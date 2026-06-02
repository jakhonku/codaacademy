-- ====================================================================
-- PROMPTLAR — 41 TA SIFATLI PROMPTNI SUPABASE BAZAGA QO'SHISH
-- ====================================================================
-- Bu faylni Supabase > SQL Editor da ochib, "Run" tugmasini bosing.
--
-- Bosqichlar:
-- 1) Avval prompts JADVALI yaratiladi (agar mavjud bo'lmasa)
-- 2) RLS siyosatlari sozlanadi
-- 3) ESKI promptlar tozalanadi (TRUNCATE) — agar kerak bo'lmasa,
--    quyidagi TRUNCATE qatorini izohga oling (--)
-- 4) 41 ta yangi prompt qo'shiladi
--
-- Eslatma: dollar-quoted strings ($prompt$...$prompt$) ishlatildi —
-- shu sababli apostrof (') va \n larni qochirish shart emas.
-- ====================================================================

-- 1. JADVAL (agar yaratilmagan bo'lsa)
CREATE TABLE IF NOT EXISTS public.prompts (
    id BIGSERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    description TEXT,
    prompt_text TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. RLS sozlash
ALTER TABLE public.prompts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public Read Prompts" ON public.prompts;
CREATE POLICY "Public Read Prompts" ON public.prompts
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "All Access for Anon/Admin on Prompts" ON public.prompts;
CREATE POLICY "All Access for Anon/Admin on Prompts" ON public.prompts
    FOR ALL USING (true) WITH CHECK (true);

-- 3. (IXTIYORIY) Eski promptlarni tozalash.
--    Faqat bazada test promptlari turgan bo'lsa qoldiring,
--    aks holda izohga oling (-- prefiksini qo'shing).
TRUNCATE TABLE public.prompts RESTART IDENTITY;

-- 4. 41 ta PROMPTNI QO'SHISH
-- ====================================================================

-- TA'LIM (1-6)
INSERT INTO public.prompts (title, category, description, prompt_text) VALUES
($t$Batafsil dars rejasi tuzish$t$, $t$Ta'lim$t$, $t$Istalgan fan va mavzu uchun bosqichma-bosqich dars rejasi.$t$, $prompt$Siz [FAN NOMI: matematika/tarix/musiqa] o'qituvchisisiz. [SINF/YOSH] o'quvchilari uchun [MAVZU NOMI] mavzusi bo'yicha 45 daqiqalik dars rejasini tuzing. Reja quyidagilardan iborat bo'lsin:
1. Darsning maqsadi va o'rganish natijalari
2. Kerakli materiallar va vositalar
3. Bosqichlar: kirish (5 daq) — qiziqarli savol/topishmoq orqali; asosiy qism (30 daq) — yangi mavzu tushuntirish va amaliy mashqlar; yakunlash (10 daq) — qisqa takror va xulosalar
4. Yakuniy refleksiya savollari
5. Uyga vazifa
6. Qo'shimcha qiyinroq o'quvchilar uchun individual topshiriqlar$prompt$),

($t$Test savollari (Bloom taksonomiyasi)$t$, $t$Ta'lim$t$, $t$Bilim, tushunish, qo'llash darajalarini tekshiruvchi test.$t$, $prompt$Menga [MAVZU NOMI] mavzusi bo'yicha 15 ta test savoli tuzing. Savollar Bloom taksonomiyasi bo'yicha taqsimlangan bo'lsin:
- 5 ta bilim/tushunish darajasidagi (oson)
- 5 ta qo'llash/tahlil darajasidagi (o'rtacha)
- 5 ta sintez/baholash darajasidagi (qiyin)

Har bir savolda 4 ta javob varianti (A, B, C, D) bo'lsin. Oxirida to'g'ri javoblar kaliti va har bir savol uchun qisqa izoh (nima uchun shu javob to'g'ri ekanligini tushuntirish) bering.$prompt$),

($t$Mavzuni sodda tilda tushuntirish$t$, $t$Ta'lim$t$, $t$Murakkab tushunchani 12 yoshli bolaga tushuntirish.$t$, $prompt$Menga [MAVZU/TUSHUNCHA] mavzusini xuddi [YOSH: 10/12/15] yoshdagi bolaga tushuntirgandek soda tilda tushuntirib bering. Quyidagilar bo'lsin:
1. Hayotiy oddiy misol bilan boshlang
2. Asosiy tushunchani 3-4 jumlada bering
3. Qiziqarli taqqoslash (analogiya) keltiring
4. Bola eslab qolishi uchun qisqa qoida yoki she'r tuzing
5. Bola savol berishi mumkin bo'lgan 3 ta savol va ularga javob$prompt$),

($t$O'quvchi xatolarini tahlil qilish$t$, $t$Ta'lim$t$, $t$Talabaning ishidagi tipik xatolarni aniqlash va tuzatish.$t$, $prompt$Quyidagi [FAN] bo'yicha o'quvchi ishini tahlil qiling:

[O'QUVCHI ISHI/JAVOBI]

Quyidagi tartibda tahlil qiling:
1. Aniqlangan xatolar ro'yxati (tipi bo'yicha guruhlangan)
2. Har bir xato uchun: nima uchun bu xato bo'ldi, qaysi tushuncha o'zlashtirilmagan
3. Tuzatilgan to'g'ri javob
4. O'quvchiga konstruktiv tushuntirish (motivatsiya yo'qotmaydigan ohangda)
5. Shu xatoni qaytarmaslik uchun 3 ta amaliy mashq$prompt$),

($t$Individual o'quv rejasi (1 oylik)$t$, $t$Ta'lim$t$, $t$Bitta o'quvchi uchun shaxsiy 4 haftalik o'quv yo'l xaritasi.$t$, $prompt$Menga [FAN/SOHA] bo'yicha [DARAJA: boshlang'ich/o'rta/yuqori] darajadagi o'quvchi uchun 4 haftalik (1 oylik) individual o'quv rejasini tuzing. O'quvchining maqsadi: [MAQSAD]. Kuniga ajratiladigan vaqt: [DAQIQA] daqiqa.

Reja quyidagi tartibda bo'lsin:
1. Haftalik maqsadlar va kalit natijalar
2. Kunlik mashqlar va vazifalar
3. Haftada 1 marta o'z-o'zini baholash savollari
4. Tavsiya etiladigan resurslar (kitob/video/sayt)
5. Oy oxirida yakuniy sinov mezonlari
6. Motivatsiya tushib ketganda qiladigan ishlar ro'yxati$prompt$),

($t$Sinfdagi muammoli vaziyatni hal qilish$t$, $t$Ta'lim$t$, $t$Pedagogik vaziyat uchun professional yondashuv.$t$, $prompt$Men [SINF/GURUH] da o'qituvchiman. Quyidagi vaziyat yuz berdi:

[VAZIYAT TAVSIFI]

Menga ushbu vaziyatni hal qilish bo'yicha:
1. Vaziyatni psixologik-pedagogik tahlil qiling
2. Darhol qilinishi mumkin bo'lgan 3 ta amal (qisqa muddatda)
3. Uzoq muddatli yechim (1-2 oy ichida)
4. Ota-onalar bilan suhbat uchun aniq matn-shablon
5. Boshqa hamkasblarga maslahat so'rashim mumkin bo'lgan savollar
6. O'xshash vaziyatlar yuz bermasligi uchun profilaktika choralari$prompt$);

-- MUSIQA (7-10)
INSERT INTO public.prompts (title, category, description, prompt_text) VALUES
($t$Musiqa asarini chuqur tahlil qilish$t$, $t$Musiqa$t$, $t$Klassik yoki zamonaviy asarning to'liq musiqashunoslik tahlili.$t$, $prompt$Menga [BASTAKOR NOMI]ning [ASAR NOMI] asarini batafsil tahlil qilib bering:
1. Asarning yaratilish tarixi va kontekst
2. Musiqa shakli va strukturasi (sonata/rondo/variatsiya)
3. Tonalliklar, modulyatsiyalar, garmonik xususiyatlar
4. Asosiy melodik mavzular va ularning rivojlanishi
5. Tembr va orkestrovka xususiyatlari
6. Ifoda va dinamik belgilarning ma'nosi
7. Ijro etish bo'yicha amaliy tavsiyalar
8. Bu asarni o'quvchilarga qanday tushuntirish bo'yicha pedagogik yondashuv$prompt$),

($t$Cholg'u uchun mashq tuzish$t$, $t$Musiqa$t$, $t$Maxsus texnik mashqlar va etyudlar yaratish.$t$, $prompt$Menga [CHOLG'U NOMI] cholg'usi uchun [DARAJA: boshlang'ich/o'rta/yuqori] darajadagi o'quvchi uchun 5 ta texnik mashq yarating. Asosiy maqsad: [MAQSAD: barmoq mashqi/intonatsiya/ritm/staccato].

Har bir mashq uchun:
1. Mashqning aniq maqsadi
2. Bajarish tartibi va tempi (metronom belgisi bilan)
3. Diqqat qaratish kerak bo'lgan jihatlar
4. Tipik xatolar va ularni oldini olish
5. Murakkablik darajasini oshirish variantlari
6. Kunlik mashq jadvali (daqiqada)$prompt$),

($t$Musiqa atamalarini lug'at sifatida$t$, $t$Musiqa$t$, $t$Italyan/lotin musiqa atamalarini sodda tushuntirish.$t$, $prompt$Menga quyidagi musiqa atamalarini lug'at shaklida tushuntirib bering. Har bir atama uchun:
1. Asl tilda (italyan/lotin) va o'zbekcha tarjimasi
2. Aniq ta'rifi
3. Asarda qanday ko'rsatiladi (belgisi)
4. Mashhur asarlardan amaliy misol
5. O'xshash atamalar bilan farqi

Atamalar: [ATAMALAR RO'YXATI: masalan — allegro, adagio, fortissimo, legato]$prompt$),

($t$Kontsert dasturi tuzish$t$, $t$Musiqa$t$, $t$Tadbir uchun professional kontsert dasturi.$t$, $prompt$Menga [TADBIR TURI: yakkaxon konsert/sinf kontserti/festival] uchun professional dastur tuzing.
Ma'lumotlar:
- Davomiyligi: [SOAT] soat
- Ishtirokchilar soni va darajasi: [SONI/DARAJA]
- Tinglovchilar: [KIMLAR: bolalar/oilalar/mutaxassislar]
- Mavzu/janr: [JANR]

Dasturda quyidagilar bo'lsin:
1. Ochilish — kuchli va e'tibor jalb qiluvchi asar
2. Asosiy qism — turli davr va uslublar aralashmasi
3. Tanaffus joyi
4. Yakunlovchi qism — emotsional cho'qqi
5. Bis variantlari
6. Har bir asar uchun: ijrochi, davomiyligi, qisqa izoh
7. Tinglovchilar uchun konferans matni$prompt$);

-- PREZENTATSIYA (11-12)
INSERT INTO public.prompts (title, category, description, prompt_text) VALUES
($t$Professional prezentatsiya rejasi (15 slayd)$t$, $t$Prezentatsiya$t$, $t$Slayd-slayd batafsil reja va dizayn tavsiyalari.$t$, $prompt$Menga [MAVZU NOMI] mavzusida [TINGLOVCHILAR: talabalar/hamkasblar/rahbariyat] uchun 15 slaydlik prezentatsiya rejasini tuzing. Prezentatsiya davomiyligi: [DAQIQA] daqiqa.

Har bir slayd uchun:
1. Slayd sarlavhasi
2. Asosiy gap-fikrlar (3-4 bullet)
3. Vizual tavsiya (rasm/grafik/diagramma turini ko'rsating)
4. Ma'ruzachi uchun gapiriladigan matn (kengroq)
5. Tinglovchilar berishi mumkin bo'lgan savollar

Oxirida: 1) Yaxshi taqdim etish bo'yicha 5 ta maslahat, 2) Slaydlar dizayni uchun rang va shrift tavsiyalari.$prompt$),

($t$Public speaking — qo'rquvni yengish$t$, $t$Prezentatsiya$t$, $t$Nutq oldidan stress va qo'rquvni boshqarish strategiyasi.$t$, $prompt$Men [SHAROIT: muhim konferensiya/dars/ish suhbati] da [DAQIQA] daqiqalik nutq so'zlayman. Mavzu: [MAVZU]. Tinglovchilar soni: [SONI].

Menga quyidagicha yordam bering:
1. Nutq oldidan 3 kun davomida tayyorlanish jadvali
2. Nutq kuni ertalab qiladigan ishlar (jismoniy va aqliy)
3. Nutqdan 5 daqiqa oldin qiladigan nafas mashqlari
4. Sahnada/oldindan turish va imo-ishora uchun maslahatlar
5. Tovush, temp va pauzalardan to'g'ri foydalanish
6. Agar so'zni unutib qo'ysam — nima qilish kerak
7. Tinglovchilarning savollariga javob berishda strategiya$prompt$);

-- KOMMUNIKATSIYA (13-15)
INSERT INTO public.prompts (title, category, description, prompt_text) VALUES
($t$Professional email yozish$t$, $t$Kommunikatsiya$t$, $t$Har qanday vaziyat uchun moslashuvchan email shabloni.$t$, $prompt$Menga professional email yozib bering.
Ma'lumotlar:
- Maqsad: [MAQSAD: taklif/so'rov/minnatdorchilik/uzr/eslatma]
- Qabul qiluvchi: [KIM: rahbar/hamkasb/mijoz/ota-ona]
- Ohang: [RASMIY/YARIM RASMIY/DO'STONA]
- Asosiy xabar: [NIMA HAQIDA]
- Talab qilinadigan harakat: [JAVOB BERISH/UCHRASHISH/HUJJAT YUBORISH]

Quyidagi tuzilishda yozing:
1. Mavzu qatori (qisqa va aniq)
2. Salomlashish
3. Kirish jumlasi (kontekst)
4. Asosiy qism (aniq va qisqa)
5. Aniq so'rov yoki taklif
6. Yakuniy jumla
7. Hurmat bilan

Shuningdek 2 ta alternativ variant bering (formalroq va do'stonaroq).$prompt$),

($t$Murakkab suhbatga tayyorgarlik$t$, $t$Kommunikatsiya$t$, $t$Qiyin mavzudagi suhbatni tayyorlash bo'yicha skript.$t$, $prompt$Men [KIM] bilan murakkab suhbat o'tkazishim kerak. Mavzu: [SUHBAT MAVZUSI: nizo/maosh/tanqid/cheklov belgilash]. Mening maqsadim: [MAQSAD].

Menga quyidagicha yordam bering:
1. Suhbat oldidan tayyorlanish (faktlar, dalillar)
2. Suhbatni boshlash uchun aniq jumla
3. Asosiy fikrlarni qanday ifodalash (3-4 jumlada)
4. Suhbatdosh berishi mumkin bo'lgan e'tirozlar va ularga javob
5. Emotsiya bilan boshqarish (agar suhbat qizib ketsa)
6. Suhbatni ijobiy yakunlash usuli
7. Suhbatdan keyin qiladigan ishlar (eslatma yuborish va h.k.)$prompt$),

($t$Ota-onalar bilan uchrashuv matni$t$, $t$Kommunikatsiya$t$, $t$Sinf yig'ilishi yoki individual suhbat uchun matn.$t$, $prompt$Men [SINF] sinfining o'qituvchisiman va [UCHRASHUV TURI: sinf yig'ilishi/individual suhbat] o'tkazyapman. Asosiy mavzular: [MAVZULAR].

Menga quyidagilarni tuzib bering:
1. Uchrashuv ochilishi (5 daqiqa) — ijobiy ohang
2. Asosiy hisobotni qanday taqdim etish (10-15 daqiqa)
3. Muammoli vaziyatlarni hassoslik bilan tushuntirish usuli
4. Ota-onalar berishi mumkin bo'lgan 7 ta savol va tayyor javoblar
5. Hamkorlik taklifi — uy va maktab orasida
6. Yakunlash va keyingi qadamlar
7. Mavjudligi mumkin bo'lgan qiyin ota-ona bilan to'g'ri munosabat$prompt$);

-- YOZISH (16-18)
INSERT INTO public.prompts (title, category, description, prompt_text) VALUES
($t$Maqola tuzilishi va yozish$t$, $t$Yozish$t$, $t$Blog yoki ilmiy maqola uchun professional reja.$t$, $prompt$Menga [MAVZU NOMI] mavzusida [QO'YILISH: blog/ilmiy/jurnalistik] maqola yozish uchun yordam bering.
Ma'lumotlar:
- Maqsadli auditoriya: [KIMLAR]
- Maqola hajmi: [SO'Z SONI] so'z
- Asosiy kalit so'zlar: [KALIT SO'ZLAR]

Quyidagilarni bering:
1. Diqqatni jalb qiluvchi 3 ta sarlavha varianti
2. Maqolaning to'liq tuzilishi (bo'limlar va paragraflar)
3. Kirish qismi (to'liq matn, ~150 so'z)
4. Har bir bo'lim uchun asosiy fikrlar va misollar
5. Yakuniy xulosa va o'quvchini harakatga undash
6. SEO uchun meta-tavsif (160 belgi)
7. Ijtimoiy tarmoqlarda ulashish uchun qisqa anons$prompt$),

($t$Ijtimoiy tarmoq posti yaratish$t$, $t$Yozish$t$, $t$Instagram/Telegram/LinkedIn uchun jozibali matn.$t$, $prompt$Menga [PLATFORMA: Instagram/Telegram/LinkedIn/Facebook] uchun post yarating.
Ma'lumotlar:
- Mavzu: [MAVZU]
- Maqsad: [MAQSAD: ma'lumot berish/sotish/jalb qilish]
- Auditoriya: [AUDITORIYA]
- Ohang: [PROFESSIONAL/DO'STONA/HAYAJONLI]

Quyidagilarni bering:
1. E'tibor tortuvchi birinchi qator (hook)
2. Asosiy matn (platforma talabiga moslashtirilgan hajm)
3. Emoji va formatlash (lekin haddan oshirmasdan)
4. 5-7 ta tegishli hashtag
5. Harakatga chaqirish (CTA)
6. Rasm/video uchun tavsiya
7. 2 ta muqobil variant (qisqaroq va uzunroq)$prompt$),

($t$Insho yozish (essay)$t$, $t$Yozish$t$, $t$Imtihon yoki ijodiy insho uchun bosqichma-bosqich reja.$t$, $prompt$Menga [MAVZU NOMI] mavzusida insho yozishga yordam bering.
Ma'lumotlar:
- Insho turi: [BAHS/TAVSIFIY/HIKOYAVIY/ANALITIK]
- Hajmi: [SO'Z SONI] so'z
- Daraja: [O'RTA MAKTAB/UNIVERSITET]

Quyidagilarni bering:
1. Insho rejasi (kirish, asosiy qism, xulosa)
2. Diqqatni tortuvchi kirish (thesis bayonoti bilan)
3. 3 ta asosiy argument va ularga dalillar/misollar
4. Qarama-qarshi fikrni qanday rad etish
5. Kuchli xulosa
6. Boy lug'at va o'rinli ulanish so'zlari ro'yxati
7. Imloviy va grammatik xatolarni oldini olish maslahatlari$prompt$);

-- ISH (19-21)
INSERT INTO public.prompts (title, category, description, prompt_text) VALUES
($t$Yig'ilish kun tartibini tuzish$t$, $t$Ish$t$, $t$Samarali yig'ilish uchun batafsil agenda.$t$, $prompt$Menga [DAQIQA] daqiqalik yig'ilish uchun kun tartibini tuzing.
Ma'lumotlar:
- Yig'ilish maqsadi: [MAQSAD]
- Ishtirokchilar: [KIMLAR va NECHTA]
- Muhokama qilinadigan mavzular: [MAVZULAR]

Kun tartibi quyidagilarni o'z ichiga olsin:
1. Yig'ilish boshlanishi va kutilayotgan natijalar (5 daq)
2. Har bir mavzu uchun: vaqt, javobgar, kutilgan natija
3. Tanaffus joyi (agar 90 daq+ bo'lsa)
4. Qarorlar qabul qilish bosqichi
5. Topshiriqlar va deadlinelar
6. Yig'ilishni yakunlash va keyingi qadamlar
7. Yig'ilishdan keyin yuboriladigan eslatma email shabloni$prompt$),

($t$Loyiha rejasini tuzish (SMART maqsadlar)$t$, $t$Ish$t$, $t$Loyihani boshlashdan tugatishgacha to'liq reja.$t$, $prompt$Menga [LOYIHA NOMI] loyihasi uchun batafsil reja tuzing.
Ma'lumotlar:
- Loyiha maqsadi: [MAQSAD]
- Muddati: [VAQT]
- Jamoa hajmi: [KISHI SONI]
- Byudjet: [BYUDJET] (agar mavjud bo'lsa)

Reja quyidagilardan iborat bo'lsin:
1. SMART maqsadlar (aniq, o'lchanadigan, erishish mumkin, ahamiyatli, vaqt chegarali)
2. Asosiy bosqichlar (milestones) va deadlinelar
3. Vazifalar taqsimoti (kim, nima, qachon)
4. Tavakkalchiliklarni baholash va profilaktika
5. Muvaffaqiyat ko'rsatkichlari (KPI)
6. Haftalik nazorat va hisobot mexanizmi
7. Loyiha yakunida nima baholash kerak$prompt$),

($t$Vaqt boshqaruvi: kunlik reja$t$, $t$Ish$t$, $t$Pomodoro va eng yaxshi vaqt boshqaruvi metodlari.$t$, $prompt$Menga samarali kunlik reja tuzib bering. Men [KASB: o'qituvchi/dasturchi/talaba/menejer] bo'lib ishlayman.
Kun davomida hal qilishim kerak bo'lgan ishlar:
[VAZIFALAR RO'YXATI]

Reja quyidagilarni o'z ichiga olsin:
1. Eng samarali ish vaqtini aniqlash (deep work)
2. Ishlarni muhimlik va shoshilinchlik bo'yicha tartiblash (Eisenhower matritsasi)
3. Pomodoro texnikasi bo'yicha vaqt bloklari (25/5)
4. Tanaffuslar va energiyani tiklash payti
5. Emaillar va xabarlarni tekshirish vaqti
6. Ish va shaxsiy hayot orasida chegara
7. Kun oxirida 5 daqiqalik refleksiya savollari$prompt$);

-- KARYERA (22-24)
INSERT INTO public.prompts (title, category, description, prompt_text) VALUES
($t$Professional CV tuzish$t$, $t$Karyera$t$, $t$Zamonaviy va e'tiborli rezyume.$t$, $prompt$Menga professional CV tuzishga yordam bering.
Ma'lumotlar:
- To'liq ism: [ISM]
- Ariza qilinayotgan lavozim: [LAVOZIM]
- Tajriba: [TAJRIBA YILLARI]
- Asosiy ko'nikmalar: [KO'NIKMALAR]
- Ta'lim: [TA'LIM]
- Yutuqlar: [YUTUQLAR]

CV quyidagi tuzilishda bo'lsin:
1. Sarlavha (ism + lavozim + kontakt)
2. Professional xulosa (3-4 jumla — eng kuchli)
3. Ish tajribasi (eng yangidan boshlab, harakat fe'llari bilan)
4. Ko'nikmalar (hard skills va soft skills)
5. Ta'lim va sertifikatlar
6. Loyihalar/yutuqlar
7. ATS (Applicant Tracking System) uchun kalit so'zlar tavsiyasi$prompt$),

($t$Cover letter (motivatsion xat) yozish$t$, $t$Karyera$t$, $t$Ish o'rni uchun individual motivatsion xat.$t$, $prompt$Menga [KOMPANIYA NOMI] kompaniyasiga [LAVOZIM] lavozimiga ariza topshirish uchun motivatsion xat (cover letter) yozib bering.

Men haqimda:
- Tajriba: [TAJRIBA]
- Asosiy ko'nikmalar: [KO'NIKMALAR]
- Yutuqlar: [YUTUQLAR]
- Bu kompaniyaga qiziqish sababim: [SABAB]

Xat quyidagi tuzilishda bo'lsin:
1. Salomlashish (HR yoki menejer ismi bilan)
2. Diqqat tortuvchi birinchi paragraf (nima uchun shu lavozim)
3. Tajriba va yutuqlar (aniq raqamlar bilan)
4. Kompaniya qadriyatlari bilan moslik
5. Nima qo'sha olishim mumkinligi
6. Yakuniy paragraf (uchrashuv taklifi)
7. Hurmat bilan

Umumiy ohang: ishonchli, lekin kibrli emas.$prompt$),

($t$Ish suhbatiga tayyorgarlik$t$, $t$Karyera$t$, $t$Mock interview — savol-javoblar va strategiya.$t$, $prompt$Men [KOMPANIYA] kompaniyasiga [LAVOZIM] lavozimiga ish suhbatiga tayyorlanyapman.
Mening tajribam: [TAJRIBA]
Mening kuchli tomonlarim: [KUCHLI TOMONLAR]
Kuchsiz tomonlarim: [KUCHSIZ TOMONLAR]

Menga quyidagilarni bering:
1. Eng ko'p so'raladigan 10 ta savol va tayyor javoblar (STAR metodi bo'yicha)
2. "O'zingiz haqingizda gapiring" uchun 90 sekundlik javob
3. "Nima uchun bizning kompaniya?" uchun shaxsiy javob
4. Maoshni muhokama qilishda strategiya
5. Suhbat oxirida men beradigan 5 ta aqlli savol
6. Body language va birinchi taassurot bo'yicha maslahatlar
7. Suhbatdan keyin minnatdorchilik xati shabloni$prompt$);

-- TAHLIL (25-26)
INSERT INTO public.prompts (title, category, description, prompt_text) VALUES
($t$Matnni qisqacha bayon qilish (summary)$t$, $t$Tahlil$t$, $t$Uzun matnni asosiy fikrlarga qisqartirish.$t$, $prompt$Quyidagi matnni tahlil qiling va qisqacha bayon qiling:

[MATN]

Quyidagi formatda bering:
1. Bir jumlali asosiy g'oya (TLDR)
2. 5-7 ta asosiy nuqta (bullet points)
3. Muallifning asosiy argumenti va dalillari
4. Matndan eng muhim 3 ta iqtibos (sitata)
5. Matnda zaif yoki bahsli joylar
6. Matnni o'qigan kishi keyingi qadam sifatida nima qilishi kerak
7. Bog'liq mavzularda qo'shimcha o'qish uchun tavsiyalar$prompt$),

($t$SWOT tahlil o'tkazish$t$, $t$Tahlil$t$, $t$Loyiha/biznes/karyera uchun strategik tahlil.$t$, $prompt$Menga [NIMA: loyiha/biznes/karyera/o'qish yo'nalishi] uchun SWOT tahlil tuzib bering.
Kontekst: [BATAFSIL TAVSIF]

Tahlil quyidagilardan iborat bo'lsin:
1. **Strengths** (Kuchli tomonlar) — ichki ijobiy omillar
2. **Weaknesses** (Zaif tomonlar) — ichki salbiy omillar
3. **Opportunities** (Imkoniyatlar) — tashqi ijobiy omillar
4. **Threats** (Tahdidlar) — tashqi salbiy omillar

Har bir bo'limda kamida 5 ta aniq punkt bo'lsin.

Tahlil oxirida:
5. Strategik tavsiyalar (SO, WO, ST, WT strategiyalari)
6. Birinchi navbatda nima qilish kerakligi
7. 3 ta amaliy qadam (keyingi 30 kun ichida)$prompt$);

-- IJODIY (27-29)
INSERT INTO public.prompts (title, category, description, prompt_text) VALUES
($t$Brend nomi va shior yaratish$t$, $t$Ijodiy$t$, $t$Biznes uchun yangi brend identifikatsiyasi.$t$, $prompt$Menga yangi brend uchun nom va shior yaratishga yordam bering.
Ma'lumotlar:
- Soha: [SOHA]
- Mahsulot/xizmat: [NIMA TAKLIF QILINADI]
- Asosiy auditoriya: [AUDITORIYA]
- Qiymatlar: [QIYMATLAR: ishonchlilik/innovatsiya/qulaylik]
- Tilshunoslik talabi: [O'ZBEK/INGLIZ/AKLITIK ARALASH]

Quyidagilarni bering:
1. 10 ta brend nomi varianti (har biri uchun ma'no izohi)
2. Har bir nom uchun 2-3 ta shior
3. Top 3 ta tavsiya etilgan kombinatsiya
4. Domen mavjudligi va social media handler tavsiyalari
5. Logotip uchun vizual konsepsiya (ranglar va shakl)
6. Brendning "hikoyasi" (storytelling) — 3 jumlada
7. Marketing pitch (15 sekund)$prompt$),

($t$Hikoya/skript yozish$t$, $t$Ijodiy$t$, $t$Qisqa hikoya yoki video skripti yaratish.$t$, $prompt$Menga [JANR: drama/komediya/fantastika/hayotiy] janrida [HAJM: qisqa hikoya/3 daqiqalik video skripti] yarating.
Kontekst:
- Asosiy g'oya: [G'OYA]
- Bosh qahramon: [QAHRAMON TAVSIFI]
- Joy: [QAYERDA]
- Vaqt: [QACHON]

Hikoya/skript:
1. Diqqatni jalb qiluvchi boshlang'ich (hook)
2. Qahramonning kelib chiqishi va maqsadi
3. To'siqlar va ziddiyatlar (3 ta ko'tarilish)
4. Cho'qqi nuqtasi (climax)
5. Yechim va xulosa
6. Tomoshabin uchun emotsional ta'sir
7. Dialoglar tabiiy va xarakterga mos bo'lsin
8. Vizual sahnalar tavsiyalari (skript bo'lsa)$prompt$),

($t$Tug'ilgan kun yoki tabriklash matni$t$, $t$Ijodiy$t$, $t$Yaqin odamga shaxsiy va samimiy tabrik.$t$, $prompt$Menga [KIM: yaqin do'st/oila a'zosi/hamkasb/rahbar] uchun [MUNOSABAT: tug'ilgan kun/yubiley/to'y/yangi ish] tabrigini yozib bering.
Ma'lumotlar:
- Munosabat darajasi: [QANCHALIK YAQIN]
- Ohang: [JIDDIY/HAZIL ARALASH/EMOTSIONAL]
- Eslatib o'tish kerak bo'lgan jihat: [XOTIRA/YUTUQ/ORZULAR]
- Format: [QISQA SMS/UZUN XAT/SHE'R/NUTQ]

Menga 3 ta variant bering:
1. Klassik va samimiy variant
2. Hayoliyroq va hissiyotli variant
3. Hazil-mutoyiba aralashgan variant

Har bir variant uchun: yopishqoq emas, shaxsiy va eslab qoladigan bo'lsin.$prompt$);

-- TARJIMA (30-31)
INSERT INTO public.prompts (title, category, description, prompt_text) VALUES
($t$Sifatli tarjima qilish$t$, $t$Tarjima$t$, $t$Kontekstni hisobga olgan professional tarjima.$t$, $prompt$Quyidagi matnni [DASTLABKI TIL]dan [MAQSADLI TIL]ga tarjima qiling:

[MATN]

Tarjima qilishda:
1. So'zma-so'z emas, ma'noni saqlab tarjima qiling
2. Maqsadli tilning idiomatik xususiyatlarini ishlating
3. Ohang va uslubni saqlang ([RASMIY/DO'STONA/TEXNIK])
4. Madaniy nuanslarga e'tibor bering
5. Tarjimani 2 ta variantda taqdim eting (so'zma-so'z va erkin)
6. Qiyin jumlalar uchun tarjima qarorlarining sababini tushuntiring
7. Alternativ so'z tanlovlari (sinonimlar) taklif qiling$prompt$),

($t$Til o'rganish: kunlik mashq$t$, $t$Tarjima$t$, $t$Xorijiy til o'rganish uchun amaliy mashqlar.$t$, $prompt$Men [TIL] tilini [DARAJA: A1/A2/B1/B2/C1] darajasida o'rganyapman. Maqsadim: [MAQSAD: sayohat/ish/imtihon].

Menga bugun uchun 30 daqiqalik mashq dasturini tuzib bering:
1. Yangi 10 ta so'z (kontekstli misollar bilan)
2. 1 ta grammatik mavzu (qisqa tushuntirish + 5 ta mashq)
3. Qisqa o'qish matni (mening darajamga mos) + tushunish savollari
4. Eshitish mashqi tavsiyasi (YouTube/podcast)
5. Yozma mashq — kunlik kundalik mavzusi
6. Og'zaki nutq — yolg'iz mashq qilish uchun gaplar
7. Ertangi kun uchun maslahat$prompt$);

-- AI (32-34)
INSERT INTO public.prompts (title, category, description, prompt_text) VALUES
($t$Promptni yaxshilash (meta-prompt)$t$, $t$AI$t$, $t$Mavjud promptingizni AI orqali kuchaytirish.$t$, $prompt$Men ChatGPT bilan ishlash uchun quyidagi promptni yozdim:

[MENING PROMPTIM]

Lekin natijalar ko'nglimga to'lmayapti. Menga yordam bering:
1. Bu promptning kuchli va kuchsiz tomonlarini tahlil qiling
2. Aniqlik, kontekst, format va misollar bo'yicha qanday yaxshilash mumkin
3. Promptning yaxshilangan to'liq versiyasini yozing
4. 2 ta muqobil variant (turli yondashuv bilan)
5. Eng ko'p ishlatiladigan prompt-engineering texnikalari ushbu promptga qanday qo'llanadi (Chain-of-Thought, Few-Shot va h.k.)
6. Promptni sinab ko'rish uchun namuna kirish ma'lumotlari
7. Promptning tavsiya etilgan modeli (GPT-4/Claude/Gemini)$prompt$),

($t$Brainstorm — g'oya yaratish$t$, $t$AI$t$, $t$Har qanday muammo uchun 20+ ijodiy g'oya.$t$, $prompt$Men [MUAMMO/MAQSAD] bilan duch keldim. Cheklovlar: [CHEKLOVLAR: byudjet/vaqt/resurslar].

Menga ushbu muammo uchun 20+ ijodiy g'oyalar generatsiya qiling. Quyidagi guruhlarga taqsimlang:
1. Klassik va sinab ko'rilgan yondashuvlar (5 ta)
2. Innovatsion va norasmiy g'oyalar (5 ta)
3. Texnologiyaga asoslangan yondashuvlar (5 ta)
4. Past byudjetli yoki bepul yechimlar (5 ta)
5. "Aql bovar qilmaydigan" — radikal g'oyalar (3-5 ta)

Har bir g'oya uchun:
- Qisqa tavsif
- Foydasi/imkoniyati
- Amalga oshirish qiyinligi (1-10)
- Birinchi qadam

Oxirida top 3 ta tavsiya — nima uchun ular eng yaxshi.$prompt$),

($t$Qaror qabul qilish — pro/kontra tahlili$t$, $t$AI$t$, $t$Murakkab qarorlarni har tomondan ko'rib chiqish.$t$, $prompt$Men quyidagi qaror oldidaman:

[QAROR/VAZIYAT]

Kontekst: [BATAFSIL TAVSIF]
Mening qadriyatlarim: [NIMA MEN UCHUN MUHIM]
Mavjud variantlar: [VARIANTLAR]

Menga ushbu qarorni qabul qilishimga yordam bering:
1. Har bir variant uchun aniq pro va kontra (5 tadan)
2. Qisqa muddatli va uzoq muddatli oqibatlar
3. Eng yomon stsenariy (worst case) — har bir variant uchun
4. Eng yaxshi stsenariy (best case)
5. Mening qadriyatlarimga qaysi variant ko'proq mos
6. Hissiyot emas, mantiq nuqtai nazaridan tavsiya
7. Qarorni qabul qilishdan oldin javob berishim kerak bo'lgan 5 ta savol$prompt$);

-- SHAXSIY (35-37)
INSERT INTO public.prompts (title, category, description, prompt_text) VALUES
($t$Yillik shaxsiy maqsadlar (OKR)$t$, $t$Shaxsiy$t$, $t$Yil boshlanishi uchun strukturali maqsadlar tizimi.$t$, $prompt$Menga keyingi 12 oy uchun shaxsiy maqsadlar tizimini tuzib bering. Hayotim hozir quyidagicha:
- Yosh: [YOSH]
- Asosiy faoliyat: [KASB/O'QISH]
- Kuchli tomonlarim: [KUCHLI TOMONLAR]
- Rivojlantirmoqchi bo'lgan jihatlarim: [RIVOJLANISH SOHALARI]
- Hozirgi qiyinchiliklarim: [QIYINCHILIKLAR]

Reja quyidagi tuzilishda:
1. 3 ta yillik asosiy maqsad (OKR formati: Objective + 3 Key Results)
2. Har bir maqsad uchun chorak (3 oylik) bosqichlari
3. Sog'liq sohasidagi maqsadlar
4. Karyera va o'rganish maqsadlari
5. Munosabatlar va oilaviy maqsadlar
6. Moliyaviy maqsadlar
7. Oylik nazorat tizimi
8. Maqsadga erishganda o'zingizni qanday taqdirlash$prompt$),

($t$Kunlik refleksiya jurnali$t$, $t$Shaxsiy$t$, $t$Kun yakunida o'z-o'zini tahlil qilish savollari.$t$, $prompt$Menga kunlik refleksiya (kundalik) yozish uchun savollar to'plamini tuzing. Maqsadim: [MAQSAD: o'sish/stress kamaytirish/produktivlik].

Har kuni kechqurun 10 daqiqada javob beradigan tuzilishni bering:
1. Bugungi 3 ta yutuq (kichik ham bo'lsa)
2. Bugun nimadan minnatdorchilik bildiraman (3 ta)
3. Bugungi eng qiyin lahza — undan nima o'rgandim
4. Bugun o'zimga qanday g'amxo'rlik qildim
5. Boshqalarga qanday yordam berdim
6. Ertangi kunning 1 ta asosiy maqsadi
7. Ertaga energiya bilan boshlash uchun bugun nima qila olaman

Shuningdek, haftalik va oylik chuqurroq refleksiya savollari bering.$prompt$),

($t$Stress va xavotirni boshqarish rejasi$t$, $t$Shaxsiy$t$, $t$Psixologik holatni yaxshilash uchun amaliy strategiya.$t$, $prompt$Men hozir [STRESS DARAJASI: o'rta/yuqori] darajada stress va xavotir his qilyapman. Sabablari: [SABABLAR].
Mening kunlik vaziyatim: [TAVSIF].

Menga yordam bering:
1. Bugun darhol qilishim mumkin bo'lgan 5 ta amal (5-10 daqiqalik)
2. Bu hafta qilishim kerak bo'lgan o'zgarishlar
3. Stress fiziologiyasini soda tilda tushuntirish — nima bo'layapti tanamda
4. Nafas mashqlari (3 ta — har xil vaziyatlar uchun)
5. Tafakkur usullarini qayta dasturlash (CBT asoslari)
6. Profilaktika — uzoq muddatli kunlik odatlar
7. Qachon mutaxassisga murojaat qilish kerak — belgilar

Muhim: tibbiy maslahat emas, balki amaliy yordam ko'rinishida.$prompt$);

-- SOG'LIQ (38-39)
INSERT INTO public.prompts (title, category, description, prompt_text) VALUES
($t$Sog'lom ovqatlanish jadvali$t$, $t$Sog'liq$t$, $t$Shaxsiy maqsad va vaziyatga moslashtirilgan ratsion.$t$, $prompt$Menga sog'lom ovqatlanish jadvalini tuzib bering.
Mening ma'lumotlarim:
- Yosh, jinsi: [YOSH/JINSI]
- Maqsad: [VAZN YO'QOTISH/OSHIRISH/SAQLASH/SOG'LIQ]
- Allergiyalar/cheklovlar: [CHEKLOVLAR]
- Hafta davomida ovqatga ajratiladigan vaqt: [VAQT]
- Mintaqa: [O'ZBEKISTON/MAHALLIY MAHSULOTLAR]

Jadval:
1. Kunlik kaloriya va makronutrientlar taqsimoti
2. Haftalik 7 kunlik menyu (nonushta, tushlik, kechki, gazak)
3. Har bir taom uchun qisqa retsept
4. Haftalik xarid ro'yxati
5. Tayyorlash strategiyalari (meal prep)
6. Mahalliy mahsulotlardan foydalanish maslahatlari
7. Sog'lom oraliq taomlar (snack) — 10 ta variant$prompt$),

($t$Yangi boshlovchilar uchun fitness reja$t$, $t$Sog'liq$t$, $t$Uyda yoki sport zalida 4 haftalik dastur.$t$, $prompt$Men [DARAJA: hech qachon mashq qilmaganman/biroz tajriba bor] va [YOSH] yoshdaman. Maqsadim: [MAQSAD: yog' yo'qotish/kuch oshirish/chidamlilik]. Joy: [UY/SPORT ZAL]. Haftada [KUN] kun mashq qila olaman.

Menga 4 haftalik dastur bering:
1. Haftalik mashq taqsimoti
2. Har bir mashq seansi tarkibi (qizdirish + asosiy + tinchlantirish)
3. Aniq mashqlar (takror va to'plam soni bilan)
4. Yangi boshlovchi uchun to'g'ri texnika maslahatlari
5. Yengillashtirilgan variantlar (agar qiyin bo'lsa)
6. Murakkablashtirilgan variantlar (oson tuyulsa)
7. Tiklanish (rest day) va uxlash bo'yicha tavsiyalar
8. 4 hafta yakunida natijalarni qanday baholash$prompt$);

-- HAYOT (40-41)
INSERT INTO public.prompts (title, category, description, prompt_text) VALUES
($t$Sayohat rejasini tuzish$t$, $t$Hayot$t$, $t$Byudjetli va to'liq sayohat marshruti.$t$, $prompt$Men [MANZIL: shahar/mamlakat] ga [SANA] dan [SANA] gacha sayohat rejalashtiryapman.
Ma'lumotlar:
- Sayohatchilar: [NECHTA, KIMLAR]
- Byudjet: [BYUDJET]
- Qiziqishlar: [QIZIQISHLAR: tarix/tabiat/oshxona/sarguzasht]
- Cheklovlar: [JISMONIY/OZIQ-OVQAT]

Reja:
1. Sayohat oldidan tayyorgarlik (hujjatlar, vaktsinalar)
2. Eng yaxshi parvoz/transport variantlari
3. Joylashish tavsiyalari (3 ta narx oralig'i)
4. Kunma-kun marshrut (har kun uchun 3-4 faoliyat)
5. Mahalliy taomlar va restoranlar
6. "Must-see" joylar va kamroq mashhur jamlovgan
7. Byudjet taqsimoti (transport, ovqat, ko'ngilochar)
8. Xavfsizlik va madaniy etika maslahatlari
9. Foydali ifoda va so'zlar mahalliy tilda$prompt$),

($t$Oilaviy byudjet rejasi$t$, $t$Hayot$t$, $t$Daromad va xarajatlarni boshqarish strategiyasi.$t$, $prompt$Menga oylik oilaviy byudjet rejasini tuzib bering.
Ma'lumotlar:
- Oylik daromad: [DAROMAD]
- Oila a'zolari soni: [SONI]
- Asosiy xarajatlar: [IJARA/KOMUNAL/OVQAT/TRANSPORT]
- Asosiy maqsadlar: [MAQSADLAR: jamg'arish/qarz to'lash/uy/mashina]

Reja:
1. 50/30/20 qoidasi bo'yicha taqsimot (zaruriyatlar/xohishlar/jamg'arma)
2. Aniq summalarda kategoriya bo'yicha taqsimot
3. Favqulodda jamg'arma (emergency fund) strategiyasi
4. Oylik xarajatlarni 10% kamaytirish bo'yicha tavsiyalar
5. Qo'shimcha daromad manbalari (passiv daromad g'oyalari)
6. Investitsiya boshlash uchun maslahatlar (boshlovchilar uchun)
7. Oilaviy byudjet uchrashuvi (haftalik)
8. Yillik moliyaviy maqsadlar tizimi$prompt$);

-- ====================================================================
-- TEKSHIRISH
-- ====================================================================
-- Nechta prompt qo'shilganini ko'rish:
SELECT category, COUNT(*) AS soni
FROM public.prompts
GROUP BY category
ORDER BY category;

-- Umumiy soni:
SELECT COUNT(*) AS jami_promptlar FROM public.prompts;
