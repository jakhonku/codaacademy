/* ============================================
   PROMPT ENGINEERING MAQOLA SAHIFASI
   ============================================
   Muallif: Baxtiyarov J. — Dasturchi, AI mutaxassisi
   ============================================ */

import { BookOpen, Lightbulb, Target, Layers, Zap, CheckCircle, ArrowRight, User, Calendar } from "lucide-react";
import Link from "next/link";

/* Next.js App Router metadata */
export const metadata = {
  title: "Prompt Engineering — Coda Academy",
  description:
    "Prompt Engineering haqida batafsil maqola. Muallif: Baxtiyarov J., dasturchi, AI mutaxassisi. Sun'iy intellektdan samarali foydalanish san'ati.",
};

export default function PromptEngineeringPage() {
  return (
    <>
      {/* ===== HERO BANNER ===== */}
      <section className="relative py-20 md:py-28 bg-gradient-to-br from-primary/5 via-cream to-accent/5 overflow-hidden">
        {/* Dekorativ doiralar */}
        <div className="absolute top-10 right-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-10 w-56 h-56 bg-accent/10 rounded-full blur-3xl" />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary text-xs font-semibold px-4 py-2 rounded-full mb-6">
            <BookOpen className="w-4 h-4" />
            Maqola
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-foreground mb-6 leading-tight">
            Prompt Engineering —{" "}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Sun&apos;iy Intellektdan Samarali Foydalanish San&apos;ati
            </span>
          </h1>

          <p className="text-muted text-base md:text-lg max-w-2xl mx-auto mb-8 leading-relaxed">
            To&apos;g&apos;ri tuzilgan promptlar modelning javobini aniq, mazmunli va foydalanuvchi
            ehtiyojiga mos qiladi. Bu maqolada prompt engineering asoslari va amaliy misollar keltirilgan.
          </p>

          {/* Muallif info */}
          <div className="inline-flex items-center gap-4 bg-white/80 backdrop-blur-sm border border-border/40 rounded-2xl px-6 py-3 shadow-sm">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-primary" />
            </div>
            <div className="text-left">
              <p className="text-sm font-bold text-foreground">Baxtiyarov J.</p>
              <p className="text-xs text-muted">Dasturchi, AI mutaxassisi</p>
            </div>
            <div className="w-px h-8 bg-border/50 mx-2" />
            <div className="flex items-center gap-1.5 text-xs text-muted">
              <Calendar className="w-3.5 h-3.5" />
              2026-yil, iyun
            </div>
          </div>
        </div>
      </section>

      {/* ===== MAQOLA ASOSIY KONTENTI ===== */}
      <section className="py-16 md:py-20 bg-cream">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Kirish */}
          <div className="bg-white rounded-3xl border border-border/40 p-8 md:p-10 shadow-sm mb-10">
            <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                <Lightbulb className="w-5 h-5 text-primary" />
              </div>
              Prompt Engineering Nima?
            </h2>
            <p className="text-muted text-sm md:text-base leading-relaxed mb-4">
              Prompt engineering — bu sun&apos;iy intellekt modellaridan (masalan, ChatGPT, Gemini, Claude)
              maksimal foyda olish uchun so&apos;rovlarni yaratish, tuzatish va optimallashtirish san&apos;ati.
              Bu shunchaki savol berish emas — bu modelga <strong>aniq ko&apos;rsatma</strong>,{" "}
              <strong>kontekst</strong> va <strong>format</strong> berish orqali eng yaxshi natijani olish usuli.
            </p>
            <p className="text-muted text-sm md:text-base leading-relaxed">
              Bugungi kunda AI texnologiyalari har bir sohaga kirib kelmoqda — ta&apos;lim, tibbiyot, dasturlash,
              musiqa, dizayn. Ammo bu vositalardan qanchalik samarali foydalanish — aynan prompt engineering
              ko&apos;nikmasiga bog&apos;liq.
            </p>
          </div>

          {/* Asosiy tamoyillar */}
          <div className="bg-white rounded-3xl border border-border/40 p-8 md:p-10 shadow-sm mb-10">
            <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
              <div className="w-10 h-10 bg-accent/10 rounded-xl flex items-center justify-center shrink-0">
                <Target className="w-5 h-5 text-accent" />
              </div>
              Asosiy Tamoyillar
            </h2>

            <div className="space-y-5">
              {[
                {
                  title: "1. Aniqlik va kontekst",
                  text: "Modelga kerakli ma'lumotni, uslubni va formatni aniq ko'rsating. Umumiy savollar — umumiy javoblar beradi. Qanchalik aniq so'rasangiz, shunchalik sifatli natija olasiz.",
                },
                {
                  title: "2. Rol berish (Role Prompting)",
                  text: "\"Siz tajribali musiqa o'qituvchisisiz\" kabi rol berilsa, model o'sha sohaga mos javob beradi. Bu usul javob sifatini sezilarli oshiradi.",
                },
                {
                  title: "3. Cheklovlar va format",
                  text: "Javob uzunligi, tili, formati (ro'yxat, jadval, kod bloki) kabi talablarni belgilash. Masalan: \"5 ta punktda, har biri 2 gapda javob bering.\"",
                },
                {
                  title: "4. Iterativ sinov",
                  text: "Birinchi promptdan mukammal natija chiqmaydi. Promptni bir necha marta test qiling, javobni tahlil qiling va yaxshilang. Bu — normal jarayon.",
                },
                {
                  title: "5. Misollar berish (Few-Shot)",
                  text: "Modelga 1-3 ta misol bering — qanday formatda javob kutayotganingizni ko'rsating. Bu usul ayniqsa murakkab vazifalar uchun samarali.",
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex items-start gap-4 p-4 rounded-2xl bg-cream/60 border border-border/20 hover:border-primary/20 hover:shadow-sm transition-all duration-300"
                >
                  <CheckCircle className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                  <div>
                    <h3 className="text-sm font-bold text-foreground mb-1">{item.title}</h3>
                    <p className="text-muted text-sm leading-relaxed">{item.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Amaliy misollar */}
          <div className="bg-white rounded-3xl border border-border/40 p-8 md:p-10 shadow-sm mb-10">
            <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                <Layers className="w-5 h-5 text-primary" />
              </div>
              Amaliy Misollar
            </h2>

            <div className="space-y-6">
              {/* Misol 1 */}
              <div className="rounded-2xl border border-border/30 overflow-hidden">
                <div className="bg-primary/5 px-5 py-3 border-b border-border/20">
                  <p className="text-xs font-bold text-primary uppercase tracking-wide">📚 Ta&apos;lim — Dars rejasi</p>
                </div>
                <div className="p-5 bg-cream/30">
                  <p className="text-sm text-foreground font-mono leading-relaxed">
                    &quot;Siz tajribali musiqa o&apos;qituvchisisiz. Menga <span className="text-primary font-bold">[MAVZU NOMI]</span> mavzusi
                    bo&apos;yicha 45 daqiqalik dars rejasini tuzing. Dars rejasida quyidagilar bo&apos;lsin:
                    1) Darsning maqsadi, 2) Kerakli materiallar, 3) Dars bosqichlari, 4) Uyga vazifa.&quot;
                  </p>
                </div>
              </div>

              {/* Misol 2 */}
              <div className="rounded-2xl border border-border/30 overflow-hidden">
                <div className="bg-accent/5 px-5 py-3 border-b border-border/20">
                  <p className="text-xs font-bold text-accent uppercase tracking-wide">💻 Dasturlash — Kod refaktoring</p>
                </div>
                <div className="p-5 bg-cream/30">
                  <p className="text-sm text-foreground font-mono leading-relaxed">
                    &quot;Menga quyidagi kodni refaktor qiling. Optimal struktura, o&apos;qish osonligi va
                    samaradorlikka e&apos;tibor bering. Izohlar bilan tushuntiring:
                    <span className="text-primary font-bold"> [KOD]</span>&quot;
                  </p>
                </div>
              </div>

              {/* Misol 3 */}
              <div className="rounded-2xl border border-border/30 overflow-hidden">
                <div className="bg-primary/5 px-5 py-3 border-b border-border/20">
                  <p className="text-xs font-bold text-primary uppercase tracking-wide">📊 Prezentatsiya</p>
                </div>
                <div className="p-5 bg-cream/30">
                  <p className="text-sm text-foreground font-mono leading-relaxed">
                    &quot;Menga <span className="text-primary font-bold">[MAVZU]</span> bo&apos;yicha 10 slaydli prezentatsiya
                    rejasini yozing. Har bir slayd uchun: sarlavha, asosiy nuqtalar (3-4 ta), vizual tavsiya.&quot;
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Nega muhim? */}
          <div className="bg-white rounded-3xl border border-border/40 p-8 md:p-10 shadow-sm mb-10">
            <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-3">
              <div className="w-10 h-10 bg-accent/10 rounded-xl flex items-center justify-center shrink-0">
                <Zap className="w-5 h-5 text-accent" />
              </div>
              Nega Prompt Engineering Muhim?
            </h2>
            <p className="text-muted text-sm md:text-base leading-relaxed mb-4">
              Yaxshi prompt — bu vaqtni tejash, xatolarni kamaytirish va sifatli natija olish kalitidir.
              Statistikaga ko&apos;ra, to&apos;g&apos;ri tuzilgan promptlar bilan ishlagan foydalanuvchilar
              <strong> 3-5 baravar</strong> samarali natijaga erishadilar.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
              {[
                { stat: "70%", label: "Vaqtni tejash" },
                { stat: "3x", label: "Sifat oshishi" },
                { stat: "90%", label: "Aniq javoblar" },
              ].map((item, i) => (
                <div key={i} className="text-center p-4 rounded-2xl bg-gradient-to-br from-primary/5 to-accent/5 border border-border/20">
                  <p className="text-2xl font-extrabold text-primary mb-1">{item.stat}</p>
                  <p className="text-xs text-muted">{item.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Xulosa va CTA */}
          <div className="bg-gradient-to-br from-primary to-primary-dark rounded-3xl p-8 md:p-10 text-white text-center shadow-xl shadow-primary/20">
            <h2 className="text-2xl font-bold mb-3">Tayyor Promptlarni Sinab Ko&apos;ring!</h2>
            <p className="text-white/80 text-sm md:text-base max-w-xl mx-auto mb-6 leading-relaxed">
              Coda Academy platformasida 14+ tayyor prompt shablonlari mavjud.
              Nusxa oling, AI vositasiga joylashtiring va natijani ko&apos;ring.
            </p>
            <Link
              href="/prompts"
              className="inline-flex items-center gap-2 bg-white text-primary font-semibold px-6 py-3 rounded-2xl hover:shadow-lg hover:shadow-white/20 transition-all duration-300 group"
            >
              Promptlar kutubxonasi
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
