/* ============================================
   HERO BO'LIMI (Hero.js)
   ============================================
   Bu komponent bosh sahifaning eng yuqori qismi —
   "Hero section". Ziyokor AI platformasi haqida ma'lumot
   va tezkor tugmalar joylashgan.
   
   Gradient fon va dekorativ elementlar bilan
   chiroyli ko'rinish yaratiladi.
   ============================================ */

import Link from "next/link";
import { ArrowRight, BookOpen, Lightbulb, Music, Users } from "lucide-react";

export default function Hero() {
  return (
    /* ============================================
       HERO TASHQI KONTEYNER
       ============================================ */
    <section className="relative overflow-hidden bg-gradient-to-br from-cream via-white to-cream-dark">
      
      {/* Dekorativ fon elementlari */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-accent/5 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/3 rounded-full blur-2xl" />
      </div>

      {/* Asosiy kontent */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="text-center max-w-4xl mx-auto">
          
          {/* Coda Academy Logo */}
          <div className="flex justify-center mb-8 animate-fade-in-up" style={{ animationDelay: '0.1s', opacity: 0 }}>
            <img 
              src="/images/logo_transparent.png" 
              alt="Coda Academy Logo" 
              className="h-32 md:h-40 w-auto object-contain hover:scale-105 transition-transform duration-500"
            />
          </div>

          {/* Asosiy sarlavha */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-6 animate-fade-in-up" style={{ animationDelay: '0.2s', opacity: 0 }}>
            Coda Academy: Ta'lim va Ijodda{" "}
            <span className="bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent">
              Sun'iy Intellekt
            </span>
          </h1>

          {/* Qisqacha tavsif */}
          <p className="text-lg md:text-xl text-muted leading-relaxed mb-10 max-w-2xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.3s', opacity: 0 }}>
            Oflayn seminar-treninglar, tayyor promptlar kutubxonasi hamda foydali AI resurslari.
          </p>

          {/* Tugmalar qatori */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up" style={{ animationDelay: '0.4s', opacity: 0 }}>
            {/* Asosiy tugma — Promptlar kutubxonasi */}
            <Link
              href="/prompts"
              className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark text-white px-8 py-4 rounded-2xl text-lg font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-primary/25 hover:-translate-y-0.5"
            >
              Promptlar kutubxonasi
              <ArrowRight className="w-5 h-5" />
            </Link>

            {/* Ikkilamchi tugma — Oflayn darsga yozilish */}
            <a
              href="#offline-register"
              className="inline-flex items-center justify-center gap-2 bg-white hover:bg-cream-dark text-foreground px-8 py-4 rounded-2xl text-lg font-semibold border border-border transition-all duration-300 hover:shadow-md hover:-translate-y-0.5"
            >
              <Users className="w-5 h-5" />
              Oflayn darsga yozilish
            </a>
          </div>

          {/* Statistika */}
          <div className="mt-16 grid grid-cols-3 gap-8 max-w-lg mx-auto animate-fade-in-up" style={{ animationDelay: '0.5s', opacity: 0 }}>
            {/* Oflayn mashg'ulotlar */}
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Users className="w-5 h-5 text-primary mr-1" />
                <span className="text-2xl md:text-3xl font-bold text-foreground">5+</span>
              </div>
              <span className="text-sm text-muted">Oflayn Guruhlar</span>
            </div>

            {/* Promptlar */}
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Lightbulb className="w-5 h-5 text-accent mr-1" />
                <span className="text-2xl md:text-3xl font-bold text-foreground">9+</span>
              </div>
              <span className="text-sm text-muted">Tayyor Promptlar</span>
            </div>

            {/* Resurslar */}
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Music className="w-5 h-5 text-primary-light mr-1" />
                <span className="text-2xl md:text-3xl font-bold text-foreground">6+</span>
              </div>
              <span className="text-sm text-muted">AI Qo'llanmalar</span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
