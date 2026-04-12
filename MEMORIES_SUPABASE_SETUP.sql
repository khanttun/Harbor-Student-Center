-- Create memories table
CREATE TABLE memories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  date DATE NOT NULL,
  caption TEXT NOT NULL,
  image_url TEXT,
  created_at TIMESTAMP DEFAULT now()
);

-- Enable RLS on memories table
ALTER TABLE memories ENABLE ROW LEVEL SECURITY;

-- Create storage bucket for memory images (if not exists)
-- DO THIS IN SUPABASE DASHBOARD:
-- 1. Go to Storage > Buckets
-- 2. Create new bucket named "memory-images"
-- 3. Make it PUBLIC
-- 4. Add the RLS policies below

-- RLS Policies for memories table (SELECT for public, INSERT/UPDATE/DELETE for authenticated)
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

-- RLS Policies for memory-images storage bucket
-- Step 1: Create bucket in Supabase Dashboard > Storage > Buckets
-- Name: "memory-images", Make it PUBLIC

-- Step 2: Drop any existing policies (optional, if you get conflicts)
-- DROP POLICY IF EXISTS "Enable public read access" ON storage.objects;
-- DROP POLICY IF EXISTS "Enable authenticated users to upload" ON storage.objects;
-- DROP POLICY IF EXISTS "Enable authenticated users to update" ON storage.objects;
-- DROP POLICY IF EXISTS "Enable authenticated users to delete" ON storage.objects;

-- Step 3: Create bucket (if not exists)
INSERT INTO storage.buckets (id, name, public)
VALUES ('memory-images', 'memory-images', true)
ON CONFLICT DO NOTHING;

-- Step 4: Create RLS policies for storage.objects
-- IMPORTANT: These policies MUST be run after creating the bucket

-- Policy 1: Allow public to SELECT (read) images
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

-- Policy 2: Allow authenticated users to INSERT (upload)
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

-- Policy 3: Allow authenticated users to UPDATE
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

-- Policy 4: Allow authenticated users to DELETE
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
