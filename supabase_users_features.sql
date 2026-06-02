-- ====================================================================
-- CODA ACADEMY — FOYDALANUVCHI XUSUSIYATLARI SXEMASI
-- ====================================================================
-- Bu fayl Google orqali kirgan foydalanuvchilar uchun
-- profile, vazifa, xabar va dars jadvali jadvallarini yaratadi.
--
-- Ushbu SQL kodini Supabase loyihangizdagi "SQL Editor" bo'limiga
-- nusxalab yozing va "Run" tugmasini bosing.
-- ====================================================================


-- ====================================================================
-- 1. FOYDALANUVCHI PROFILLARI (profiles)
-- ====================================================================
-- auth.users jadvaliga bog'langan ommaviy profil ma'lumotlari
-- (admin paneldan ko'rinishi uchun)
-- ====================================================================

CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT,
    full_name TEXT,
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Hamma foydalanuvchilar ro'yxatini ko'ra oladi (admin va boshqalar)
CREATE POLICY "Public Read Profiles" ON public.profiles
    FOR SELECT USING (true);

-- Profil yangilash huquqi (yangi foydalanuvchi yaratilganda trigger ishlatiladi)
CREATE POLICY "All Access for Anon/Admin on Profiles" ON public.profiles
    FOR ALL USING (true) WITH CHECK (true);


-- ====================================================================
-- 2. TRIGGER: Google bilan kirgan foydalanuvchini avtomatik profilga qo'shish
-- ====================================================================
-- Yangi foydalanuvchi auth.users jadvaliga qo'shilganda
-- avtomatik ravishda public.profiles jadvaliga ham yoziladi.
-- ====================================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name, avatar_url)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name'),
        COALESCE(NEW.raw_user_meta_data->>'avatar_url', NEW.raw_user_meta_data->>'picture')
    )
    ON CONFLICT (id) DO UPDATE SET
        email = EXCLUDED.email,
        full_name = EXCLUDED.full_name,
        avatar_url = EXCLUDED.avatar_url;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Eski triggerni o'chirib qaytadan yaratish
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT OR UPDATE ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Mavjud auth.users foydalanuvchilarini ham profiles jadvaliga ko'chirish
INSERT INTO public.profiles (id, email, full_name, avatar_url)
SELECT
    id,
    email,
    COALESCE(raw_user_meta_data->>'full_name', raw_user_meta_data->>'name'),
    COALESCE(raw_user_meta_data->>'avatar_url', raw_user_meta_data->>'picture')
FROM auth.users
ON CONFLICT (id) DO NOTHING;


-- ====================================================================
-- 3. VAZIFALAR (user_tasks)
-- ====================================================================
-- Admin foydalanuvchilarga vazifa yuboradi.
-- user_id = NULL bo'lsa, vazifa BARCHA foydalanuvchilarga yuboriladi.
-- ====================================================================

CREATE TABLE IF NOT EXISTS public.user_tasks (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    due_date DATE,
    is_completed BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.user_tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public Read User Tasks" ON public.user_tasks
    FOR SELECT USING (true);

CREATE POLICY "All Access for Anon/Admin on User Tasks" ON public.user_tasks
    FOR ALL USING (true) WITH CHECK (true);


-- ====================================================================
-- 4. XABARLAR (user_messages)
-- ====================================================================
-- Admin foydalanuvchilarga xabar yuboradi.
-- user_id = NULL bo'lsa, xabar BARCHA foydalanuvchilarga yuboriladi.
-- ====================================================================

CREATE TABLE IF NOT EXISTS public.user_messages (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    subject TEXT NOT NULL,
    body TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.user_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public Read User Messages" ON public.user_messages
    FOR SELECT USING (true);

CREATE POLICY "All Access for Anon/Admin on User Messages" ON public.user_messages
    FOR ALL USING (true) WITH CHECK (true);


-- ====================================================================
-- 5. DARS JADVALI (lessons)
-- ====================================================================
-- Faqat ro'yxatdan o'tgan foydalanuvchilar uchun dars jadvali.
-- Admin yaratadi, foydalanuvchi profilida ko'rinadi.
-- ====================================================================

CREATE TABLE IF NOT EXISTS public.lessons (
    id BIGSERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    scheduled_at TIMESTAMPTZ NOT NULL,
    duration_minutes INTEGER DEFAULT 60,
    location TEXT,
    meeting_link TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public Read Lessons" ON public.lessons
    FOR SELECT USING (true);

CREATE POLICY "All Access for Anon/Admin on Lessons" ON public.lessons
    FOR ALL USING (true) WITH CHECK (true);
