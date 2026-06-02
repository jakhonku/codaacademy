/* ============================================
   PROMPTLAR MA'LUMOTLARI (prompts.js)
   ============================================
   Bu faylda foydalanuvchilar uchun tayyor prompt
   (so'rov) shablonlari saqlanadi.

   Har bir prompt obyektida:
   - id: Unikal raqam
   - title: Prompt nomi
   - category: Kategoriya (filtrlash uchun)
   - description: Qisqacha tavsif
   - promptText: Tayyor prompt matni (nusxa olish uchun)

   [KVADRAT QAVS] ichidagi so'zlar — foydalanuvchi
   o'z ma'lumotlari bilan to'ldirishi kerak bo'lgan joylar.
   ============================================ */

const prompts = [
  // ============================================
  // TA'LIM KATEGORIYASI
  // ============================================
  {
    id: 1,
    title: "Batafsil dars rejasi tuzish",
    category: "Ta'lim",
    description: "Istalgan fan va mavzu uchun bosqichma-bosqich dars rejasi.",
    promptText:
      "Siz [FAN NOMI: matematika/tarix/musiqa] o'qituvchisisiz. [SINF/YOSH] o'quvchilari uchun [MAVZU NOMI] mavzusi bo'yicha 45 daqiqalik dars rejasini tuzing. Reja quyidagilardan iborat bo'lsin:\n1. Darsning maqsadi va o'rganish natijalari\n2. Kerakli materiallar va vositalar\n3. Bosqichlar: kirish (5 daq) — qiziqarli savol/topishmoq orqali; asosiy qism (30 daq) — yangi mavzu tushuntirish va amaliy mashqlar; yakunlash (10 daq) — qisqa takror va xulosalar\n4. Yakuniy refleksiya savollari\n5. Uyga vazifa\n6. Qo'shimcha qiyinroq o'quvchilar uchun individual topshiriqlar",
  },
  {
    id: 2,
    title: "Test savollari (Bloom taksonomiyasi)",
    category: "Ta'lim",
    description: "Bilim, tushunish, qo'llash darajalarini tekshiruvchi test.",
    promptText:
      "Menga [MAVZU NOMI] mavzusi bo'yicha 15 ta test savoli tuzing. Savollar Bloom taksonomiyasi bo'yicha taqsimlangan bo'lsin:\n- 5 ta bilim/tushunish darajasidagi (oson)\n- 5 ta qo'llash/tahlil darajasidagi (o'rtacha)\n- 5 ta sintez/baholash darajasidagi (qiyin)\n\nHar bir savolda 4 ta javob varianti (A, B, C, D) bo'lsin. Oxirida to'g'ri javoblar kaliti va har bir savol uchun qisqa izoh (nima uchun shu javob to'g'ri ekanligini tushuntirish) bering.",
  },
  {
    id: 3,
    title: "Mavzuni sodda tilda tushuntirish",
    category: "Ta'lim",
    description: "Murakkab tushunchani 12 yoshli bolaga tushuntirish.",
    promptText:
      "Menga [MAVZU/TUSHUNCHA] mavzusini xuddi [YOSH: 10/12/15] yoshdagi bolaga tushuntirgandek soda tilda tushuntirib bering. Quyidagilar bo'lsin:\n1. Hayotiy oddiy misol bilan boshlang\n2. Asosiy tushunchani 3-4 jumlada bering\n3. Qiziqarli taqqoslash (analogiya) keltiring\n4. Bola eslab qolishi uchun qisqa qoida yoki she'r tuzing\n5. Bola savol berishi mumkin bo'lgan 3 ta savol va ularga javob",
  },
  {
    id: 4,
    title: "O'quvchi xatolarini tahlil qilish",
    category: "Ta'lim",
    description: "Talabaning ishidagi tipik xatolarni aniqlash va tuzatish.",
    promptText:
      "Quyidagi [FAN] bo'yicha o'quvchi ishini tahlil qiling:\n\n[O'QUVCHI ISHI/JAVOBI]\n\nQuyidagi tartibda tahlil qiling:\n1. Aniqlangan xatolar ro'yxati (tipi bo'yicha guruhlangan)\n2. Har bir xato uchun: nima uchun bu xato bo'ldi, qaysi tushuncha o'zlashtirilmagan\n3. Tuzatilgan to'g'ri javob\n4. O'quvchiga konstruktiv tushuntirish (motivatsiya yo'qotmaydigan ohangda)\n5. Shu xatoni qaytarmaslik uchun 3 ta amaliy mashq",
  },
  {
    id: 5,
    title: "Individual o'quv rejasi (1 oylik)",
    category: "Ta'lim",
    description: "Bitta o'quvchi uchun shaxsiy 4 haftalik o'quv yo'l xaritasi.",
    promptText:
      "Menga [FAN/SOHA] bo'yicha [DARAJA: boshlang'ich/o'rta/yuqori] darajadagi o'quvchi uchun 4 haftalik (1 oylik) individual o'quv rejasini tuzing. O'quvchining maqsadi: [MAQSAD]. Kuniga ajratiladigan vaqt: [DAQIQA] daqiqa.\n\nReja quyidagi tartibda bo'lsin:\n1. Haftalik maqsadlar va kalit natijalar\n2. Kunlik mashqlar va vazifalar\n3. Haftada 1 marta o'z-o'zini baholash savollari\n4. Tavsiya etiladigan resurslar (kitob/video/sayt)\n5. Oy oxirida yakuniy sinov mezonlari\n6. Motivatsiya tushib ketganda qiladigan ishlar ro'yxati",
  },
  {
    id: 6,
    title: "Sinfdagi muammoli vaziyatni hal qilish",
    category: "Ta'lim",
    description: "Pedagogik vaziyat uchun professional yondashuv.",
    promptText:
      "Men [SINF/GURUH] da o'qituvchiman. Quyidagi vaziyat yuz berdi:\n\n[VAZIYAT TAVSIFI]\n\nMenga ushbu vaziyatni hal qilish bo'yicha:\n1. Vaziyatni psixologik-pedagogik tahlil qiling\n2. Darhol qilinishi mumkin bo'lgan 3 ta amal (qisqa muddatda)\n3. Uzoq muddatli yechim (1-2 oy ichida)\n4. Ota-onalar bilan suhbat uchun aniq matn-shablon\n5. Boshqa hamkasblarga maslahat so'rashim mumkin bo'lgan savollar\n6. O'xshash vaziyatlar yuz bermasligi uchun profilaktika choralari",
  },

  // ============================================
  // MUSIQA KATEGORIYASI
  // ============================================
  {
    id: 7,
    title: "Musiqa asarini chuqur tahlil qilish",
    category: "Musiqa",
    description: "Klassik yoki zamonaviy asarning to'liq musiqashunoslik tahlili.",
    promptText:
      "Menga [BASTAKOR NOMI]ning [ASAR NOMI] asarini batafsil tahlil qilib bering:\n1. Asarning yaratilish tarixi va kontekst\n2. Musiqa shakli va strukturasi (sonata/rondo/variatsiya)\n3. Tonalliklar, modulyatsiyalar, garmonik xususiyatlar\n4. Asosiy melodik mavzular va ularning rivojlanishi\n5. Tembr va orkestrovka xususiyatlari\n6. Ifoda va dinamik belgilarning ma'nosi\n7. Ijro etish bo'yicha amaliy tavsiyalar\n8. Bu asarni o'quvchilarga qanday tushuntirish bo'yicha pedagogik yondashuv",
  },
  {
    id: 8,
    title: "Cholg'u uchun mashq tuzish",
    category: "Musiqa",
    description: "Maxsus texnik mashqlar va etyudlar yaratish.",
    promptText:
      "Menga [CHOLG'U NOMI] cholg'usi uchun [DARAJA: boshlang'ich/o'rta/yuqori] darajadagi o'quvchi uchun 5 ta texnik mashq yarating. Asosiy maqsad: [MAQSAD: barmoq mashqi/intonatsiya/ritm/staccato].\n\nHar bir mashq uchun:\n1. Mashqning aniq maqsadi\n2. Bajarish tartibi va tempi (metronom belgisi bilan)\n3. Diqqat qaratish kerak bo'lgan jihatlar\n4. Tipik xatolar va ularni oldini olish\n5. Murakkablik darajasini oshirish variantlari\n6. Kunlik mashq jadvali (daqiqada)",
  },
  {
    id: 9,
    title: "Musiqa atamalarini lug'at sifatida",
    category: "Musiqa",
    description: "Italyan/lotin musiqa atamalarini sodda tushuntirish.",
    promptText:
      "Menga quyidagi musiqa atamalarini lug'at shaklida tushuntirib bering. Har bir atama uchun:\n1. Asl tilda (italyan/lotin) va o'zbekcha tarjimasi\n2. Aniq ta'rifi\n3. Asarda qanday ko'rsatiladi (belgisi)\n4. Mashhur asarlardan amaliy misol\n5. O'xshash atamalar bilan farqi\n\nAtamalar: [ATAMALAR RO'YXATI: masalan — allegro, adagio, fortissimo, legato]",
  },
  {
    id: 10,
    title: "Kontsert dasturi tuzish",
    category: "Musiqa",
    description: "Tadbir uchun professional kontsert dasturi.",
    promptText:
      "Menga [TADBIR TURI: yakkaxon konsert/sinf kontserti/festival] uchun professional dastur tuzing.\nMa'lumotlar:\n- Davomiyligi: [SOAT] soat\n- Ishtirokchilar soni va darajasi: [SONI/DARAJA]\n- Tinglovchilar: [KIMLAR: bolalar/oilalar/mutaxassislar]\n- Mavzu/janr: [JANR]\n\nDasturda quyidagilar bo'lsin:\n1. Ochilish — kuchli va e'tibor jalb qiluvchi asar\n2. Asosiy qism — turli davr va uslublar aralashmasi\n3. Tanaffus joyi\n4. Yakunlovchi qism — emotsional cho'qqi\n5. Bis variantlari\n6. Har bir asar uchun: ijrochi, davomiyligi, qisqa izoh\n7. Tinglovchilar uchun konferans matni",
  },

  // ============================================
  // PREZENTATSIYA KATEGORIYASI
  // ============================================
  {
    id: 11,
    title: "Professional prezentatsiya rejasi (15 slayd)",
    category: "Prezentatsiya",
    description: "Slayd-slayd batafsil reja va dizayn tavsiyalari.",
    promptText:
      "Menga [MAVZU NOMI] mavzusida [TINGLOVCHILAR: talabalar/hamkasblar/rahbariyat] uchun 15 slaydlik prezentatsiya rejasini tuzing. Prezentatsiya davomiyligi: [DAQIQA] daqiqa.\n\nHar bir slayd uchun:\n1. Slayd sarlavhasi\n2. Asosiy gap-fikrlar (3-4 bullet)\n3. Vizual tavsiya (rasm/grafik/diagramma turini ko'rsating)\n4. Ma'ruzachi uchun gapiriladigan matn (kengroq)\n5. Tinglovchilar berishi mumkin bo'lgan savollar\n\nOxirida: 1) Yaxshi taqdim etish bo'yicha 5 ta maslahat, 2) Slaydlar dizayni uchun rang va shrift tavsiyalari.",
  },
  {
    id: 12,
    title: "Public speaking — qo'rquvni yengish",
    category: "Prezentatsiya",
    description: "Nutq oldidan stress va qo'rquvni boshqarish strategiyasi.",
    promptText:
      "Men [SHAROIT: muhim konferensiya/dars/ish suhbati] da [DAQIQA] daqiqalik nutq so'zlayman. Mavzu: [MAVZU]. Tinglovchilar soni: [SONI].\n\nMenga quyidagicha yordam bering:\n1. Nutq oldidan 3 kun davomida tayyorlanish jadvali\n2. Nutq kuni ertalab qiladigan ishlar (jismoniy va aqliy)\n3. Nutqdan 5 daqiqa oldin qiladigan nafas mashqlari\n4. Sahnada/oldindan turish va imo-ishora uchun maslahatlar\n5. Tovush, temp va pauzalardan to'g'ri foydalanish\n6. Agar so'zni unutib qo'ysam — nima qilish kerak\n7. Tinglovchilarning savollariga javob berishda strategiya",
  },

  // ============================================
  // KOMMUNIKATSIYA KATEGORIYASI
  // ============================================
  {
    id: 13,
    title: "Professional email yozish",
    category: "Kommunikatsiya",
    description: "Har qanday vaziyat uchun moslashuvchan email shabloni.",
    promptText:
      "Menga professional email yozib bering.\nMa'lumotlar:\n- Maqsad: [MAQSAD: taklif/so'rov/minnatdorchilik/uzr/eslatma]\n- Qabul qiluvchi: [KIM: rahbar/hamkasb/mijoz/ota-ona]\n- Ohang: [RASMIY/YARIM RASMIY/DO'STONA]\n- Asosiy xabar: [NIMA HAQIDA]\n- Talab qilinadigan harakat: [JAVOB BERISH/UCHRASHISH/HUJJAT YUBORISH]\n\nQuyidagi tuzilishda yozing:\n1. Mavzu qatori (qisqa va aniq)\n2. Salomlashish\n3. Kirish jumlasi (kontekst)\n4. Asosiy qism (aniq va qisqa)\n5. Aniq so'rov yoki taklif\n6. Yakuniy jumla\n7. Hurmat bilan\n\nShuningdek 2 ta alternativ variant bering (formalroq va do'stonaroq).",
  },
  {
    id: 14,
    title: "Murakkab suhbatga tayyorgarlik",
    category: "Kommunikatsiya",
    description: "Qiyin mavzudagi suhbatni tayyorlash bo'yicha skript.",
    promptText:
      "Men [KIM] bilan murakkab suhbat o'tkazishim kerak. Mavzu: [SUHBAT MAVZUSI: nizo/maosh/tanqid/cheklov belgilash]. Mening maqsadim: [MAQSAD].\n\nMenga quyidagicha yordam bering:\n1. Suhbat oldidan tayyorlanish (faktlar, dalillar)\n2. Suhbatni boshlash uchun aniq jumla\n3. Asosiy fikrlarni qanday ifodalash (3-4 jumlada)\n4. Suhbatdosh berishi mumkin bo'lgan e'tirozlar va ularga javob\n5. Emotsiya bilan boshqarish (agar suhbat qizib ketsa)\n6. Suhbatni ijobiy yakunlash usuli\n7. Suhbatdan keyin qiladigan ishlar (eslatma yuborish va h.k.)",
  },
  {
    id: 15,
    title: "Ota-onalar bilan uchrashuv matni",
    category: "Kommunikatsiya",
    description: "Sinf yig'ilishi yoki individual suhbat uchun matn.",
    promptText:
      "Men [SINF] sinfining o'qituvchisiman va [UCHRASHUV TURI: sinf yig'ilishi/individual suhbat] o'tkazyapman. Asosiy mavzular: [MAVZULAR].\n\nMenga quyidagilarni tuzib bering:\n1. Uchrashuv ochilishi (5 daqiqa) — ijobiy ohang\n2. Asosiy hisobotni qanday taqdim etish (10-15 daqiqa)\n3. Muammoli vaziyatlarni hassoslik bilan tushuntirish usuli\n4. Ota-onalar berishi mumkin bo'lgan 7 ta savol va tayyor javoblar\n5. Hamkorlik taklifi — uy va maktab orasida\n6. Yakunlash va keyingi qadamlar\n7. Mavjudligi mumkin bo'lgan qiyin ota-ona bilan to'g'ri munosabat",
  },

  // ============================================
  // YOZISH KATEGORIYASI
  // ============================================
  {
    id: 16,
    title: "Maqola tuzilishi va yozish",
    category: "Yozish",
    description: "Blog yoki ilmiy maqola uchun professional reja.",
    promptText:
      "Menga [MAVZU NOMI] mavzusida [QO'YILISH: blog/ilmiy/jurnalistik] maqola yozish uchun yordam bering.\nMa'lumotlar:\n- Maqsadli auditoriya: [KIMLAR]\n- Maqola hajmi: [SO'Z SONI] so'z\n- Asosiy kalit so'zlar: [KALIT SO'ZLAR]\n\nQuyidagilarni bering:\n1. Diqqatni jalb qiluvchi 3 ta sarlavha varianti\n2. Maqolaning to'liq tuzilishi (bo'limlar va paragraflar)\n3. Kirish qismi (to'liq matn, ~150 so'z)\n4. Har bir bo'lim uchun asosiy fikrlar va misollar\n5. Yakuniy xulosa va o'quvchini harakatga undash\n6. SEO uchun meta-tavsif (160 belgi)\n7. Ijtimoiy tarmoqlarda ulashish uchun qisqa anons",
  },
  {
    id: 17,
    title: "Ijtimoiy tarmoq posti yaratish",
    category: "Yozish",
    description: "Instagram/Telegram/LinkedIn uchun jozibali matn.",
    promptText:
      "Menga [PLATFORMA: Instagram/Telegram/LinkedIn/Facebook] uchun post yarating.\nMa'lumotlar:\n- Mavzu: [MAVZU]\n- Maqsad: [MAQSAD: ma'lumot berish/sotish/jalb qilish]\n- Auditoriya: [AUDITORIYA]\n- Ohang: [PROFESSIONAL/DO'STONA/HAYAJONLI]\n\nQuyidagilarni bering:\n1. E'tibor tortuvchi birinchi qator (hook)\n2. Asosiy matn (platforma talabiga moslashtirilgan hajm)\n3. Emoji va formatlash (lekin haddan oshirmasdan)\n4. 5-7 ta tegishli hashtag\n5. Harakatga chaqirish (CTA)\n6. Rasm/video uchun tavsiya\n7. 2 ta muqobil variant (qisqaroq va uzunroq)",
  },
  {
    id: 18,
    title: "Insho yozish (essay)",
    category: "Yozish",
    description: "Imtihon yoki ijodiy insho uchun bosqichma-bosqich reja.",
    promptText:
      "Menga [MAVZU NOMI] mavzusida insho yozishga yordam bering.\nMa'lumotlar:\n- Insho turi: [BAHS/TAVSIFIY/HIKOYAVIY/ANALITIK]\n- Hajmi: [SO'Z SONI] so'z\n- Daraja: [O'RTA MAKTAB/UNIVERSITET]\n\nQuyidagilarni bering:\n1. Insho rejasi (kirish, asosiy qism, xulosa)\n2. Diqqatni tortuvchi kirish (thesis bayonoti bilan)\n3. 3 ta asosiy argument va ularga dalillar/misollar\n4. Qarama-qarshi fikrni qanday rad etish\n5. Kuchli xulosa\n6. Boy lug'at va o'rinli ulanish so'zlari ro'yxati\n7. Imloviy va grammatik xatolarni oldini olish maslahatlari",
  },

  // ============================================
  // ISH VA PRODUKTIVLIK
  // ============================================
  {
    id: 19,
    title: "Yig'ilish kun tartibini tuzish",
    category: "Ish",
    description: "Samarali yig'ilish uchun batafsil agenda.",
    promptText:
      "Menga [DAQIQA] daqiqalik yig'ilish uchun kun tartibini tuzing.\nMa'lumotlar:\n- Yig'ilish maqsadi: [MAQSAD]\n- Ishtirokchilar: [KIMLAR va NECHTA]\n- Muhokama qilinadigan mavzular: [MAVZULAR]\n\nKun tartibi quyidagilarni o'z ichiga olsin:\n1. Yig'ilish boshlanishi va kutilayotgan natijalar (5 daq)\n2. Har bir mavzu uchun: vaqt, javobgar, kutilgan natija\n3. Tanaffus joyi (agar 90 daq+ bo'lsa)\n4. Qarorlar qabul qilish bosqichi\n5. Topshiriqlar va deadlinelar\n6. Yig'ilishni yakunlash va keyingi qadamlar\n7. Yig'ilishdan keyin yuboriladigan eslatma email shabloni",
  },
  {
    id: 20,
    title: "Loyiha rejasini tuzish (SMART maqsadlar)",
    category: "Ish",
    description: "Loyihani boshlashdan tugatishgacha to'liq reja.",
    promptText:
      "Menga [LOYIHA NOMI] loyihasi uchun batafsil reja tuzing.\nMa'lumotlar:\n- Loyiha maqsadi: [MAQSAD]\n- Muddati: [VAQT]\n- Jamoa hajmi: [KISHI SONI]\n- Byudjet: [BYUDJET] (agar mavjud bo'lsa)\n\nReja quyidagilardan iborat bo'lsin:\n1. SMART maqsadlar (aniq, o'lchanadigan, erishish mumkin, ahamiyatli, vaqt chegarali)\n2. Asosiy bosqichlar (milestones) va deadlinelar\n3. Vazifalar taqsimoti (kim, nima, qachon)\n4. Tavakkalchiliklarni baholash va profilaktika\n5. Muvaffaqiyat ko'rsatkichlari (KPI)\n6. Haftalik nazorat va hisobot mexanizmi\n7. Loyiha yakunida nima baholash kerak",
  },
  {
    id: 21,
    title: "Vaqt boshqaruvi: kunlik reja",
    category: "Ish",
    description: "Pomodoro va eng yaxshi vaqt boshqaruvi metodlari.",
    promptText:
      "Menga samarali kunlik reja tuzib bering. Men [KASB: o'qituvchi/dasturchi/talaba/menejer] bo'lib ishlayman.\nKun davomida hal qilishim kerak bo'lgan ishlar:\n[VAZIFALAR RO'YXATI]\n\nReja quyidagilarni o'z ichiga olsin:\n1. Eng samarali ish vaqtini aniqlash (deep work)\n2. Ishlarni muhimlik va shoshilinchlik bo'yicha tartiblash (Eisenhower matritsasi)\n3. Pomodoro texnikasi bo'yicha vaqt bloklari (25/5)\n4. Tanaffuslar va energiyani tiklash payti\n5. Emaillar va xabarlarni tekshirish vaqti\n6. Ish va shaxsiy hayot orasida chegara\n7. Kun oxirida 5 daqiqalik refleksiya savollari",
  },

  // ============================================
  // KARYERA
  // ============================================
  {
    id: 22,
    title: "Professional CV tuzish",
    category: "Karyera",
    description: "Zamonaviy va e'tiborli rezyume.",
    promptText:
      "Menga professional CV tuzishga yordam bering.\nMa'lumotlar:\n- To'liq ism: [ISM]\n- Ariza qilinayotgan lavozim: [LAVOZIM]\n- Tajriba: [TAJRIBA YILLARI]\n- Asosiy ko'nikmalar: [KO'NIKMALAR]\n- Ta'lim: [TA'LIM]\n- Yutuqlar: [YUTUQLAR]\n\nCV quyidagi tuzilishda bo'lsin:\n1. Sarlavha (ism + lavozim + kontakt)\n2. Professional xulosa (3-4 jumla — eng kuchli)\n3. Ish tajribasi (eng yangidan boshlab, harakat fe'llari bilan)\n4. Ko'nikmalar (hard skills va soft skills)\n5. Ta'lim va sertifikatlar\n6. Loyihalar/yutuqlar\n7. ATS (Applicant Tracking System) uchun kalit so'zlar tavsiyasi",
  },
  {
    id: 23,
    title: "Cover letter (motivatsion xat) yozish",
    category: "Karyera",
    description: "Ish o'rni uchun individual motivatsion xat.",
    promptText:
      "Menga [KOMPANIYA NOMI] kompaniyasiga [LAVOZIM] lavozimiga ariza topshirish uchun motivatsion xat (cover letter) yozib bering.\n\nMen haqimda:\n- Tajriba: [TAJRIBA]\n- Asosiy ko'nikmalar: [KO'NIKMALAR]\n- Yutuqlar: [YUTUQLAR]\n- Bu kompaniyaga qiziqish sababim: [SABAB]\n\nXat quyidagi tuzilishda bo'lsin:\n1. Salomlashish (HR yoki menejer ismi bilan)\n2. Diqqat tortuvchi birinchi paragraf (nima uchun shu lavozim)\n3. Tajriba va yutuqlar (aniq raqamlar bilan)\n4. Kompaniya qadriyatlari bilan moslik\n5. Nima qo'sha olishim mumkinligi\n6. Yakuniy paragraf (uchrashuv taklifi)\n7. Hurmat bilan\n\nUmumiy ohang: ishonchli, lekin kibrli emas.",
  },
  {
    id: 24,
    title: "Ish suhbatiga tayyorgarlik",
    category: "Karyera",
    description: "Mock interview — savol-javoblar va strategiya.",
    promptText:
      "Men [KOMPANIYA] kompaniyasiga [LAVOZIM] lavozimiga ish suhbatiga tayyorlanyapman.\nMening tajribam: [TAJRIBA]\nMening kuchli tomonlarim: [KUCHLI TOMONLAR]\nKuchsiz tomonlarim: [KUCHSIZ TOMONLAR]\n\nMenga quyidagilarni bering:\n1. Eng ko'p so'raladigan 10 ta savol va tayyor javoblar (STAR metodi bo'yicha)\n2. \"O'zingiz haqingizda gapiring\" uchun 90 sekundlik javob\n3. \"Nima uchun bizning kompaniya?\" uchun shaxsiy javob\n4. Maoshni muhokama qilishda strategiya\n5. Suhbat oxirida men beradigan 5 ta aqlli savol\n6. Body language va birinchi taassurot bo'yicha maslahatlar\n7. Suhbatdan keyin minnatdorchilik xati shabloni",
  },

  // ============================================
  // TAHLIL VA TADQIQOT
  // ============================================
  {
    id: 25,
    title: "Matnni qisqacha bayon qilish (summary)",
    category: "Tahlil",
    description: "Uzun matnni asosiy fikrlarga qisqartirish.",
    promptText:
      "Quyidagi matnni tahlil qiling va qisqacha bayon qiling:\n\n[MATN]\n\nQuyidagi formatda bering:\n1. Bir jumlali asosiy g'oya (TLDR)\n2. 5-7 ta asosiy nuqta (bullet points)\n3. Muallifning asosiy argumenti va dalillari\n4. Matndan eng muhim 3 ta iqtibos (sitata)\n5. Matnda zaif yoki bahsli joylar\n6. Matnni o'qigan kishi keyingi qadam sifatida nima qilishi kerak\n7. Bog'liq mavzularda qo'shimcha o'qish uchun tavsiyalar",
  },
  {
    id: 26,
    title: "SWOT tahlil o'tkazish",
    category: "Tahlil",
    description: "Loyiha/biznes/karyera uchun strategik tahlil.",
    promptText:
      "Menga [NIMA: loyiha/biznes/karyera/o'qish yo'nalishi] uchun SWOT tahlil tuzib bering.\nKontekst: [BATAFSIL TAVSIF]\n\nTahlil quyidagilardan iborat bo'lsin:\n1. **Strengths** (Kuchli tomonlar) — ichki ijobiy omillar\n2. **Weaknesses** (Zaif tomonlar) — ichki salbiy omillar\n3. **Opportunities** (Imkoniyatlar) — tashqi ijobiy omillar\n4. **Threats** (Tahdidlar) — tashqi salbiy omillar\n\nHar bir bo'limda kamida 5 ta aniq punkt bo'lsin.\n\nTahlil oxirida:\n5. Strategik tavsiyalar (SO, WO, ST, WT strategiyalari)\n6. Birinchi navbatda nima qilish kerakligi\n7. 3 ta amaliy qadam (keyingi 30 kun ichida)",
  },

  // ============================================
  // IJODIY KATEGORIYASI
  // ============================================
  {
    id: 27,
    title: "Brend nomi va shior yaratish",
    category: "Ijodiy",
    description: "Biznes uchun yangi brend identifikatsiyasi.",
    promptText:
      "Menga yangi brend uchun nom va shior yaratishga yordam bering.\nMa'lumotlar:\n- Soha: [SOHA]\n- Mahsulot/xizmat: [NIMA TAKLIF QILINADI]\n- Asosiy auditoriya: [AUDITORIYA]\n- Qiymatlar: [QIYMATLAR: ishonchlilik/innovatsiya/qulaylik]\n- Tilshunoslik talabi: [O'ZBEK/INGLIZ/AKLITIK ARALASH]\n\nQuyidagilarni bering:\n1. 10 ta brend nomi varianti (har biri uchun ma'no izohi)\n2. Har bir nom uchun 2-3 ta shior\n3. Top 3 ta tavsiya etilgan kombinatsiya\n4. Domen mavjudligi va social media handler tavsiyalari\n5. Logotip uchun vizual konsepsiya (ranglar va shakl)\n6. Brendning \"hikoyasi\" (storytelling) — 3 jumlada\n7. Marketing pitch (15 sekund)",
  },
  {
    id: 28,
    title: "Hikoya/skript yozish",
    category: "Ijodiy",
    description: "Qisqa hikoya yoki video skripti yaratish.",
    promptText:
      "Menga [JANR: drama/komediya/fantastika/hayotiy] janrida [HAJM: qisqa hikoya/3 daqiqalik video skripti] yarating.\nKontekst:\n- Asosiy g'oya: [G'OYA]\n- Bosh qahramon: [QAHRAMON TAVSIFI]\n- Joy: [QAYERDA]\n- Vaqt: [QACHON]\n\nHikoya/skript:\n1. Diqqatni jalb qiluvchi boshlang'ich (hook)\n2. Qahramonning kelib chiqishi va maqsadi\n3. To'siqlar va ziddiyatlar (3 ta ko'tarilish)\n4. Cho'qqi nuqtasi (climax)\n5. Yechim va xulosa\n6. Tomoshabin uchun emotsional ta'sir\n7. Dialoglar tabiiy va xarakterga mos bo'lsin\n8. Vizual sahnalar tavsiyalari (skript bo'lsa)",
  },
  {
    id: 29,
    title: "Tug'ilgan kun yoki tabriklash matni",
    category: "Ijodiy",
    description: "Yaqin odamga shaxsiy va samimiy tabrik.",
    promptText:
      "Menga [KIM: yaqin do'st/oila a'zosi/hamkasb/rahbar] uchun [MUNOSABAT: tug'ilgan kun/yubiley/to'y/yangi ish] tabrigini yozib bering.\nMa'lumotlar:\n- Munosabat darajasi: [QANCHALIK YAQIN]\n- Ohang: [JIDDIY/HAZIL ARALASH/EMOTSIONAL]\n- Eslatib o'tish kerak bo'lgan jihat: [XOTIRA/YUTUQ/ORZULAR]\n- Format: [QISQA SMS/UZUN XAT/SHE'R/NUTQ]\n\nMenga 3 ta variant bering:\n1. Klassik va samimiy variant\n2. Hayoliyroq va hissiyotli variant\n3. Hazil-mutoyiba aralashgan variant\n\nHar bir variant uchun: yopishqoq emas, shaxsiy va eslab qoladigan bo'lsin.",
  },

  // ============================================
  // TARJIMA VA TIL
  // ============================================
  {
    id: 30,
    title: "Sifatli tarjima qilish",
    category: "Tarjima",
    description: "Kontekstni hisobga olgan professional tarjima.",
    promptText:
      "Quyidagi matnni [DASTLABKI TIL]dan [MAQSADLI TIL]ga tarjima qiling:\n\n[MATN]\n\nTarjima qilishda:\n1. So'zma-so'z emas, ma'noni saqlab tarjima qiling\n2. Maqsadli tilning idiomatik xususiyatlarini ishlating\n3. Ohang va uslubni saqlang ([RASMIY/DO'STONA/TEXNIK])\n4. Madaniy nuanslarga e'tibor bering\n5. Tarjimani 2 ta variantda taqdim eting (so'zma-so'z va erkin)\n6. Qiyin jumlalar uchun tarjima qarorlarining sababini tushuntiring\n7. Alternativ so'z tanlovlari (sinonimlar) taklif qiling",
  },
  {
    id: 31,
    title: "Til o'rganish: kunlik mashq",
    category: "Tarjima",
    description: "Xorijiy til o'rganish uchun amaliy mashqlar.",
    promptText:
      "Men [TIL] tilini [DARAJA: A1/A2/B1/B2/C1] darajasida o'rganyapman. Maqsadim: [MAQSAD: sayohat/ish/imtihon].\n\nMenga bugun uchun 30 daqiqalik mashq dasturini tuzib bering:\n1. Yangi 10 ta so'z (kontekstli misollar bilan)\n2. 1 ta grammatik mavzu (qisqa tushuntirish + 5 ta mashq)\n3. Qisqa o'qish matni (mening darajamga mos) + tushunish savollari\n4. Eshitish mashqi tavsiyasi (YouTube/podcast)\n5. Yozma mashq — kunlik kundalik mavzusi\n6. Og'zaki nutq — yolg'iz mashq qilish uchun gaplar\n7. Ertangi kun uchun maslahat",
  },

  // ============================================
  // SUN'IY INTELLEKT BILAN ISHLASH
  // ============================================
  {
    id: 32,
    title: "Promptni yaxshilash (meta-prompt)",
    category: "AI",
    description: "Mavjud promptingizni AI orqali kuchaytirish.",
    promptText:
      "Men ChatGPT bilan ishlash uchun quyidagi promptni yozdim:\n\n[MENING PROMPTIM]\n\nLekin natijalar ko'nglimga to'lmayapti. Menga yordam bering:\n1. Bu promptning kuchli va kuchsiz tomonlarini tahlil qiling\n2. Aniqlik, kontekst, format va misollar bo'yicha qanday yaxshilash mumkin\n3. Promptning yaxshilangan to'liq versiyasini yozing\n4. 2 ta muqobil variant (turli yondashuv bilan)\n5. Eng ko'p ishlatiladigan prompt-engineering texnikalari ushbu promptga qanday qo'llanadi (Chain-of-Thought, Few-Shot va h.k.)\n6. Promptni sinab ko'rish uchun namuna kirish ma'lumotlari\n7. Promptning tavsiya etilgan modeli (GPT-4/Claude/Gemini)",
  },
  {
    id: 33,
    title: "Brainstorm — g'oya yaratish",
    category: "AI",
    description: "Har qanday muammo uchun 20+ ijodiy g'oya.",
    promptText:
      "Men [MUAMMO/MAQSAD] bilan duch keldim. Cheklovlar: [CHEKLOVLAR: byudjet/vaqt/resurslar].\n\nMenga ushbu muammo uchun 20+ ijodiy g'oyalar generatsiya qiling. Quyidagi guruhlarga taqsimlang:\n1. Klassik va sinab ko'rilgan yondashuvlar (5 ta)\n2. Innovatsion va norasmiy g'oyalar (5 ta)\n3. Texnologiyaga asoslangan yondashuvlar (5 ta)\n4. Past byudjetli yoki bepul yechimlar (5 ta)\n5. \"Aql bovar qilmaydigan\" — radikal g'oyalar (3-5 ta)\n\nHar bir g'oya uchun:\n- Qisqa tavsif\n- Foydasi/imkoniyati\n- Amalga oshirish qiyinligi (1-10)\n- Birinchi qadam\n\nOxirida top 3 ta tavsiya — nima uchun ular eng yaxshi.",
  },
  {
    id: 34,
    title: "Qaror qabul qilish — pro/kontra tahlili",
    category: "AI",
    description: "Murakkab qarorlarni har tomondan ko'rib chiqish.",
    promptText:
      "Men quyidagi qaror oldidaman:\n\n[QAROR/VAZIYAT]\n\nKontekst: [BATAFSIL TAVSIF]\nMening qadriyatlarim: [NIMA MEN UCHUN MUHIM]\nMavjud variantlar: [VARIANTLAR]\n\nMenga ushbu qarorni qabul qilishimga yordam bering:\n1. Har bir variant uchun aniq pro va kontra (5 tadan)\n2. Qisqa muddatli va uzoq muddatli oqibatlar\n3. Eng yomon stsenariy (worst case) — har bir variant uchun\n4. Eng yaxshi stsenariy (best case)\n5. Mening qadriyatlarimga qaysi variant ko'proq mos\n6. Hissiyot emas, mantiq nuqtai nazaridan tavsiya\n7. Qarorni qabul qilishdan oldin javob berishim kerak bo'lgan 5 ta savol",
  },

  // ============================================
  // SHAXSIY RIVOJLANISH
  // ============================================
  {
    id: 35,
    title: "Yillik shaxsiy maqsadlar (OKR)",
    category: "Shaxsiy",
    description: "Yil boshlanishi uchun strukturali maqsadlar tizimi.",
    promptText:
      "Menga keyingi 12 oy uchun shaxsiy maqsadlar tizimini tuzib bering. Hayotim hozir quyidagicha:\n- Yosh: [YOSH]\n- Asosiy faoliyat: [KASB/O'QISH]\n- Kuchli tomonlarim: [KUCHLI TOMONLAR]\n- Rivojlantirmoqchi bo'lgan jihatlarim: [RIVOJLANISH SOHALARI]\n- Hozirgi qiyinchiliklarim: [QIYINCHILIKLAR]\n\nReja quyidagi tuzilishda:\n1. 3 ta yillik asosiy maqsad (OKR formati: Objective + 3 Key Results)\n2. Har bir maqsad uchun chorak (3 oylik) bosqichlari\n3. Sog'liq sohasidagi maqsadlar\n4. Karyera va o'rganish maqsadlari\n5. Munosabatlar va oilaviy maqsadlar\n6. Moliyaviy maqsadlar\n7. Oylik nazorat tizimi\n8. Maqsadga erishganda o'zingizni qanday taqdirlash",
  },
  {
    id: 36,
    title: "Kunlik refleksiya jurnali",
    category: "Shaxsiy",
    description: "Kun yakunida o'z-o'zini tahlil qilish savollari.",
    promptText:
      "Menga kunlik refleksiya (kundalik) yozish uchun savollar to'plamini tuzing. Maqsadim: [MAQSAD: o'sish/stress kamaytirish/produktivlik].\n\nHar kuni kechqurun 10 daqiqada javob beradigan tuzilishni bering:\n1. Bugungi 3 ta yutuq (kichik ham bo'lsa)\n2. Bugun nimadan minnatdorchilik bildiraman (3 ta)\n3. Bugungi eng qiyin lahza — undan nima o'rgandim\n4. Bugun o'zimga qanday g'amxo'rlik qildim\n5. Boshqalarga qanday yordam berdim\n6. Ertangi kunning 1 ta asosiy maqsadi\n7. Ertaga energiya bilan boshlash uchun bugun nima qila olaman\n\nShuningdek, haftalik va oylik chuqurroq refleksiya savollari bering.",
  },
  {
    id: 37,
    title: "Stress va xavotirni boshqarish rejasi",
    category: "Shaxsiy",
    description: "Psixologik holatni yaxshilash uchun amaliy strategiya.",
    promptText:
      "Men hozir [STRESS DARAJASI: o'rta/yuqori] darajada stress va xavotir his qilyapman. Sabablari: [SABABLAR].\nMening kunlik vaziyatim: [TAVSIF].\n\nMenga yordam bering:\n1. Bugun darhol qilishim mumkin bo'lgan 5 ta amal (5-10 daqiqalik)\n2. Bu hafta qilishim kerak bo'lgan o'zgarishlar\n3. Stress fiziologiyasini soda tilda tushuntirish — nima bo'layapti tanamda\n4. Nafas mashqlari (3 ta — har xil vaziyatlar uchun)\n5. Tafakkur usullarini qayta dasturlash (CBT asoslari)\n6. Profilaktika — uzoq muddatli kunlik odatlar\n7. Qachon mutaxassisga murojaat qilish kerak — belgilar\n\nMuhim: tibbiy maslahat emas, balki amaliy yordam ko'rinishida.",
  },

  // ============================================
  // SOG'LIQ VA OVQATLANISH
  // ============================================
  {
    id: 38,
    title: "Sog'lom ovqatlanish jadvali",
    category: "Sog'liq",
    description: "Shaxsiy maqsad va vaziyatga moslashtirilgan ratsion.",
    promptText:
      "Menga sog'lom ovqatlanish jadvalini tuzib bering.\nMening ma'lumotlarim:\n- Yosh, jinsi: [YOSH/JINSI]\n- Maqsad: [VAZN YO'QOTISH/OSHIRISH/SAQLASH/SOG'LIQ]\n- Allergiyalar/cheklovlar: [CHEKLOVLAR]\n- Hafta davomida ovqatga ajratiladigan vaqt: [VAQT]\n- Mintaqa: [O'ZBEKISTON/MAHALLIY MAHSULOTLAR]\n\nJadval:\n1. Kunlik kaloriya va makronutrientlar taqsimoti\n2. Haftalik 7 kunlik menyu (nonushta, tushlik, kechki, gazak)\n3. Har bir taom uchun qisqa retsept\n4. Haftalik xarid ro'yxati\n5. Tayyorlash strategiyalari (meal prep)\n6. Mahalliy mahsulotlardan foydalanish maslahatlari\n7. Sog'lom oraliq taomlar (snack) — 10 ta variant",
  },
  {
    id: 39,
    title: "Yangi boshlovchilar uchun fitness reja",
    category: "Sog'liq",
    description: "Uyda yoki sport zalida 4 haftalik dastur.",
    promptText:
      "Men [DARAJA: hech qachon mashq qilmaganman/biroz tajriba bor] va [YOSH] yoshdaman. Maqsadim: [MAQSAD: yog' yo'qotish/kuch oshirish/chidamlilik]. Joy: [UY/SPORT ZAL]. Haftada [KUN] kun mashq qila olaman.\n\nMenga 4 haftalik dastur bering:\n1. Haftalik mashq taqsimoti\n2. Har bir mashq seansi tarkibi (qizdirish + asosiy + tinchlantirish)\n3. Aniq mashqlar (takror va to'plam soni bilan)\n4. Yangi boshlovchi uchun to'g'ri texnika maslahatlari\n5. Yengillashtirilgan variantlar (agar qiyin bo'lsa)\n6. Murakkablashtirilgan variantlar (oson tuyulsa)\n7. Tiklanish (rest day) va uxlash bo'yicha tavsiyalar\n8. 4 hafta yakunida natijalarni qanday baholash",
  },

  // ============================================
  // QO'SHIMCHA AMALIY
  // ============================================
  {
    id: 40,
    title: "Sayohat rejasini tuzish",
    category: "Hayot",
    description: "Byudjetli va to'liq sayohat marshruti.",
    promptText:
      "Men [MANZIL: shahar/mamlakat] ga [SANA] dan [SANA] gacha sayohat rejalashtiryapman.\nMa'lumotlar:\n- Sayohatchilar: [NECHTA, KIMLAR]\n- Byudjet: [BYUDJET]\n- Qiziqishlar: [QIZIQISHLAR: tarix/tabiat/oshxona/sarguzasht]\n- Cheklovlar: [JISMONIY/OZIQ-OVQAT]\n\nReja:\n1. Sayohat oldidan tayyorgarlik (hujjatlar, vaktsinalar)\n2. Eng yaxshi parvoz/transport variantlari\n3. Joylashish tavsiyalari (3 ta narx oralig'i)\n4. Kunma-kun marshrut (har kun uchun 3-4 faoliyat)\n5. Mahalliy taomlar va restoranlar\n6. \"Must-see\" joylar va kamroq mashhur jamlovgan\n7. Byudjet taqsimoti (transport, ovqat, ko'ngilochar)\n8. Xavfsizlik va madaniy etika maslahatlari\n9. Foydali ifoda va so'zlar mahalliy tilda",
  },
  {
    id: 41,
    title: "Oilaviy byudjet rejasi",
    category: "Hayot",
    description: "Daromad va xarajatlarni boshqarish strategiyasi.",
    promptText:
      "Menga oylik oilaviy byudjet rejasini tuzib bering.\nMa'lumotlar:\n- Oylik daromad: [DAROMAD]\n- Oila a'zolari soni: [SONI]\n- Asosiy xarajatlar: [IJARA/KOMUNAL/OVQAT/TRANSPORT]\n- Asosiy maqsadlar: [MAQSADLAR: jamg'arish/qarz to'lash/uy/mashina]\n\nReja:\n1. 50/30/20 qoidasi bo'yicha taqsimot (zaruriyatlar/xohishlar/jamg'arma)\n2. Aniq summalarda kategoriya bo'yicha taqsimot\n3. Favqulodda jamg'arma (emergency fund) strategiyasi\n4. Oylik xarajatlarni 10% kamaytirish bo'yicha tavsiyalar\n5. Qo'shimcha daromad manbalari (passiv daromad g'oyalari)\n6. Investitsiya boshlash uchun maslahatlar (boshlovchilar uchun)\n7. Oilaviy byudjet uchrashuvi (haftalik)\n8. Yillik moliyaviy maqsadlar tizimi",
  },
];

/* Barcha kategoriyalarni olish — filtrlash uchun */
export const categories = [...new Set(prompts.map((p) => p.category))];

/* Promptlar massivini eksport qilish */
export default prompts;
