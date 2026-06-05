-- ====================================================================
-- CODA ACADEMY — RO'YXATDAN O'TISH / PROFIL TUZATISH SXEMASI
-- ====================================================================
-- Bu faylni Supabase loyihangizdagi "SQL Editor" bo'limiga nusxalab
-- yozing va "Run" tugmasini bosing. Fayl idempotent — bir necha marta
-- ishga tushirsa ham xavfsiz.
--
-- Maqsad:
--   1. profiles jadvalida is_registered / invite_code ustunlari borligiga
--      ishonch hosil qilish.
--   2. Yangi Google foydalanuvchilari is_registered = false bilan kelishi
--      (kurs kodi bilan tasdiqlanmaguncha admin panelida ko'rinmaydi).
--   3. (IXTIYORIY) Hozir o'qiyotgan eski talabalarni "tasdiqlangan" deb
--      belgilash — ular yangi tizim tufayli bloklanib qolmasligi uchun.
-- ====================================================================


-- 1. Ustunlar mavjudligini ta'minlash --------------------------------
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS is_registered BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS invite_code   TEXT;


-- 2. Trigger funksiyasi: yangi foydalanuvchi HAR DOIM is_registered=false
--    bo'lib yaratiladi. Qayta kirganda (UPDATE) is_registered TEGILMAYDI,
--    ya'ni tasdiqlangan foydalanuvchi tasdiqlangan bo'lib qoladi.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name, avatar_url, is_registered)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name'),
        COALESCE(NEW.raw_user_meta_data->>'avatar_url', NEW.raw_user_meta_data->>'picture'),
        false
    )
    ON CONFLICT (id) DO UPDATE SET
        email      = EXCLUDED.email,
        full_name  = EXCLUDED.full_name,
        avatar_url = EXCLUDED.avatar_url;
        -- DIQQAT: is_registered bu yerda yangilanmaydi (qasddan).
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT OR UPDATE ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


-- 3. NULL qiymatlarni false ga keltirish (eski qatorlar uchun) --------
UPDATE public.profiles SET is_registered = false WHERE is_registered IS NULL;


-- ====================================================================
-- 4. (IXTIYORIY) ESKI TALABALARNI TASDIQLASH
-- ====================================================================
-- Yangi kurs-kodi tizimidan OLDIN ro'yxatdan o'tgan haqiqiy talabalar
-- endi /dashboard va /profile dan /login ga uloqtiriladi va ulardan kod
-- so'raladi. Ularni bloklab qo'ymaslik uchun quyidagilardan BIRINI tanlang.
--
-- A varianti — hozirgi BARCHA foydalanuvchilarni tasdiqlangan deb belgilash
--   (kelajakdagi yangi Google foydalanuvchilar baribir kod talab qiladi):
--
--   UPDATE public.profiles SET is_registered = true;
--
-- B varianti — faqat aniq email'larni tasdiqlash (tavsiya etiladi):
--
--   UPDATE public.profiles
--   SET is_registered = true
--   WHERE email IN (
--     'talaba1@gmail.com',
--     'talaba2@gmail.com'
--   );
--
-- Kerakli variantning izohini (--) olib tashlab, ishga tushiring.
-- ====================================================================


-- 5. Tekshirish: kim tasdiqlangan, kim yo'q ---------------------------
-- SELECT email, is_registered, invite_code, created_at
-- FROM public.profiles
-- ORDER BY created_at DESC;
