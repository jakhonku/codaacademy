-- ====================================================================
-- CODA ACADEMY — XAVFSIZLIK: RLS QATTIQLASHTIRISH (1-bosqich)
-- ====================================================================
-- DIQQAT: Bu SQL ni Supabase SQL Editor'da ishga tushirishdan OLDIN
-- yangi kod Vercel'ga DEPLOY qilingan bo'lishi SHART. Aks holda eski
-- mijoz kodi (kodni to'g'ridan-to'g'ri yozadigan) ishlamay qoladi.
--
-- Tartib:
--   1) git push + Vercel deploy (yangi kod)
--   2) shu faylni ishga tushirish
--
-- Bu fayl quyidagilarni yopadi:
--   • profiles  — foydalanuvchi faqat O'Z qatorini o'qiydi; is_registered
--                 ni o'zi yoza olmaydi (faqat trigger / server route).
--   • invite_codes — anonim/oddiy foydalanuvchi UMUMAN ko'rmaydi/yozmaydi
--                    (faqat /api/redeem-code va /api/admin/invite-codes —
--                     service_role orqali).
-- ====================================================================


-- 1. PROFILES --------------------------------------------------------
-- Eski "hammaga ochiq" siyosatlarni olib tashlaymiz
DROP POLICY IF EXISTS "All Access for Anon/Admin on Profiles" ON public.profiles;
DROP POLICY IF EXISTS "Public Read Profiles" ON public.profiles;

-- Foydalanuvchi faqat o'z profilini o'qiy oladi.
-- (Admin panel profillarni service_role orqali /api/admin/users dan oladi —
--  service_role RLS ni chetlab o'tadi, shuning uchun bu yetarli.)
CREATE POLICY "Users read own profile" ON public.profiles
    FOR SELECT
    USING (auth.uid() = id);

-- INSERT/UPDATE/DELETE uchun foydalanuvchiga siyosat BERILMAYDI =>
-- mijoz tomonidan yozish taqiqlanadi. Profil qatorini:
--   • auth trigger (handle_new_user, SECURITY DEFINER) — signup paytida,
--   • /api/redeem-code (service_role) — kod tasdiqlanganda
-- yaratadi/yangilaydi.


-- 2. INVITE_CODES ----------------------------------------------------
-- Eski ochiq siyosatlarni olib tashlaymiz
DROP POLICY IF EXISTS "All Access for Anon/Admin on Invite Codes" ON public.invite_codes;
DROP POLICY IF EXISTS "Public Read Invite Codes" ON public.invite_codes;

-- Hech qanday permissive siyosat qoldirmaymiz => anon/authenticated
-- foydalanuvchilar kodlarni KO'RA OLMAYDI va o'zgartira olmaydi.
-- Barcha amallar service_role bilan server route orqali bajariladi
-- (service_role RLS ni chetlab o'tadi).

-- RLS yoqilganligiga ishonch hosil qilamiz
ALTER TABLE public.invite_codes ENABLE ROW LEVEL SECURITY;


-- 3. TEKSHIRISH ------------------------------------------------------
-- Quyidagi so'rovni ANON kalit bilan (masalan, oddiy foydalanuvchi
-- brauzeridan) bajarib ko'ring — endi bo'sh/xato qaytishi kerak:
--   SELECT * FROM invite_codes;   -- => 0 qator (ko'rinmaydi)
--
-- Joriy siyosatlarni ko'rish:
-- SELECT tablename, policyname, cmd
-- FROM pg_policies
-- WHERE schemaname = 'public' AND tablename IN ('profiles','invite_codes')
-- ORDER BY tablename, policyname;
