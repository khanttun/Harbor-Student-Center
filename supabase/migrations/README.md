# Migrations

Consolidated, ordered history of the SQL that was previously scattered across
`ANNOUNCEMENTS_SUPABASE_SETUP.sql`, `FIX_STORAGE_RLS.sql`, `LOVE_REACTIONS_SETUP.sql`,
`MEMORIES_SUPABASE_SETUP.sql`, and `supabase/*.sql` at the repo root. Each file here is a
faithful, unmodified port of one of those originals — same SQL, just reordered into a
single chronological sequence (verified against `git log` for each source file) and
renamed to the `<timestamp>_<description>.sql` convention the Supabase CLI expects.

The original files are left in place (some are linked from `MEMORIES_SETUP_GUIDE.md`),
but this directory is the source of truth going forward — new schema/RLS changes should
land here, not as a new loose `.sql` file at the repo root.

## What this does — and doesn't — cover

Running these migrations in order against a **fresh** Supabase project reproduces the
`memories`, `announcements`, and `kindness_notes` tables, their RLS policies, and the
`memory-images` storage bucket, as of when each original file was written.

It does **not** cover schema that was applied directly (e.g. via the Supabase dashboard)
and never captured in a tracked `.sql` file. Confirmed gaps, found by cross-referencing
the app code against what's migrated here:

- `kindness_notes.is_pinned` (boolean) — used by the pin feature in
  `components/admin/KindnessNotesForm.tsx` and the dashboard KPI in `app/dashboard/page.tsx`
- `kindness_notes.parent_id` (uuid, self-referencing) — used by the reply feature in the
  same form, and filtered on in the dashboard KPI query

Before treating this directory as a complete source of truth (e.g. to provision a new
environment), run `supabase db pull` against the live project to capture these and any
other undocumented drift, and add the result as a new migration here.

## Do not replay against the existing production database

These migrations assume a fresh database. Running them against the already-configured
production project is likely to error (e.g. `CREATE TABLE memories` without
`IF NOT EXISTS`) or, per the note in
`20260413000200_fix_memory_images_storage_policies.sql`, create redundant duplicate
storage policies. They're meant for provisioning a new project (staging, disaster
recovery, onboarding), not for reapplying to the one already running.
