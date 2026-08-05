# Memories CRUD Setup Guide

## What's Been Implemented

### 1. MemoryForm Component (`components/admin/MemoryForm.tsx`)

**Full CRUD Operations:**

- ✅ **Create** - Add new memories with title, date, caption, and image
- ✅ **Read** - Display list of all memories in admin dashboard
- ✅ **Update** - Edit existing memories (click pencil icon)
- ✅ **Delete** - Remove memories (click trash icon)

**Features:**

- Image upload to Supabase storage with validation (max 5MB, image files only)
- Preview image before upload
- Error handling with user-friendly messages
- List view showing all memories with thumbnails
- Form automatically resets after successful submission
- Cancel button appears when editing

### 2. TimelineTreeSection Component (`components/sections/timeline-tree-section.tsx`)

**Now Server-Rendered with Live Data:**

- ✅ Fetches memories directly from Supabase
- ✅ Groups memories by year (descending order)
- ✅ Displays in beautiful timeline layout
- ✅ Replaced static memory data with dynamic data

### 3. Admin Dashboard

**Location:** `/dashboard/memories`

- Displays MemoryForm with full CRUD interface
- Shows all memories in a scrollable list
- Edit/Delete buttons for each memory

### 4. Public Timeline

**Location:** `/memories`

- Displays TimelineTreeSection (server-rendered)
- Shows memories in chronological order
- Horizontal scrollable timeline with year grouping

## Supabase Database Setup

### Step 1: Create the Table and Storage Bucket

1. **Go to Supabase Dashboard** → SQL Editor
2. **Option A (Recommended):** Run the SQL from `MEMORIES_SUPABASE_SETUP.sql`
   - Copy all SQL commands
   - Paste into SQL Editor
   - Execute

3. **Option B (Manual):** Run these commands one by one:

```sql
-- Create memories table with fields
CREATE TABLE memories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  date DATE NOT NULL,
  caption TEXT NOT NULL,
  image_url TEXT,
  created_at TIMESTAMP DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE memories ENABLE ROW LEVEL SECURITY;

-- Create policies for public READ and authenticated WRITE
CREATE POLICY "Enable read access for all users" ON memories
  FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users" ON memories
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update for authenticated users" ON memories
  FOR UPDATE USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable delete for authenticated users" ON memories
  FOR DELETE USING (auth.role() = 'authenticated');
```

### Step 2: Create Storage Bucket

1. **Go to Storage** → **Buckets**
2. **Create new bucket:**
   - Name: `memory-images`
   - Make it **PUBLIC** (toggle on)
   - Click Create
3. **Add RLS Policies to the bucket:**

```sql
-- Run in SQL Editor for storage policies
INSERT INTO storage.buckets (id, name, public)
VALUES ('memory-images', 'memory-images', true)
ON CONFLICT DO NOTHING;

CREATE POLICY "Enable public read" ON storage.objects
  FOR SELECT USING (bucket_id = 'memory-images');

CREATE POLICY "Enable authenticated upload" ON storage.objects
  FOR INSERT TO authenticated WITH CHECK (bucket_id = 'memory-images');

CREATE POLICY "Enable authenticated update" ON storage.objects
  FOR UPDATE TO authenticated USING (bucket_id = 'memory-images')
  WITH CHECK (bucket_id = 'memory-images');

CREATE POLICY "Enable authenticated delete" ON storage.objects
  FOR DELETE TO authenticated USING (bucket_id = 'memory-images');
```

## Using the Memories System

### Admin Dashboard (`/dashboard/memories`)

1. **Add a New Memory:**
   - Fill in Title (e.g., "Pizza Night")
   - Select Date
   - Click to upload a photo
   - Write Caption/Story
   - Click "Save to Timeline"

2. **Edit a Memory:**
   - Find memory in the list
   - Click pencil icon
   - Form will populate with memory data
   - Make changes
   - Click "Update Memory"

3. **Delete a Memory:**
   - Find memory in the list
   - Click trash icon
   - Confirm deletion

### Public Timeline (`/memories`)

- Displays all memories in a beautiful horizontal timeline
- Memories grouped by year
- Images shown with title, date, and caption
- Hover to see animations

## Database Schema

```typescript
interface Memory {
  id: string; // UUID
  title: string; // e.g. "Pizza Night"
  date: string; // ISO date format (YYYY-MM-DD)
  caption: string; // Story/description
  image_url: string; // Full Supabase storage URL
  created_at: string; // Timestamp
}

// Organized by year for display:
// {
//   "2026": [memories from 2026],
//   "2025": [memories from 2025],
//   "2024": [memories from 2024]
// }
```

## Image Upload Details

### Storage Path Structure

```
memory-images/
└── memories/
    ├── 1712000000000-pizza-night.jpg
    ├── 1712000001000-birthday-party.jpg
    └── ...
```

