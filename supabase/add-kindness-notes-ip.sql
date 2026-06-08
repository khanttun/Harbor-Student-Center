-- Run this if kindness_notes already exists without ip_address.

ALTER TABLE kindness_notes
  ADD COLUMN IF NOT EXISTS ip_address TEXT;
