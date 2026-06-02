/* ============================================
   AUTH HOOK (useAuth.js)
   ============================================
   Bu hook foydalanuvchi (user) holatini boshqaradi.
   Supabase Auth orqali Google bilan kirish, chiqish
   va joriy foydalanuvchini olish funksiyalarini taqdim etadi.
   ============================================ */

"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export function useAuth() {
  // Joriy foydalanuvchi (null = kirilmagan)
  const [user, setUser] = useState(null);
  // Yuklanmoqda (sahifa yangilanganda sessiyani tekshirayotgan vaqt)
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    // 1. Hozirgi sessiyani olish (sahifa yangilanganda)
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // 2. Auth holatining o'zgarishini kuzatish (kirish/chiqish)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  /* ============================================
     GOOGLE ORQALI KIRISH
     ============================================
     Supabase OAuth'ni ishga tushiradi. Foydalanuvchi
     Google sahifasiga yo'naltiriladi, so'ng /auth/callback
     sahifasiga qaytib keladi.
     ============================================ */
  const signInWithGoogle = async () => {
    if (!supabase) {
      throw new Error("Supabase sozlanmagan");
    }
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) throw error;
  };

  /* ============================================
     CHIQISH (SignOut)
     ============================================ */
  const signOut = async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
    setUser(null);
  };

  return { user, loading, signInWithGoogle, signOut };
}
