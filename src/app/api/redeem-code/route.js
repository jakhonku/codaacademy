/* ============================================
   KURS KODINI TASDIQLASH API (api/redeem-code/route.js)
   ============================================
   Foydalanuvchi kiritgan kurs kodini SERVER tomonida
   tekshiradi va to'g'ri bo'lsa profilni faollashtiradi
   (is_registered = true).

   Nega serverda:
   - is_registered ni faqat shu route (service_role) yoqadi.
     Foydalanuvchi uni mijoz tomonidan o'zi yoqa olmaydi.
   - Kod band qilinishi ATOMAR (UPDATE ... WHERE is_used=false),
     shuning uchun bitta kodni ikki kishi bir vaqtda ishlata olmaydi.

   Kirish: POST { code }, Authorization: Bearer <access_token>
   ============================================ */

import { createClient } from "@supabase/supabase-js";

export async function POST(request) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceKey) {
    return json({ error: "Server sozlanmagan" }, 500);
  }

  // 1. Kirishni o'qish
  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: "Noto'g'ri so'rov" }, 400);
  }

  const rawCode = (body?.code || "").toString().trim().toUpperCase();
  if (!rawCode) {
    return json({ error: "Kurs kodi kiritilmagan" }, 400);
  }

  // 2. Foydalanuvchini access_token orqali aniqlash
  const authHeader = request.headers.get("authorization") || "";
  const token = authHeader.replace(/^Bearer\s+/i, "").trim();
  if (!token) {
    return json({ error: "Avval tizimga kiring" }, 401);
  }

  const supabaseAdmin = createClient(supabaseUrl, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const {
    data: { user },
    error: userErr,
  } = await supabaseAdmin.auth.getUser(token);

  if (userErr || !user) {
    return json({ error: "Sessiya yaroqsiz. Qayta kiring." }, 401);
  }

  try {
    // 3. Kodni ATOMAR band qilish: faqat hali ishlatilmagan bo'lsa.
    //    Ikki kishi bir vaqtda yuborsa ham, faqat bittasi muvaffaqiyatli bo'ladi.
    const { data: claimed, error: claimErr } = await supabaseAdmin
      .from("invite_codes")
      .update({
        is_used: true,
        used_by: user.id,
        used_by_email: user.email,
        used_at: new Date().toISOString(),
      })
      .eq("code", rawCode)
      .eq("is_used", false)
      .select()
      .maybeSingle();

    if (claimErr) throw claimErr;

    // 4. Hech narsa yangilanmadi — kod yo'q yoki allaqachon ishlatilgan
    if (!claimed) {
      const { data: exists } = await supabaseAdmin
        .from("invite_codes")
        .select("is_used")
        .eq("code", rawCode)
        .maybeSingle();

      if (!exists) {
        return json({ error: "Kurs kodi topilmadi. Kodni tekshiring." }, 404);
      }
      return json(
        { error: "Bu kurs kodi allaqachon ishlatilgan." },
        409
      );
    }

    // 5. Profilni faollashtirish (service_role — RLS chetlab o'tiladi)
    const { error: profErr } = await supabaseAdmin.from("profiles").upsert(
      {
        id: user.id,
        email: user.email,
        full_name:
          user.user_metadata?.full_name ||
          user.user_metadata?.name ||
          "Foydalanuvchi",
        avatar_url:
          user.user_metadata?.avatar_url || user.user_metadata?.picture,
        is_registered: true,
        invite_code: rawCode,
      },
      { onConflict: "id" }
    );

    if (profErr) {
      // Profil yangilanmasa, kodni qaytarib bo'shatamiz (foydalanuvchi qayta urinishi uchun)
      await supabaseAdmin
        .from("invite_codes")
        .update({ is_used: false, used_by: null, used_by_email: null, used_at: null })
        .eq("code", rawCode);
      throw profErr;
    }

    return json({ success: true }, 200);
  } catch (err) {
    console.error("redeem-code xatosi:", err);
    return json({ error: "Server xatosi. Birozdan so'ng qayta urining." }, 500);
  }
}

function json(obj, status) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}
