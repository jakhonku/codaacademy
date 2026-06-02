/* ============================================
   PROMPT KARTOCHKASI (PromptCard.js)
   ============================================
   Bitta prompt shablonini kartochka shaklida ko'rsatadi.

   - Kartochkani bosish — to'liq modalni ochadi
     (joylarni to'ldirib, tayyor matnni olish uchun)
   - Yurakcha tugmasi — sevimlilarga qo'shish (localStorage)
   - Tezkor nusxa olish tugmasi — original matnni ko'chiradi
   ============================================ */

"use client";

import { useState } from "react";
import { Copy, Check, Tag, Heart, Wand2 } from "lucide-react";

export default function PromptCard({
  prompt,
  index = 0,
  isFavorite = false,
  onToggleFavorite,
  onOpen,
}) {
  const [copied, setCopied] = useState(false);

  // Tezkor nusxa olish (kartochka tashqarisida, original matnni)
  const handleQuickCopy = async (e) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(prompt.promptText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Nusxalashda xato:", err);
    }
  };

  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    onToggleFavorite?.(prompt.id);
  };

  // Kategoriya rangi
  const getCategoryColor = (category) => {
    const colors = {
      "Ta'lim": "bg-blue-50 text-blue-600 border-blue-200",
      "Musiqa": "bg-purple-50 text-purple-600 border-purple-200",
      "Prezentatsiya": "bg-green-50 text-green-600 border-green-200",
      "Kommunikatsiya": "bg-orange-50 text-orange-600 border-orange-200",
      "Yozish": "bg-pink-50 text-pink-600 border-pink-200",
      "Ish": "bg-indigo-50 text-indigo-600 border-indigo-200",
      "Karyera": "bg-cyan-50 text-cyan-600 border-cyan-200",
      "Tahlil": "bg-amber-50 text-amber-600 border-amber-200",
      "Ijodiy": "bg-rose-50 text-rose-600 border-rose-200",
      "Tarjima": "bg-teal-50 text-teal-600 border-teal-200",
      "AI": "bg-violet-50 text-violet-600 border-violet-200",
      "Shaxsiy": "bg-emerald-50 text-emerald-600 border-emerald-200",
      "Sog'liq": "bg-lime-50 text-lime-600 border-lime-200",
      "Hayot": "bg-sky-50 text-sky-600 border-sky-200",
    };
    return colors[category] || "bg-gray-50 text-gray-600 border-gray-200";
  };

  return (
    <div
      onClick={() => onOpen?.(prompt)}
      className="group bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-border/30 p-6 animate-fade-in-up flex flex-col cursor-pointer relative"
      style={{ animationDelay: `${index * 0.05}s`, opacity: 0 }}
    >
      {/* Sevimli tugmasi (yuqori o'ng burchak) */}
      <button
        onClick={handleFavoriteClick}
        className={`absolute top-4 right-4 p-1.5 rounded-full transition-all cursor-pointer ${
          isFavorite
            ? "text-rose-500 hover:bg-rose-50"
            : "text-muted/40 hover:text-rose-500 hover:bg-rose-50"
        }`}
        title={isFavorite ? "Sevimlilardan o'chirish" : "Sevimlilarga qo'shish"}
        aria-label="Sevimlilar"
      >
        <Heart
          className="w-5 h-5"
          fill={isFavorite ? "currentColor" : "none"}
        />
      </button>

      {/* Sarlavha va kategoriya */}
      <div className="mb-3 pr-10">
        <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors duration-300 mb-2">
          {prompt.title}
        </h3>
        <span
          className={`text-xs font-medium px-3 py-1 rounded-full border inline-flex items-center gap-1 ${getCategoryColor(
            prompt.category
          )}`}
        >
          <Tag className="w-3 h-3" />
          {prompt.category}
        </span>
      </div>

      {/* Qisqacha tavsif */}
      <p className="text-muted text-sm leading-relaxed mb-4">
        {prompt.description}
      </p>

      {/* Prompt matni (qisqartirilgan ko'rinish) */}
      <div className="bg-cream-dark/50 rounded-xl p-4 mb-4 flex-1">
        <p className="text-sm text-foreground/80 leading-relaxed line-clamp-4 font-mono">
          {prompt.promptText}
        </p>
      </div>

      {/* Tugmalar — birgalikda */}
      <div className="flex gap-2">
        {/* Modalni ochish (asosiy tugma) */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onOpen?.(prompt);
          }}
          className="flex-1 py-2.5 px-4 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all duration-300 cursor-pointer bg-primary hover:bg-primary-dark text-white shadow-sm hover:shadow-md"
        >
          <Wand2 className="w-4 h-4" />
          To'ldirib olish
        </button>

        {/* Tezkor nusxa olish */}
        <button
          onClick={handleQuickCopy}
          className={`px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all duration-300 cursor-pointer border ${
            copied
              ? "bg-emerald-50 text-emerald-600 border-emerald-200"
              : "bg-white text-primary hover:bg-primary/5 border-primary/20"
          }`}
          title="Original matnni nusxa olish"
        >
          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
}
