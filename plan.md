# The Harbor Student Center — Project Plan

Living roadmap for the project. `README.md` documents how the app works today; this file tracks where it stands and what's next. Update it as priorities shift — it's meant to be edited, not archived.

## 1. Snapshot

Community platform for Myanmar students at Mae Fah Luang University: public marketing/community site (home, about, events, memories, contact, kindness notes) plus an authenticated admin dashboard for content management. Next.js 16 (App Router, Turbopack) + TypeScript + Tailwind v4 + Supabase (Postgres, Auth, Storage).

Status: actively developed, single maintainer, deployed features are in real use (not a prototype).

## 2. Current State

### Public site
- Home, About, Events, Memories, Contact pages — built, using shared `sections/*` components
- Memories timeline (`timeline-tree-section`) — pulls from Supabase, supports multi-image entries
- Announcements — public display component + scheduled publishing (added recently)
- Kindness notes / appreciation — public submission form, with pin + reply support and IP-based rate limiting (`add-kindness-notes-ip.sql`)
- Event cards — responsive grid, multi-image preview, share button

### Admin dashboard (`/dashboard`, gated by `middleware.ts`)
- Auth-protected via Supabase session (redirects `/dashboard → /login` and back)
- CRUD for: announcements, events, memories, kindness notes/appreciation, admins
- Scheduled uploads for announcements and events
- Image upload wired to Supabase Storage

### Backend / data
- Supabase Postgres for `announcements`, `events`, `memories`, kindness notes tables
- Storage buckets for memory/event photos
- RLS/schema history now versioned in `supabase/migrations/` (see §4) — the original loose `.sql` files still exist for guide compatibility but are marked superseded

## 3. Architecture Notes

- `lib/supabase/client.ts` + `server.ts` are the current pattern; `lib/supabaseClient.ts` is marked "legacy" in the README — confirm nothing still imports it before deleting
- Tailwind v4 config lives in CSS (`app/globals.css` / `styles/globals.css`) via `@theme`, not a `tailwind.config.ts` — README's project-structure diagram still lists one, worth fixing next time the README is touched
- `next.config.mjs` has `typescript.ignoreBuildErrors: true` — intentional per README ("for flexibility"), but means `next build` won't catch type errors; `tsc --noEmit` or CI type-checking would be the only backstop if that's ever wanted

## 4. Housekeeping / Risks

**Resolved:**
- ~~`dev.db` tracked in git~~ — removed (unreferenced Prisma-era leftover; confirmed no code, env var, or `.prisma` schema referenced it)
- ~~`tsconfig.tsbuildinfo` tracked~~ — removed and gitignored (`*.tsbuildinfo`)
- ~~`lib/supabaseClient.ts` legacy client~~ — removed (confirmed zero imports outside itself)
- ~~SQL setup spread across five loose files, no ordering~~ — ported into `supabase/migrations/` as an ordered sequence (chronology verified against `git log` per file); originals kept in place with pointer comments since `MEMORIES_SETUP_GUIDE.md` links to two of them. See `supabase/migrations/README.md` for scope and a confirmed gap: `kindness_notes.is_pinned` and `kindness_notes.parent_id` (pin/reply feature) exist in production but were never captured in any tracked `.sql` file — run `supabase db pull` before treating the migrations directory as complete.
- ~~No CI / type-check backstop~~ — added `.github/workflows/ci.yml` (runs `npm run type-check` and `npm run lint` on push/PR to `main`), plus a `type-check` script (`tsc --noEmit`) in `package.json`
- Found and removed `components/sections/carousel.tsx` — an unused, broken component (`ReferenceError` on an undefined `memoriesByYear`) that was blocking a clean `tsc --noEmit` run; verified unimported anywhere and superseded by the timeline-based memories UI
- `.gitignore`'s blanket `*.sql` rule now explicitly allows `supabase/migrations/*.sql`

- ~~`Downloads/Harbor-Student-Center-main/Harbor-Student-Center-main/` full project duplicate (191 files, ~25MB)~~ — removed. It was a stale GitHub ZIP-download artifact tracked since the initial commit, unimported anywhere, and inconsistent even with itself (referenced modules like `@/lib/scheduling` that didn't exist in its own copy).

**Still open:**
- No automated tests (no test runner, no `*.test.*`/`*.spec.*` files) — everything is verified manually today
- `.env.local` exists in the working tree (correctly gitignored) — no action needed, confirmed not at risk of being committed
- `npm install` currently reports 1 high-severity advisory (`npm audit` for details) — not investigated, out of scope for this pass

## 5. Roadmap

Proposed, not committed — reprioritize freely.

**Now**
- Run `supabase db pull` to capture the `is_pinned`/`parent_id` schema drift noted in §4 as a proper migration

**Later**
- Lightweight test coverage for the admin CRUD flows and the kindness-notes rate limiting (highest-risk logic, least visible if it silently breaks)
- Revisit `admins` management (`app/dashboard/admins`) if the team grows beyond one admin — confirm role/permission model still fits

## 6. Open Decisions

Flagging these rather than deciding them — they depend on things I don't have visibility into (team size, hosting budget, how much this needs to scale):

- Is multi-admin / role-based access actually needed, or is single-admin auth sufficient for the foreseeable future?
- Is automated testing worth the setup cost for a project this size, or does manual verification remain the right call?
- Any plan to move off ad hoc `.sql` files to a real migration tool (Supabase CLI migrations, etc.)?
