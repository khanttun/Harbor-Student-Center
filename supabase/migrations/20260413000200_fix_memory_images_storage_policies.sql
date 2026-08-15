-- Ported from FIX_STORAGE_RLS.sql (originally: "run this if you get 'violates row-level
-- security policy' errors"). Re-issued as memory-images-* named policies after the
-- previous migration's policies proved unreliable in production.
--
-- KNOWN ISSUE (carried over as-is, not fixed here to keep this a faithful port):
-- the DROP POLICY names below don't match the names created in the prior migration
-- ("Enable public read access for memory-images", etc.), so on a fresh database both
-- sets of SELECT/INSERT/UPDATE/DELETE policies end up coexisting on storage.objects for
-- the memory-images bucket. They're redundant, not broken (Postgres RLS policies are
-- OR'd), but worth cleaning up in a future migration.

INSERT INTO storage.buckets (id, name, public)
VALUES ('memory-images', 'memory-images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

DROP POLICY IF EXISTS "Enable public read access" ON storage.objects;
DROP POLICY IF EXISTS "Enable authenticated users to upload" ON storage.objects;
DROP POLICY IF EXISTS "Enable authenticated users to update" ON storage.objects;
DROP POLICY IF EXISTS "Enable authenticated users to delete" ON storage.objects;
DROP POLICY IF EXISTS "memory-images-public-read" ON storage.objects;
DROP POLICY IF EXISTS "memory-images-authenticated-insert" ON storage.objects;
DROP POLICY IF EXISTS "memory-images-authenticated-update" ON storage.objects;
DROP POLICY IF EXISTS "memory-images-authenticated-delete" ON storage.objects;

CREATE POLICY "memory-images-public-read" ON storage.objects
  FOR SELECT
  USING (bucket_id = 'memory-images');

CREATE POLICY "memory-images-authenticated-insert" ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'memory-images'
     AND auth.uid() IS NOT NULL
  );

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

CREATE POLICY "memory-images-authenticated-delete" ON storage.objects
  FOR DELETE
  USING (
    bucket_id = 'memory-images'
     AND auth.uid() IS NOT NULL
  );
