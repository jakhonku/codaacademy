/* ============================================
   KIRISH SAHIFASI (login/page.js)
   ============================================
   Foydalanuvchi Google akkaunti orqali tizimga
   kiradi yoki ro'yxatdan o'tadi. Supabase Auth
   ishlatiladi — alohida parolga ehtiyoj yo'q.
   ============================================ */

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/useAuth";
import { LogIn, ShieldCheck, Sparkles, AlertCircle, Loader2 } from "lucide-react";

import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const router = useRouter();
  const { user, profile, loading, signInWithGoogle, signOut, refreshProfile } = useAuth();
  const [error, setError] = useState("");
  const [signingIn, setSigningIn] = useState(false);

  // Kod tekshirish holatlari
  const [inviteCode, setInviteCode] = useState("");
  const [verifyingCode, setVerifyingCode] = useState(false);
  const [codeError, setCodeError] = useState("");
  const [codeSuccess, setCodeSuccess] = useState("");

  // Agar foydalanuvchi allaqachon kirgan bo'lsa va ro'yxatdan o'tgan bo'lsa, boshqaruv paneliga yo'naltirish
  useEffect(() => {
    if (!loading && user && profile && profile.is_registered) {
      router.replace("/dashboard");
    }
  }, [user, profile, loading, router]);

  const handleGoogleSignIn = async () => {
    setError("");
    setSigningIn(true);
    try {
      await signInWithGoogle();
      // Google sahifasiga yo'naltiriladi, shuning uchun setSigningIn'ni o'chirib qo'ymaymiz
    } catch (err) {
      console.error("Google bilan kirishda xato:", err);
      setError(
        "Google orqali kirib bo'lmadi. Supabase'da Google provayderi sozlanganligini tekshiring."
      );
      setSigningIn(false);
    }
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    if (!inviteCode.trim() || !user) return;
    setVerifyingCode(true);
    setCodeError("");
    setCodeSuccess("");

    if (!supabase) {
      setCodeSuccess("Muvaffaqiyatli ro'yxatdan o'tdingiz (Lokal)!");
      setTimeout(() => {
        router.replace("/dashboard");
      }, 1000);
      setVerifyingCode(false);
      return;
    }

    try {
      const cleanCode = inviteCode.trim().toUpperCase();
      // 1. Kodni bazadan qidiramiz
      const { data: codeData, error: fetchErr } = await supabase
        .from("invite_codes")
        .select("*")
        .eq("code", cleanCode)
        .single();

      if (fetchErr || !codeData) {
        setCodeError("Kurs kodi topilmadi. Iltimos, kodni to'g'ri kiritganingizni tekshiring.");
        setVerifyingCode(false);
        return;
      }

      if (codeData.is_used) {
        setCodeError("Ushbu kurs kodi allaqachon ishlatilgan! Kurs kodi faqat bir marta ishlatilishi mumkin.");
        setVerifyingCode(false);
        return;
      }

      // 2. Kodni ishlatilgan deb belgilaymiz
      const { error: updateCodeErr } = await supabase
        .from("invite_codes")
        .update({
          is_used: true,
          used_by: user.id,
          used_by_email: user.email,
          used_at: new Date().toISOString()
        })
        .eq("id", codeData.id);

      if (updateCodeErr) throw updateCodeErr;

      // 3. Foydalanuvchi profilini faollashtiramiz (is_registered = true).
      //    upsert ishlatamiz — agar profil qatori hali yaratilmagan bo'lsa ham,
      //    is_registered = true aniq o'rnatiladi (update 0 qatorga ta'sir qilib qolmaydi).
      const { error: updateProfileErr } = await supabase
        .from("profiles")
        .upsert(
          {
            id: user.id,
            email: user.email,
            full_name: user.user_metadata?.full_name || user.user_metadata?.name || "Foydalanuvchi",
            avatar_url: user.user_metadata?.avatar_url || user.user_metadata?.picture,
            is_registered: true,
            invite_code: cleanCode,
          },
          { onConflict: "id" }
        );

      if (updateProfileErr) throw updateProfileErr;

      setCodeSuccess("Muvaffaqiyatli ro'yxatdan o'tdingiz!");
      await refreshProfile();
      setTimeout(() => {
        router.replace("/dashboard");
      }, 1000);

    } catch (err) {
      console.error("Kod tasdiqlashda xato:", err);
      setCodeError("Xatolik yuz berdi: " + err.message);
    } finally {
      setVerifyingCode(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  // Foydalanuvchi kirgan, lekin hali kurs kodi bilan tasdiqlanmagan bo'lsa
  // (profil null bo'lsa ham — tasdiqlanmagan deb hisoblaymiz), kod kiritish
  // formasini ko'rsatamiz. Aks holda ro'yxatdan o'tish "yo'q bo'lib qoladi".
  if (user && (!profile || !profile.is_registered)) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 bg-cream-dark/20">
        <div className="w-full max-w-md animate-fade-in-up">
          <div className="bg-white border border-border/80 rounded-3xl p-8 md:p-10 shadow-xl shadow-primary/5 relative overflow-hidden">
            <div className="absolute -top-16 -right-16 w-32 h-32 bg-primary/5 rounded-full blur-2xl" />
            <div className="absolute -bottom-16 -left-16 w-32 h-32 bg-accent/5 rounded-full blur-2xl" />

            <div className="relative">
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center">
                  <ShieldCheck className="w-8 h-8 stroke-[1.5]" />
                </div>
              </div>

              <h1 className="text-2xl font-bold text-center text-foreground mb-2">
                Kurs Kodini Kiriting
              </h1>
              <p className="text-muted text-center text-xs mb-6 leading-relaxed">
                Salom, <span className="font-bold text-foreground">{profile?.full_name || user.user_metadata?.full_name || user.user_metadata?.name || user.email}</span>! O'qishni boshlash uchun o'qituvchi tomonidan berilgan maxsus kurs kodini kiriting.
              </p>

              <form onSubmit={handleVerifyCode} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-2" htmlFor="invite-code">
                    Kurs kodi *
                  </label>
                  <input
                    type="text"
                    id="invite-code"
                    required
                    value={inviteCode}
                    onChange={(e) => setInviteCode(e.target.value)}
                    placeholder="Masalan: CODA-XXXX"
                    className="w-full px-4 py-3.5 rounded-2xl border border-border/80 bg-cream/20 text-foreground text-sm uppercase font-semibold text-center tracking-widest focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:normal-case placeholder:tracking-normal"
                  />
                </div>

                {codeError && (
                  <div className="p-3.5 bg-rose-50 border border-rose-100 text-rose-800 text-xs rounded-xl font-medium">
                    {codeError}
                  </div>
                )}

                {codeSuccess && (
                  <div className="p-3.5 bg-emerald-50 border border-emerald-100 text-emerald-800 text-xs rounded-xl font-medium">
                    {codeSuccess}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={verifyingCode || !inviteCode.trim()}
                  className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-primary to-primary-dark hover:from-primary-dark hover:to-primary text-white font-semibold py-4 px-6 rounded-2xl transition-all duration-300 hover:shadow-lg disabled:opacity-50 cursor-pointer text-sm"
                >
                  {verifyingCode ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Kodni tekshirish...
                    </>
                  ) : (
                    "Tizimga kirishga ruxsat berish"
                  )}
                </button>
              </form>

              <div className="mt-6 pt-6 border-t border-border/60 text-center">
                <p className="text-xs text-muted mb-3">Ushbu Google akkaunt sizga tegishli emasmi?</p>
                <button
                  onClick={() => signOut()}
                  className="text-xs font-semibold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100/60 px-4 py-2.5 rounded-xl transition-all cursor-pointer inline-flex items-center gap-1.5"
                >
                  Tizimdan chiqish (Boshqa profil)
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 bg-cream-dark/20">
      <div className="w-full max-w-md">
        {/* Asosiy karta */}
        <div className="bg-white border border-border/80 rounded-3xl p-8 md:p-10 shadow-xl shadow-primary/5">
          {/* Logo / Ikonka */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center">
              <LogIn className="w-8 h-8 stroke-[1.5]" />
            </div>
          </div>

          {/* Sarlavha */}
          <h1 className="text-2xl md:text-3xl font-bold text-center text-foreground mb-2">
            Tizimga kirish
          </h1>
          <p className="text-muted text-center text-sm mb-8">
            Coda Academy platformasiga Google akkauntingiz orqali
            ro'yxatdan o'ting yoki kiring
          </p>

          {/* Google tugmasi */}
          <button
            onClick={handleGoogleSignIn}
            disabled={signingIn}
            className="w-full inline-flex items-center justify-center gap-3 bg-white hover:bg-cream-dark border-2 border-border hover:border-primary/30 text-foreground font-semibold py-4 px-6 rounded-2xl transition-all duration-300 hover:shadow-md disabled:opacity-60 disabled:cursor-not-allowed text-sm cursor-pointer"
          >
            {signingIn ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Yo'naltirilmoqda...
              </>
            ) : (
              <>
                {/* Google rasmiy logosi (SVG) */}
                <svg className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Google orqali davom etish
              </>
            )}
          </button>

          {/* Xato xabari */}
          {error && (
            <div className="mt-6 flex items-start gap-3 bg-rose-50 text-rose-800 border border-rose-200 p-4 rounded-2xl">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-sm">Xatolik yuz berdi</h4>
                <p className="text-xs text-rose-700 mt-1">{error}</p>
              </div>
            </div>
          )}

          {/* Afzalliklar ro'yxati */}
          <div className="mt-8 pt-8 border-t border-border/60 space-y-3">
            <div className="flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <p className="text-xs text-muted">
                Maxfiy va xavfsiz — parolingiz Coda Academy'da saqlanmaydi
              </p>
            </div>
            <div className="flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <p className="text-xs text-muted">
                Bir necha soniyada — alohida parol o'ylab topish shart emas
              </p>
            </div>
          </div>
        </div>

        {/* Bosh sahifaga qaytish havolasi */}
        <div className="text-center mt-6">
          <Link
            href="/"
            className="text-sm text-muted hover:text-primary transition-colors"
          >
            ← Bosh sahifaga qaytish
          </Link>
        </div>
      </div>
    </div>
  );
}