### Image URL Format

```
https://<your-supabase-url>/storage/v1/object/public/memory-images/memories/<timestamp>-<filename>
```

### Validation

- ✅ File type: Must be image (jpg, png, gif, webp, etc.)
- ✅ Max size: 5MB
- ✅ File naming: Timestamps + original name sanitized

## Error Messages & Solutions

| Error                      | Solution                                                     |
| -------------------------- | ------------------------------------------------------------ |
| "Image upload failed"      | Check bucket "memory-images" exists and is PUBLIC            |
| "Memory creation failed"   | Ensure memories table was created with correct schema        |
| "Memory not found"         | Memory may have been deleted by another user                 |
| "Memories table not found" | Run the SQL setup commands - table not created yet           |
| "Permission denied"        | Check RLS policies are set correctly for authenticated users |

## Architecture

### Component Flow

```
Dashboard (/dashboard/memories)
  └─ DashboardMemoriesPage
      └─ MemoryForm (Client Component)
          ├─ Admin CRUD form
          ├─ Image upload handler
          └─ Memories list with edit/delete

Home / Public (/memories)
  └─ MemoriesPage
      └─ TimelineTreeSection (Server Component)
          ├─ Fetches from Supabase
          ├─ Groups by year
          └─ TimelineMemoryNode (displays each memory)
```

### Data Flow

```
Admin creates/edits/deletes → MemoryForm → Supabase DB + Storage
                                └─→ Reloads list

Public views → TimelineTreeSection → Fetches from Supabase → Renders timeline
```

## Key Files Modified

1. **components/admin/MemoryForm.tsx** - Full CRUD implementation
2. **components/sections/timeline-tree-section.tsx** - Server component, fetches from Supabase
3. **app/dashboard/memories/page.tsx** - Wraps MemoryForm
4. **app/memories/page.tsx** - Uses TimelineTreeSection

## Testing Checklist

- [ ] Can add new memory from admin dashboard
- [ ] Image uploads successfully
- [ ] Memory appears in dashboard list
- [ ] Can edit memory details
- [ ] Can delete memory
- [ ] Updated memory appears on public /memories page
- [ ] Timeline organizes by year correctly
- [ ] No console errors when loading

## Troubleshooting

### Images not showing in timeline

- Check image_url format in database
- Verify bucket "memory-images" is PUBLIC
- Check browser console for 403 errors

### Admin form not loading memories

- Check Supabase connection in .env.local
- Verify RLS policies allow SELECT
- Check console for Supabase errors

### Can't upload images

- Check bucket exists and is PUBLIC
- Verify RLS INSERT policy for authenticated users
- Check file size < 5MB
- Verify file is actual image (not renamed)

### "Image upload failed: Error: new row violates row-level security policy"

**This means the storage bucket RLS policies are not set correctly.**

**Quick Fix:**

1. Go to Supabase Dashboard → SQL Editor
2. Copy all SQL from [`FIX_STORAGE_RLS.sql`](FIX_STORAGE_RLS.sql)
3. Paste and execute in the SQL Editor

**Manual Fix Steps:**

1. **Check bucket exists:** Storage → Buckets → Verify "memory-images" exists and is PUBLIC
2. **Reset policies:**
   - Run this SQL to drop conflicting policies:
   ```sql
   DROP POLICY IF EXISTS "memory-images-public-read" ON storage.objects;
   DROP POLICY IF EXISTS "memory-images-authenticated-insert" ON storage.objects;
   DROP POLICY IF EXISTS "memory-images-authenticated-update" ON storage.objects;
   DROP POLICY IF EXISTS "memory-images-authenticated-delete" ON storage.objects;
   ```
3. **Create new policies:**
   - Run the full SQL from FIX_STORAGE_RLS.sql above

**If policies still don't work:**

- Ensure you're authenticated (logged in) before uploading
- Check browser console for detailed error
- Verify `.env.local` has correct Supabase URL and keys
- Try uploading a fresh file - sometimes cached settings cause issues

### "Error: must be owner of table objects"

**This error means the SQL script tried to ALTER TABLE on a Supabase-owned table.**

**Solution:** Use the updated [`FIX_STORAGE_RLS.sql`](FIX_STORAGE_RLS.sql) which removes the problematic `ALTER TABLE` line. The table RLS is already enabled by Supabase, so you only need to create policies.

If you run the original script, just skip the `ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;` line and run only the policy creation commands.

### Images not showing in timeline

- Check image_url format in database
- Verify bucket "memory-images" is PUBLIC
- Check browser console for 403 errors

### Admin form not loading memories

- Check Supabase connection in .env.local
- Verify RLS policies allow SELECT
- Check console for Supabase errors
