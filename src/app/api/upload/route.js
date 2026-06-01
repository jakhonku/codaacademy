/* ============================================
   FAYL YUKLASH API ROUTE (api/upload/route.js)
   ============================================
   Bu API endpoint admin paneldan yuklangan fayllarni
   Supabase Storage'ga saqlaydi.
   
   Qo'llab-quvvatlanadigan formatlar:
   - PDF (.pdf)
   - Word (.doc, .docx)
   - Rasmlar (.png, .jpg, .jpeg, .webp)
   ============================================ */

import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

// Service role key bilan Supabase client (storage uchun)
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.SUPABASE_SERVICE_ROLE_KEY || ""
);

// Ruxsat berilgan fayl turlari
const ALLOWED_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "image/png",
  "image/jpeg",
  "image/webp",
];

// Maksimal fayl hajmi: 10MB
const MAX_SIZE = 10 * 1024 * 1024;

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json(
        { error: "Fayl tanlanmagan" },
        { status: 400 }
      );
    }

    // Fayl turini tekshirish
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: "Bu fayl turi qo'llab-quvvatlanmaydi. Faqat PDF, Word va rasm fayllari ruxsat etilgan." },
        { status: 400 }
      );
    }

    // Fayl hajmini tekshirish
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: "Fayl hajmi 10MB dan oshmasligi kerak." },
        { status: 400 }
      );
    }

    // Fayl nomini tozalash va unikal qilish
    const originalName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    const timestamp = Date.now();
    const fileName = `${timestamp}_${originalName}`;

    // Faylni buffer ga o'girish
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Supabase Storage'ga yuklash
    const { data, error } = await supabaseAdmin.storage
      .from("resources")
      .upload(fileName, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (error) {
      console.error("Supabase Storage xatosi:", error);
      return NextResponse.json(
        { error: "Faylni saqlashda xatolik yuz berdi: " + error.message },
        { status: 500 }
      );
    }

    // Public URL ni olish
    const { data: urlData } = supabaseAdmin.storage
      .from("resources")
      .getPublicUrl(fileName);

    // Fayl hajmini formatlash
    const fileSizeFormatted = file.size < 1024 * 1024
      ? `${(file.size / 1024).toFixed(1)} KB`
      : `${(file.size / (1024 * 1024)).toFixed(1)} MB`;

    return NextResponse.json({
      success: true,
      url: urlData.publicUrl,
      fileName: originalName,
      fileSize: fileSizeFormatted,
    });
  } catch (err) {
    console.error("Upload xatosi:", err);
    return NextResponse.json(
      { error: "Server xatosi: " + err.message },
      { status: 500 }
    );
  }
}
