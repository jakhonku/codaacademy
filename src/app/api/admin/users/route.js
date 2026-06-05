/* ============================================
   ADMIN USERS API (api/admin/users/route.js)
   ============================================
   Bu server-side API admin paneliga Google orqali
   kirgan barcha foydalanuvchilarni qaytaradi.

   Service Role Key ishlatiladi (faqat serverda),
   shuning uchun auth.users jadvalidan to'g'ridan-to'g'ri
   o'qish mumkin — public.profiles jadvali kerakmas.

   Admin parolini header'da yuborish shart.
   ============================================ */

import { createClient } from "@supabase/supabase-js";

export async function GET(request) {
  // 1. Admin parolini tekshirish
  const adminPassword = request.headers.get("x-admin-password");
  const expectedPassword =
    process.env.ADMIN_PASSWORD ||
    process.env.NEXT_PUBLIC_ADMIN_PASSWORD ||
    "admin123";

  if (adminPassword !== expectedPassword) {
    return new Response(
      JSON.stringify({ error: "Ruxsat berilmagan" }),
      { status: 401, headers: { "Content-Type": "application/json" } }
    );
  }

  // 2. Supabase admin klientini service_role bilan yaratish
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceKey) {
    return new Response(
      JSON.stringify({ error: "Supabase sozlamalari topilmadi" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  const supabaseAdmin = createClient(supabaseUrl, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  // 3. Faqat kurs kodi bilan tasdiqlangan (is_registered = true) foydalanuvchilarni olish
  try {
    // profiles jadvalidan faqat tasdiqlangan foydalanuvchilarni olamiz
    const { data: profilesData, error: profilesErr } = await supabaseAdmin
      .from("profiles")
      .select("id, email, full_name, avatar_url, is_registered, invite_code, created_at")
      .eq("is_registered", true)
      .order("created_at", { ascending: false });

    if (profilesErr) throw profilesErr;

    // auth.users dan qo'shimcha ma'lumotlarni olamiz
    const { data: authData, error: authErr } = await supabaseAdmin.auth.admin.listUsers({
      page: 1,
      perPage: 1000,
    });

    if (authErr) throw authErr;

    // auth.users bilan birlashtirish
    const authUsersMap = {};
    (authData.users || []).forEach((u) => {
      authUsersMap[u.id] = u;
    });

    const users = (profilesData || []).map((p) => {
      const authUser = authUsersMap[p.id];
      return {
        id: p.id,
        email: p.email,
        fullName: p.full_name || authUser?.user_metadata?.full_name || authUser?.user_metadata?.name || null,
        avatarUrl: p.avatar_url || authUser?.user_metadata?.avatar_url || authUser?.user_metadata?.picture || null,
        createdAt: p.created_at,
        lastSignInAt: authUser?.last_sign_in_at || null,
        provider: authUser?.app_metadata?.provider || "—",
        inviteCode: p.invite_code || null,
      };
    });

    return new Response(JSON.stringify({ users }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Foydalanuvchilarni olishda xato:", err);
    return new Response(
      JSON.stringify({ error: err.message || "Server xatosi" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
