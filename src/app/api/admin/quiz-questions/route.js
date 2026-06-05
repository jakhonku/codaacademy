/* ============================================
   ADMIN SAVOLLAR API (api/admin/quiz-questions/route.js)
   ============================================
   quiz_questions endi anon kalit uchun yopiq (RLS). Admin
   savollarni (to'g'ri javob bilan) shu route orqali boshqaradi.

   Himoya: x-admin-password header.

   - GET    ?quizId=X        — testning savollari (to'g'ri javob bilan)
   - POST   { ...question }  — yangi savol
   - PUT    { id, ...fields }— savolni tahrirlash
   - DELETE ?id=Y            — savolni o'chirish
   ============================================ */

import { createClient } from "@supabase/supabase-js";

function checkAuth(request) {
  const pwd = request.headers.get("x-admin-password");
  return pwd === (process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "admin123");
}
function admin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } });
}
function json(obj, status) {
  return new Response(JSON.stringify(obj), { status, headers: { "Content-Type": "application/json" } });
}

const FIELDS = ["quiz_id", "question_text", "option_a", "option_b", "option_c", "option_d", "correct_answer", "order_num"];
function pick(body) {
  const out = {};
  for (const f of FIELDS) if (body[f] !== undefined) out[f] = body[f];
  return out;
}

export async function GET(request) {
  if (!checkAuth(request)) return json({ error: "Ruxsat berilmagan" }, 401);
  const db = admin();
  if (!db) return json({ error: "Server sozlanmagan" }, 500);

  const quizId = new URL(request.url).searchParams.get("quizId");
  if (!quizId) return json({ error: "quizId berilmagan" }, 400);

  const { data, error } = await db
    .from("quiz_questions")
    .select("*")
    .eq("quiz_id", quizId)
    .order("order_num", { ascending: true });
  if (error) return json({ error: error.message }, 500);
  return json({ questions: data || [] }, 200);
}

export async function POST(request) {
  if (!checkAuth(request)) return json({ error: "Ruxsat berilmagan" }, 401);
  const db = admin();
  if (!db) return json({ error: "Server sozlanmagan" }, 500);

  const body = await request.json().catch(() => null);
  if (!body?.quiz_id || !body?.question_text) return json({ error: "Ma'lumot to'liq emas" }, 400);

  const { error } = await db.from("quiz_questions").insert([pick(body)]);
  if (error) return json({ error: error.message }, 500);
  return json({ success: true }, 200);
}

export async function PUT(request) {
  if (!checkAuth(request)) return json({ error: "Ruxsat berilmagan" }, 401);
  const db = admin();
  if (!db) return json({ error: "Server sozlanmagan" }, 500);

  const body = await request.json().catch(() => null);
  if (!body?.id) return json({ error: "id berilmagan" }, 400);

  const { error } = await db.from("quiz_questions").update(pick(body)).eq("id", body.id);
  if (error) return json({ error: error.message }, 500);
  return json({ success: true }, 200);
}

export async function DELETE(request) {
  if (!checkAuth(request)) return json({ error: "Ruxsat berilmagan" }, 401);
  const db = admin();
  if (!db) return json({ error: "Server sozlanmagan" }, 500);

  const id = new URL(request.url).searchParams.get("id");
  if (!id) return json({ error: "id berilmagan" }, 400);

  const { error } = await db.from("quiz_questions").delete().eq("id", id);
  if (error) return json({ error: error.message }, 500);
  return json({ success: true }, 200);
}
