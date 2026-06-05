/* ============================================
   ADMIN UMUMIY DB API (api/admin/db/route.js)
   ============================================
   Kontent va shaxsiy jadvallar RLS bilan yopilgach,
   admin paneli ularni shu route orqali (service_role)
   boshqaradi. Faqat oq ro'yxatdagi jadvallarga ruxsat.

   Himoya: x-admin-password header (server ADMIN_PASSWORD).

   POST { action, table, values?, id?, order?, ascending? }
     action: "list" | "insert" | "update" | "delete"
   ============================================ */

import { createClient } from "@supabase/supabase-js";

// Faqat shu jadvallarga ruxsat
const ALLOWED = new Set([
  "prompts",
  "resources",
  "registrations",
  "user_tasks",
  "user_messages",
  "lessons",
  "quizzes",
]);

function json(obj, status) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

function authorized(request) {
  const pwd = request.headers.get("x-admin-password");
  const expected =
    process.env.ADMIN_PASSWORD ||
    process.env.NEXT_PUBLIC_ADMIN_PASSWORD ||
    "admin123";
  return pwd === expected;
}

export async function POST(request) {
  if (!authorized(request)) return json({ error: "Ruxsat berilmagan" }, 401);

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return json({ error: "Server sozlanmagan" }, 500);

  const body = await request.json().catch(() => null);
  if (!body) return json({ error: "Noto'g'ri so'rov" }, 400);

  const { action, table, values, id, order, ascending } = body;
  if (!ALLOWED.has(table)) return json({ error: "Ruxsat etilmagan jadval" }, 403);

  const db = createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  try {
    if (action === "list") {
      let q = db.from(table).select("*");
      if (order) q = q.order(order, { ascending: ascending !== false });
      const { data, error } = await q;
      if (error) throw error;
      return json({ data: data || [] }, 200);
    }

    if (action === "insert") {
      if (!values) return json({ error: "values yo'q" }, 400);
      const rows = Array.isArray(values) ? values : [values];
      const { error } = await db.from(table).insert(rows);
      if (error) throw error;
      return json({ success: true }, 200);
    }

    if (action === "update") {
      if (!id || !values) return json({ error: "id yoki values yo'q" }, 400);
      const { error } = await db.from(table).update(values).eq("id", id);
      if (error) throw error;
      return json({ success: true }, 200);
    }

    if (action === "delete") {
      if (!id) return json({ error: "id yo'q" }, 400);
      const { error } = await db.from(table).delete().eq("id", id);
      if (error) throw error;
      return json({ success: true }, 200);
    }

    return json({ error: "Noma'lum amal" }, 400);
  } catch (err) {
    console.error("admin/db xatosi:", err);
    return json({ error: err.message || "Server xatosi" }, 500);
  }
}
