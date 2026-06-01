/* ============================================
   SUPABASE KLIENTI (supabase.js)
   ============================================
   Bu fayl Supabase bilan bog'lanish uchun mijoz (client)
   obyektini yaratadi va eksport qiladi.
   
   Agar .env.local faylida kalitlar kiritilmagan bo'lsa,
   ilova xato bermasdan lokal rejimda ishlaydi (null qaytaradi).
   ============================================ */

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Supabase ulanishi holatini tekshirish
if (!supabase) {
  console.warn(
    "Supabase ulanishi faollashtirilmagan. Iltimos, .env.local faylida NEXT_PUBLIC_SUPABASE_URL va NEXT_PUBLIC_SUPABASE_ANON_KEY o'zgaruvchilarini sozlang."
  );
}
