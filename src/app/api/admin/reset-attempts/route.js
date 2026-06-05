/* ============================================
   ADMIN URINISHLARNI RESET API (api/admin/reset-attempts/route.js)
   ============================================
   quiz_participants endi anon kalit uchun yozilmaydi (RLS).
   Admin foydalanuvchining urinishlar sonini shu route orqali
   noldan boshlaydi.

   Himoya: x-admin-password header.
   POST { participantId }
   ============================================ */

import { createClient } from "@supabase/supabase-js";

function json(obj, status) {
  return new Response(JSON.stringify(obj), { status, headers: { "Content-Type": "application/json" } });
}

export async function POST(request) {
  const pwd = request.headers.get("x-admin-password");
  const expected =
    process.env.ADMIN_PASSWORD ||
    process.env.NEXT_PUBLIC_ADMIN_PASSWORD ||
    "admin123";
  if (pwd !== expected) {
    return json({ error: "Ruxsat berilmagan" }, 401);
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return json({ error: "Server sozlanmagan" }, 500);

  const body = await request.json().catch(() => null);
  if (!body?.participantId) return json({ error: "participantId berilmagan" }, 400);

  const db = createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } });
  const { error } = await db
    .from("quiz_participants")
    .update({ attempt_count: 0 })
    .eq("id", body.participantId);

  if (error) return json({ error: error.message }, 500);
  return json({ success: true }, 200);
}
