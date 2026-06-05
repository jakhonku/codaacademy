/* ============================================
   TEST TOPSHIRISH API (api/quiz/submit/route.js)
   ============================================
   Test natijasini SERVERda hisoblaydi va saqlaydi.

   Nega serverda:
   - To'g'ri javoblar (correct_answer) mijozga umuman yuborilmaydi —
     firibgarlikni oldini oladi.
   - Ballni mijoz emas, server hisoblaydi va yozadi (soxtalashtirib bo'lmaydi).
   - Kunlik 3 urinish chegarasi serverda majburlanadi.

   Kirish: POST { quizId, answers: { [questionId]: "A"|"B"|"C"|"D" }, fullName }
           Authorization: Bearer <access_token>
   ============================================ */

import { createClient } from "@supabase/supabase-js";

function json(obj, status) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

const isSameDay = (a, b) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

export async function POST(request) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceKey) return json({ error: "Server sozlanmagan" }, 500);

  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: "Noto'g'ri so'rov" }, 400);
  }

  const quizId = body?.quizId;
  const answers = body?.answers || {};
  const fullName = (body?.fullName || "").toString().trim();
  if (!quizId || !fullName) {
    return json({ error: "Ma'lumot to'liq emas" }, 400);
  }

  // Foydalanuvchini token orqali aniqlash (faqat kirgan foydalanuvchi)
  const token = (request.headers.get("authorization") || "").replace(/^Bearer\s+/i, "").trim();
  if (!token) return json({ error: "Avval tizimga kiring" }, 401);

  const supabaseAdmin = createClient(supabaseUrl, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const {
    data: { user },
    error: userErr,
  } = await supabaseAdmin.auth.getUser(token);
  if (userErr || !user) return json({ error: "Sessiya yaroqsiz. Qayta kiring." }, 401);

  // Faqat kurs kodi bilan tasdiqlangan foydalanuvchi test topshira oladi
  const { data: prof } = await supabaseAdmin
    .from("profiles")
    .select("is_registered")
    .eq("id", user.id)
    .maybeSingle();
  if (!prof?.is_registered) {
    return json({ error: "Test topshirish uchun avval kurs kodi bilan ro'yxatdan o'ting." }, 403);
  }

  try {
    // 1. Joriy urinish holatini tekshirish (server — chegara majburiy)
    const { data: parts } = await supabaseAdmin
      .from("quiz_participants")
      .select("*")
      .eq("quiz_id", quizId)
      .eq("full_name", fullName);
    const existing = parts && parts.length > 0 ? parts[0] : null;

    let attemptBase = existing?.attempt_count || 0;

    if (existing && attemptBase >= 3) {
      const last = new Date(existing.last_attempt_at);
      const now = new Date();
      if (isSameDay(last, now)) {
        // Bugun limit tugagan — cooldown qaytaramiz, ball hisoblamaymiz
        const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
        return json(
          {
            error: "Bugungi urinishlar tugadi (3/3). Ertaga qayta urining.",
            blocked: true,
            cooldown: Math.ceil((tomorrow - now) / 1000),
          },
          429
        );
      }
      // Yangi kun — urinishlar noldan boshlanadi
      attemptBase = 0;
    }

    // 2. To'g'ri javoblarni SERVERda olish va ball hisoblash
    const { data: questions, error: qErr } = await supabaseAdmin
      .from("quiz_questions")
      .select("id, correct_answer")
      .eq("quiz_id", quizId);
    if (qErr) throw qErr;
    if (!questions || questions.length === 0) {
      return json({ error: "Bu testda savollar yo'q" }, 400);
    }

    let correctCount = 0;
    for (const q of questions) {
      if (answers[q.id] && answers[q.id] === q.correct_answer) correctCount++;
    }
    const total = questions.length;

    // 3. Natijani yozish (service_role)
    const nowIso = new Date().toISOString();
    let bestScore = correctCount;
    let attemptCount = attemptBase + 1;

    if (existing) {
      bestScore = Math.max(existing.score || 0, correctCount);
      const { error: upErr } = await supabaseAdmin
        .from("quiz_participants")
        .update({
          score: bestScore,
          total_questions: total,
          attempt_count: attemptCount,
          last_attempt_at: nowIso,
          completed: true,
        })
        .eq("id", existing.id);
      if (upErr) throw upErr;
    } else {
      const { error: insErr } = await supabaseAdmin.from("quiz_participants").insert([
        {
          quiz_id: quizId,
          full_name: fullName,
          score: correctCount,
          total_questions: total,
          attempt_count: 1,
          last_attempt_at: nowIso,
          completed: true,
        },
      ]);
      if (insErr) throw insErr;
    }

    // 4. Bugungi leaderboard (top 3, har ism uchun bitta)
    const todayStr = nowIso.split("T")[0];
    const { data: leadersData } = await supabaseAdmin
      .from("quiz_participants")
      .select("full_name, score, last_attempt_at")
      .eq("quiz_id", quizId)
      .gte("last_attempt_at", `${todayStr}T00:00:00.000Z`)
      .order("score", { ascending: false })
      .limit(10);

    const leaders = [];
    const seen = new Set();
    for (const l of leadersData || []) {
      if (!seen.has(l.full_name)) {
        leaders.push(l);
        seen.add(l.full_name);
      }
    }

    return json(
      {
        score: correctCount,
        total,
        bestScore,
        attemptCount,
        attemptsLeft: Math.max(0, 3 - attemptCount),
        leaders: leaders.slice(0, 3),
      },
      200
    );
  } catch (err) {
    console.error("quiz/submit xatosi:", err);
    return json({ error: "Natijani saqlashda xatolik" }, 500);
  }
}
