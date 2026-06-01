/* ============================================
   PROMPTLAR MA'LUMOTLARI (prompts.js)
   ============================================
   Bu faylda o'qituvchilar uchun tayyor prompt
   (so'rov) shablonlari saqlanadi.
   
   Har bir prompt obyektida:
   - id: Unikal raqam
   - title: Prompt nomi
   - category: Kategoriya (filtrlash uchun)
   - description: Qisqacha tavsif
   - promptText: Tayyor prompt matni (nusxa olish uchun)
   ============================================ */

const prompts = [
  {
    id: 1,
    title: "Dars rejasi yaratish",
    category: "Ta'lim",
    description:
      "Istalgan mavzu bo'yicha batafsil dars rejasi yaratish uchun tayyor so'rov.",
    promptText:
      "Siz tajribali musiqa o'qituvchisisiz. Menga [MAVZU NOMI] mavzusi bo'yicha 45 daqiqalik dars rejasini tuzing. Dars rejasida quyidagilar bo'lsin: 1) Darsning maqsadi, 2) Kerakli materiallar, 3) Dars bosqichlari (kirish — 5 daq, asosiy qism — 30 daq, yakunlash — 10 daq), 4) Talabalar uchun uyga vazifa.",
  },
  {
    id: 2,
    title: "Musiqa asari tahlili",
    category: "Musiqa",
    description:
      "Biror musiqa asarini chuqur tahlil qilish uchun AI'ga beriladigan so'rov.",
    promptText:
      "Menga [BASTAKOR NOMI]ning [ASAR NOMI] asarini batafsil tahlil qilib bering. Tahlilda quyidagilarni yoritib bering: 1) Asarning yaratilish tarixi, 2) Musiqa shakli va strukturasi, 3) Garmoniya va melodiya xususiyatlari, 4) Ijro etish bo'yicha tavsiyalar, 5) Bu asarni darsda qanday o'rgatish mumkin.",
  },
  {
    id: 3,
    title: "Test savollari tuzish",
    category: "Ta'lim",
    description:
      "Talabalar bilimini tekshirish uchun test savollari yaratish.",
    promptText:
      "Menga [MAVZU NOMI] mavzusi bo'yicha 10 ta test savoli tuzing. Har bir savolda 4 ta javob varianti bo'lsin (A, B, C, D). Savollar oson, o'rta va qiyin darajada aralash bo'lsin. Oxirida to'g'ri javoblar kalitini bering.",
  },
  {
    id: 4,
    title: "Ijodiy mashq yaratish",
    category: "Musiqa",
    description:
      "Talabalar uchun ijodiy musiqa mashqlari tayyorlash.",
    promptText:
      "Menga [CHOLG'U NOMI] cholg'usi uchun [DARAJA: boshlang'ich/o'rta/yuqori] darajadagi talabalar uchun 5 ta ijodiy mashq yarating. Har bir mashqda: 1) Mashq maqsadi, 2) Bajarish tartibi, 3) Qiyinlik darajasi, 4) Kengaytirilgan variant bo'lsin.",
  },
  {
    id: 5,
    title: "Prezentatsiya rejasi",
    category: "Prezentatsiya",
    description: "Professional prezentatsiya uchun batafsil reja tayyorlash.",
    promptText:
      "Menga [MAVZU NOMI] mavzusida 15 slaydlik prezentatsiya rejasini tuzing. Har bir slayd uchun: 1) Slayd sarlavhasi, 2) Asosiy matn (3-4 gap), 3) Vizual tavsiya (qanday rasm yoki grafik qo'yish kerak). Prezentatsiya [TINGLOVCHILAR: talabalar/hamkasblar/ota-onalar] uchun mo'ljallangan.",
  },
  {
    id: 6,
    title: "Talaba uchun individual reja",
    category: "Ta'lim",
    description:
      "Har bir talaba uchun shaxsiy o'quv rejasi tuzish.",
    promptText:
      "Menga [CHOLG'U NOMI] bo'yicha [DARAJA] darajadagi talaba uchun 1 oylik individual o'quv rejasini tuzing. Rejada: 1) Haftalik maqsadlar, 2) Kunlik mashqlar (30 daqiqalik), 3) O'zlashtirilishi kerak bo'lgan asarlar ro'yxati, 4) Texnik mashqlar, 5) Oylik yakuniy baholash mezonlari bo'lsin.",
  },
  {
    id: 7,
    title: "Musiqa atamalarini tushuntirish",
    category: "Musiqa",
    description:
      "Murakkab musiqa atamalarini sodda tilda tushuntirish uchun so'rov.",
    promptText:
      "Menga quyidagi musiqa atamalarini sodda, tushunarli tilda tushuntirib bering. Har bir atama uchun: 1) Ta'rifi, 2) Hayotiy misol, 3) Qayerda ishlatiladi. Atamalar: [ATAMALAR RO'YXATI].",
  },
  {
    id: 8,
    title: "Email va xat yozish",
    category: "Kommunikatsiya",
    description:
      "Professional email va rasmiy xatlar yozish uchun shablon.",
    promptText:
      "Menga [MAQSAD: taklif/so'rov/minnatdorchilik/ma'lumot berish] uchun professional email yozib bering. Email [KIMGA: ota-onalar/hamkasblar/rahbariyat] ga yo'naltirilgan. Ohang [RASMIY/YARIM RASMIY] bo'lsin. Mavzu: [MAVZU].",
  },
  {
    id: 9,
    title: "Kontsert dasturi tuzish",
    category: "Musiqa",
    description:
      "Kontsert yoki tadbirlar uchun dastur tuzish.",
    promptText:
      "Menga [TADBIR TURI: kontsert/master-klass/festival] uchun dastur tuzing. Ma'lumotlar: 1) Davomiyligi: [SOAT] soat, 2) Ishtirokchilar soni: [SONI], 3) Tinglovchilar: [KIMLAR], 4) Mavzu: [MAVZU]. Dasturda tanaffuslar va tartib bo'lsin.",
  },
  {
    id: 10,
    title: "AI yordamida kod refaktor",
    category: "Ta'lim",
    description: "Kod refaktoring uchun prompt, kodni optimallashtirish, xavfsizligini oshirish",
    promptText: "Menga [KOD] kodini refaktor qiling, optimal struktura, o'qish osonligi va samaradorlikka e'tibor bering. Har qanday keraksiz kodni olib tashlang. Qo'shimcha izohlar bilan tushuntiring."
  },
  {
    id: 11,
    title: "Musiqa kompozitsiyasi yaratish",
    category: "Musiqa",
    description: "Yangi musiqa asari yaratish uchun prompt",
    promptText: "Menga [JANR] uslubida, [MIDI] melodiya bilan 2 daqiqalik instrumental trek yarating. Asboblar: piano, synth, drum. Fon qisqa tasvir, dinamik o'zgarishlar bilan."
  },
  {
    id: 12,
    title: "Prezentatsiya slaydlarini yaratish",
    category: "Prezentatsiya",
    description: "Ta'lim yoki biznes prezentatsiyasi uchun slayd kontenti",
    promptText: "Menga [MAVZU] bo'yicha 10 slaydli prezentatsiya rejasini yozing. Har bir slayd uchun sarlavha, asosiy nuqtalar, vizual tavsiya (rasm, diagramma)."
  },
  {
    id: 13,
    title: "Biznes email yozish",
    category: "Kommunikatsiya",
    description: "Professional biznes email yaratish",
    promptText: "Menga [MAQSAD] uchun professional email yozing. Email [QABULQILUVCHINING ISMI] ga yo'naltirilgan, rasmiy ohangda, qisqa va aniq."
  },
  {
    id: 14,
    title: "Texnologiya tendensiyalarini tahlil qilish",
    category: "Texnologiya",
    description: "So'nggi texnologik trendlar haqida tavsif",
    promptText: "2026-yil uchun AI, blockchain, quantum computing sohalaridagi eng muhim texnologik tendensiyalarni 5 ta punktda qisqacha tavsiflang, har birining ta'siri va imkoniyatlarini ko'rsating."
  }
];

/* Barcha kategoriyalarni olish — filtrlash uchun kerak bo'ladi */
export const categories = [...new Set(prompts.map((p) => p.category))];

/* Promptlar massivini eksport qilish */
export default prompts;
