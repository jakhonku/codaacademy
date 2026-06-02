/* ============================================
   NAVIGATSIYA PANELI (Navbar.js)
   ============================================
   Bu komponent sahifaning yuqori qismida ko'rinadigan
   navigatsiya paneli (menyu). U barcha sahifalarda
   ko'rinadi (layout.js orqali).
   
   "use client" — bu komponent brauzerda ishlaydi
   (client component), chunki biz useState va 
   usePathname hook'larini ishlatamiz.
   ============================================ */

"use client";

// React'dan useState hook'ini import qilish — menyu holatini boshqarish uchun
import { useState } from "react";

// Next.js'dan Link komponentini import qilish — sahifalar orasida ko'chish uchun
import Link from "next/link";

// Next.js'dan usePathname hook'ini import qilish — hozirgi sahifani aniqlash uchun
import { usePathname } from "next/navigation";

// Lucide ikonkalarini import qilish
import {
  Menu,       // Hamburger menyu ikonkasi (mobil uchun)
  X,          // Yopish ikonkasi (X belgisi)
  LogIn,      // Kirish tugmasi ikonkasi
  User,       // Profil ikonkasi (avatar bo'lmasa)
} from "lucide-react";

// Auth hook'ini import qilish — foydalanuvchi holatini olish uchun
import { useAuth } from "@/lib/useAuth";

