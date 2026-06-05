/* ============================================
   DASHBOARD QOBIG'I (DashboardShell.js)
   ============================================
   Google orqali kirgan foydalanuvchilar uchun
   ilova ko'rinishidagi qobiq (app shell):
   - Chap tomonda yon menyu (sidebar)
   - Mobil qurilmalarda burger menyu (drawer)
   - Yuqorida foydalanuvchi va chiqish tugmasi

   Bu qobiq oddiy "landing page" navbar o'rniga
   faqat dashboard sahifalarida ishlatiladi.
   ============================================ */

"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/lib/useAuth";
import {
  LayoutDashboard,
  Sparkles,
  FolderOpen,
  ClipboardCheck,
  BookOpen,
  UserCircle,
  LogOut,
  Menu,
  X,
  Home,
  Loader2,
} from "lucide-react";

// Yon menyu havolalari
const NAV_ITEMS = [
  { name: "Boshqaruv paneli", href: "/dashboard", icon: LayoutDashboard },
  { name: "Promptlar", href: "/prompts", icon: Sparkles },
  { name: "Foydali resurslar", href: "/resources", icon: FolderOpen },
  { name: "Bilim testlari", href: "/test", icon: ClipboardCheck },
  { name: "Maqolalar", href: "/prompt-engineering", icon: BookOpen },
  { name: "Mening profilim", href: "/profile", icon: UserCircle },
];

export default function DashboardShell({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading, signOut } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Sessiya tekshirilyapti
  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  // Kirmagan foydalanuvchi — sahifaning o'zi /login'ga yo'naltiradi.
  // Qobiqsiz (sidebar ko'rsatmasdan) faqat kontentni qaytaramiz.
  if (!user) {
    return <div className="flex-1">{children}</div>;
  }

  const fullName =
    user.user_metadata?.full_name ||
    user.user_metadata?.name ||
    user.email ||
    "Foydalanuvchi";
  const avatarUrl =
    user.user_metadata?.avatar_url || user.user_metadata?.picture;
  const initial = (fullName || "U").charAt(0).toUpperCase();

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  const isActive = (href) =>
    pathname === href || pathname.startsWith(href + "/");

  // Yon menyu tarkibi (desktop va mobil drawer'da qayta ishlatiladi)
  const SidebarContent = ({ onNavigate }) => (
    <div className="flex flex-col h-full">
      {/* Brend */}
      <div className="flex items-center gap-2 px-5 h-16 border-b border-border/50 shrink-0">
        <Link
          href="/dashboard"
          onClick={onNavigate}
          className="flex items-center gap-2 group"
        >
          <img
            src="/images/logo_icon.png"
            alt="Coda Academy"
            className="w-8 h-8 object-contain"
          />
          <span className="text-base font-bold text-foreground">
            Coda Academy
          </span>
        </Link>
      </div>

      {/* Navigatsiya havolalari */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-2xl text-sm font-medium transition-all duration-200 ${
                active
                  ? "bg-primary text-white shadow-sm shadow-primary/20"
                  : "text-muted hover:text-foreground hover:bg-cream-dark"
              }`}
            >
              <Icon className="w-5 h-5 shrink-0" />
              {item.name}
            </Link>
          );
        })}

        {/* Bosh sahifaga qaytish */}
        <Link
          href="/"
          onClick={onNavigate}
          className="flex items-center gap-3 px-3 py-2.5 rounded-2xl text-sm font-medium text-muted hover:text-foreground hover:bg-cream-dark transition-all duration-200 mt-2"
        >
          <Home className="w-5 h-5 shrink-0" />
          Bosh sahifa
        </Link>
      </nav>

      {/* Foydalanuvchi + chiqish */}
      <div className="border-t border-border/50 p-3 shrink-0">
        <div className="flex items-center gap-3 px-2 py-2 mb-1">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={fullName}
              className="w-9 h-9 rounded-full object-cover border border-border shrink-0"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-bold shrink-0">
              {initial}
            </div>
          )}
          <div className="min-w-0">
            <p className="text-sm font-semibold text-foreground truncate">
              {fullName}
            </p>
            <p className="text-xs text-muted truncate">{user.email}</p>
          </div>
        </div>
        <button
          onClick={handleSignOut}
          className="w-full inline-flex items-center gap-2 px-3 py-2.5 rounded-2xl text-sm font-medium text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
        >
          <LogOut className="w-5 h-5 shrink-0" />
          Tizimdan chiqish
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex-1 flex bg-cream-dark/20">
      {/* ============================================
          DESKTOP YON MENYU (doimiy)
          ============================================ */}
      <aside className="hidden lg:flex w-64 shrink-0 flex-col bg-white border-r border-border/50 sticky top-0 h-screen">
        <SidebarContent />
      </aside>

      {/* ============================================
          MOBIL DRAWER (burger menyu)
          ============================================ */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          {/* Qoraytirilgan fon (overlay) */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          {/* Drawer paneli */}
          <aside className="relative w-72 max-w-[80%] bg-white h-full shadow-xl animate-slide-in-left flex flex-col">
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-xl text-muted hover:text-foreground hover:bg-cream-dark transition-colors"
              aria-label="Menyuni yopish"
            >
              <X className="w-5 h-5" />
            </button>
            <SidebarContent onNavigate={() => setMobileOpen(false)} />
          </aside>
        </div>
      )}

      {/* ============================================
          ASOSIY KONTENT
          ============================================ */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobil yuqori panel — burger tugmasi */}
        <div className="lg:hidden sticky top-0 z-40 flex items-center justify-between h-16 px-4 bg-white/90 backdrop-blur-lg border-b border-border/50">
          <button
            onClick={() => setMobileOpen(true)}
            className="p-2 rounded-xl text-muted hover:text-foreground hover:bg-cream-dark transition-colors"
            aria-label="Menyuni ochish"
          >
            <Menu className="w-6 h-6" />
          </button>
          <Link href="/dashboard" className="flex items-center gap-2">
            <img
              src="/images/logo_icon.png"
              alt="Coda Academy"
              className="w-7 h-7 object-contain"
            />
            <span className="text-sm font-bold text-foreground">
              Coda Academy
            </span>
          </Link>
          {/* Avatar (o'ng tomonni muvozanatlash uchun) */}
          <Link href="/profile" className="shrink-0">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={fullName}
                className="w-8 h-8 rounded-full object-cover border border-border"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-bold">
                {initial}
              </div>
            )}
          </Link>
        </div>

        {/* Sahifa kontenti */}
        <main className="flex-1 min-w-0">{children}</main>
      </div>
    </div>
  );
}
