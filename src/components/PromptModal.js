/* ============================================
   PROMPT MODAL (PromptModal.js)
   ============================================
   Promptni bosganda ochiladigan modal. Ichida:
   - To'liq prompt matni ko'rinadi
   - [KVADRAT QAVS] ichidagi joylar avtomatik aniqlanib,
     foydalanuvchi alohida input maydonlarida to'ldiradi
   - "Nusxa olish" bosganda — to'ldirilgan tayyor matn
     clipboard'ga ko'chiriladi
   ============================================ */

"use client";

import { useEffect, useMemo, useState } from "react";
import { X, Copy, Check, Sparkles, Tag, RotateCcw } from "lucide-react";

// [PLACEHOLDER] formatdagi joylarni topish uchun regex
const PLACEHOLDER_REGEX = /\[([^\]]+)\]/g;

export default function PromptModal({ prompt, onClose }) {
  // Topilgan unikal placeholderlar ro'yxati
  const placeholders = useMemo(() => {
    if (!prompt?.promptText) return [];
    const matches = prompt.promptText.match(PLACEHOLDER_REGEX) || [];
    // Unikal qilish (bir xil placeholder bir necha marta uchrashishi mumkin)
    return [...new Set(matches)];
  }, [prompt]);

  // Har bir placeholder uchun foydalanuvchi kiritgan qiymat
  const [values, setValues] = useState({});
  const [copied, setCopied] = useState(false);

  // Modal ochilganda qiymatlarni tozalash
  useEffect(() => {
    if (prompt) {
      setValues({});
      setCopied(false);
    }
  }, [prompt]);

  // ESC tugmasi bilan yopish
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };
    if (prompt) {
      window.addEventListener("keydown", handleEsc);
      // Sahifa skroll qilinmasin
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "";
    };
  }, [prompt, onClose]);

  if (!prompt) return null;

  // To'ldirilgan tayyor matnni hosil qilish
  const filledText = placeholders.reduce((text, ph) => {
    const userValue = values[ph]?.trim();
    if (userValue) {
      // Barcha takrorlanishlarni almashtirish
      return text.split(ph).join(userValue);
    }
    return text;
  }, prompt.promptText);

  // Necha foiz to'ldirilgan
  const filledCount = placeholders.filter((ph) => values[ph]?.trim()).length;
  const progressPercent = placeholders.length
    ? Math.round((filledCount / placeholders.length) * 100)
    : 100;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(filledText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error("Nusxa olishda xato:", err);
    }
  };

  const handleReset = () => {
    setValues({});
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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-white border border-border rounded-3xl max-w-3xl w-full shadow-2xl max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Sarlavha */}
        <div className="flex items-start justify-between p-6 md:p-8 border-b border-border/60">
          <div className="flex-1 pr-4">
            <div className="flex items-center gap-2 mb-2">
              <span
                className={`text-xs font-medium px-3 py-1 rounded-full border inline-flex items-center gap-1 ${getCategoryColor(prompt.category)}`}
              >
                <Tag className="w-3 h-3" />
                {prompt.category}
              </span>
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-foreground">
              {prompt.title}
            </h2>
            <p className="text-sm text-muted mt-1">{prompt.description}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-muted hover:text-foreground hover:bg-cream-dark rounded-xl transition-colors cursor-pointer shrink-0"
            aria-label="Yopish"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Kontent — skroll bilan */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6">
          {/* Placeholderlarni to'ldirish */}
          {placeholders.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-primary" />
                  Maydonlarni to'ldiring
                </h3>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-muted">
                    {filledCount}/{placeholders.length}
                  </span>
                  {filledCount > 0 && (
                    <button
                      onClick={handleReset}
                      className="inline-flex items-center gap-1 text-xs text-muted hover:text-rose-600 transition-colors cursor-pointer"
                      title="Maydonlarni tozalash"
                    >
                      <RotateCcw className="w-3 h-3" />
                      Tozalash
                    </button>
                  )}
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full h-1.5 bg-cream-dark rounded-full mb-4 overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>

              <div className="space-y-3">
                {placeholders.map((ph, idx) => {
                  // [SOMETHING: hint] formatini ajratish
                  const inner = ph.slice(1, -1);
                  const colonIdx = inner.indexOf(":");
                  const label =
                    colonIdx > -1 ? inner.slice(0, colonIdx).trim() : inner.trim();
                  const hint =
                    colonIdx > -1 ? inner.slice(colonIdx + 1).trim() : "";

                  return (
                    <div key={`${ph}-${idx}`}>
                      <label className="block text-xs font-semibold text-foreground mb-1.5">
                        {label}
                        {hint && (
                          <span className="text-muted/70 font-normal ml-1">
                            ({hint})
                          </span>
                        )}
                      </label>
                      <input
                        type="text"
                        value={values[ph] || ""}
                        onChange={(e) =>
                          setValues((v) => ({ ...v, [ph]: e.target.value }))
                        }
                        placeholder={hint || `${label}ni kiriting`}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-cream/10 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Tayyor prompt ko'rinishi */}
          <div>
            <h3 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
              <Copy className="w-4 h-4 text-primary" />
              {placeholders.length > 0
                ? "To'ldirilgan prompt (oldindan ko'rish)"
                : "Prompt matni"}
            </h3>
            <div className="bg-cream-dark/40 border border-border/60 rounded-2xl p-4 max-h-72 overflow-y-auto">
              <pre className="text-sm text-foreground/90 whitespace-pre-wrap font-mono leading-relaxed">
                {/* To'ldirilmagan placeholderlarni ajratib ko'rsatish */}
                {renderHighlightedText(filledText, placeholders, values)}
              </pre>
            </div>
            {placeholders.length > 0 && filledCount < placeholders.length && (
              <p className="text-xs text-amber-600 mt-2 flex items-center gap-1">
                ⚠️ To'ldirilmagan maydonlar [qavslar] ichida qoldi —
                ChatGPT'ga yuborishdan oldin to'ldiring
              </p>
            )}
          </div>
        </div>

        {/* Pastki panel — nusxa olish tugmasi */}
        <div className="p-6 md:p-8 border-t border-border/60 bg-cream-dark/20 rounded-b-3xl">
          <div className="flex flex-col sm:flex-row gap-2">
            <button
              onClick={onClose}
              className="px-5 py-3 border border-border text-muted hover:bg-cream-dark rounded-2xl text-sm font-semibold transition-colors cursor-pointer"
            >
              Yopish
            </button>
            <button
              onClick={handleCopy}
              className={`flex-1 py-3 px-6 rounded-2xl text-sm font-semibold transition-all duration-300 cursor-pointer inline-flex items-center justify-center gap-2 ${
                copied
                  ? "bg-emerald-500 text-white"
                  : "bg-primary hover:bg-primary-dark text-white shadow-md hover:shadow-lg"
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" />
                  Nusxalandi! ChatGPT'ga joylashtiring
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  Tayyor promptni nusxa olish
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// To'ldirilmagan placeholderlarni primary rang bilan ajratib ko'rsatish
function renderHighlightedText(text, placeholders, values) {
  // Mavjud to'ldirilmagan placeholderlar
  const unfilled = placeholders.filter((ph) => !values[ph]?.trim());
  if (unfilled.length === 0) return text;

  // Regex bilan ajratish
  const escapedPhs = unfilled.map((ph) =>
    ph.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
  );
  const pattern = new RegExp(`(${escapedPhs.join("|")})`, "g");
  const parts = text.split(pattern);

  return parts.map((part, idx) => {
    if (unfilled.includes(part)) {
      return (
        <span
          key={idx}
          className="bg-primary/15 text-primary font-semibold px-1 rounded"
        >
          {part}
        </span>
      );
    }
    return <span key={idx}>{part}</span>;
  });
}
