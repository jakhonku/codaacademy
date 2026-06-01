/* ============================================
   PROMPT KARTOCHKASI (PromptCard.js)
   ============================================
   Bu komponent bitta prompt (tayyor so'rov) shablonini
   kartochka shaklida ko'rsatadi.
   
   "use client" — brauzerda ishlaydi, chunki clipboard
   (nusxa olish) funksiyasi faqat brauzerda ishlaydi.
   
   Props (parametrlar):
   - prompt: Prompt obyekti (id, title, category,
     description, promptText)
   - index: Animatsiya kechikishi uchun tartib raqami
   ============================================ */

"use client";

// React'dan useState hook'ini import qilish — nusxa olish holatini boshqarish uchun
import { useState } from "react";

import { Copy, Check, Tag } from "lucide-react";

export default function PromptCard({ prompt, index = 0 }) {
  /* ============================================
     NUSXA OLISH HOLATI
     ============================================
     copied — true bo'lganda "Nusxalandi!" xabari ko'rinadi.
     Bir necha soniyadan keyin yana false bo'ladi.
     ============================================ */
  const [copied, setCopied] = useState(false);

  /* ============================================
     NUSXA OLISH FUNKSIYASI
     ============================================
     Prompt matnini brauzerning clipboard (bufer)iga
     nusxalaydi. Muvaffaqiyatli bo'lsa, "Nusxalandi!" 
     xabari 2 soniya ko'rinadi.
     ============================================ */
  const handleCopy = async () => {
    try {
      // Matnni clipboard'ga nusxalash
      await navigator.clipboard.writeText(prompt.promptText);
      // Holat o'zgartirish — nusxalandi
      setCopied(true);
      // 2 soniyadan keyin holatni qaytarish
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      // Agar nusxalash ishlamasa, xato haqida xabar berish
      console.error("Nusxalashda xato:", err);
    }
  };

  /* ============================================
     KATEGORIYA RANGLARINI ANIQLASH
     ============================================
     Har bir kategoriya uchun turli rang ishlatiladi.
     Bu funksiya kategoriya nomiga qarab rang klassini qaytaradi.
     ============================================ */
  const getCategoryColor = (category) => {
    const colors = {
      "Ta'lim": "bg-blue-50 text-blue-600 border-blue-200",
      "Musiqa": "bg-purple-50 text-purple-600 border-purple-200",
      "Prezentatsiya": "bg-green-50 text-green-600 border-green-200",
      "Kommunikatsiya": "bg-orange-50 text-orange-600 border-orange-200",
    };
    // Agar kategoriya topilmasa, standart rang qaytarish
    return colors[category] || "bg-gray-50 text-gray-600 border-gray-200";
  };

  return (
    /* Kartochka konteyner */
    <div
      className="group bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-border/30 p-6 animate-fade-in-up flex flex-col"
      style={{ animationDelay: `${index * 0.1}s`, opacity: 0 }}
    >
      {/* ============================================
          SARLAVHA VA KATEGORIYA
          ============================================ */}
      <div className="flex items-start justify-between mb-3">
        {/* Prompt sarlavhasi */}
        <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors duration-300 flex-1 pr-2">
          {prompt.title}
        </h3>

        {/* Kategoriya belgisi */}
        <span
          className={`
            text-xs font-medium px-3 py-1 rounded-full border
            flex items-center gap-1 whitespace-nowrap
            ${getCategoryColor(prompt.category)}
          `}
        >
          <Tag className="w-3 h-3" />
          {prompt.category}
        </span>
      </div>

      {/* Qisqacha tavsif */}
      <p className="text-muted text-sm leading-relaxed mb-4">
        {prompt.description}
      </p>

      {/* ============================================
          PROMPT MATNI
          ============================================
          Kulrang fonda ko'rsatiladi. 4 qatordan keyin
          qisqartiriladi (line-clamp-4).
          ============================================ */}
      <div className="bg-cream-dark/50 rounded-xl p-4 mb-4 flex-1">
        <p className="text-sm text-foreground/80 leading-relaxed line-clamp-4 font-mono">
          {prompt.promptText}
        </p>
      </div>

      {/* ============================================
          NUSXA OLISH TUGMASI
          ============================================
          Bosganda prompt matni clipboard'ga nusxalanadi.
          ============================================ */}
      <button
        onClick={handleCopy}
        className={`
          w-full py-2.5 px-4 rounded-xl text-sm font-medium
          flex items-center justify-center gap-2
          transition-all duration-300 cursor-pointer
          ${
            copied
              ? /* Nusxalandi holatida — yashil rang */
                "bg-green-50 text-green-600 border border-green-200"
              : /* Oddiy holatda — primary rang */
                "bg-primary/5 text-primary hover:bg-primary hover:text-white border border-primary/20"
          }
        `}
      >
        {copied ? (
          <>
            {/* Nusxalandi — tasdiqlash ikonkasi */}
            <Check className="w-4 h-4" />
            Nusxalandi!
          </>
        ) : (
          <>
            {/* Nusxa olish — clipboard ikonkasi */}
            <Copy className="w-4 h-4" />
            Nusxa olish
          </>
        )}
      </button>
    </div>
  );
}
