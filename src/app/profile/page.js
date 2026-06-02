/* ============================================
   PROFIL SAHIFASI (profile/page.js)
   ============================================
   Foydalanuvchi quyidagilarni ko'radi:
   - Avatar, ism, email, ro'yxatdan o'tilgan sana
   - O'ziga tegishli vazifalar (admin tomonidan yuborilgan)
   - O'ziga tegishli xabarlar (admin tomonidan yuborilgan)
   - Dars jadvali (barcha ro'yxatdan o'tganlar uchun umumiy)
   ============================================ */

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/useAuth";
import { supabase } from "@/lib/supabase";
import {
  LogOut,
  Mail,
  Calendar,
  User as UserIcon,
  ShieldCheck,
  Loader2,
  ClipboardList,
  MessageSquare,
  CalendarDays,
  CheckCircle,
  Clock,
  MapPin,
  ExternalLink,
  Inbox,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

// O'zbekcha oy nomlari (brauzer uz-UZ to'liq qo'llab-quvvatlamaydi)
const UZ_MONTHS = [
  "yanvar", "fevral", "mart", "aprel", "may", "iyun",
  "iyul", "avgust", "sentabr", "oktabr", "noyabr", "dekabr",
];

// Hafta kunlari (Dushanbadan boshlanadi)
const UZ_DAYS_SHORT = ["Dush", "Sesh", "Chor", "Pay", "Juma", "Shan", "Yak"];
const UZ_DAYS_FULL = [
  "Dushanba", "Seshanba", "Chorshanba", "Payshanba",
  "Juma", "Shanba", "Yakshanba",
];

const formatUzDate = (iso) => {
  if (!iso) return "—";
  const d = new Date(iso);
  return `${d.getDate()}-${UZ_MONTHS[d.getMonth()]}, ${d.getFullYear()}-yil`;
};

const formatUzDateTime = (iso) => {
  if (!iso) return "—";
  const d = new Date(iso);
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getDate()}-${UZ_MONTHS[d.getMonth()]}, ${d.getFullYear()} • ${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

// Vaqtni HH:MM formatda
const formatTime = (iso) => {
  if (!iso) return "";
  const d = new Date(iso);
  const pad = (n) => String(n).padStart(2, "0");
  return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

// Hafta boshini (dushanba) olish
const getWeekStart = (date) => {
  const d = new Date(date);
  const day = d.getDay(); // 0 = Yakshanba, 1 = Dushanba ...
  const diff = day === 0 ? -6 : 1 - day; // Dushanba bilan boshlash
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
};

// Ikki sananing kun-oy-yil bir xilligini tekshirish
const isSameDay = (a, b) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

export default function ProfilePage() {
  const router = useRouter();
  const { user, loading, signOut } = useAuth();

  // Foydalanuvchiga tegishli ma'lumotlar
  const [tasks, setTasks] = useState([]);
  const [messages, setMessages] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);

  // Tanlangan tab — "tasks" | "messages" | "lessons"
  const [activeTab, setActiveTab] = useState("tasks");

  // Dars jadvali uchun ko'rilayotgan hafta boshi (dushanba)
  const [weekStart, setWeekStart] = useState(() => getWeekStart(new Date()));

  // Foydalanuvchi kirmagan bo'lsa, login sahifasiga yo'naltirish
  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [user, loading, router]);

  // Foydalanuvchi ma'lumotlarini yuklash
  useEffect(() => {
    if (!user || !supabase) return;

    async function loadUserData() {
      setDataLoading(true);
      try {
        // Vazifalar: o'ziga tegishli + barchaga tegishli (user_id = null)
        const { data: tasksData } = await supabase
          .from("user_tasks")
          .select("*")
          .or(`user_id.eq.${user.id},user_id.is.null`)
          .order("created_at", { ascending: false });
        setTasks(tasksData || []);

        // Xabarlar: o'ziga tegishli + barchaga tegishli
        const { data: msgData } = await supabase
          .from("user_messages")
          .select("*")
          .or(`user_id.eq.${user.id},user_id.is.null`)
          .order("created_at", { ascending: false });
        setMessages(msgData || []);

        // Dars jadvali: hammaga umumiy (faqat kelgusi darslar)
        const { data: lessonData } = await supabase
          .from("lessons")
          .select("*")
          .order("scheduled_at", { ascending: true });
        setLessons(lessonData || []);
      } catch (err) {
        console.error("Ma'lumotlarni yuklashda xato:", err);
      } finally {
        setDataLoading(false);
      }
    }

    loadUserData();
  }, [user]);

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  // Vazifani bajarildi/bajarilmadi deb belgilash (faqat o'ziniki uchun)
  const toggleTaskComplete = async (task) => {
    if (!supabase) return;
    try {
      const { error } = await supabase
        .from("user_tasks")
        .update({ is_completed: !task.is_completed })
        .eq("id", task.id);
      if (error) throw error;
      setTasks((prev) =>
        prev.map((t) =>
          t.id === task.id ? { ...t, is_completed: !t.is_completed } : t
        )
      );
    } catch (err) {
      console.error("Vazifa holatini o'zgartirishda xato:", err);
    }
  };

  // Xabarni o'qildi deb belgilash
  const markMessageRead = async (msg) => {
    if (!supabase || msg.is_read) return;
    try {
      await supabase.from("user_messages").update({ is_read: true }).eq("id", msg.id);
      setMessages((prev) =>
        prev.map((m) => (m.id === msg.id ? { ...m, is_read: true } : m))
      );
    } catch (err) {
      console.error("Xabarni o'qildi deb belgilashda xato:", err);
    }
  };

  if (loading || !user) {
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
  const avatarUrl =
    user.user_metadata?.avatar_url || user.user_metadata?.picture;
  const email = user.email;
  const createdAt = formatUzDate(user.created_at);
  const initial = (fullName || email || "U").charAt(0).toUpperCase();

  // Statistikalar
  const unreadCount = messages.filter((m) => !m.is_read).length;
  const pendingTasks = tasks.filter((t) => !t.is_completed).length;
  const upcomingLessons = lessons.filter(
    (l) => new Date(l.scheduled_at) >= new Date()
  ).length;

  return (
    <div className="min-h-[80vh] py-12 px-4 bg-cream-dark/20">
      <div className="max-w-6xl mx-auto">
        {/* Sahifa sarlavhasi */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            Mening profilim
          </h1>
          <p className="text-muted text-sm">
            Vazifalaringiz, xabarlaringiz va dars jadvalini ko'ring
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* CHAP USTUN — Avatar va asosiy ma'lumotlar */}
          <div className="md:col-span-1 space-y-6">
            <div className="bg-white border border-border/80 rounded-3xl p-6 shadow-sm text-center">
              <div className="flex justify-center mb-4">
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt={fullName}
                    className="w-24 h-24 rounded-full object-cover border-4 border-primary/10"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-primary/10 text-primary flex items-center justify-center text-3xl font-bold border-4 border-primary/10">
                    {initial}
                  </div>
                )}
              </div>

              <h2 className="text-lg font-bold text-foreground mb-1">
                {fullName}
              </h2>
              <p className="text-xs text-muted break-all">{email}</p>

              <div className="mt-4 inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 text-xs font-medium px-3 py-1.5 rounded-full border border-emerald-200">
                <ShieldCheck className="w-3.5 h-3.5" />
                Google orqali tasdiqlangan
              </div>

              <button
                onClick={handleSignOut}
                className="mt-6 w-full inline-flex items-center justify-center gap-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-semibold py-3 px-4 rounded-2xl transition-all duration-300 text-sm cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                Tizimdan chiqish
              </button>
            </div>

            {/* Akkaunt ma'lumotlari */}
            <div className="bg-white border border-border/80 rounded-3xl p-6 shadow-sm">
              <h3 className="text-sm font-bold text-foreground mb-4 flex items-center gap-2">
                <UserIcon className="w-4 h-4 text-primary" />
                Akkaunt ma'lumotlari
              </h3>

              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-xs text-muted mb-0.5">To'liq ism</p>
                  <p className="text-foreground font-medium">{fullName}</p>
                </div>
                <div>
                  <p className="text-xs text-muted mb-0.5">Email</p>
                  <p className="text-foreground font-medium break-all">{email}</p>
                </div>
                <div>
                  <p className="text-xs text-muted mb-0.5">Ro'yxatdan o'tgan</p>
                  <p className="text-foreground font-medium">{createdAt}</p>
                </div>
              </div>
            </div>
          </div>

          {/* O'NG USTUN — Vazifalar, xabarlar, dars jadvali */}
          <div className="md:col-span-2 space-y-6">
            {/* Statistika kartochkalari */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-white border border-border/80 rounded-2xl p-4 text-center">
                <ClipboardList className="w-5 h-5 text-primary mx-auto mb-1.5" />
                <p className="text-2xl font-bold text-foreground">
                  {pendingTasks}
                </p>
                <p className="text-xs text-muted mt-1">Vazifa</p>
              </div>
              <div className="bg-white border border-border/80 rounded-2xl p-4 text-center">
                <MessageSquare className="w-5 h-5 text-accent mx-auto mb-1.5" />
                <p className="text-2xl font-bold text-foreground">
                  {unreadCount}
                </p>
                <p className="text-xs text-muted mt-1">Yangi xabar</p>
              </div>
              <div className="bg-white border border-border/80 rounded-2xl p-4 text-center">
                <CalendarDays className="w-5 h-5 text-emerald-600 mx-auto mb-1.5" />
                <p className="text-2xl font-bold text-foreground">
                  {upcomingLessons}
                </p>
                <p className="text-xs text-muted mt-1">Kelgusi dars</p>
              </div>
            </div>

            {/* Tab tugmalari */}
            <div className="bg-white border border-border/80 rounded-3xl shadow-sm overflow-hidden">
              <div className="flex border-b border-border/60 overflow-x-auto">
                <button
                  onClick={() => setActiveTab("tasks")}
                  className={`flex items-center gap-2 px-5 py-4 text-sm font-semibold whitespace-nowrap transition-all border-b-2 cursor-pointer ${
                    activeTab === "tasks"
                      ? "border-primary text-primary"
                      : "border-transparent text-muted hover:text-foreground"
                  }`}
                >
                  <ClipboardList className="w-4 h-4" />
                  Vazifalar
                  {pendingTasks > 0 && (
                    <span className="ml-1 px-2 py-0.5 bg-primary text-white text-xs rounded-full">
                      {pendingTasks}
                    </span>
                  )}
                </button>
                <button
                  onClick={() => setActiveTab("messages")}
                  className={`flex items-center gap-2 px-5 py-4 text-sm font-semibold whitespace-nowrap transition-all border-b-2 cursor-pointer ${
                    activeTab === "messages"
                      ? "border-primary text-primary"
                      : "border-transparent text-muted hover:text-foreground"
                  }`}
                >
                  <MessageSquare className="w-4 h-4" />
                  Xabarlar
                  {unreadCount > 0 && (
                    <span className="ml-1 px-2 py-0.5 bg-accent text-white text-xs rounded-full">
                      {unreadCount}
                    </span>
                  )}
                </button>
                <button
                  onClick={() => setActiveTab("lessons")}
                  className={`flex items-center gap-2 px-5 py-4 text-sm font-semibold whitespace-nowrap transition-all border-b-2 cursor-pointer ${
                    activeTab === "lessons"
                      ? "border-primary text-primary"
                      : "border-transparent text-muted hover:text-foreground"
                  }`}
                >
                  <CalendarDays className="w-4 h-4" />
                  Dars jadvali
                </button>
              </div>

              {/* Tab kontentlari */}
              <div className="p-6">
                {dataLoading ? (
                  <div className="py-12 flex justify-center">
                    <Loader2 className="w-6 h-6 text-primary animate-spin" />
                  </div>
                ) : (
                  <>
                    {/* VAZIFALAR */}
                    {activeTab === "tasks" && (
                      <div className="space-y-3">
                        {tasks.length === 0 ? (
                          <div className="py-12 text-center">
                            <Inbox className="w-12 h-12 text-muted/40 mx-auto mb-3" />
                            <p className="text-sm text-muted">
                              Hozircha vazifa yuborilmagan
                            </p>
                          </div>
                        ) : (
                          tasks.map((t) => (
                            <div
                              key={t.id}
                              className={`p-4 rounded-2xl border transition-all ${
                                t.is_completed
                                  ? "bg-emerald-50/50 border-emerald-200"
                                  : "bg-cream-dark/30 border-border/60"
                              }`}
                            >
                              <div className="flex items-start gap-3">
                                <button
                                  onClick={() => toggleTaskComplete(t)}
                                  className="mt-0.5 cursor-pointer"
                                  title={
                                    t.is_completed
                                      ? "Bajarilmadi deb belgilash"
                                      : "Bajarildi deb belgilash"
                                  }
                                >
                                  {t.is_completed ? (
                                    <CheckCircle className="w-5 h-5 text-emerald-600" />
                                  ) : (
                                    <div className="w-5 h-5 rounded-full border-2 border-muted/40 hover:border-primary transition-colors" />
                                  )}
                                </button>
                                <div className="flex-1 min-w-0">
                                  <h4
                                    className={`font-bold text-sm ${
                                      t.is_completed
                                        ? "text-muted line-through"
                                        : "text-foreground"
                                    }`}
                                  >
                                    {t.title}
                                  </h4>
                                  {t.description && (
                                    <p className="text-xs text-muted mt-1">
                                      {t.description}
                                    </p>
                                  )}
                                  <div className="flex items-center gap-3 mt-2 text-xs text-muted">
                                    {t.due_date && (
                                      <span className="inline-flex items-center gap-1">
                                        <Calendar className="w-3 h-3" />
                                        Muddat: {formatUzDate(t.due_date)}
                                      </span>
                                    )}
                                    {!t.user_id && (
                                      <span className="bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">
                                        Umumiy vazifa
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    )}

                    {/* XABARLAR */}
                    {activeTab === "messages" && (
                      <div className="space-y-3">
                        {messages.length === 0 ? (
                          <div className="py-12 text-center">
                            <Inbox className="w-12 h-12 text-muted/40 mx-auto mb-3" />
                            <p className="text-sm text-muted">
                              Hozircha xabar yo'q
                            </p>
                          </div>
                        ) : (
                          messages.map((m) => (
                            <div
                              key={m.id}
                              onClick={() => markMessageRead(m)}
                              className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                                !m.is_read
                                  ? "bg-accent/5 border-accent/30 hover:border-accent/50"
                                  : "bg-cream-dark/30 border-border/60"
                              }`}
                            >
                              <div className="flex items-start gap-3">
                                <div
                                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                                    !m.is_read
                                      ? "bg-accent/20 text-accent"
                                      : "bg-muted/10 text-muted"
                                  }`}
                                >
                                  <Mail className="w-5 h-5" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 flex-wrap mb-1">
                                    <h4
                                      className={`font-bold text-sm ${
                                        !m.is_read
                                          ? "text-foreground"
                                          : "text-muted"
                                      }`}
                                    >
                                      {m.subject}
                                    </h4>
                                    {!m.is_read && (
                                      <span className="bg-accent text-white text-xs px-2 py-0.5 rounded-full font-medium">
                                        Yangi
                                      </span>
                                    )}
                                    {!m.user_id && (
                                      <span className="bg-primary/10 text-primary px-2 py-0.5 rounded-full text-xs font-medium">
                                        Umumiy
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-sm text-muted whitespace-pre-wrap">
                                    {m.body}
                                  </p>
                                  <p className="text-xs text-muted/60 mt-2">
                                    {formatUzDateTime(m.created_at)}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    )}

                    {/* DARS JADVALI — HAFTALIK KALENDAR */}
                    {activeTab === "lessons" && (() => {
                      // Haftadagi 7 kunni hisoblash (dushanba — yakshanba)
                      const weekDays = Array.from({ length: 7 }, (_, i) => {
                        const d = new Date(weekStart);
                        d.setDate(d.getDate() + i);
                        return d;
                      });

                      // Berilgan kunga tegishli darslarni topish va vaqti bo'yicha
                      // tartiblash
                      const lessonsForDay = (date) =>
                        lessons
                          .filter((l) =>
                            isSameDay(new Date(l.scheduled_at), date)
                          )
                          .sort(
                            (a, b) =>
                              new Date(a.scheduled_at) -
                              new Date(b.scheduled_at)
                          );

                      // Hafta navigatsiyasi
                      const prevWeek = () => {
                        const d = new Date(weekStart);
                        d.setDate(d.getDate() - 7);
                        setWeekStart(d);
                      };
                      const nextWeek = () => {
                        const d = new Date(weekStart);
                        d.setDate(d.getDate() + 7);
                        setWeekStart(d);
                      };
                      const thisWeek = () => setWeekStart(getWeekStart(new Date()));

                      // Hafta sarlavhasi (1-iyun — 7-iyun, 2026-yil)
                      const weekEnd = weekDays[6];
                      const sameMonth =
                        weekStart.getMonth() === weekEnd.getMonth();
                      const weekTitle = sameMonth
                        ? `${weekStart.getDate()} — ${weekEnd.getDate()}-${UZ_MONTHS[weekEnd.getMonth()]}, ${weekEnd.getFullYear()}-yil`
                        : `${weekStart.getDate()}-${UZ_MONTHS[weekStart.getMonth()]} — ${weekEnd.getDate()}-${UZ_MONTHS[weekEnd.getMonth()]}, ${weekEnd.getFullYear()}-yil`;

                      const today = new Date();
                      const totalThisWeek = weekDays.reduce(
                        (sum, d) => sum + lessonsForDay(d).length,
                        0
                      );

                      return (
                        <div>
                          {/* Hafta navigatsiyasi */}
                          <div className="flex items-center justify-between gap-2 mb-5">
                            <button
                              onClick={prevWeek}
                              className="p-2 text-muted hover:text-primary hover:bg-primary/5 rounded-xl transition-colors cursor-pointer"
                              title="Oldingi hafta"
                            >
                              <ChevronLeft className="w-5 h-5" />
                            </button>
                            <div className="flex-1 text-center">
                              <p className="text-sm font-bold text-foreground">
                                {weekTitle}
                              </p>
                              <button
                                onClick={thisWeek}
                                className="text-xs text-primary hover:underline mt-0.5"
                              >
                                Joriy haftaga qaytish
                              </button>
                            </div>
                            <button
                              onClick={nextWeek}
                              className="p-2 text-muted hover:text-primary hover:bg-primary/5 rounded-xl transition-colors cursor-pointer"
                              title="Keyingi hafta"
                            >
                              <ChevronRight className="w-5 h-5" />
                            </button>
                          </div>

                          {/* Agar umuman dars bo'lmasa */}
                          {lessons.length === 0 ? (
                            <div className="py-12 text-center">
                              <CalendarDays className="w-12 h-12 text-muted/40 mx-auto mb-3" />
                              <p className="text-sm text-muted">
                                Hozircha dars jadvali e'lon qilinmagan
                              </p>
                            </div>
                          ) : (
                            <>
                              {/* 7 kunlik kalendar grid */}
                              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
                                {weekDays.map((day, idx) => {
                                  const dayLessons = lessonsForDay(day);
                                  const isToday = isSameDay(day, today);
                                  const hasLessons = dayLessons.length > 0;

                                  return (
                                    <div
                                      key={idx}
                                      className={`rounded-2xl border p-3 min-h-[140px] flex flex-col transition-all ${
                                        isToday
                                          ? "border-primary bg-primary/5"
                                          : hasLessons
                                          ? "border-primary/20 bg-white hover:border-primary/40"
                                          : "border-border/40 bg-cream-dark/20"
                                      }`}
                                    >
                                      {/* Kun sarlavhasi */}
                                      <div className="text-center pb-2 mb-2 border-b border-border/40">
                                        <p
                                          className={`text-[10px] font-semibold uppercase tracking-wide ${
                                            isToday
                                              ? "text-primary"
                                              : "text-muted"
                                          }`}
                                        >
                                          {UZ_DAYS_SHORT[idx]}
                                        </p>
                                        <p
                                          className={`text-xl font-bold mt-0.5 ${
                                            isToday
                                              ? "text-primary"
                                              : hasLessons
                                              ? "text-foreground"
                                              : "text-muted/50"
                                          }`}
                                        >
                                          {day.getDate()}
                                        </p>
                                        <p className="text-[10px] text-muted/70">
                                          {UZ_MONTHS[day.getMonth()].slice(0, 3)}
                                        </p>
                                      </div>

                                      {/* Kun darslari */}
                                      <div className="flex-1 space-y-1.5">
                                        {hasLessons ? (
                                          dayLessons.map((l) => {
                                            const isPast =
                                              new Date(l.scheduled_at) <
                                              new Date();
                                            return (
                                              <div
                                                key={l.id}
                                                className={`p-2 rounded-lg text-xs border-l-2 ${
                                                  isPast
                                                    ? "bg-muted/5 border-muted/40 opacity-60"
                                                    : "bg-primary/5 border-primary"
                                                }`}
                                              >
                                                <div className="flex items-center gap-1 text-primary font-bold mb-0.5">
                                                  <Clock className="w-3 h-3" />
                                                  {formatTime(l.scheduled_at)}
                                                </div>
                                                <p className="font-semibold text-foreground line-clamp-2 leading-snug">
                                                  {l.title}
                                                </p>
                                                <p className="text-muted text-[10px] mt-0.5">
                                                  {l.duration_minutes} daq.
                                                </p>
                                              </div>
                                            );
                                          })
                                        ) : (
                                          <div className="flex items-center justify-center h-full text-muted/40 text-[10px]">
                                            Dars yo'q
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>

                              {/* Haftalik xulosa */}
                              <div className="mt-4 flex items-center justify-between text-xs text-muted bg-cream-dark/40 px-4 py-2.5 rounded-2xl">
                                <span>Bu haftada jami darslar:</span>
                                <span className="font-bold text-primary text-sm">
                                  {totalThisWeek} ta
                                </span>
                              </div>

                              {/* Tanlangan haftadagi darslar batafsil (faqat darslar bo'lsa) */}
                              {totalThisWeek > 0 && (
                                <div className="mt-6">
                                  <h3 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
                                    <CalendarDays className="w-4 h-4 text-primary" />
                                    Bu haftadagi darslar batafsil
                                  </h3>
                                  <div className="space-y-2">
                                    {weekDays.flatMap((day, dayIdx) =>
                                      lessonsForDay(day).map((l) => {
                                        const isPast =
                                          new Date(l.scheduled_at) < new Date();
                                        return (
                                          <div
                                            key={l.id}
                                            className={`p-4 rounded-2xl border ${
                                              isPast
                                                ? "bg-muted/5 border-border/40 opacity-70"
                                                : "bg-white border-primary/20 hover:border-primary/40"
                                            } transition-all`}
                                          >
                                            <div className="flex items-start gap-3">
                                              <div className="bg-primary/10 text-primary rounded-xl w-12 h-12 flex flex-col items-center justify-center shrink-0">
                                                <span className="text-[10px] font-semibold uppercase">
                                                  {UZ_DAYS_SHORT[dayIdx]}
                                                </span>
                                                <span className="text-base font-bold leading-none">
                                                  {day.getDate()}
                                                </span>
                                              </div>
                                              <div className="flex-1 min-w-0">
                                                <h4 className="font-bold text-sm text-foreground">
                                                  {l.title}
                                                </h4>
                                                {l.description && (
                                                  <p className="text-xs text-muted mt-1">
                                                    {l.description}
                                                  </p>
                                                )}
                                                <div className="flex flex-wrap gap-3 mt-2 text-xs">
                                                  <span className="inline-flex items-center gap-1 text-foreground font-medium">
                                                    <Clock className="w-3 h-3 text-primary" />
                                                    {formatTime(l.scheduled_at)} ({l.duration_minutes} daq.)
                                                  </span>
                                                  {l.location && (
                                                    <span className="inline-flex items-center gap-1 text-muted">
                                                      <MapPin className="w-3 h-3" />
                                                      {l.location}
                                                    </span>
                                                  )}
                                                </div>
                                                {l.meeting_link && !isPast && (
                                                  <a
                                                    href={l.meeting_link}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="mt-2 inline-flex items-center gap-1.5 bg-primary hover:bg-primary-dark text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors"
                                                  >
                                                    Darsga qo'shilish
                                                    <ExternalLink className="w-3 h-3" />
                                                  </a>
                                                )}
                                              </div>
                                            </div>
                                          </div>
                                        );
                                      })
                                    )}
                                  </div>
                                </div>
                              )}
                            </>
                          )}
                        </div>
                      );
                    })()}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
