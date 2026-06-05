/* ============================================
   AI YORDAMCHI API (api/chat/route.js)
   ============================================
   Coda Academy sayti uchun sun'iy intellekt
   yordamchisi. Foydalanuvchilarga sayt va sun'iy
   intellekt haqida savollarga javob beradi.

   - Vercel AI SDK (v6) + Google Gemini ishlatiladi.
   - Javoblar oqim (streaming) shaklida qaytariladi.
   - Kalit GOOGLE_GENERATIVE_AI_API_KEY env'dan olinadi
     (kodda saqlanmaydi).
   ============================================ */

import { google } from "@ai-sdk/google";
import { streamText, convertToModelMessages } from "ai";

// Funksiya bajarilish vaqti chegarasi (oqim uchun yetarli)
export const maxDuration = 30;

// AI yordamchining "shaxsiyati" va qoidalari
const SYSTEM_PROMPT = `Sen "Coda Academy" ta'lim platformasining sun'iy intellekt yordamchisisan.

Vazifang:
- Foydalanuvchilarga doim O'ZBEK TILIDA, samimiy va sodda tilda yordam berish.
- Sun'iy intellekt (AI), ChatGPT, prompt-engineering, AI vositalari va ulardan ta'limda/ijodda foydalanish haqida tushunarli ma'lumot berish.
- Coda Academy platformasi bo'limlari bo'yicha yo'l-yo'riq ko'rsatish:
  • Promptlar — tayyor AI shablonlari kutubxonasi
  • Foydali resurslar — PDF, video va o'quv modullari (Google orqali kirgan foydalanuvchilarga)
  • Bilim testlari — bilimni sinash uchun testlar (kirgan foydalanuvchilarga)
  • Maqolalar — prompt-engineering bo'yicha qo'llanmalar
  • Boshqaruv paneli va Profil — kirgan foydalanuvchilar uchun

Qoidalar:
- Javoblarni qisqa, aniq va foydali qilib ber. Kerak bo'lsa ro'yxat (bullet) ishlat.
- Agar savol platformaga oid bo'lsa, qaysi bo'limga borishni ayt.
- Resurslar va testlar faqat Google akkaunti orqali kirgan foydalanuvchilarga ochiq ekanini eslat (agar kerak bo'lsa).
- Bilmagan narsangni to'qib chiqarma — halol ayt.
- Hech qachon maxfiy texnik ma'lumot yoki API kalitlarini so'rama yoki oshkor qilma.`;

export async function POST(req) {
  // Kalit sozlanmagan bo'lsa, tushunarli xato qaytaramiz
  if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
    return new Response(
      JSON.stringify({
        error:
          "AI yordamchi sozlanmagan. .env.local faylida GOOGLE_GENERATIVE_AI_API_KEY ni belgilang.",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  try {
    const { messages } = await req.json();

    // v6'da convertToModelMessages async — uni kutib (await) olish shart
    const modelMessages = await convertToModelMessages(messages);

    const result = streamText({
      model: google("gemini-2.5-flash"),
      system: SYSTEM_PROMPT,
      messages: modelMessages,
    });

    return result.toUIMessageStreamResponse();
  } catch (err) {
    console.error("AI chat xatosi:", err);
    return new Response(
      JSON.stringify({ error: "Javob olishda xatolik yuz berdi." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
