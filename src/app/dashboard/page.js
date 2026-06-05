/* ============================================
   BOSHQARUV PANELI / DASHBOARD (dashboard/page.js)
   ============================================
   Google orqali ro'yxatdan o'tgan foydalanuvchilar
   uchun ta'lim platformasining asosiy boshqaruv
   paneli (dashboard). Kirgandan so'ng birinchi shu
   sahifa ochiladi.

   Tarkibi:
   - Xush kelibsiz banneri (avatar + ism)
   - Tezkor statistika (vazifalar, xabarlar, darslar)
   - Eng yaqin dars (agar bo'lsa)
   - Platforma bo'limlariga tezkor o'tish kartalari
   ============================================ */

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/useAuth";
import { supabase } from "@/lib/supabase";
import {
  Loader2,
  ClipboardList,
  MessageSquare,
  CalendarDays,
  Clock,
  MapPin,
  ExternalLink,
  Sparkles,
  FolderOpen,
  ClipboardCheck,
  BookOpen,
  UserCircle,
  ArrowRight,
} from "lucide-react";

// O'zbekcha oy nomlari
const UZ_MONTHS = [
  "yanvar", "fevral", "mart", "aprel", "may", "iyun",
  "iyul", "avgust", "sentabr", "oktabr", "noyabr", "dekabr",
];

