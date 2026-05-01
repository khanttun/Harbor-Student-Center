-- Create announcements table
CREATE TABLE IF NOT EXISTS announcements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on announcements table
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;

-- Read policy for public pages
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'announcements'
      AND policyname = 'Announcements are readable by everyone'
  ) THEN
    CREATE POLICY "Announcements are readable by everyone" ON announcements
      FOR SELECT
      USING (true);
  END IF;
END $$;

-- Write policies for authenticated dashboard users
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'announcements'
      AND policyname = 'Authenticated users can insert announcements'
  ) THEN
    CREATE POLICY "Authenticated users can insert announcements" ON announcements
      FOR INSERT
      WITH CHECK (auth.uid() IS NOT NULL);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'announcements'
      AND policyname = 'Authenticated users can update announcements'
  ) THEN
    CREATE POLICY "Authenticated users can update announcements" ON announcements
      FOR UPDATE
      USING (auth.uid() IS NOT NULL)
      WITH CHECK (auth.uid() IS NOT NULL);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'announcements'
      AND policyname = 'Authenticated users can delete announcements'
  ) THEN
    CREATE POLICY "Authenticated users can delete announcements" ON announcements
      FOR DELETE
      USING (auth.uid() IS NOT NULL);
  END IF;
END $$;