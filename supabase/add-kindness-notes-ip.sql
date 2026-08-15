-- Superseded by supabase/migrations/20260609000300_add_kindness_notes_ip_address.sql,
-- which is the source of truth going forward.

-- Run this if kindness_notes already exists without ip_address.

ALTER TABLE kindness_notes
  ADD COLUMN IF NOT EXISTS ip_address TEXT;
