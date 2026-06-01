/* ============================================
   PROMPTLAR SAHIFASI (prompts/page.js)
   ============================================
   Bu sahifada barcha prompt shablonlari ko'rsatiladi.
   Ma'lumotlar Supabase'dan real vaqtda yuklanadi,
   agar ulanish bo'lmasa, lokal static fayldan fallback sifatida foydalaniladi.
   
   "use client" — interaktiv filtrlash va yuklash jarayonlari uchun.
   ============================================ */

"use client";

import { useState, useEffect } from "react";
import SectionTitle from "@/components/SectionTitle";
import PromptCard from "@/components/PromptCard";
import staticPrompts from "@/data/prompts";
import { supabase } from "@/lib/supabase";
import { Filter, Loader2 } from "lucide-react";

export default function PromptsPage() {
  const [prompts, setPrompts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("Barchasi");

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
          
          if (!error && data) {
            // Supabase kalitlarini moslash
            const formatted = data.map(item => ({
              id: item.id,
              title: item.title,
              category: item.category,
              description: item.description,
              promptText: item.prompt_text || item.promptText
            }));
            setPrompts(formatted);
            setLoading(false);
            return;
          }
        } catch (e) {
          console.error("Prompts load error:", e);
        }
      }
      // Fallback
      setPrompts(staticPrompts);
      setLoading(false);
    }
    fetchPrompts();
  }, []);

  // Dinamik kategoriyalar ro'yxati
  const categoriesList = ["Barchasi", ...new Set(prompts.map((p) => p.category))];

  // Filtrlangant promptlar
  const filteredPrompts =
    activeCategory === "Barchasi"
      ? prompts
      : prompts.filter((p) => p.category === activeCategory);

  return (
    <section className="py-16 md:py-20 bg-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          title="Promptlar kutubxonasi"
          subtitle="Tayyor so'rov shablonlari — nusxa oling va sun'iy intellektdan samarali foydalaning"
        />

        {/* Yuklanmoqda... */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
            <p className="text-muted text-sm">Promptlar yuklanmoqda...</p>
          </div>
        ) : (
          <>
            {/* Kategoriya filtri */}
            <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
              <Filter className="w-4 h-4 text-muted mr-1" />
              
              {categoriesList.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`
                    px-4 py-2 rounded-xl text-sm font-medium
                    transition-all duration-300 cursor-pointer
                    ${
                      activeCategory === cat
                        ? "bg-primary text-white shadow-md"
                        : "bg-white text-muted hover:bg-cream-dark border border-border/30"
                    }
                  `}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Promptlar ro'yxati */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPrompts.map((prompt, index) => (
                <PromptCard key={prompt.id} prompt={prompt} index={index} />
              ))}
            </div>

            {/* Bo'sh holat */}
            {filteredPrompts.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted text-lg">
                  Bu kategoriyada hali promptlar yo'q.
                </p>
              </div>
            )}
          </>
        )}

        {/* Qo'llanma */}
        <div className="mt-16 text-center bg-white rounded-2xl p-8 shadow-sm border border-border/30">
          <h3 className="text-xl font-semibold text-foreground mb-3">
            Qanday foydalanish kerak? 💡
          </h3>
          <p className="text-muted max-w-2xl mx-auto text-sm leading-relaxed">
            Kerakli prompt kartochkasidagi <strong>"Nusxa olish"</strong> tugmasini bosing.
            So'ngra ChatGPT, Gemini yoki boshqa AI vositasiga o'tib, 
            nusxalangan matnni joylashtiring (Ctrl+V). Kvadrat qavslar 
            <code>[MAVZU NOMI]</code> ichidagi so'zlarni o'zingizning ma'lumotlaringiz bilan almashtiring.
          </p>
        </div>
      </div>
    </section>
  );
}
