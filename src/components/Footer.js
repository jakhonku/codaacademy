/* ============================================
   PASTKI QISM (Footer.js)
   ============================================
   Sahifaning eng pastki qismi. Mualliflik huquqi
   va ijtimoiy tarmoqlar haqida ma'lumot ko'rsatadi.
   Bu komponent barcha sahifalarda ko'rinadi.
   ============================================ */

import Link from "next/link";
import { 
  Mail, 
  Phone, 
  MapPin
} from "lucide-react";

export default function Footer() {
  return (
    /* ============================================
       FOOTER TASHQI KONTEYNER
       ============================================
       - mt-auto: sahifa kontent qisqa bo'lsa ham footer pastda turadi
       - bg-gradient-to-b: premium gradyent fon
       - border-t: mayin yuqori chegara
       ============================================ */
    <footer className="mt-auto bg-gradient-to-b from-[#1E1B4B] to-[#121036] text-white border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">

        {/* ============================================
            YUQORI QISM — Logo va havolalar
            ============================================ */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

          {/* 1-ustun: Logo va tavsif */}
          <div className="space-y-6">
            <div className="flex items-center gap-2.5">
              <img 
                src="/images/logo_icon_white.png" 
                alt="Coda Academy Logo" 
                className="w-7 h-7 object-contain hover:rotate-6 transition-transform duration-300"
              />
              <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-white to-white/80 bg-clip-text">
                Coda Academy
              </span>
            </div>
            <p className="text-white/60 text-sm leading-relaxed max-w-sm">
              Sun'iy intellektdan ta'limda va ijodda foydalanish platformasi. Oflayn darslar, foydali resurslar va tayyor promptlar.
            </p>
          </div>

          {/* 2-ustun: Tezkor havolalar */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-white/40 mb-5">
              Sahifalar
            </h3>
            <ul className="space-y-3">
              {[
                { name: "Bosh sahifa", href: "/" },
                { name: "Promptlar", href: "/prompts" },
                { name: "Resurslar", href: "/resources" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="inline-block text-white/60 hover:text-accent hover:translate-x-1 text-sm transition-all duration-300"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 3-ustun: Aloqa ma'lumotlari */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-white/40 mb-5">
              Aloqa
            </h3>
            <ul className="space-y-3.5 text-white/60 text-sm">
              <li className="flex items-center gap-3 group">
                <Mail className="w-4 h-4 text-accent group-hover:scale-110 transition-transform shrink-0" />
                <a href="mailto:info@coda-academy.uz" className="hover:text-white transition-colors">
                  info@coda-academy.uz
                </a>
              </li>
              <li className="flex items-center gap-3 group">
                <Phone className="w-4 h-4 text-accent group-hover:scale-110 transition-transform shrink-0" />
                <a href="tel:+998998303802" className="hover:text-white transition-colors">
                  +998 99 830 38 02
                </a>
              </li>
              <li className="flex items-start gap-3 group">
                <MapPin className="w-4 h-4 text-accent group-hover:scale-110 transition-transform shrink-0 mt-0.5" />
                <span className="hover:text-white transition-colors">
                  Toshkent, O'zbekiston
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* ============================================
            PASTKI CHIZIQ — Mualliflik huquqi
            ============================================ */}
        <div className="border-t border-white/5 mt-12 pt-8 text-center">
          <p className="text-white/40 text-sm">
            © {new Date().getFullYear()} Coda Academy. Barcha huquqlar himoyalangan.
          </p>
        </div>
      </div>
    </footer>
  );
}
