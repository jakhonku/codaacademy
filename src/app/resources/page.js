/* ============================================
   RESURSLAR SAHIFASI (resources/page.js)
   ============================================
   Bu sahifada foydali resurslar (PDF fayllar, 
   video darsliklar, veb-sayt havolalari) ko'rsatiladi.
   Guruhlangan (Modullar) va mustaqil resurslar qo'llab-quvvatlanadi.
   ============================================ */

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import SectionTitle from "@/components/SectionTitle";
import ResourceCard from "@/components/ResourceCard";
import staticResources from "@/data/resources";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/useAuth";
import {
  Loader2,
  Folder,
  FileText,
  Video,
  ExternalLink,
  Download,
  ChevronDown,
  ChevronUp,
  BookOpen,
  Play
} from "lucide-react";

export default function ResourcesPage() {
  const router = useRouter();
  // Foydalanuvchi holati — faqat Google orqali kirganlar resurslarni ko'radi
  const { user, profile, loading: authLoading } = useAuth();

  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedModules, setExpandedModules] = useState({});

  // Kirmagan yoki ro'yxatdan o'tmagan foydalanuvchini login sahifasiga yo'naltirish
  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.replace("/login");
      } else if (profile && !profile.is_registered) {
        router.replace("/login");
      }
    }
  }, [user, profile, authLoading, router]);

  // Resurslarni yuklash (faqat foydalanuvchi kirgan bo'lsa)
  useEffect(() => {
    if (!user) return;
    async function fetchResources() {
      setLoading(true);
      if (supabase) {
        try {
          const { data, error } = await supabase
            .from("resources")
            .select("*")
            .order("created_at", { ascending: true });

          if (!error && data) {
            const formatted = data.map(item => ({
              id: item.id,
              title: item.title,
              description: item.description,
              type: item.type,
              url: item.url,
              fileSize: item.file_size || item.fileSize,
              parentId: item.parent_id || item.parentId || null
            }));
            setResources(formatted);
            setLoading(false);
            return;
          }
        } catch (e) {
          console.error("Resources load error:", e);
        }
      }
      setResources(staticResources);
      setLoading(false);
    }
    fetchResources();
  }, [user]);

  const toggleModule = (id) => {
    setExpandedModules(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Resurslarni toifalarga ajratish
  const modules = resources.filter(r => r.type === "group");
  const orphans = resources.filter(r => r.type !== "group" && !r.parentId);

  // Har bir modul uchun bolalar resurslarini olish
  const getModuleChildren = (moduleId) => {
    return resources.filter(r => r.parentId === moduleId);
  };

  // Resurs turi bo'yicha ikonka va rang
  const getSubResourceConfig = (type) => {
    const configs = {
      pdf: {
        icon: FileText,
        bgClass: "bg-rose-50 text-rose-600",
        label: "PDF Hujjat",
        btnText: "Yuklab olish",
        btnIcon: Download
      },
      video: {
        icon: Video,
        bgClass: "bg-blue-50 text-blue-600",
        label: "Video Dars",
        btnText: "Ko'rish",
        btnIcon: Play
      },
      link: {
        icon: ExternalLink,
        bgClass: "bg-emerald-50 text-emerald-600",
        label: "Havola",
        btnText: "Ochish",
        btnIcon: ExternalLink
      }
    };
    return configs[type] || configs.link;
  };

  // Sessiyani tekshirayotgan yoki kirmagan foydalanuvchi uchun yuklanish ko'rsatiladi
  // (kirmaganlar yuqoridagi effekt orqali /login sahifasiga yo'naltiriladi)
  if (authLoading || !user) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <section className="py-16 md:py-20 bg-cream min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          title="Foydali resurslar"
          subtitle="Qo'shimcha materiallar, amaliy qo'llanmalar va foydali modullar — bilimingizni mustahkamlang"
        />

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
            <p className="text-muted text-sm font-medium">Resurslar yuklanmoqda...</p>
          </div>
        ) : (
          <div className="space-y-16">

            {/* ============================================
                1. O'QUV MODULLARI (GURUHLAR)
                ============================================ */}
            {modules.length > 0 && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 border-b border-border/40 pb-4">
                  <div className="p-2 bg-primary/10 rounded-xl text-primary">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-xl md:text-2xl font-bold text-foreground">O'quv Modullari</h2>
                    <p className="text-muted text-xs md:text-sm flex items-center gap-1">
                      Mavzular bo'yicha jamlangan darsliklar va materiallar to'plami.
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  {modules.map((module) => {
                    const children = getModuleChildren(module.id);
                    const isExpanded = !!expandedModules[module.id];

                    return (
                      <div
                        key={module.id}
                        className="bg-white border border-border/40 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
                      >
                        {/* Modul Header */}
                        <div
                          onClick={() => toggleModule(module.id)}
                          className="p-6 md:p-8 flex items-center justify-between gap-4 cursor-pointer select-none hover:bg-cream/[0.15] transition-colors"
                        >
                          <div className="flex items-start gap-4 flex-1">
                            <div className="p-4 bg-primary/5 text-primary rounded-2xl flex-shrink-0 mt-0.5">
                              <Folder className="w-6 h-6" />
                            </div>
                            <div className="flex-1">
                              <span className="text-xs font-semibold text-primary uppercase tracking-wider bg-primary/10 px-2.5 py-1 rounded-full">
                                Modul
                              </span>
                              <h3 className="text-lg md:text-xl font-bold text-foreground mt-2">
                                {module.title}
                              </h3>
                              {module.description && (
                                <p className="text-muted text-sm mt-1 leading-relaxed max-w-3xl">
                                  {module.description}
                                </p>
                              )}
                              <div className="flex items-center gap-2 mt-3 text-xs font-medium text-muted-light">
                                <span>{children.length} ta material</span>
                              </div>
                            </div>
                          </div>

                          <div className="p-2 rounded-xl border border-border/60 text-muted hover:text-foreground hover:bg-cream-dark transition-all">
                            {isExpanded ? (
                              <ChevronUp className="w-5 h-5" />
                            ) : (
                              <ChevronDown className="w-5 h-5" />
                            )}
                          </div>
                        </div>

                        {/* Modul Body (Bolalar resurslari) */}
                        {isExpanded && (
                          <div className="border-t border-border/30 bg-cream/[0.05] p-6 md:p-8 space-y-4 animate-fade-in-up">
                            {children.length > 0 ? (
                              <div className="divide-y divide-border/20">
                                {children.map((child) => {
                                  const childConfig = getSubResourceConfig(child.type);
                                  const ChildIcon = childConfig.icon;
                                  const BtnIcon = childConfig.btnIcon;

                                  return (
                                    <div
                                      key={child.id}
                                      className="py-4 first:pt-0 last:pb-0 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-cream/10 rounded-2xl md:px-4 -mx-2 md:-mx-4 transition-colors"
                                    >
                                      <div className="flex items-start gap-3.5">
                                        <div className={`p-2.5 rounded-xl ${childConfig.bgClass} flex-shrink-0 mt-0.5`}>
                                          <ChildIcon className="w-5 h-5" />
                                        </div>
                                        <div>
                                          <div className="flex items-center gap-2 flex-wrap">
                                            <h4 className="font-semibold text-foreground text-sm md:text-base">
                                              {child.title}
                                            </h4>
                                            <span className="text-[10px] font-semibold bg-cream-dark text-muted-dark px-2 py-0.5 rounded-full">
                                              {childConfig.label}
                                            </span>
                                            {child.fileSize && (
                                              <span className="text-[10px] text-muted-light font-medium">
                                                {child.fileSize}
                                              </span>
                                            )}
                                          </div>
                                          {child.description && (
                                            <p className="text-muted text-xs mt-1 leading-relaxed max-w-2xl">
                                              {child.description}
                                            </p>
                                          )}
                                        </div>
                                      </div>

                                      <a
                                        href={child.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center justify-center gap-1.5 px-4 py-2 border border-primary/20 bg-primary/5 hover:bg-primary text-primary hover:text-white rounded-xl text-xs font-semibold transition-all duration-300 self-start md:self-auto"
                                      >
                                        <BtnIcon className="w-3.5 h-3.5" />
                                        {childConfig.btnText}
                                      </a>
                                    </div>
                                  );
                                })}
                              </div>
                            ) : (
                              <p className="text-center py-6 text-muted text-sm">Ushbu modulda hozircha materiallar yo'q.</p>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ============================================
                2. MUSTAQIL RESURSLAR (ORPHANS)
                ============================================ */}
            <div>
              <div className="flex items-center gap-3 border-b border-border/40 pb-4 mb-6">
                <div className="p-2 bg-primary/10 rounded-xl text-primary">
                  <Folder className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl md:text-2xl font-bold text-foreground">
                    {modules.length > 0 ? "Mustaqil Materiallar" : "Barcha materiallar"}
                  </h2>
                  <p className="text-muted text-xs md:text-sm">Alohihda joylashtirilgan foydali resurslar va qo'shimcha havolalar.</p>
                </div>
              </div>

              {orphans.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {orphans.map((resource, index) => (
                    <ResourceCard
                      key={resource.id}
                      resource={resource}
                      index={index}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-white rounded-3xl border border-border/30">
                  <p className="text-muted text-sm">Hozircha mustaqil resurslar yo'q.</p>
                </div>
              )}
            </div>

            {/* Bo'sh holat */}
            {resources.length === 0 && (
              <div className="text-center py-16 bg-white rounded-3xl border border-border/30">
                <p className="text-muted text-lg">Hozircha foydali resurslar yuklanmagan.</p>
              </div>
            )}

          </div>
        )}

        {/* Qo'shimcha yordam */}
        <div className="mt-16 text-center bg-white rounded-3xl p-8 shadow-sm border border-border/30 max-w-4xl mx-auto">
          <h3 className="text-xl font-bold text-foreground mb-3">
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