export default function Navbar() {
  /* Foydalanuvchi holatini olish — Supabase Auth'dan */
  const { user, loading } = useAuth();
  /* ============================================
     HOLAT BOSHQARUVI (State Management)
     ============================================
     isMobileMenuOpen — mobil menyuning ochiq/yopiq
     holati. true = ochiq, false = yopiq.
     ============================================ */
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  /* Hozirgi sahifa yo'lini olish (masalan: "/lessons") */
  const pathname = usePathname();

  /* ============================================
     MENYU ELEMENTLARI
     ============================================
     Har bir element — bitta havola.
     name: Ko'rinadigan nomi
     href: Sahifa manzili
     ============================================ */
  const menuItems = [
    { name: "Bosh sahifa", href: "/" },
    { name: "Promptlar", href: "/prompts" },
    { name: "Resurslar", href: "/resources" },
    { name: "Maqolalar", href: "/prompt-engineering" },
    { name: "Testlar", href: "/test" },
  ];

  return (
    /* ============================================
       NAVIGATSIYA PANELI TASHQI KONTEYNER
       ============================================
       - sticky top-0: sahifa skroll qilinganda ham yuqorida qoladi
       - z-50: boshqa elementlar ustida turadi
       - bg-white/80 backdrop-blur: shaffof fon + xiralashtirish effekti
       ============================================ */
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-border/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          {/* ============================================
              LOGO QISMI
              ============================================
              Logoni bosganda bosh sahifaga qaytadi.
              ============================================ */}
          <Link href="/" className="flex items-center gap-2 group">
            {/* Coda Academy Logo Icon */}
            <img 
              src="/images/logo_icon.png" 
              alt="Coda Academy Logo" 
              className="w-8 h-8 object-contain transition-transform duration-300 group-hover:scale-110"
            />
            {/* Sayt nomi */}
            <span className="text-lg font-bold text-foreground">
              Coda Academy
            </span>
          </Link>

          {/* ============================================
              DESKTOP MENYU (katta ekranlar uchun)
              ============================================
              md: — faqat o'rta va katta ekranlarda ko'rinadi.
              Kichik ekranlarda yashirinadi.
              ============================================ */}
          <div className="hidden md:flex items-center gap-1">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  px-4 py-2 rounded-xl text-sm font-medium
                  transition-all duration-300
                  ${
                    /* Agar hozirgi sahifa shu havola bilan mos kelsa,
                       uni ajratib ko'rsatish (aktiv holat) */
                    pathname === item.href
                      ? "bg-primary/10 text-primary"
                      : "text-muted hover:text-foreground hover:bg-cream-dark"
                  }
                `}
              >
                {item.name}
              </Link>
            ))}

            {/* ============================================
                FOYDALANUVCHI / KIRISH TUGMASI (DESKTOP)
                ============================================
                Agar foydalanuvchi kirgan bo'lsa, avatar va
                ismni profil havolasi sifatida ko'rsatamiz.
                Aks holda — "Kirish" tugmasini chiqaramiz.
                ============================================ */}
            {!loading && (
              user ? (
                <Link
                  href="/profile"
                  className={`
                    ml-2 inline-flex items-center gap-2 px-3 py-1.5 rounded-xl
                    text-sm font-medium transition-all duration-300
                    ${
                      pathname === "/profile"
                        ? "bg-primary/10 text-primary"
                        : "text-foreground hover:bg-cream-dark"
                    }
                  `}
                >
                  {user.user_metadata?.avatar_url ? (
                    <img
                      src={user.user_metadata.avatar_url}
                      alt="Profil"
                      className="w-7 h-7 rounded-full object-cover border border-border"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                      <User className="w-4 h-4" />
                    </div>
                  )}
                  <span className="hidden lg:inline max-w-[120px] truncate">
                    {user.user_metadata?.full_name ||
                      user.user_metadata?.name ||
                      user.email}
                  </span>
                </Link>
              ) : (
                <Link
                  href="/login"
                  className="ml-2 inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 hover:shadow-md hover:shadow-primary/20"
                >
                  <LogIn className="w-4 h-4" />
                  Kirish
                </Link>
              )
            )}
          </div>

          {/* ============================================
              MOBIL MENYU TUGMASI (kichik ekranlar uchun)
              ============================================
              md:hidden — faqat kichik ekranlarda ko'rinadi.
              Bosganda menyu ochiladi yoki yopiladi.
              ============================================ */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-xl text-muted hover:text-foreground hover:bg-cream-dark transition-colors"
            /* aria-label — ekran o'quvchilar uchun (accessibility) */
            aria-label="Menyuni ochish"
          >
            {/* Menyu ochiq bo'lsa X, yopiq bo'lsa hamburger ikonkasi */}
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* ============================================
          MOBIL MENYU PANELI
          ============================================
          Faqat isMobileMenuOpen === true bo'lganda ko'rinadi.
          Yuqoridan pastga ochiladi.
          ============================================ */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-border/50 bg-white/95 backdrop-blur-lg">
          <div className="px-4 py-3 space-y-1">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                /* Mobil menyuda havolani bosganda menyu yopiladi */
                onClick={() => setIsMobileMenuOpen(false)}
                className={`
                  block px-4 py-3 rounded-xl text-sm font-medium
                  transition-all duration-300
                  ${
                    pathname === item.href
                      ? "bg-primary/10 text-primary"
                      : "text-muted hover:text-foreground hover:bg-cream-dark"
                  }
                `}
              >
                {item.name}
              </Link>
            ))}

            {/* Mobil menyuda kirish / profil tugmasi */}
            {!loading && (
              <div className="pt-2 mt-2 border-t border-border/50">
                {user ? (
                  <Link
                    href="/profile"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`
                      flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium
                      transition-all duration-300
                      ${
                        pathname === "/profile"
                          ? "bg-primary/10 text-primary"
                          : "text-foreground hover:bg-cream-dark"
                      }
                    `}
                  >
                    {user.user_metadata?.avatar_url ? (
                      <img
                        src={user.user_metadata.avatar_url}
                        alt="Profil"
                        className="w-8 h-8 rounded-full object-cover border border-border"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                        <User className="w-4 h-4" />
                      </div>
                    )}
                    <span className="truncate">
                      {user.user_metadata?.full_name ||
                        user.user_metadata?.name ||
                        user.email}
                    </span>
                  </Link>
                ) : (
                  <Link
                    href="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark text-white px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300"
                  >
                    <LogIn className="w-4 h-4" />
                    Kirish
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
