/* ============================================
   PROMPTLAR SAHIFASI (prompts/page.js)
   ============================================
   - Barcha prompt shablonlari
   - Qidiruv (search) — sarlavha/tavsif/kategoriya bo'yicha
   - Kategoriya filtri
   - Sevimlilar (localStorage)
   - Promptni bosganda interaktiv modal ochiladi
     ([PLACEHOLDER]larni to'ldirish uchun)
   ============================================ */

"use client";

import { useState, useEffect } from "react";
import SectionTitle from "@/components/SectionTitle";
import PromptCard from "@/components/PromptCard";
import PromptModal from "@/components/PromptModal";
import staticPrompts from "@/data/prompts";
import { supabase } from "@/lib/supabase";
import { Filter, Loader2, Search, Heart, X, Sparkles } from "lucide-react";

const FAVORITES_KEY = "favorite_prompts";

export default function PromptsPage() {
  const [prompts, setPrompts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("Barchasi");
  const [searchQuery, setSearchQuery] = useState("");
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [selectedPrompt, setSelectedPrompt] = useState(null);

  // Promptlarni yuklash
  useEffect(() => {
    async function fetchPrompts() {
      setLoading(true);
      if (supabase) {
        try {
          const { data, error } = await supabase
            .from("prompts")
            .select("*")
            .order("created_at", { ascending: true });

          if (!error && data && data.length > 0) {
            const formatted = data.map((item) => ({
              id: item.id,
              title: item.title,
              category: item.category,
              description: item.description,
              promptText: item.prompt_text || item.promptText,
            }));
            setPrompts(formatted);
            setLoading(false);
            return;
          }
        } catch (e) {
          console.error("Prompts load error:", e);
        }
      }
      setPrompts(staticPrompts);
      setLoading(false);
    }
    fetchPrompts();
  }, []);

  // Sevimlilarni localStorage'dan yuklash
  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem(FAVORITES_KEY) || "[]");
      setFavorites(stored);
    } catch (e) {
      setFavorites([]);
    }
  }, []);

  // Sevimliga qo'shish/o'chirish
  const toggleFavorite = (id) => {
    setFavorites((prev) => {
      const next = prev.includes(id)
        ? prev.filter((x) => x !== id)
        : [...prev, id];
      try {
        localStorage.setItem(FAVORITES_KEY, JSON.stringify(next));
      } catch (e) {
        console.error("Sevimlilarni saqlashda xato:", e);
      }
      return next;
    });
  };

  // Kategoriyalar ro'yxati
  const categoriesList = [
    "Barchasi",
    ...Array.from(new Set(prompts.map((p) => p.category))),
  ];

  // Filtrlangan promptlar (kategoriya + qidiruv + sevimlilar)
  const filteredPrompts = prompts.filter((p) => {
    // Sevimlilar filtri
    if (showFavoritesOnly && !favorites.includes(p.id)) return false;

    // Kategoriya filtri
    if (activeCategory !== "Barchasi" && p.category !== activeCategory) {
      return false;
    }

    // Qidiruv (sarlavha + tavsif + kategoriya + prompt matnida)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const inTitle = p.title.toLowerCase().includes(q);
      const inDesc = (p.description || "").toLowerCase().includes(q);
      const inCat = p.category.toLowerCase().includes(q);
      const inText = p.promptText.toLowerCase().includes(q);
      if (!inTitle && !inDesc && !inCat && !inText) return false;
    }

    return true;
  });

  return (
    <section className="py-16 md:py-20 bg-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          title="Promptlar kutubxonasi"
          subtitle={`${prompts.length}+ tayyor so'rov shablonlari — bosing, joylarni to'ldiring va AI'ga yuboring`}
        />

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
            <p className="text-muted text-sm">Promptlar yuklanmoqda...</p>
          </div>
        ) : (
          <>
            {/* Qidiruv va sevimlilar */}
            <div className="max-w-3xl mx-auto mb-6">
              <div className="flex gap-2">
                {/* Qidiruv maydoni */}
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Promptlarni qidirish... (masalan: dars, email, prezentatsiya)"
                    className="w-full pl-12 pr-12 py-3.5 bg-white border border-border/60 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-muted hover:text-foreground transition-colors cursor-pointer"
                      aria-label="Tozalash"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Sevimlilar tugmasi */}
                <button
                  onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
                  className={`px-4 py-3.5 rounded-2xl border text-sm font-semibold transition-all duration-300 cursor-pointer inline-flex items-center gap-2 shadow-sm ${
                    showFavoritesOnly
                      ? "bg-rose-500 text-white border-rose-500"
                      : "bg-white text-foreground border-border/60 hover:border-rose-300 hover:bg-rose-50"
                  }`}
                  title="Faqat sevimli promptlar"
                >
                  <Heart
                    className="w-4 h-4"
                    fill={showFavoritesOnly ? "currentColor" : "none"}
                  />
                  <span className="hidden sm:inline">
                    Sevimlilar
                  </span>
                  {favorites.length > 0 && (
                    <span
                      className={`text-xs px-1.5 py-0.5 rounded-full ${
                        showFavoritesOnly
                          ? "bg-white/20"
                          : "bg-rose-100 text-rose-600"
                      }`}
                    >
                      {favorites.length}
                    </span>
                  )}
                </button>
              </div>
            </div>

            {/* Kategoriya filtri */}
            <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
              <Filter className="w-4 h-4 text-muted mr-1" />
              {categoriesList.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 cursor-pointer ${
                    activeCategory === cat
                      ? "bg-primary text-white shadow-md"
                      : "bg-white text-muted hover:bg-cream-dark border border-border/30"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Natijalar soni */}
            {(searchQuery || activeCategory !== "Barchasi" || showFavoritesOnly) && (
              <p className="text-center text-sm text-muted mb-6">
                {filteredPrompts.length} ta prompt topildi
                {searchQuery && (
                  <>
                    {" "}— qidiruv: <strong>"{searchQuery}"</strong>
                  </>
                )}
              </p>
            )}

            {/* Promptlar ro'yxati */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPrompts.map((prompt, index) => (
                <PromptCard
                  key={prompt.id}
                  prompt={prompt}
                  index={index}
                  isFavorite={favorites.includes(prompt.id)}
                  onToggleFavorite={toggleFavorite}
                  onOpen={setSelectedPrompt}
                />
              ))}
            </div>

            {/* Bo'sh holat */}
            {filteredPrompts.length === 0 && (
              <div className="text-center py-16 bg-white rounded-3xl border border-border/30">
                {showFavoritesOnly ? (
                  <>
                    <Heart className="w-12 h-12 text-muted/40 mx-auto mb-3" />
                    <p className="text-foreground font-semibold mb-1">
                      Sizda hali sevimli prompt yo'q
                    </p>
                    <p className="text-muted text-sm">
                      Yoqtirgan promptlaringizda ❤️ tugmasini bosing
                    </p>
                  </>
                ) : (
                  <>
                    <Search className="w-12 h-12 text-muted/40 mx-auto mb-3" />
                    <p className="text-foreground font-semibold mb-1">
                      Hech narsa topilmadi
                    </p>
                    <p className="text-muted text-sm">
                      Boshqa kalit so'z bilan qidirib ko'ring
                    </p>
                  </>
                )}
              </div>
            )}
          </>
        )}

        {/* Qo'llanma */}
        <div className="mt-16 bg-white rounded-3xl p-8 shadow-sm border border-border/30">
          <h3 className="text-xl font-semibold text-foreground mb-6 flex items-center justify-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            Qanday foydalanish kerak?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-12 h-12 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mx-auto mb-3 text-xl font-bold">
                1
              </div>
              <h4 className="font-semibold text-foreground mb-2 text-sm">
                Promptni tanlang
              </h4>
              <p className="text-muted text-xs leading-relaxed">
                Kerakli prompt kartochkasini bosing — modal ochiladi
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mx-auto mb-3 text-xl font-bold">
                2
              </div>
              <h4 className="font-semibold text-foreground mb-2 text-sm">
                Maydonlarni to'ldiring
              </h4>
              <p className="text-muted text-xs leading-relaxed">
                [Qavslar] ichidagi joylarni o'zingiz uchun moslashtiring
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mx-auto mb-3 text-xl font-bold">
                3
              </div>
              <h4 className="font-semibold text-foreground mb-2 text-sm">
                Nusxa olib yuboring
              </h4>
              <p className="text-muted text-xs leading-relaxed">
                Tayyor matnni ChatGPT, Gemini yoki Claude'ga joylashtiring
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Prompt modali */}
      <PromptModal
        prompt={selectedPrompt}
        onClose={() => setSelectedPrompt(null)}
      />
    </section>
  );
}
