/* ============================================
   ILOVA QOBIG'I TANLOVCHISI (AppChrome.js)
   ============================================
   Joriy sahifa va foydalanuvchi holatiga qarab
   tegishli qobiqni tanlaydi:
   - Dashboard sahifalari (faqat kirgan foydalanuvchilar uchun)
     → yon menyu + burger menyuli DashboardShell
   - Umumiy kontent sahifalari (promptlar, maqolalar):
     kirgan bo'lsa → DashboardShell, aks holda → Navbar/Footer
   - Boshqa sahifalar (landing, login, h.k.)
     → oddiy Navbar + Footer
   ============================================ */

"use client";

import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/useAuth";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import DashboardShell from "@/components/DashboardShell";

// Doimo dashboard qobig'ida ko'rsatiladigan (himoyalangan) yo'llar
const DASHBOARD_ROUTES = ["/dashboard", "/resources", "/test", "/profile"];

// Umumiy kontent — kirgan bo'lsa dashboard qobig'ida, aks holda landing'da
const DUAL_ROUTES = ["/prompts", "/prompt-engineering"];

const matches = (pathname, routes) =>
  routes.some((route) => pathname === route || pathname.startsWith(route + "/"));

export default function AppChrome({ children }) {
  const pathname = usePathname();
  const { user } = useAuth();

  const isDashboard = matches(pathname, DASHBOARD_ROUTES);
  const isDualForUser = user && matches(pathname, DUAL_ROUTES);

  if (isDashboard || isDualForUser) {
    return <DashboardShell>{children}</DashboardShell>;
  }

  return (
    <>
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
