-- Add love_count column to kindness_notes table
-- Run this in your Supabase SQL editor

ALTER TABLE kindness_notes
  ADD COLUMN IF NOT EXISTS love_count INTEGER NOT NULL DEFAULT 0;

-- Optional: allow anyone (anon) to increment love_count via RLS
-- (the API uses the anon key, so this policy must exist)
-- If you have RLS enabled, add a policy that allows UPDATE on love_count:
-- CREATE POLICY "Allow love reactions" ON kindness_notes
--   FOR UPDATE USING (true)
--   WITH CHECK (true);
