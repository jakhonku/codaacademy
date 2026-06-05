-- ====================================================================
-- CODA ACADEMY — KURS KODLARI VA RO'YXATDAN O'TISH SXEMASI
-- ====================================================================
-- Ushbu SQL kodini Supabase loyihangizdagi "SQL Editor" bo'limiga
-- nusxalab yozing va "Run" tugmasini bosing.
-- ====================================================================

-- 1. invite_codes jadvalini yaratish
CREATE TABLE IF NOT EXISTS public.invite_codes (
    id BIGSERIAL PRIMARY KEY,
    code TEXT UNIQUE NOT NULL,
    is_used BOOLEAN DEFAULT false,
    used_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    used_by_email TEXT,
    used_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLSni yoqish
ALTER TABLE public.invite_codes ENABLE ROW LEVEL SECURITY;

-- Siyosat: Barcha foydalanuvchilar o'qishi mumkin (Select)
CREATE POLICY "Public Read Invite Codes" ON public.invite_codes
    FOR SELECT USING (true);

-- Siyosat: Anonim yoki ro'yxatdan o'tgan admin ma'lumotlarni o'zgartirishi mumkin
CREATE POLICY "All Access for Anon/Admin on Invite Codes" ON public.invite_codes
    FOR ALL USING (true) WITH CHECK (true);


-- 2. profiles jadvaliga is_registered va invite_code ustunlarini qo'shish
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS is_registered BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS invite_code TEXT;

-- 3. handle_new_user triggerni yangilash
-- Google bilan kirgan yangi foydalanuvchilar is_registered = false bo'lib yaratiladi.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name, avatar_url, is_registered)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name'),
        COALESCE(NEW.raw_user_meta_data->>'avatar_url', NEW.raw_user_meta_data->>'picture'),
        false -- yangi foydalanuvchilar avtomatik ro'yxatdan o'tmagan deb hisoblanadi
    )
    ON CONFLICT (id) DO UPDATE SET
        email = EXCLUDED.email,
        full_name = EXCLUDED.full_name,
        avatar_url = EXCLUDED.avatar_url;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
