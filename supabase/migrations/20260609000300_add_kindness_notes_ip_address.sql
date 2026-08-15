-- Ported from supabase/add-kindness-notes-ip.sql.
-- Originally a follow-up for databases where kindness_notes was created before
-- ip_address existed. The prior migration already includes ip_address inline, so on a
-- fresh database this is a no-op — kept only to preserve the original history.

ALTER TABLE kindness_notes
  ADD COLUMN IF NOT EXISTS ip_address TEXT;
