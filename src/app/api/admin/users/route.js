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
  const expectedPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "admin123";

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

  // 3. Barcha foydalanuvchilarni listAll bilan olish
  try {
    const { data, error } = await supabaseAdmin.auth.admin.listUsers({
      page: 1,
      perPage: 1000,
    });

    if (error) throw error;

    // Faqat kerakli maydonlarni qaytaramiz
    const users = (data.users || []).map((u) => ({
      id: u.id,
      email: u.email,
      fullName:
        u.user_metadata?.full_name ||
        u.user_metadata?.name ||
        null,
      avatarUrl:
        u.user_metadata?.avatar_url ||
        u.user_metadata?.picture ||
        null,
      createdAt: u.created_at,
      lastSignInAt: u.last_sign_in_at,
      provider: u.app_metadata?.provider || "—",
    }));

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
