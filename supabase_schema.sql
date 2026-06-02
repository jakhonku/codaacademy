-- ====================================================================
-- ZIYOKOR AI — SUPABASE MA'LUMOTLAR BAZASI SXEMASI
-- ====================================================================
-- Ushbu SQL kodini Supabase loyihangizdagi "SQL Editor" bo'limiga
-- nusxalab yozing va "Run" tugmasini bosing.
-- Bu sizga kerakli jadvallarni va namuna ma'lumotlarni yaratib beradi.
-- ====================================================================

-- 1. PROMPTLAR JADVALI (prompts)
CREATE TABLE IF NOT EXISTS public.prompts (
    id BIGSERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    description TEXT,
    prompt_text TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS (Row Level Security) ni o'chirib turamiz yoki ommaviy o'qishga ruxsat beramiz
ALTER TABLE public.prompts ENABLE ROW LEVEL SECURITY;

-- Siyosat: Barcha foydalanuvchilar o'qishi mumkin (Select)
CREATE POLICY "Public Read Prompts" ON public.prompts
    FOR SELECT USING (true);

-- Siyosat: Anonim yoki ro'yxatdan o'tgan admin ma'lumotlarni o'zgartirishi mumkin
-- Soddalik uchun anon/anonim foydalanuvchilarga barcha huquqlarni beramiz (chunki kalit anon key)
CREATE POLICY "All Access for Anon/Admin on Prompts" ON public.prompts
    FOR ALL USING (true) WITH CHECK (true);


-- 2. RESURSLAR JADVALI (resources)
CREATE TABLE IF NOT EXISTS public.resources (
    id BIGSERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    type TEXT NOT NULL CHECK (type IN ('pdf', 'video', 'link', 'group')),
    url TEXT,
    file_size TEXT,
    parent_id BIGINT REFERENCES public.resources(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public Read Resources" ON public.resources
    FOR SELECT USING (true);

CREATE POLICY "All Access for Anon/Admin on Resources" ON public.resources
    FOR ALL USING (true) WITH CHECK (true);


-- 3. RO'YXATDAN O'TGANLAR JADVALI (registrations)
CREATE TABLE IF NOT EXISTS public.registrations (
    id BIGSERIAL PRIMARY KEY,
    full_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    department TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.registrations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Insert registrations for anyone" ON public.registrations
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Select registrations for anyone" ON public.registrations
    FOR SELECT USING (true);

CREATE POLICY "All Access for Anon/Admin on Registrations" ON public.registrations
    FOR ALL USING (true) WITH CHECK (true);


-- ====================================================================
-- NAMUNA MA'LUMOTLAR (Seed Data)
-- ====================================================================

-- Promptlar namunasi
INSERT INTO public.prompts (title, category, description, prompt_text) VALUES
('Dars rejasi yaratish', 'Ta''lim', 'Istalgan mavzu bo''yicha batafsil dars rejasi yaratish uchun tayyor so''rov.', 'Siz tajribali musiqa o''qituvchisisiz. Menga [MAVZU NOMI] mavzusi bo''yicha 45 daqiqalik dars rejasini tuzing. Dars rejasida quyidagilar bo''lsin: 1) Darsning maqsadi, 2) Kerakli materiallar, 3) Dars bosqichlari (kirish — 5 daq, asosiy qism — 30 daq, yakunlash — 10 daq), 4) Talabalar uchun uyga vazifa.'),
('Musiqa asari tahlili', 'Musiqa', 'Biror musiqa asarini chuqur tahlil qilish uchun AI''ga beriladigan so''rov.', 'Menga [BASTAKOR NOMI]ning [ASAR NOMI] asarini batafsil tahlil qilib bering. Tahlilda quyidagilarni yoritib bering: 1) Asarning yaratilish tarixi, 2) Musiqa shakli va strukturasi, 3) Garmoniya va melodiya xususiyatlari, 4) Ijro etish bo''yicha tavsiyalar, 5) Bu asarni darsda qanday o''rgatish mumkin.'),
('Test savollari tuzish', 'Ta''lim', 'Talabalar bilimini tekshirish uchun test savollari yaratish.', 'Menga [MAVZU NOMI] mavzusi bo''yicha 10 ta test savoli tuzing. Har bir savolda 4 ta javob varianti bo''lsin (A, B, C, D). Savollar oson, o''rta va qiyin darajada aralash bo''lsin. Oxirida to''g''ri javoblar kalitini bering.'),
('Prezentatsiya rejasi', 'Prezentatsiya', 'Professional prezentatsiya uchun batafsil reja tayyorlash.', 'Menga [MAVZU NOMI] mavzusida 15 slaydlik prezentatsiya rejasini tuzing. Har bir slayd uchun: 1) Slayd sarlavhasi, 2) Asosiy matn (3-4 gap), 3) Vizual tavsiya (qanday rasm yoki grafik qo''yish kerak). Prezentatsiya [TINGLOVCHILAR] uchun mo''ljallangan.')
ON CONFLICT DO NOTHING;

-- Resurslar namunasi
INSERT INTO public.resources (title, description, type, url, file_size) VALUES
('ChatGPT bilan ishlash qo''llanmasi', 'ChatGPT''dan ta''limda foydalanishning to''liq qo''llanmasi. Boshlang''ich darajadan professional darajagacha.', 'pdf', '/files/chatgpt-qollanma.pdf', '2.5 MB'),
('AI vositalari ro''yxati', 'O''qituvchilar uchun foydali sun''iy intellekt vositalari va platformalari ro''yxati va taqqoslash jadvali.', 'pdf', '/files/ai-vositalar.pdf', '1.8 MB'),
('Musiqa va AI — video darslik', 'Musiqada sun''iy intellektdan foydalanish bo''yicha batafsil video qo''llanma.', 'video', 'https://www.youtube.com/watch?v=example', NULL),
('OpenAI rasmiy hujjatlari', 'OpenAI''ning rasmiy veb-sayti — eng yangi AI texnologiyalari haqida ma''lumot.', 'link', 'https://openai.com', NULL)
ON CONFLICT DO NOTHING;


-- ====================================================================
-- 4. TESTLAR TIZIMI
-- ====================================================================

-- 4.1 TESTLAR JADVALI (quizzes)
CREATE TABLE IF NOT EXISTS public.quizzes (
    id BIGSERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    time_limit INTEGER DEFAULT 30,
    is_active BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.quizzes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public Read Quizzes" ON public.quizzes
    FOR SELECT USING (true);

CREATE POLICY "All Access for Anon/Admin on Quizzes" ON public.quizzes
    FOR ALL USING (true) WITH CHECK (true);


-- 4.2 TEST SAVOLLARI JADVALI (quiz_questions)
CREATE TABLE IF NOT EXISTS public.quiz_questions (
    id BIGSERIAL PRIMARY KEY,
    quiz_id BIGINT REFERENCES public.quizzes(id) ON DELETE CASCADE,
    question_text TEXT NOT NULL,
    option_a TEXT NOT NULL,
    option_b TEXT NOT NULL,
    option_c TEXT NOT NULL,
    option_d TEXT NOT NULL,
    correct_answer CHAR(1) NOT NULL CHECK (correct_answer IN ('A', 'B', 'C', 'D')),
    order_num INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.quiz_questions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public Read Quiz Questions" ON public.quiz_questions
    FOR SELECT USING (true);

CREATE POLICY "All Access for Anon/Admin on Quiz Questions" ON public.quiz_questions
    FOR ALL USING (true) WITH CHECK (true);


-- 4.3 TEST ISHTIROKCHILARI JADVALI (quiz_participants)
CREATE TABLE IF NOT EXISTS public.quiz_participants (
    id BIGSERIAL PRIMARY KEY,
    quiz_id BIGINT REFERENCES public.quizzes(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    score INTEGER DEFAULT 0,
    total_questions INTEGER DEFAULT 0,
    attempt_count INTEGER DEFAULT 0,
    last_attempt_at TIMESTAMPTZ,
    completed BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.quiz_participants ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public Read Quiz Participants" ON public.quiz_participants
    FOR SELECT USING (true);

CREATE POLICY "All Access for Anon/Admin on Quiz Participants" ON public.quiz_participants
    FOR ALL USING (true) WITH CHECK (true);

