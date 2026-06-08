-- Run this in the Supabase SQL editor to enable Messages of Appreciation.

CREATE TABLE IF NOT EXISTS kindness_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_name TEXT NOT NULL,
  message TEXT NOT NULL,
  ip_address TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_kindness_notes_created_at
  ON kindness_notes (created_at DESC);

ALTER TABLE kindness_notes ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'kindness_notes'
      AND policyname = 'Kindness notes are readable by everyone'
  ) THEN
    CREATE POLICY "Kindness notes are readable by everyone" ON kindness_notes
      FOR SELECT
      USING (true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'kindness_notes'
      AND policyname = 'Anyone can submit kindness notes'
  ) THEN
    CREATE POLICY "Anyone can submit kindness notes" ON kindness_notes
      FOR INSERT
      WITH CHECK (true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'kindness_notes'
      AND policyname = 'Authenticated users can delete kindness notes'
  ) THEN
    CREATE POLICY "Authenticated users can delete kindness notes" ON kindness_notes
      FOR DELETE
      USING (auth.uid() IS NOT NULL);
  END IF;
END $$;

ALTER PUBLICATION supabase_realtime ADD TABLE kindness_notes;
