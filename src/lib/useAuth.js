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
  // Foydalanuvchi profili
  const [profile, setProfile] = useState(null);
  // Yuklanmoqda (sahifa yangilanganda sessiyani tekshirayotgan vaqt)
  const [loading, setLoading] = useState(true);

  // Profilni yuklash funksiyasi
  const fetchProfile = async (u) => {
    if (!supabase || !u) {
      setProfile(null);
      setLoading(false);
      return;
    }
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", u.id)
        .single();
      if (!error && data) {
        setProfile(data);
      } else {
        // Agar profil trigger orqali hali yaratilmagan bo'lsa, uni qo'lda yaratib olamiz
        const { data: newProfile, error: insErr } = await supabase
          .from("profiles")
          .insert([
            {
              id: u.id,
              email: u.email,
              full_name: u.user_metadata?.full_name || u.user_metadata?.name || "Foydalanuvchi",
              avatar_url: u.user_metadata?.avatar_url || u.user_metadata?.picture,
              is_registered: false
            }
          ])
          .select()
          .single();
        if (!insErr && newProfile) {
          setProfile(newProfile);
        } else {
          setProfile(null);
        }
      }
    } catch (e) {
      setProfile(null);
    }
    setLoading(false);
  };

  const refreshProfile = async () => {
    if (user) {
      await fetchProfile(user);
    }
  };

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    // 1. Hozirgi sessiyani olish (sahifa yangilanganda)
    supabase.auth.getSession().then(({ data: { session } }) => {
      const u = session?.user ?? null;
      setUser(u);
      if (u) {
        fetchProfile(u);
      } else {
        setProfile(null);
        setLoading(false);
      }
    });

    // 2. Auth holatining o'zgarishini kuzatish (kirish/chiqish)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        const u = session?.user ?? null;
        setUser(u);
        if (u) {
          fetchProfile(u);
        } else {
          setProfile(null);
          setLoading(false);
        }
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
    setProfile(null);
  };

  return { user, profile, loading, refreshProfile, signInWithGoogle, signOut };
}
