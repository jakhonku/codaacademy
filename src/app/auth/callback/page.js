/* ============================================
   AUTH CALLBACK SAHIFASI (auth/callback/page.js)
   ============================================
   Google orqali ro'yxatdan o'tib qaytib kelganda
   shu sahifaga tushadi. Supabase URL'dagi auth
   kodini sessiyaga almashtiradi va foydalanuvchini
   profil sahifasiga yo'naltiradi.
   ============================================ */

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Loader2, AlertCircle } from "lucide-react";

export default function AuthCallbackPage() {
  const router = useRouter();
  const [error, setError] = useState("");

  useEffect(() => {
    async function handleCallback() {
      if (!supabase) {
        setError("Supabase sozlanmagan");
        return;
      }

      try {
        // PKCE flow uchun URL'dagi kodni sessiyaga almashtirish
        const url = new URL(window.location.href);
        const code = url.searchParams.get("code");

        if (code) {
          const { error: exchangeError } =
            await supabase.auth.exchangeCodeForSession(code);
          if (exchangeError) throw exchangeError;
        }

        // Sessiya muvaffaqiyatli o'rnatildimi tekshirish
        const { data: { session } } = await supabase.auth.getSession();

        if (session) {
          router.replace("/profile");
        } else {
          // Implicit flow uchun (token URL hash'ida) Supabase avtomatik
          // qabul qiladi — biroz kutib, qayta tekshiramiz
          setTimeout(async () => {
            const { data: { session: retrySession } } =
              await supabase.auth.getSession();
            if (retrySession) {
              router.replace("/profile");
            } else {
              setError("Sessiya yaratilmadi. Iltimos, qayta urinib ko'ring.");
            }
          }, 1000);
        }
      } catch (err) {
        console.error("Auth callback xatosi:", err);
        setError(err.message || "Kirishni yakunlab bo'lmadi");
      }
    }

    handleCallback();
  }, [router]);

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="text-center">
        {error ? (
          <>
            <div className="w-16 h-16 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-foreground mb-2">
              Kirishda xatolik
            </h2>
            <p className="text-sm text-muted mb-6 max-w-md">{error}</p>
            <button
              onClick={() => router.push("/login")}
              className="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-white font-semibold py-3 px-6 rounded-2xl transition-all duration-300 text-sm cursor-pointer"
            >
              Qayta urinib ko'rish
            </button>
          </>
        ) : (
          <>
            <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
            <h2 className="text-xl font-bold text-foreground mb-2">
              Kirish yakunlanmoqda...
            </h2>
            <p className="text-sm text-muted">
              Iltimos, biroz kuting. Sizni profil sahifasiga yo'naltiramiz.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
