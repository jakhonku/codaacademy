/* ============================================
   RESURSLAR SAHIFASI (resources/page.js)
   ============================================
   Bu sahifada foydali resurslar (PDF fayllar, 
   video darsliklar, veb-sayt havolalari) ko'rsatiladi.
   Ma'lumotlar Supabase'dan yuklanadi, agar ulanish
   bo'lmasa static fayldan foydalaniladi.
   
   "use client" — client-side fetch va yuklash holatlari uchun.
   ============================================ */

"use client";

import { useState, useEffect } from "react";
import SectionTitle from "@/components/SectionTitle";
import ResourceCard from "@/components/ResourceCard";
import staticResources from "@/data/resources";
import { supabase } from "@/lib/supabase";
import { Loader2 } from "lucide-react";

export default function ResourcesPage() {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);

  // Resurslarni yuklash
  useEffect(() => {
    async function fetchResources() {
      setLoading(true);
      if (supabase) {
        try {
          const { data, error } = await supabase
            .from("resources")
            .select("*")
            .order("created_at", { ascending: true });

          if (!error && data) {
            // Supabase kalitlarini moslash
            const formatted = data.map(item => ({
              id: item.id,
              title: item.title,
              description: item.description,
              type: item.type,
              url: item.url,
              fileSize: item.file_size || item.fileSize
            }));
            setResources(formatted);
            setLoading(false);
            return;
          }
        } catch (e) {
          console.error("Resources load error:", e);
        }
      }
      // Fallback
      setResources(staticResources);
      setLoading(false);
    }
    fetchResources();
  }, []);

  return (
    <section className="py-16 md:py-20 bg-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          title="Foydali resurslar"
          subtitle="Qo'shimcha materiallar, amaliy qo'llanmalar va foydali havolalar — bilimingizni mustahkamlang"
        />

        {/* Yuklanmoqda... */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
            <p className="text-muted text-sm">Resurslar yuklanmoqda...</p>
          </div>
        ) : (
          <>
            {/* Resurslar ro'yxati */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {resources.map((resource, index) => (
                <ResourceCard
                  key={resource.id}
                  resource={resource}
                  index={index}
                />
              ))}
            </div>

            {/* Bo'sh holat */}
            {resources.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted text-lg">
                  Hozircha foydali resurslar yo'q.
                </p>
              </div>
            )}
          </>
        )}

        {/* Qo'shimcha yordam */}
        <div className="mt-16 text-center bg-white rounded-2xl p-8 shadow-sm border border-border/30">
          <h3 className="text-xl font-semibold text-foreground mb-3">
            Qo'shimcha yordam kerakmi? 📚
          </h3>
          <p className="text-muted max-w-2xl mx-auto text-sm leading-relaxed">
            Agar biror mavzu bo'yicha qo'shimcha material kerak bo'lsa yoki 
            savollaringiz bo'lsa, bizga murojaat qilishingiz mumkin. 
            Yangi resurslar muntazam ravishda qo'shib boriladi.
          </p>
        </div>
      </div>
    </section>
  );
}
