# Kindness Notes Backend Setup Guide

## Overview
The **Kindness Notes Section** displays messages of appreciation that students leave for Katrina and Floyd on the Memories page. This guide provides all necessary backend setup instructions.

## Frontend Component Location
- **Component**: `components/sections/kindness-notes-section.tsx`
- **Page**: `app/memories/page.tsx`
- **Features**:
  - Displays notes filtered by recipient (Katrina or Floyd)
  - Tab switching between recipients
  - Shows student name, message, and when it was posted
  - Beautiful UI with animations and hover effects
  - Call-to-action link to the contact page to leave notes

## Database Schema

### Supabase Table: `kindness_notes`

```sql
CREATE TABLE kindness_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_name TEXT NOT NULL,
  message TEXT NOT NULL,
  recipient TEXT NOT NULL CHECK (recipient IN ('katrina', 'floyd')),
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now(),
  is_approved BOOLEAN DEFAULT false
);

-- Create index for faster queries
CREATE INDEX idx_kindness_notes_recipient ON kindness_notes(recipient);
CREATE INDEX idx_kindness_notes_created_at ON kindness_notes(created_at DESC);
CREATE INDEX idx_kindness_notes_approved ON kindness_notes(is_approved);
```

### Column Descriptions
- **id**: Unique identifier (UUID)
- **student_name**: Name of the student leaving the note
- **message**: The appreciation message text
- **recipient**: Who the note is for - must be either `'katrina'` or `'floyd'`
- **created_at**: Timestamp when the note was created
- **updated_at**: Timestamp when the note was last updated
- **is_approved**: Boolean flag for moderation (only show approved notes to users)

## API Endpoints Required

### 1. POST `/api/kindness-notes`
**Purpose**: Submit a new kindness note

**Request Body**:
```json
{
  "student_name": "Sarah Johnson",
  "message": "Thank you for everything you do!",
  "recipient": "katrina"
}
```

**Response** (Success - 201):
```json
{
  "success": true,
  "message": "Note submitted successfully",
  "id": "uuid-here"
}
```

**Response** (Error - 400):
```json
{
  "success": false,
  "error": "Invalid recipient or missing fields"
}
```

**Implementation Notes**:
- Validate that `recipient` is either 'katrina' or 'floyd'
- Validate required fields (student_name, message, recipient)
- Store with `is_approved: false` by default (for moderation)
- Sanitize/escape the message to prevent XSS
- Optionally add rate limiting to prevent spam
- Consider adding a CAPTCHA for security

---

### 2. GET `/api/kindness-notes?recipient={name}`
**Purpose**: Fetch approved kindness notes for a specific recipient

**Query Parameters**:
- `recipient` (required): Either 'katrina' or 'floyd'
- `limit` (optional): Number of notes to return (default: 50)
- `offset` (optional): For pagination (default: 0)

**Response** (Success - 200):
```json
[
  {
    "id": "uuid-1",
    "student_name": "Sarah Johnson",
    "message": "Thank you for always being there!",
    "recipient": "katrina",
    "created_at": "2024-04-20T10:30:00Z"
  },
  {
    "id": "uuid-2",
    "student_name": "Marcus Chen",
    "message": "Your guidance means so much to me.",
    "recipient": "katrina",
    "created_at": "2024-04-18T14:15:00Z"
  }
]
```

**Implementation Notes**:
- Only return notes where `is_approved: true`
- Order by `created_at` in descending order (newest first)
- Return empty array if no notes exist
- Validate recipient parameter

---

### 3. GET `/api/kindness-notes/admin` (Optional - For Admin Dashboard)
**Purpose**: Fetch unapproved notes for moderation

**Authentication**: Requires admin authorization

**Query Parameters**:
- `is_approved` (optional): Filter by approval status
- `recipient` (optional): Filter by recipient

