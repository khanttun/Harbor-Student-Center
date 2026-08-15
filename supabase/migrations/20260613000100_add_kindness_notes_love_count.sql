-- Ported from LOVE_REACTIONS_SETUP.sql.
-- Adds the love_count reaction counter to kindness_notes.
--
-- If RLS is enabled and the app updates this column using the anon key, a policy
-- allowing that UPDATE must exist, e.g.:
--   CREATE POLICY "Allow love reactions" ON kindness_notes
--     FOR UPDATE USING (true) WITH CHECK (true);
-- Left commented in the original source; add it here if love reactions are anon-writable
-- in production.

ALTER TABLE kindness_notes
  ADD COLUMN IF NOT EXISTS love_count INTEGER NOT NULL DEFAULT 0;
