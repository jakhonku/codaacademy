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

export default function LoginPage() {
  const router = useRouter();
  const { user, loading, signInWithGoogle } = useAuth();
  const [error, setError] = useState("");
  const [signingIn, setSigningIn] = useState(false);

  // Agar foydalanuvchi allaqachon kirgan bo'lsa, boshqaruv paneliga yo'naltirish
  useEffect(() => {
    if (!loading && user) {
      router.replace("/dashboard");
    }
  }, [user, loading, router]);

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

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
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
