-- ====================================================================
-- CODA ACADEMY — XAVFSIZLIK: TEST TIZIMI (2-bosqich)
-- ====================================================================
-- DIQQAT: yangi kod Vercel'ga DEPLOY qilingandan KEYIN ishga tushiring.
-- Tartib: git push + deploy  ->  shu SQL.
--
-- Yopadi:
--   • quiz_questions.correct_answer — endi anon/oddiy foydalanuvchi
--     to'g'ri javobni KO'RA OLMAYDI (test paytida ham). Sahifa javobsiz
--     "quiz_questions_public" VIEW dan o'qiydi. Ball SERVERda hisoblanadi
--     (/api/quiz/submit).
--   • quiz_participants — endi mijoz ball YOZA OLMAYDI (faqat o'qiydi —
--     leaderboard uchun). Yozish /api/quiz/submit (service_role) orqali.
--   • quiz_questions yozish/o'qish — admin /api/admin/quiz-questions orqali.
-- ====================================================================


-- 1. JAVOBSIZ VIEW ---------------------------------------------------
-- correct_answer ustunisiz ko'rinish. Foydalanuvchi test ishlayotganda
-- shu view'dan savollarni oladi.
CREATE OR REPLACE VIEW public.quiz_questions_public AS
SELECT
    id,
    quiz_id,
    question_text,
    option_a,
    option_b,
    option_c,
    option_d,
    order_num,
    created_at
FROM public.quiz_questions;

-- View egasi (postgres) huquqi bilan ishlaydi => baza jadvalidagi RLS
-- view orqali o'qishga to'sqinlik qilmaydi, lekin correct_answer baribir
-- ustunlar ro'yxatida yo'q.
GRANT SELECT ON public.quiz_questions_public TO anon, authenticated;


-- 2. BAZA JADVALINI QULFLASH (quiz_questions) ------------------------
DROP POLICY IF EXISTS "Public Read Quiz Questions" ON public.quiz_questions;
DROP POLICY IF EXISTS "All Access for Anon/Admin on Quiz Questions" ON public.quiz_questions;
ALTER TABLE public.quiz_questions ENABLE ROW LEVEL SECURITY;
-- Permissive siyosat qoldirilmaydi => anon/authenticated to'g'ridan-to'g'ri
-- quiz_questions (correct_answer bilan) ni o'qiy/yoza olmaydi.
-- Hammasi service_role server route orqali.


-- 3. ISHTIROKCHILAR: o'qish ochiq, YOZISH yopiq ----------------------
DROP POLICY IF EXISTS "All Access for Anon/Admin on Quiz Participants" ON public.quiz_participants;
-- "Public Read Quiz Participants" (FOR SELECT USING(true)) QOLDIRILADI —
-- leaderboard ishlashi uchun. Agar yo'q bo'lsa, qayta yaratamiz:
DROP POLICY IF EXISTS "Public Read Quiz Participants" ON public.quiz_participants;
CREATE POLICY "Public Read Quiz Participants" ON public.quiz_participants
    FOR SELECT USING (true);
ALTER TABLE public.quiz_participants ENABLE ROW LEVEL SECURITY;
-- INSERT/UPDATE/DELETE uchun siyosat yo'q => mijoz ball yoza olmaydi.
-- Yozish faqat /api/quiz/submit (service_role) va admin reset route orqali.


-- 4. TEKSHIRISH ------------------------------------------------------
-- Anon kalit bilan quyidagi bo'sh/xato qaytishi kerak:
--   SELECT correct_answer FROM quiz_questions;   -- => ruxsat yo'q
-- View esa javobsiz ishlashi kerak:
--   SELECT * FROM quiz_questions_public;          -- => javobsiz savollar