const formatUzDateTime = (iso) => {
  if (!iso) return "—";
  const d = new Date(iso);
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getDate()}-${UZ_MONTHS[d.getMonth()]}, ${d.getFullYear()} • ${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

// Platforma bo'limlari (tezkor o'tish kartalari)
const SECTIONS = [
  {
    title: "Promptlar",
    description: "Tayyor sun'iy intellekt shablonlari kutubxonasi",
    href: "/prompts",
    icon: Sparkles,
    color: "text-violet-600 bg-violet-50",
  },
  {
    title: "Foydali resurslar",
    description: "O'quv modullari, PDF, video va havolalar",
    href: "/resources",
    icon: FolderOpen,
    color: "text-emerald-600 bg-emerald-50",
  },
  {
    title: "Bilim testlari",
    description: "O'zingizni sinab ko'ring va ball to'plang",
    href: "/test",
    icon: ClipboardCheck,
    color: "text-amber-600 bg-amber-50",
  },
  {
    title: "Maqolalar",
    description: "Prompt-engineering bo'yicha qo'llanmalar",
    href: "/prompt-engineering",
    icon: BookOpen,
    color: "text-sky-600 bg-sky-50",
  },
  {
    title: "Mening profilim",
    description: "Vazifalar, xabarlar va dars jadvali",
    href: "/profile",
    icon: UserCircle,
    color: "text-rose-600 bg-rose-50",
  },
];

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [tasks, setTasks] = useState([]);
  const [messages, setMessages] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);

  // Kirmagan foydalanuvchini login sahifasiga yo'naltirish
  useEffect(() => {
    if (!authLoading && !user) {
      router.replace("/login");
    }
  }, [user, authLoading, router]);

  // Foydalanuvchi ma'lumotlarini yuklash (profil bilan bir xil manbalar)
  useEffect(() => {
    if (!user || !supabase) {
      setDataLoading(false);
      return;
    }

    async function loadData() {
      setDataLoading(true);
      try {
        const { data: tasksData } = await supabase
          .from("user_tasks")
          .select("*")
          .or(`user_id.eq.${user.id},user_id.is.null`)
          .order("created_at", { ascending: false });
        setTasks(tasksData || []);

        const { data: msgData } = await supabase
          .from("user_messages")
          .select("*")
          .or(`user_id.eq.${user.id},user_id.is.null`)
          .order("created_at", { ascending: false });
        setMessages(msgData || []);

        const { data: lessonData } = await supabase
          .from("lessons")
          .select("*")
          .order("scheduled_at", { ascending: true });
        setLessons(lessonData || []);
      } catch (err) {
        console.error("Dashboard ma'lumotlarini yuklashda xato:", err);
      } finally {
        setDataLoading(false);
      }
    }

    loadData();
  }, [user]);

  // Sessiya tekshirilayotgan yoki kirmagan foydalanuvchi uchun yuklanish
  if (authLoading || !user) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  const fullName =
    user.user_metadata?.full_name ||
    user.user_metadata?.name ||
    "Foydalanuvchi";
  const firstName = fullName.split(" ").slice(-1)[0] || fullName;
  const avatarUrl =
    user.user_metadata?.avatar_url || user.user_metadata?.picture;
  const initial = (fullName || user.email || "U").charAt(0).toUpperCase();

  // Statistikalar
  const pendingTasks = tasks.filter((t) => !t.is_completed).length;
  const unreadCount = messages.filter((m) => !m.is_read).length;
  const upcomingLessons = lessons
    .filter((l) => new Date(l.scheduled_at) >= new Date())
    .sort((a, b) => new Date(a.scheduled_at) - new Date(b.scheduled_at));
  const nextLesson = upcomingLessons[0] || null;

  const stats = [
    {
      label: "Bajarilmagan vazifa",
      value: pendingTasks,
      icon: ClipboardList,
      color: "text-primary bg-primary/10",
    },
    {
      label: "Yangi xabar",
      value: unreadCount,
      icon: MessageSquare,
      color: "text-accent bg-accent/10",
    },
    {
      label: "Kelgusi dars",
      value: upcomingLessons.length,
      icon: CalendarDays,
      color: "text-emerald-600 bg-emerald-50",
    },
  ];

  return (
    <div className="min-h-[85vh] py-10 md:py-12 px-4 bg-cream-dark/20">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* ============================================
            XUSH KELIBSIZ BANNERI
            ============================================ */}
        <div className="relative overflow-hidden bg-gradient-to-br from-primary to-primary-dark rounded-3xl p-7 md:p-9 shadow-xl shadow-primary/20">
          <div className="absolute -top-16 -right-10 w-48 h-48 bg-white/10 rounded-full blur-2xl" />
          <div className="absolute -bottom-20 -left-10 w-48 h-48 bg-white/5 rounded-full blur-2xl" />
          <div className="relative flex items-center gap-5">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={fullName}
                className="w-16 h-16 md:w-20 md:h-20 rounded-2xl object-cover border-2 border-white/30 shrink-0"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-white/20 text-white flex items-center justify-center text-2xl md:text-3xl font-bold border-2 border-white/30 shrink-0">
                {initial}
              </div>
            )}
            <div className="text-white">
              <p className="text-white/80 text-sm font-medium mb-0.5">
                Xush kelibsiz 👋
              </p>
              <h1 className="text-2xl md:text-3xl font-bold leading-tight">
                {firstName}
              </h1>
              <p className="text-white/80 text-xs md:text-sm mt-1">
                Coda Academy ta'lim platformasi boshqaruv paneli
              </p>
            </div>
          </div>
        </div>

        {/* ============================================
            TEZKOR STATISTIKA
            ============================================ */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {stats.map((s) => {
            const Icon = s.icon;
            return (
              <div
                key={s.label}
                className="bg-white border border-border/60 rounded-3xl p-5 shadow-sm flex items-center gap-4"
              >
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${s.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  {dataLoading ? (
                    <Loader2 className="w-5 h-5 text-muted/50 animate-spin" />
                  ) : (
                    <p className="text-2xl font-bold text-foreground leading-none">
                      {s.value}
                    </p>
                  )}
                  <p className="text-xs text-muted mt-1.5">{s.label}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* ============================================
            ENG YAQIN DARS
            ============================================ */}
        {!dataLoading && nextLesson && (
          <div className="bg-white border border-primary/20 rounded-3xl p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <CalendarDays className="w-5 h-5 text-primary" />
              <h2 className="text-base font-bold text-foreground">
                Eng yaqin dars
              </h2>
            </div>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-foreground">{nextLesson.title}</h3>
                {nextLesson.description && (
                  <p className="text-sm text-muted mt-1">
                    {nextLesson.description}
                  </p>
                )}
                <div className="flex flex-wrap gap-4 mt-3 text-xs text-muted">
                  <span className="inline-flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-primary" />
                    {formatUzDateTime(nextLesson.scheduled_at)}
                    {nextLesson.duration_minutes
                      ? ` (${nextLesson.duration_minutes} daq.)`
                      : ""}
                  </span>
                  {nextLesson.location && (
                    <span className="inline-flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5" />
                      {nextLesson.location}
                    </span>
                  )}
                </div>
              </div>
              {nextLesson.meeting_link && (
                <a
                  href={nextLesson.meeting_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-1.5 bg-primary hover:bg-primary-dark text-white text-sm font-semibold px-4 py-2.5 rounded-2xl transition-colors shrink-0"
                >
                  Darsga qo'shilish
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>
        )}

        {/* ============================================
            PLATFORMA BO'LIMLARI (TEZKOR O'TISH)
            ============================================ */}
        <div>
          <h2 className="text-lg font-bold text-foreground mb-4">
            Platforma bo'limlari
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {SECTIONS.map((section) => {
              const Icon = section.icon;
              return (
                <Link
                  key={section.href}
                  href={section.href}
                  className="group bg-white border border-border/60 rounded-3xl p-6 shadow-sm hover:shadow-md hover:border-primary/30 transition-all duration-300"
                >
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${section.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-foreground group-hover:text-primary transition-colors">
                    {section.title}
                  </h3>
                  <p className="text-sm text-muted mt-1 leading-relaxed">
                    {section.description}
                  </p>
                  <div className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary">
                    Ochish
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
