-- ====================================================================
-- RESURSLARNI GURUHLASH VA BIRIKTIRISH UCHUN SXEMANI YANGILASH
-- ====================================================================
-- Ushbu SQL kodini Supabase loyihangizdagi "SQL Editor" bo'limiga
-- nusxalab yozing va "Run" tugmasini bosing.
-- ====================================================================

-- 1. Resurs turi (type) cheklovini yangilash
ALTER TABLE public.resources DROP CONSTRAINT IF EXISTS resources_type_check;
ALTER TABLE public.resources ADD CONSTRAINT resources_type_check CHECK (type IN ('pdf', 'video', 'link', 'group'));

-- 2. URL ustunini ixtiyoriy (nullable) qilish, chunki guruhlarda havola bo'lmaydi
ALTER TABLE public.resources ALTER COLUMN url DROP NOT NULL;

-- 3. parent_id (ota modul) ustunini qo'shish
ALTER TABLE public.resources ADD COLUMN IF NOT EXISTS parent_id BIGINT REFERENCES public.resources(id) ON DELETE CASCADE;

-- 4. Baza uchun namunaviy ma'lumotlar qo'shish (ixtiyoriy, izohni olib tashlab ishlatsa bo'ladi)
-- INSERT INTO public.resources (title, description, type, url) 
-- VALUES ('1-Modul: Sun''iy Intellekt Kirish', 'Sun''iy intellektning asosiy tushunchalari va tarixi haqida darsliklar.', 'group', NULL);
