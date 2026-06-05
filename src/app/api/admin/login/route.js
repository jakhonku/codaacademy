/* ============================================
   ADMIN LOGIN API (api/admin/login/route.js)
   ============================================
   Admin parolini SERVERda tekshiradi. Parol endi
   brauzer bundle'iga tushmaydi — admin uni yozadi,
   server tekshiradi.

   Afzal: ADMIN_PASSWORD (NEXT_PUBLIC'siz, faqat server).
   Orqaga moslik uchun eski NEXT_PUBLIC_ADMIN_PASSWORD ham
   qabul qilinadi (Vercel'da ADMIN_PASSWORD qo'yilgach uni o'chiring).

   POST { password }
   ============================================ */

function expectedPassword() {
  return (
    process.env.ADMIN_PASSWORD ||
    process.env.NEXT_PUBLIC_ADMIN_PASSWORD ||
    "admin123"
  );
}

// Doimiy vaqtli taqqoslash (timing-attack'ga qarshi)
function safeEqual(a, b) {
  if (typeof a !== "string" || typeof b !== "string") return false;
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export async function POST(request) {
  const body = await request.json().catch(() => null);
  const password = body?.password;

  if (!password || !safeEqual(password, expectedPassword())) {
    return new Response(JSON.stringify({ error: "Noto'g'ri parol" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
