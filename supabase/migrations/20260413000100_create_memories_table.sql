-- Ported from MEMORIES_SUPABASE_SETUP.sql (originally: "run this in the Supabase SQL editor").
-- Creates the memories table, enables RLS, and provisions the memory-images storage bucket.
-- NOTE: superseded storage.objects policies below are corrected by the next migration
-- (20260413000200_fix_memory_images_storage_policies.sql) — kept here to preserve history.

CREATE TABLE memories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  date DATE NOT NULL,
  caption TEXT NOT NULL,
  image_url TEXT,
  created_at TIMESTAMP DEFAULT now()
);

ALTER TABLE memories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read access for all users" ON memories
  FOR SELECT
  USING (true);

CREATE POLICY "Enable insert for authenticated users only" ON memories
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update for authenticated users only" ON memories
  FOR UPDATE
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable delete for authenticated users only" ON memories
  FOR DELETE
  USING (auth.role() = 'authenticated');

-- Storage bucket for memory images
INSERT INTO storage.buckets (id, name, public)
VALUES ('memory-images', 'memory-images', true)
ON CONFLICT DO NOTHING;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'objects' AND policyname = 'Enable public read access for memory-images'
  ) THEN
    CREATE POLICY "Enable public read access for memory-images" ON storage.objects
      FOR SELECT
      USING (bucket_id = 'memory-images');
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'objects' AND policyname = 'Enable authenticated users to upload to memory-images'
  ) THEN
    CREATE POLICY "Enable authenticated users to upload to memory-images" ON storage.objects
      FOR INSERT
      WITH CHECK (bucket_id = 'memory-images' AND auth.role() = 'authenticated');
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'objects' AND policyname = 'Enable authenticated users to update memory-images'
  ) THEN
    CREATE POLICY "Enable authenticated users to update memory-images" ON storage.objects
      FOR UPDATE
      USING (bucket_id = 'memory-images' AND auth.role() = 'authenticated')
      WITH CHECK (bucket_id = 'memory-images' AND auth.role() = 'authenticated');
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'objects' AND policyname = 'Enable authenticated users to delete memory-images'
  ) THEN
    CREATE POLICY "Enable authenticated users to delete memory-images" ON storage.objects
      FOR DELETE
      USING (bucket_id = 'memory-images' AND auth.role() = 'authenticated');
  END IF;
END $$;
