-- ============================================
-- SUPABASE STORAGE BUCKET YARATISH
-- ============================================
-- Bu skriptni Supabase Dashboard > SQL Editor da bajaring.
-- "resources" nomli bucket yaratiladi va public qilinadi.
-- ============================================

-- 1. Storage bucket yaratish
INSERT INTO storage.buckets (id, name, public) 
VALUES ('resources', 'resources', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Hamma foydalanuvchilar fayl yuklashi mumkin (anon key bilan)
CREATE POLICY "Allow public uploads" ON storage.objects
  FOR INSERT
  TO public
  WITH CHECK (bucket_id = 'resources');

-- 3. Hamma foydalanuvchilar fayllarni o'qiy olishi mumkin
CREATE POLICY "Allow public reads" ON storage.objects
  FOR SELECT
  TO public
  USING (bucket_id = 'resources');

-- 4. Fayllarni o'chirish (admin uchun)
CREATE POLICY "Allow public deletes" ON storage.objects
  FOR DELETE
  TO public
  USING (bucket_id = 'resources');
