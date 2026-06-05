/* ============================================
   BOSH SAHIFA (page.js)
   ============================================
   Ziyokor AI platformasining bosh sahifasi.
   
   Sahifa tarkibi:
   1. Hero bo'limi — platforma haqida ma'lumot va tezkor tugmalar.
   2. Oflayn mashg'ulotlar bo'limi — darslar haqida batafsil ma'lumot.
   3. Oflayn darsga yozilish formasi — Supabase bilan ulangan.
   4. Promptlar preview — 3 ta tayyor so'rov shablonlari.
   ============================================ */

"use client"; // Formadagi holatlarni boshqarish va Supabase ulanishi uchun

import { useState, useEffect } from "react";
import Hero from "@/components/Hero";
import SectionTitle from "@/components/SectionTitle";
import PromptCard from "@/components/PromptCard";

// Lokal static promptlarni import qilish (ulanish bo'lmasa fallback uchun)
import staticPrompts from "@/data/prompts";
import { supabase } from "@/lib/supabase";

import Link from "next/link";
import { ArrowRight, Send, CheckCircle, AlertCircle, Calendar, MapPin, Clock } from "lucide-react";

export default function HomePage() {
  // Holatlar (States)
  const [prompts, setPrompts] = useState([]);
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    department: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success' | 'error' | null

  // Promptlarni yuklash (Supabase'dan yoki lokal)
  useEffect(() => {
    async function loadPrompts() {
      if (supabase) {
        try {
          const { data, error } = await supabase
            .from("prompts")
            .select("*")
            .order("created_at", { ascending: true })
            .limit(3);

          if (!error && data && data.length > 0) {
            // Supabase'dan kelgan kalit nomlarini front-endga moslash (prompt_text -> promptText)
            const formattedData = data.map(item => ({
              id: item.id,
              title: item.title,
              category: item.category,
              description: item.description,
              promptText: item.prompt_text || item.promptText
            }));
            setPrompts(formattedData);
            return;
          }
        } catch (e) {
          console.error("Supabase'dan promptlarni yuklashda xato:", e);
        }
      }
      // Agar xato bo'lsa yoki Supabase bo'lmasa, lokal static fayldan foydalanamiz
      setPrompts(staticPrompts.slice(0, 3));
    }
    loadPrompts();
  }, []);

  // Formani yuborish
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    // Telefon raqamini va ismni tekshirish
    if (!formData.fullName.trim() || !formData.phone.trim()) {
      setSubmitStatus("error");
      setIsSubmitting(false);
      return;
    }

    if (supabase) {
      try {
        const { error } = await supabase
          .from("registrations")
          .insert([
            {
              full_name: formData.fullName,
              phone: formData.phone,
              department: formData.department,
            }
          ]);

        if (error) throw error;

        setSubmitStatus("success");
        setFormData({ fullName: "", phone: "", department: "" });
      } catch (err) {
        console.error("Supabase'ga yozilishda xatolik:", err);
        setSubmitStatus("error");
      }
    } else {
      // Supabase yo'q bo'lsa, lokal saqlab qo'yamiz (demo uchun)
      try {
        const localRegs = JSON.parse(localStorage.getItem("offline_registrations") || "[]");
        localRegs.push({
          ...formData,
          id: Date.now(),
          created_at: new Date().toISOString()
        });
        localStorage.setItem("offline_registrations", JSON.stringify(localRegs));

        setSubmitStatus("success");
        setFormData({ fullName: "", phone: "", department: "" });
      } catch (err) {
        setSubmitStatus("error");
      }
    }
    setIsSubmitting(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <>
      {/* 1. Hero bo'limi */}
      <Hero />

      {/* 2. Oflayn Seminar-Mashg'ulotlar bo'limi */}
      <section className="py-20 bg-white" id="offline-info">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle
            title="Oflayn Seminar va Master-klasslar"
            subtitle="Sun'iy intellektdan amaliy foydalanish mashg'ulotlari"
          />

          {/* Dars haqida ma'lumot kartochkalari */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            {/* Karta 1: Dars mazmuni */}
            <div className="bg-white border border-border/40 rounded-3xl p-8 hover:shadow-xl hover:border-primary/20 transition-all duration-300 flex flex-col items-start group">
              <div className="w-12 h-12 bg-primary/5 text-primary rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white transition-all duration-300 shadow-sm border border-primary/10">
                <Calendar className="w-6 h-6 stroke-[1.5]" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors duration-300">Mashg'ulotlar Dasturi</h3>
              <p className="text-muted text-sm leading-relaxed">
                Seminar davomida siz dars rejalari tuzish, test savollari yaratish va musiqiy tahlil qilish uchun ChatGPT hamda maxsus AI-musiqa vositalari bilan amaliy ishlaysiz.
              </p>
            </div>

            {/* Karta 2: Joylashuv va Vaqt */}
            <div className="bg-white border border-border/40 rounded-3xl p-8 hover:shadow-xl hover:border-primary/20 transition-all duration-300 flex flex-col items-start group">
              <div className="w-12 h-12 bg-primary/5 text-primary rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white transition-all duration-300 shadow-sm border border-primary/10">
                <MapPin className="w-6 h-6 stroke-[1.5]" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors duration-300">Mashg'ulot Joyi</h3>
              <p className="text-muted text-sm leading-relaxed">
                Darslar zamonaviy texnologiyalar va kerakli asbob-uskunalar bilan jihozlangan maxsus xonalarda haftalik tartibda tashkil etiladi.
              </p>
            </div>

            {/* Karta 3: Vaqt */}
            <div className="bg-white border border-border/40 rounded-3xl p-8 hover:shadow-xl hover:border-primary/20 transition-all duration-300 flex flex-col items-start group">
              <div className="w-12 h-12 bg-primary/5 text-primary rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white transition-all duration-300 shadow-sm border border-primary/10">
                <Clock className="w-6 h-6 stroke-[1.5]" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors duration-300">Vaqti va Sharoit</h3>
              <p className="text-muted text-sm leading-relaxed">
                Mashg'ulotlar har shanba kuni soat 14:00 da boshlanadi. Har bir ishtirokchi shaxsiy kompyuter va internet tarmog'i bilan ta'minlanadi.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Ro'yxatdan o'tish formasi bo'limi */}
      <section className="py-20 bg-cream-dark/20 border-t border-b border-border/50" id="offline-register">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="bg-white border border-border/80 rounded-3xl p-8 md:p-12 shadow-xl shadow-primary/5">
            <h2 className="text-2xl md:text-3xl font-bold text-center text-foreground mb-2">
              Oflayn mashg'ulotga yozilish
            </h2>
            <p className="text-muted text-center text-sm mb-8">
              Kursda ishtirok etish uchun quyidagi formani to'ldiring. Siz bilan tez orada bog'lanamiz.
            </p>

            <form onSubmit={handleFormSubmit} className="space-y-6">
              {/* Ism familiya */}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2" htmlFor="fullName">
                  Familiyangiz va Ismingiz *
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  required
                  value={formData.fullName}
                  onChange={handleInputChange}
                  placeholder="Masalan: Abdullayev Anvar"
                  className="w-full px-4 py-3 rounded-2xl border border-border/80 bg-cream/20 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
              </div>

              {/* Telefon raqami */}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2" htmlFor="phone">
                  Telefon raqamingiz *
                </label>
                <input
                  type="text"
                  id="phone"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Masalan: +998 99 830 38 02"
                  className="w-full px-4 py-3 rounded-2xl border border-border/80 bg-cream/20 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
              </div>

              {/* Kafedra / Yo'nalish */}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2" htmlFor="department">
                  Mutaxassisligingiz / Ish (o'qish) joyingiz
                </label>
                <input
                  type="text"
                  id="department"
                  name="department"
                  value={formData.department}
                  onChange={handleInputChange}
                  placeholder="Masalan: Matematika o'qituvchisi / Muhandis"
                  className="w-full px-4 py-3 rounded-2xl border border-border/80 bg-cream/20 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
              </div>

              {/* Submit va status xabarlari */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark text-white font-semibold py-4 px-6 rounded-2xl transition-all duration-300 hover:shadow-lg hover:shadow-primary/20 disabled:bg-muted disabled:cursor-not-allowed text-base cursor-pointer"
                >
                  {isSubmitting ? "Yuborilmoqda..." : "Ro'yxatdan o'tish"}
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </form>

            {/* Muvaqqiyatli status */}
            {submitStatus === "success" && (
              <div className="mt-6 flex items-start gap-3 bg-emerald-50 text-emerald-800 border border-emerald-200 p-4 rounded-2xl animate-fade-in-up">
                <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-sm">Siz muvaffaqiyatli ro'yxatdan o'tdingiz!</h4>
                  <p className="text-xs text-emerald-700 mt-1">Tez orada tashkilotchilarimiz siz bilan bog'lanib, seminar jadvalini tushuntiradilar.</p>
                </div>
              </div>
            )}

            {/* Xatolik statusi */}
            {submitStatus === "error" && (
              <div className="mt-6 flex items-start gap-3 bg-rose-50 text-rose-800 border border-rose-200 p-4 rounded-2xl animate-fade-in-up">
                <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-sm">Ro'yxatdan o'tishda xatolik yuz berdi.</h4>
                  <p className="text-xs text-rose-700 mt-1">Ma'lumotlar saqlanmadi. Iltimos, qayta urinib ko'ring yoki keyinroq bog'laning.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 4. Promptlar preview bo'limi */}
      <section className="py-20 bg-cream-dark/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle
            title="Promptlar kutubxonasi"
            subtitle="Darsingizni samarali tashkil qilish uchun tayyor sun'iy intellekt shablonlaridan foydalaning"
          />

          {/* Prompt kartochkalari — 3 ta ustunda */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
            {prompts.map((prompt, index) => (
              <PromptCard key={prompt.id} prompt={prompt} index={index} />
            ))}
          </div>

          {/* "Barcha promptlar" havolasi */}
          <div className="text-center mt-12">
            <Link
              href="/prompts"
              className="inline-flex items-center gap-2 text-primary hover:text-primary-dark font-medium transition-colors duration-300 group"
            >
              Barcha promptlarni ko'rish
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