**Response**:
```json
{
  "pending": [
    {
      "id": "uuid",
      "student_name": "John Doe",
      "message": "Thank you!",
      "recipient": "floyd",
      "created_at": "2024-04-25T08:00:00Z",
      "is_approved": false
    }
  ],
  "count": 1
}
```

---

### 4. PATCH `/api/kindness-notes/{id}/approve` (Optional - For Admin Dashboard)
**Purpose**: Approve a kindness note for display

**Authentication**: Requires admin authorization

**Request Body**:
```json
{
  "is_approved": true
}
```

**Response**:
```json
{
  "success": true,
  "message": "Note approved successfully"
}
```

---

## Frontend Integration

The component currently uses **mock data** for demonstration. To connect it to your backend:

1. **Uncomment the fetch logic** in `kindness-notes-section.tsx`:
```typescript
// Find this section (around line 60):
// const response = await fetch(`/api/kindness-notes?recipient=${selectedRecipient}`);
// const data = await response.json();
// setNotes(data);

// Uncomment these lines and remove the mock data
```

2. **Remove mock data** (lines 64-85):
```typescript
// Delete this entire block once backend is ready:
const mockNotes: KindnessNote[] = [...]
```

## Security Considerations

1. **Validation**: Validate all inputs on the backend
2. **Sanitization**: Escape/sanitize messages to prevent XSS attacks
3. **Rate Limiting**: Implement rate limiting to prevent spam
4. **CAPTCHA**: Consider adding CAPTCHA verification for form submissions
5. **Moderation**: Require admin approval before notes are visible
6. **CORS**: Configure CORS properly for API requests
7. **SQL Injection**: Use parameterized queries (Supabase handles this automatically)

## Moderation Workflow (Recommended)

1. Student submits note via contact page
2. Note is stored with `is_approved: false`
3. Admin reviews pending notes in admin dashboard
4. Admin approves/rejects notes
5. Only approved notes display on the Memories page

## Contact Form Integration

The contact page's `ThankYouForm` component should be updated to:
1. Accept a "recipient" parameter (katrina or floyd)
2. Call the `POST /api/kindness-notes` endpoint instead of (or in addition to) the current `/api/thanks` endpoint

See `components/ThankYouForm.tsx` for where to make this change.

## Environment Variables (if needed)

Add to your `.env.local`:
```
NEXT_PUBLIC_KINDNESS_NOTES_API=http://localhost:3000/api
```

## Testing

### Test the GET endpoint:
```bash
curl "http://localhost:3000/api/kindness-notes?recipient=katrina"
```

### Test the POST endpoint:
```bash
curl -X POST "http://localhost:3000/api/kindness-notes" \
  -H "Content-Type: application/json" \
  -d '{
    "student_name": "Test User",
    "message": "This is a test message",
    "recipient": "katrina"
  }'
```

## Component Props & Usage

```typescript
// The component is self-contained and requires no props:
import { KindnessNotesSection } from "@/components/sections/kindness-notes-section";

export default function MemoriesPage() {
  return (
    <main>
      <KindnessNotesSection />
    </main>
  );
}
```

## Styling & Customization

The component uses Tailwind CSS and follows the design system of the project:
- Colors: Rose/Amber gradient theme
- Typography: Uses `--font-heading` CSS variable
- Responsive: Mobile-first design with sm, md breakpoints
- Animations: Smooth fade-in animations with stagger effect

## Troubleshooting

**Notes not showing?**
- Check that the backend endpoint is returning data
- Verify recipient parameter is either 'katrina' or 'floyd'
- Check browser console for fetch errors

**Form submission not working?**
- Update `ThankYouForm.tsx` to call the new API endpoint
- Ensure the backend is handling POST requests correctly

**Styling looks off?**
- Clear browser cache
- Verify Tailwind CSS is properly configured
- Check that all CSS variables are defined in your theme

## Timeline

This was created as a frontend-only task. Backend development can proceed independently after the schema and endpoints are defined.
