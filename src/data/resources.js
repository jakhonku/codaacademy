/* ============================================
   RESURSLAR MA'LUMOTLARI (resources.js)
   ============================================
   Bu faylda foydali resurslar (qo'llanmalar, videolar,
   veb-saytlar) haqidagi ma'lumotlar saqlanadi.
   
   Har bir resurs obyektida:
   - id: Unikal raqam
   - title: Resurs nomi
   - description: Qisqacha tavsif
   - type: Resurs turi ("pdf", "video", "link")
   - url: Havola yoki fayl yo'li
   - fileSize: Fayl hajmi (faqat yuklanadigan fayllar uchun)
   ============================================ */

const resources = [
  {
    id: 10,
    title: "1-Modul: Sun'iy Intellekt Asoslari",
    description: "Sun'iy intellektning ta'limda qo'llanilishi va asosiy AI tushunchalari bo'yicha darsliklar va materiallar.",
    type: "group",
    url: null,
    fileSize: null,
    parentId: null,
  },
  {
    id: 1,
    title: "ChatGPT bilan ishlash qo'llanmasi",
    description: "ChatGPT'dan ta'limda foydalanishning to'liq qo'llanmasi. Boshlang'ich darajadan professional darajagacha.",
    type: "pdf",
    url: "/files/chatgpt-qollanma.pdf",
    fileSize: "2.5 MB",
    parentId: 10,
  },
  {
    id: 2,
    title: "AI vositalari ro'yxati",
    description: "O'qituvchilar uchun foydali sun'iy intellekt vositalari va platformalari ro'yxati va taqqoslash jadvali.",
    type: "pdf",
    url: "/files/ai-vositalar.pdf",
    fileSize: "1.8 MB",
    parentId: 10,
  },
  {
    id: 3,
    title: "Musiqa va AI — video darslik",
    description: "Musiqada sun'iy intellektdan foydalanish bo'yicha batafsil video qo'llanma.",
    type: "video",
    url: "https://www.youtube.com/watch?v=example",
    fileSize: null,
    parentId: 10,
  },
  {
    id: 20,
    title: "2-Modul: Prompt Muhandisligi (Prompt Engineering)",
    description: "AI modellaridan samarali natija olish uchun to'g'ri so'rovlar yozishni o'rganish.",
    type: "group",
    url: null,
    fileSize: null,
    parentId: null,
  },
  {
    id: 4,
    title: "Prompt yozish bo'yicha qo'llanma",
    description: "Sun'iy intellektga samarali so'rov (prompt) yozish san'ati. Amaliy misollar bilan.",
    type: "pdf",
    url: "/files/prompt-qollanma.pdf",
    fileSize: "3.2 MB",
    parentId: 20,
  },
  {
    id: 5,
    title: "OpenAI rasmiy hujjatlari",
    description: "OpenAI'ning rasmiy veb-sayti — eng yangi AI texnologiyalari haqida ma'lumot.",
    type: "link",
    url: "https://openai.com",
    fileSize: null,
    parentId: null,
  },
  {
    id: 6,
    title: "Google Gemini bilan tanishuv",
    description: "Google'ning Gemini AI modeli haqida ma'lumot va undan foydalanish bo'yicha yo'riqnoma.",
    type: "link",
    url: "https://gemini.google.com",
    fileSize: null,
    parentId: null,
  },
];

/* Resurslar massivini eksport qilish */
export default resources;
