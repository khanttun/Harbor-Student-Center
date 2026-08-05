# The Harbor Student Center

A welcoming digital hub created for Myanmar students at Mae Fah Luang University. The Harbor is a free, independent community space designed to help students connect, share meals, build memories, and feel at home away from home.

## 🌊 Project Overview

The Harbor Student Center is a modern, responsive web application built with Next.js 16, React, and TypeScript. It serves as a community platform featuring:

- **Community Hub** - Central gathering place for Myanmar students
- **Event Management** - Schedule and announcements for gatherings
- **Memory Timeline** - Visual timeline of community moments and celebrations
- **Admin Dashboard** - Content management for events, memories, and announcements
- **Contact Portal** - Direct communication and feedback collection

## 🚀 Tech Stack

- **Framework**: Next.js 16.2.3 (with Turbopack)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + PostCSS
- **UI Components**: Radix UI
- **Animation**: Framer Motion
- **Backend**: Supabase (PostgreSQL + Auth)
- **Database**: Supabase
- **Image Optimization**: Next.js Image component
- **Forms**: React Hook Form
- **Icons**: Lucide React
- **Package Manager**: npm

## 📦 Installation & Setup

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account ([https://supabase.com](https://supabase.com))

### Getting Started

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd "Harbor-Student-Center"
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Supabase credentials**
   - Create a file `.env.local` in the root directory
   - Add your Supabase credentials:
     ```env
     NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
     NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
     ```

4. **Run development server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser

5. **Build for production**
   ```bash
   npm run build
   npm start
   ```

## 📂 Project Structure

```
Harbor-Student-Center/
├── app/                          # Next.js app directory (pages & layouts)
│   ├── page.tsx                 # Home page
│   ├── about/page.tsx           # About page
│   ├── events/page.tsx          # Events & schedule page
│   ├── memories/page.tsx        # Memories timeline page
│   ├── contact/page.tsx         # Contact & feedback page
│   ├── login/page.tsx           # Admin login page
│   ├── dashboard/               # Admin dashboard
│   │   ├── page.tsx            # Dashboard main
│   │   ├── announcements/      # Announcements management
│   │   ├── events/             # Events management
│   │   └── memories/           # Memories management
│   ├── layout.tsx              # Root layout
│   └── globals.css             # Global styles
│
├── components/                   # Reusable React components
│   ├── sections/               # Page sections (hero, mission, etc.)
│   │   ├── hero-section.tsx
│   │   ├── about-hero-section.tsx
│   │   ├── mission-section.tsx
│   │   ├── what-we-do-section.tsx
│   │   ├── values-section.tsx
│   │   ├── quote-section.tsx
│   │   ├── timeline-tree-section.tsx
│   │   ├── schedule-section.tsx
│   │   ├── upcoming-events-section.tsx
│   │   ├── announcements-section.tsx
│   │   ├── memories-section.tsx
│   │   └── [more sections...]
│   ├── admin/                  # Admin form components
│   │   ├── AnnouncementForm.tsx
│   │   ├── EventForm.tsx
│   │   └── MemoryForm.tsx
│   ├── ui/                     # Base UI components (Radix UI based)
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── form.tsx
│   │   ├── dialog.tsx
│   │   └── [other UI components...]
│   ├── Announcements.tsx       # Announcements display component
│   ├── navbar.tsx              # Navigation bar
│   ├── footer.tsx              # Footer
│   ├── theme-provider.tsx      # Theme context
│   ├── scroll-to-top-button.tsx
│   └── feature-card.tsx
│
├── lib/                         # Utility functions & services
│   ├── supabase/
│   │   ├── client.ts           # Browser Supabase client
│   │   └── server.ts           # Server Supabase client
│   ├── supabaseClient.ts       # Legacy Supabase client
│   └── utils.ts                # Helper functions
│
├── hooks/                       # Custom React hooks
│   ├── use-mobile.ts
│   └── use-toast.ts
│
├── public/                      # Static assets
│   └── images/
│       ├── harborlogo.jpg
│       ├── hero-*.jpg
│       ├── about-hero.jpg
│       ├── event-hero.jpg
│       ├── memories-hero.jpg
│       └── [other images...]
│
├── styles/                      # Global styles
│   └── globals.css
│
├── next.config.mjs             # Next.js configuration
├── tsconfig.json               # TypeScript configuration
├── tailwind.config.ts          # Tailwind CSS configuration
├── postcss.config.mjs          # PostCSS configuration
├── components.json             # shadcn/ui components config
├── package.json                # Project dependencies
├── .env.example                # Environment variables template
└── README.md                   # This file
```

## 📄 Pages & Features

### 🏠 **Home Page** (`/`)
- **Hero Section**: Animated carousel with 3 slides showcasing the community
- **Mission Statement**: "Our Purpose" with the Harbor's mission
- **What We Do**: Services and activities offered
- **Upcoming Events**: Preview of next community gathering
- **Announcements**: Latest community updates and news
- **Memories Gallery**: Recent community moments
- **Call-to-Action**: Encouragement to join the community

### ℹ️ **About Page** (`/about`)
- **Hero Section**: Beautiful hero image with title overlay
- **Our Story**: History and background of The Harbor
- **People Section**: Team members and contributors
- **Values Section**: Core principles (Kindness, Community, Care)
- **Quote Section**: Inspirational message about the community
- **Meaning Section**: What "Harbor" means to the organization
- **Call-to-Action**: Invitation to get involved

### 📅 **Events Page** (`/events`)
- **Hero Section**: Events-focused header
- **Schedule Section**: Weekly event calendar
- **Upcoming Events**: Detailed list of future gatherings
- **Announcements Section**: Event-related announcements
- **Call-to-Action**: Sign up or get more information

### 📸 **Memories Page** (`/memories`)
- **Hero Section**: Memories-focused header
- **Timeline Tree Section**: Interactive vertical timeline of community moments
- **Database Integration**: Fetches memories from Supabase
- **Call-to-Action**: Submit your own memories

### 📞 **Contact Page** (`/contact`)
- **Hero Section**: Contact information header
- **Contact Methods Section**: Multiple ways to reach the community
- **Location Section**: Map and physical location
- **Thank You Form**: Community feedback and appreciation form
- **Call-to-Action**: Encouragement to stay connected

### 🔐 **Admin Pages** (`/dashboard`)
- **Login Page** (`/login`): Admin authentication
- **Dashboard Main** (`/dashboard`): Admin overview
- **Announcements Management**: Create, edit, delete announcements
- **Events Management**: Create, edit, delete events
- **Memories Management**: Create, edit, delete memory entries
- **Image Upload**: Direct storage integration for photos

## 🎨 Design & Components

### Layout System
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Color Scheme**: Light/dark mode support with CSS variables
- **Typography**: Custom heading font family with fallbacks
- **Spacing**: Consistent padding/margins using Tailwind scale

### Hero Sections Dimensions
| Page | Height | Min Height | Notes |
|------|--------|-----------|-------|
| Home | `h-[80vh]` | `min-h-[600px]` | Full-screen carousel |
| About | `h-[60vh]` | `min-h-[400px]` | Medium height |
| Events/Memories/Contact | `h-[50vh]` | `min-h-100` | Standard height |

### Key UI Components
- **Section Heading**: Reusable title with optional subtitle
- **Feature Card**: Card layout for showcasing features
- **Event Card**: Display event information with dates/times
- **Image Card**: Responsive image containers
- **Button Group**: Multiple button layouts
- **Announcements Component**: Live announcement display

## 🔗 Navigation

**Main Navigation Links:**
- Home (`/`)
- About (`/about`)
- Events (`/events`)
- Memories (`/memories`)
- Contact (`/contact`)

**Admin Navigation:**
- Login (`/login`)
- Dashboard (`/dashboard`)
  - Announcements (`/dashboard/announcements`)
  - Events (`/dashboard/events`)
  - Memories (`/dashboard/memories`)

## 🗄️ Database (Supabase)

### Required Tables

**announcements**
```
- id: UUID (Primary Key)
- title: Text
- content: Text
- created_at: Timestamp
```

**events**
```
- id: UUID (Primary Key)
- title: Text
- date: Date/Timestamp
- time: Text
- description: Text
- location: Text
- created_at: Timestamp
```

**memories**
```
- id: UUID (Primary Key)
- title: Text
- date: Date
- caption: Text
- image_url: Text
- created_at: Timestamp
```

### Storage Buckets
- `memories`: Store memory photos
- `events`: Store event photos (optional)

## 🔒 Authentication & Security

- **Supabase Auth**: Email/password authentication for admin access
- **Row Level Security (RLS)**: Database policies for data protection
- **Environment Variables**: Sensitive data stored in `.env.local`
- **Non-public Access**: Admin features protected by authentication

## 🎬 Animations & Interactions

- **Framer Motion**: Smooth page transitions and component animations
- **Hero Carousel**: Auto-rotating image slideshow (5s interval)
- **Scroll Animations**: Elements animate in on viewport entry
- **Navbar Scroll Effect**: Navbar styling changes on scroll
- **Mobile Menu**: Animated hamburger menu for responsive design

## ⚙️ Configuration

### Environment Variables (`.env.local`)
```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### TypeScript Configuration
- Strict mode enabled
- Next.js app type definitions
- ESLint integration

### Build Optimization
- Image optimization enabled
- Turbopack bundler for fast builds
- TypeScript build errors ignored (for flexibility)

## 🚨 Troubleshooting

### "Cannot read properties of undefined (reading 'replace')"
**Solution**: Ensure all environment variables are properly set in `.env.local`

### "Network error. Check your Supabase URL..."
**Solution**: Update `.env.local` with real Supabase credentials (not placeholder values)

### Images not loading
**Solution**: 
- Check image paths in `public/images/`
- Verify image file names match component references
- Clear `.next` build cache and rebuild

### Database connection errors
**Solution**:
- Verify Supabase project is active
- Check RLS policies are properly configured
- Ensure database tables exist with correct schema
- Verify user has proper permissions

## 📝 Content & Messaging

### Key Messages
- **Hero**: "A Home Away From Home" - For Myanmar students at Mae Fah Luang University
- **Mission**: The Harbor is a free, independent space created with love for students
- **Quote**: "The Harbor: A secure and welcoming place where you can rest after a difficult journey."
- **Values**: Kindness, Community, Care

### Community Focus Areas
1. **Connection**: Building relationships among Myanmar students
2. **Support**: Providing a safe, welcoming environment
3. **Celebration**: Sharing meals and creating memories together
4. **Belonging**: Creating a sense of home and family

## 🤝 Contributing

This is a community-driven project. To contribute:

1. Make changes to your feature branch
2. Test thoroughly before committing
3. Ensure TypeScript compilation passes
4. Submit pull requests with clear descriptions

## 📄 License

This project is created for the Myanmar student community at Mae Fah Luang University.

## 📧 Contact & Support

For questions or support regarding The Harbor Student Center, please use the contact form on the website or reach out through the contact methods listed on the Contact page.

---

**Last Updated**: April 2026
**Next.js Version**: 16.2.3 (Turbopack)
**Status**: Active Development
