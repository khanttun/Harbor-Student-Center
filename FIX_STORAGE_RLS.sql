-- STORAGE RLS FIX FOR MEMORY-IMAGES BUCKET
-- Run this in Supabase SQL Editor if you get "violates row-level security policy" errors

-- Step 1: Ensure bucket exists and is public
INSERT INTO storage.buckets (id, name, public)
VALUES ('memory-images', 'memory-images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Step 2: Drop old conflicting policies (if they exist)
DROP POLICY IF EXISTS "Enable public read access" ON storage.objects;
DROP POLICY IF EXISTS "Enable authenticated users to upload" ON storage.objects;
DROP POLICY IF EXISTS "Enable authenticated users to update" ON storage.objects;
DROP POLICY IF EXISTS "Enable authenticated users to delete" ON storage.objects;
DROP POLICY IF EXISTS "memory-images-public-read" ON storage.objects;
DROP POLICY IF EXISTS "memory-images-authenticated-insert" ON storage.objects;
DROP POLICY IF EXISTS "memory-images-authenticated-update" ON storage.objects;
DROP POLICY IF EXISTS "memory-images-authenticated-delete" ON storage.objects;

-- Step 3: Create new policies for memory-images bucket

-- Allow public to read images
CREATE POLICY "memory-images-public-read" ON storage.objects
  FOR SELECT
  USING (bucket_id = 'memory-images');

-- Allow authenticated to upload
CREATE POLICY "memory-images-authenticated-insert" ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'memory-images'
     AND auth.uid() IS NOT NULL
  );

-- Allow authenticated to update their own files
CREATE POLICY "memory-images-authenticated-update" ON storage.objects
  FOR UPDATE
  USING (
    bucket_id = 'memory-images'
     AND auth.uid() IS NOT NULL
  )
  WITH CHECK (
    bucket_id = 'memory-images'
     AND auth.uid() IS NOT NULL
  );

-- Allow authenticated to delete their own files
CREATE POLICY "memory-images-authenticated-delete" ON storage.objects
  FOR DELETE
  USING (
    bucket_id = 'memory-images'
     AND auth.uid() IS NOT NULL
  );

-- Verify policies are in place
SELECT policyname, roles, qual, with_check
FROM pg_policies
WHERE tablename = 'objects' AND schemaname = 'storage'
ORDER BY policyname;
