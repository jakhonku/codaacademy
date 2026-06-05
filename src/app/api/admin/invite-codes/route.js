/* ============================================
   ADMIN KURS KODLARI API (api/admin/invite-codes/route.js)
   ============================================
   invite_codes jadvali endi anonim kalit uchun yopiq (RLS).
   Shuning uchun admin panel kodlarni shu route orqali
   (service_role bilan) boshqaradi.

   Himoya: x-admin-password header tekshiriladi.

   - GET    — barcha kodlar ro'yxati
   - POST   — yangi kod yaratish (server tomonida generatsiya)
   - DELETE — ?id=<id> bo'yicha kodni o'chirish
   ============================================ */

import { createClient } from "@supabase/supabase-js";

function checkAuth(request) {
  const adminPassword = request.headers.get("x-admin-password");
  const expected = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "admin123";
  return adminPassword === expected;
}

function admin() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceKey) return null;
  return createClient(supabaseUrl, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

function json(obj, status) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export async function GET(request) {
  if (!checkAuth(request)) return json({ error: "Ruxsat berilmagan" }, 401);
  const supabaseAdmin = admin();
  if (!supabaseAdmin) return json({ error: "Server sozlanmagan" }, 500);

  const { data, error } = await supabaseAdmin
    .from("invite_codes")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return json({ error: error.message }, 500);
  return json({ codes: data || [] }, 200);
}

export async function POST(request) {
  if (!checkAuth(request)) return json({ error: "Ruxsat berilmagan" }, 401);
  const supabaseAdmin = admin();
  if (!supabaseAdmin) return json({ error: "Server sozlanmagan" }, 500);

  // Kodni server tomonida generatsiya qilamiz: CODA-XXXXX
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const gen = () => {
    let p = "";
    for (let i = 0; i < 5; i++) p += chars.charAt(Math.floor(Math.random() * chars.length));
    return `CODA-${p}`;
  };

  // Takrorlanmaslik uchun bir necha marta urinib ko'ramiz
  let lastErr = null;
  for (let attempt = 0; attempt < 5; attempt++) {
    const code = gen();
    const { data, error } = await supabaseAdmin
      .from("invite_codes")
      .insert([{ code }])
      .select()
      .maybeSingle();
    if (!error && data) return json({ code: data }, 200);
    lastErr = error;
    // 23505 = unique violation — boshqa kod bilan qayta urinamiz
    if (error && error.code !== "23505") break;
  }

  return json({ error: lastErr?.message || "Kod yaratib bo'lmadi" }, 500);
}

export async function DELETE(request) {
  if (!checkAuth(request)) return json({ error: "Ruxsat berilmagan" }, 401);
  const supabaseAdmin = admin();
  if (!supabaseAdmin) return json({ error: "Server sozlanmagan" }, 500);

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) return json({ error: "id berilmagan" }, 400);

  const { error } = await supabaseAdmin
    .from("invite_codes")
    .delete()
    .eq("id", id);

  if (error) return json({ error: error.message }, 500);
  return json({ success: true }, 200);
}
