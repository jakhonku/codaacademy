-- ====================================================================
-- CODA ACADEMY — XAVFSIZLIK: KONTENT VA SHAXSIY MA'LUMOTLAR (2b-bosqich)
-- ====================================================================
-- DIQQAT: yangi kod Vercel'ga DEPLOY qilingandan KEYIN ishga tushiring.
-- Tartib: git push + deploy  ->  shu SQL.
--
-- Bu fayl quyidagilarni yopadi:
--   • resources, lessons, quizzes — faqat kurs kodi bilan tasdiqlangan
--     (is_registered) foydalanuvchi O'QIY oladi.
--   • registrations (ism/telefon — PII) — anon endi O'QIY OLMAYDI
--     (faqat INSERT — ariza formasi). Admin /api/admin/db orqali o'qiydi.
--   • user_tasks, user_messages — foydalanuvchi faqat O'ZIGA tegishli
--     (yoki umumiy) qatorlarni o'qiydi; faqat o'zinikini yangilaydi.
--   • prompts — o'qish ochiq qoladi (bosh sahifa/prompts kutubxonasi),
--     lekin yozish faqat admin route orqali.
--   Barcha admin yozuvlari /api/admin/db (service_role) orqali.
-- ====================================================================


-- 0. YORDAMCHI: joriy foydalanuvchi tasdiqlanganmi? -------------------
CREATE OR REPLACE FUNCTION public.is_registered_user()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND is_registered = true
  );
$$;
GRANT EXECUTE ON FUNCTION public.is_registered_user() TO anon, authenticated;


-- 1. PROMPTS — o'qish ochiq, yozish faqat admin ----------------------
DROP POLICY IF EXISTS "All Access for Anon/Admin on Prompts" ON public.prompts;
DROP POLICY IF EXISTS "Public Read Prompts" ON public.prompts;
CREATE POLICY "Public Read Prompts" ON public.prompts
    FOR SELECT USING (true);
ALTER TABLE public.prompts ENABLE ROW LEVEL SECURITY;


-- 2. RESOURCES — faqat tasdiqlangan o'qiydi --------------------------
DROP POLICY IF EXISTS "All Access for Anon/Admin on Resources" ON public.resources;
DROP POLICY IF EXISTS "Public Read Resources" ON public.resources;
CREATE POLICY "Registered read Resources" ON public.resources
    FOR SELECT USING (public.is_registered_user());
ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;


-- 3. LESSONS — faqat tasdiqlangan o'qiydi ----------------------------
DROP POLICY IF EXISTS "All Access for Anon/Admin on Lessons" ON public.lessons;
DROP POLICY IF EXISTS "Public Read Lessons" ON public.lessons;
CREATE POLICY "Registered read Lessons" ON public.lessons
    FOR SELECT USING (public.is_registered_user());
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;


-- 4. QUIZZES — faqat tasdiqlangan o'qiydi ----------------------------
DROP POLICY IF EXISTS "All Access for Anon/Admin on Quizzes" ON public.quizzes;
DROP POLICY IF EXISTS "Public Read Quizzes" ON public.quizzes;
CREATE POLICY "Registered read Quizzes" ON public.quizzes
    FOR SELECT USING (public.is_registered_user());
ALTER TABLE public.quizzes ENABLE ROW LEVEL SECURITY;


-- 5. REGISTRATIONS — INSERT ochiq (forma), O'QISH faqat admin --------
DROP POLICY IF EXISTS "All Access for Anon/Admin on Registrations" ON public.registrations;
DROP POLICY IF EXISTS "Select registrations for anyone" ON public.registrations;
DROP POLICY IF EXISTS "Insert registrations for anyone" ON public.registrations;
-- Har kim ariza qoldira oladi (bosh sahifadagi forma)
CREATE POLICY "Insert registrations for anyone" ON public.registrations
    FOR INSERT WITH CHECK (true);
-- SELECT/UPDATE/DELETE uchun siyosat yo'q => anon o'qiy olmaydi.
-- Admin /api/admin/db (service_role) orqali o'qiydi.
ALTER TABLE public.registrations ENABLE ROW LEVEL SECURITY;


-- 6. USER_TASKS — o'ziniki/umumiy o'qish; o'zinikini yangilash --------
DROP POLICY IF EXISTS "All Access for Anon/Admin on User Tasks" ON public.user_tasks;
DROP POLICY IF EXISTS "Public Read User Tasks" ON public.user_tasks;
CREATE POLICY "Read own or broadcast tasks" ON public.user_tasks
    FOR SELECT USING (auth.uid() = user_id OR user_id IS NULL);
CREATE POLICY "Update own tasks" ON public.user_tasks
    FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
ALTER TABLE public.user_tasks ENABLE ROW LEVEL SECURITY;
-- INSERT/DELETE faqat admin route orqali.


-- 7. USER_MESSAGES — o'ziniki/umumiy o'qish; o'zinikini yangilash -----
DROP POLICY IF EXISTS "All Access for Anon/Admin on User Messages" ON public.user_messages;
DROP POLICY IF EXISTS "Public Read User Messages" ON public.user_messages;
CREATE POLICY "Read own or broadcast messages" ON public.user_messages
    FOR SELECT USING (auth.uid() = user_id OR user_id IS NULL);
CREATE POLICY "Update own messages" ON public.user_messages
    FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
ALTER TABLE public.user_messages ENABLE ROW LEVEL SECURITY;
-- INSERT/DELETE faqat admin route orqali.


-- 8. TEKSHIRISH ------------------------------------------------------
-- Anon kalit bilan (oddiy foydalanuvchi) quyidagilar BO'SH qaytishi kerak:
--   SELECT * FROM registrations;  -- => ko'rinmaydi (PII himoyalangan)
--   SELECT * FROM resources;      -- => faqat is_registered=true bo'lsa
--   SELECT * FROM user_messages;  -- => faqat o'ziniki/umumiy
