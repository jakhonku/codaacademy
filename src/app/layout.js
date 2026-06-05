/* ============================================
   ASOSIY LAYOUT (layout.js)
   ============================================
   Bu fayl butun ilovaning asosiy "qobiq"i (shell).
   Har bir sahifa shu layout ichida ko'rsatiladi.
   
   Bu yerda belgilanadigan narsalar:
   - HTML tili (lang="uz")
   - Shriftlar (Inter — Google Fonts'dan)
   - Global CSS fayli
   - Navbar (yuqori menyu) — barcha sahifalarda ko'rinadi
   - Footer (pastki qism) — barcha sahifalarda ko'rinadi
   - Metadata (SEO uchun — title, description)
   ============================================ */

// Next.js'dan Google Fonts'ni import qilish
// Inter — zamonaviy, o'qishga qulay shrift
import { Inter } from "next/font/google";

// Global stillar faylini import qilish
import "./globals.css";

// Ilova qobig'i tanlovchisi — sahifaga qarab Navbar yoki Dashboard yon menyusi
import AppChrome from "@/components/AppChrome";

// AI yordamchi widget — barcha sahifalarda o'ng-pastda ko'rinadi
import AiAssistant from "@/components/AiAssistant";

/* ============================================
   SHRIFT SOZLAMALARI
   ============================================
   Inter shriftini "latin" harflar bilan yuklaymiz.
   variable: CSS o'zgaruvchisi nomi — Tailwind'da ishlatiladi.
   ============================================ */
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "cyrillic"],
});

/* ============================================
   METADATA — SEO UCHUN
   ============================================
   Bu ma'lumotlar brauzer tab'ida va qidiruv
   tizimlarida (Google, Yandex) ko'rinadi.
   ============================================ */
export const metadata = {
  title: "Coda Academy — Ta'limda va ijodda Sun'iy Intellekt",
  description:
    "Sun'iy intellektdan ta'limda va ijodda foydalanish platformasi. Oflayn seminar-treninglar, tayyor promptlar va foydali resurslar.",
};

/* ============================================
   ROOT LAYOUT KOMPONENTI
   ============================================
   Bu funksiya asosiy layout'ni qaytaradi.
   {children} — hozirgi sahifaning kontenti.
   ============================================ */
export default function RootLayout({ children }) {
  return (
    /* HTML element — sahifa tili o'zbek (uz) */
    <html lang="uz" className={`${inter.variable} h-full antialiased`}>
      {/* Body — sahifaning asosiy qismi */}
      <body className="min-h-full flex flex-col font-sans bg-background text-foreground">
        {/* AppChrome — joriy sahifaga qarab landing (Navbar+Footer) yoki
            dashboard (yon menyu + burger) qobig'ini ko'rsatadi */}
        <AppChrome>{children}</AppChrome>

        {/* AI yordamchi — foydalanuvchilarga yordam beradi */}
        <AiAssistant />
      </body>
    </html>
  );
}
