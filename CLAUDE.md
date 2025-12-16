# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## ⚙️ Workflow Instructions

1. **First think through the problem, read the codebase for relevant files, and write a plan to `tasks/todo.md`.**

2. **The plan should have a list of todo items that you can check off as you complete them.**

3. **Before you begin working, check in with me and I will verify the plan.**

4. **Then, begin working on the todo items, marking them as complete as you go.**

5. **Please, every step of the way, just give me a high-level explanation of what changes you made.**

6. **Make every task and code change you do as simple as possible. We want to avoid making any massive or complex changes. Every change should impact as little code as possible. Everything is about simplicity.**

7. **Finally, add a review section to the `todo.md` file with a summary of the changes you made and any other relevant information.**

8. **DO NOT BE LAZY. NEVER BE LAZY. IF THERE IS A BUG FIND THE ROOT CAUSE AND FIX IT. NO TEMPORARY FIXES. YOU ARE A SENIOR DEVELOPER. NEVER BE LAZY.**

9. **MAKE ALL FIXES AND CODE CHANGES AS SIMPLE AS HUMANLY POSSIBLE. THEY SHOULD ONLY IMPACT NECESSARY CODE RELEVANT TO THE TASK AND NOTHING ELSE. IT SHOULD IMPACT AS LITTLE CODE AS POSSIBLE. YOUR GOAL IS TO NOT INTRODUCE ANY BUGS. IT'S ALL ABOUT SIMPLICITY.**

## 📋 Project Overview

**Aphorismes Philosophiques** is an elegant web platform for discovering philosophical aphorisms and reflections. The site presents a curated collection of aphorismes with artistic visuals, organized by theme with an interactive tag cloud, and includes a simple admin interface for managing content.

**Stack:** Next.js 14+ (TypeScript), Tailwind CSS, Framer Motion, InstantDB, ImageKit, Vercel

**Key Reference:** See [PRD_Aphorismes_MVP.md](PRD_Aphorismes_MVP.md) for complete product requirements, architecture, and acceptance criteria.

## 🚀 Common Development Commands

### Initial Setup
```bash
npm install
```

### Development
```bash
npm run dev
# Runs Next.js dev server on http://localhost:3000
# Hot reload enabled
```

### Build & Production
```bash
npm run build
npm start
```

### Linting & Code Quality
```bash
npm run lint
# ESLint with Next.js config
```

### Testing
```bash
npm test
# Jest test runner (if set up)
```

### Single Test File
```bash
npm test -- [path-to-test-file]
```

### Type Checking
```bash
npm run type-check
# or tsc --noEmit
```

### Environment Setup
Create `.env.local` with:
```env
NEXT_PUBLIC_INSTANT_APP_ID=xxx
INSTANT_ADMIN_TOKEN=xxx
NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY=xxx
IMAGEKIT_PRIVATE_KEY=xxx
IMAGEKIT_URL_ENDPOINT=xxx
```

## 🏗️ Architecture & Structure

### Core Technology Stack
- **Frontend Framework:** Next.js 14+ with App Router (TypeScript)
- **Styling:** Tailwind CSS + CSS Modules (for custom animations)
- **Animations:** Framer Motion (elegant transitions and micro-interactions)
- **Database:** InstantDB (realtime, schemaless)
- **Authentication:** InstantDB Auth (email/password for single admin)
- **Image Management:** ImageKit.io SDK for upload and optimization
- **UI Components:** shadcn/ui (admin forms), Lucide React (icons)
- **Hosting:** Vercel with GitHub integration

### Directory Structure
```
/app                          # Next.js App Router pages & layouts
  /admin                      # Admin section (protected routes)
    /login                    # Admin authentication
    /nouveau                  # New aphorism form
    /edit/[id]               # Edit aphorism form
  /theme/[slug]              # Theme/tag filtering pages
  /galerie                   # Visual gallery view
  /search                    # Search results page
  /api                       # API routes
    /upload-image            # ImageKit upload endpoint (secured)
  page.tsx                   # Home page (hero + tag cloud)
  layout.tsx                 # Root layout

/components                   # Reusable React components
  /admin                     # Admin UI components
  /common                    # Shared components (nav, footer, etc)
  /aphorism                  # Aphorism display components
  /gallery                   # Gallery/lightbox components
  /tags                      # Tag cloud component

/lib                         # Utilities and helpers
  instant.ts                 # InstantDB client setup & queries
  imagekit.ts               # ImageKit client setup
  types.ts                  # Shared TypeScript types

/styles                      # Global styles & CSS modules
  globals.css               # Tailwind imports + global styles

/public                      # Static assets
  images/                   # Logos, favicons, etc

/types                       # TypeScript type definitions
  aphorism.ts              # Aphorism data model
  user.ts                  # User/admin types
```

### InstantDB Data Schema
```javascript
// aphorismes collection
{
  id: uuid,
  text: string,              // Main aphorism text
  tags: array<string>,       // Theme/topic tags (e.g., ["amour", "liberté"])
  imageUrl: string | null,   // ImageKit URL
  featured: boolean,         // Shows in hero section
  createdAt: timestamp,
  updatedAt: timestamp
}

// admin collection (managed by InstantDB Auth)
{
  id: uuid,
  email: string,
  // Password handled securely by InstantDB
}
```

### Page Routes & Purposes

| Route | Purpose |
|-------|---------|
| `/` | Home page with hero section (3-5 featured aphorismes) + interactive tag cloud |
| `/theme/[slug]` | Filter aphorismes by tag with lazy loading (10 items per load) |
| `/galerie` | Masonry grid gallery with lightbox modal and theme filtering |
| `/search?q=term` | Full-text search across aphorisme text and tags with debouncing |
| `/admin` | Protected dashboard with list of all aphorismes + CRUD actions |
| `/admin/login` | Admin authentication page |
| `/admin/nouveau` | Form to create new aphorisme with text, tags, optional image |
| `/admin/edit/[id]` | Edit existing aphorisme |
| `/api/upload-image` | Secured API endpoint for ImageKit image uploads |

## 🎨 Design & Development Guidelines

### Aesthetic Principles (High Priority)
The design follows a **"Atelier Vivant" (Living Workshop)** aesthetic, emphasizing texture, warmth, and immersion:

- **Theme:** Warm Charcoal background (`#0f0e0d`) with Antique Gold accents (`#cbb387`) and Deep Burgundy (`#8f232e`).
- **Texture:** Global paper grain noise overlay (`bg-noise`) for a non-digital, tactile feel.
- **Typography:** **Cormorant Garamond** (display/headings) for dramatic impact, **Outfit** (UI) for clean navigation.
- **Kinetic Type:** Hero section features massive, animated 9xl typography.
- **Rich Cards:** Glassmorphism with warm borders (`border-white/5`) and gold glow on hover (`shadow-primary`).
- **Reading Experience:** "Zen" modal with reduced contrast (`text-foreground/85`), justified text, and drop caps (lettrine).
- **Masonry Layout:** Responsive grid for "bento-box" style content density.

### Key Component Design Considerations

1. **Hero Aphorisme Card**
   - Large, immersive display with image background or text overlay
   - Transitions between featured aphorismes should be smooth (fade or slide)
   - Text overlay should be readable (contrast + shadow)

2. **Tag Cloud**
   - Font size proportional to aphorisme count
   - Toggle between popularity and alphabetical sorting
   - Hover reveals count; click filters aphorismes
   - Animated entrance and interactions

3. **Gallery Lightbox**
   - Masonry/grid responsive layout (use CSS Grid or Tailwind grid)
   - Lightbox modal with elegant fade in/out
   - Display full aphorisme text + tags inside lightbox
   - Keyboard navigation support (arrow keys, Esc to close)

4. **Admin Forms**
   - Clean, professional UI (use shadcn/ui Form components)
   - Preview before submission
   - Clear visual feedback on success/error
   - Image upload with progress indicator

## 🔌 External Services Integration

### InstantDB
- **Purpose:** Real-time database and authentication
- **Setup:** Initialize in `/lib/instant.ts`
- **Auth Flow:** Single admin email/password login
- **Realtime Updates:** Use `db.useQuery()` hooks for subscriptions

### ImageKit
- **Purpose:** Image upload, optimization, CDN delivery
- **Upload:** Handle securely in `/api/upload-image` route
- **Optimization:** Use Next.js `Image` component with ImageKit loader
- **API:** Documentation at https://imagekit.io/docs
- **Security:** Private key only on server; use public key on client

## 📝 Development Workflow

### Feature Development
1. Understand acceptance criteria from PRD
2. Create branch: `feature/[feature-name]`
3. Implement component and pages
4. Test responsive behavior (mobile, tablet, desktop)
5. Test accessibility (keyboard nav, ARIA labels, alt text)
6. Create Vercel preview deployment
7. Get client feedback via preview URL
8. Iterate and merge when approved

### Code Organization Principles
- **Component Logic:** Keep components focused on single responsibility
- **Hooks:** Use custom hooks in `/lib` for reusable logic (e.g., `useAphorismes()`, `useImageUpload()`)
- **Types:** Define all TypeScript types in `/types` or near usage
- **API Routes:** Secure server-side operations (auth, ImageKit calls)
- **CSS:** Use Tailwind for layout/utilities; CSS Modules for component-scoped animations

### Performance Priorities
- **Images:** Always use Next.js `Image` component with ImageKit loader
- **Lazy Loading:** Implement pagination (10 items initial, 10 per scroll)
- **Debouncing:** Search input should debounce API queries (300-500ms)
- **Bundling:** Monitor bundle size; code split routes with dynamic imports if needed

## ✅ Acceptance Criteria & Testing Checklist

Before marking any feature complete:

### Functional Requirements
- [ ] Feature matches PRD acceptance criteria exactly
- [ ] All user story flows work end-to-end
- [ ] Admin can complete tasks in stated time (e.g., "add aphorisme in <2 min")
- [ ] No console errors or warnings

### Performance & Accessibility
- [ ] Responsive on mobile (375px), tablet (768px), desktop (1024px+)
- [ ] Images optimized and loaded via ImageKit
- [ ] Lighthouse score >85 (mobile), >90 (desktop)
- [ ] Keyboard navigation fully functional
- [ ] ARIA labels and alt text present
- [ ] Color contrast sufficient (WCAG AA minimum)

### Visual Quality
- [ ] Design matches aesthetic principles (minimalist, elegant)
- [ ] Animations smooth (no jank or stuttering)
- [ ] Consistency across pages (spacing, typography, colors)
- [ ] Client feedback indicates "visually exceptional" quality

## 🚀 Deployment & Release

### Vercel Deployment
- Connect GitHub repo to Vercel project
- Environment variables configured in Vercel settings
- Preview deployments auto-generate for PRs
- Production deployment automatic on merge to main

### Pre-Release Checklist
- [ ] All features tested on production-like environment
- [ ] Admin workflow tested end-to-end
- [ ] Performance acceptable (Lighthouse >85 mobile, >90 desktop)
- [ ] Error handling graceful (clear user messages)
- [ ] Analytics tracking in place (optional: Google Analytics)

## 📚 Key Files to Understand

When starting work, review these files to understand the project:
- **[PRD_Aphorismes_MVP.md](PRD_Aphorismes_MVP.md)** — Complete product definition, user stories, architecture, and acceptance criteria
- **`package.json`** — Dependencies and npm scripts
- **`/lib/instant.ts`** — InstantDB client initialization and query hooks
- **`/lib/imagekit.ts`** — ImageKit configuration
- **`/types/`** — TypeScript interfaces for aphorisme, user, etc.
- **`/app/layout.tsx`** — Root layout with nav, footer, global styles
- **`/app/page.tsx`** — Home page (hero + tag cloud)
- **`/components/tags/TagCloud.tsx`** — Interactive tag cloud component
- **`/app/admin/page.tsx`** — Admin dashboard
- **`/app/api/upload-image/route.ts`** — Secured ImageKit upload endpoint

## ⚠️ Known Risks & Mitigations

### 1. Visual Quality Expectations
The client's success metric is "visually exceptionional" which is subjective. **Mitigation:** Get feedback early (week 1), iterate on 2-3 design variations, reference high-quality inspirations (Typewolf, Awwwards).

### 2. Performance at Scale
With 100+ images, gallery and lazy loading could slow down. **Mitigation:** Use Next.js Image optimization, strict pagination (10-20 items), virtualization if needed.

### 3. ImageKit API Limits
Uploading many images could hit quota limits. **Mitigation:** Compress client-side before upload, monitor usage, handle API errors gracefully.

## 🔐 Security Considerations

- **Admin Auth:** InstantDB Auth handles password hashing; never store passwords in code
- **ImageKit:** Private key never exposed in browser; all uploads via secured API route
- **Environment Variables:** Use `.env.local` for sensitive values; never commit credentials
- **CORS:** Configure properly if API is consumed from external origins

## 📞 Common Questions During Development

**Q: How do I query aphorismes with a specific tag?**
A: Use InstantDB query in `/lib/instant.ts`: `db.query({ aphorismes: { where: { tags: { includes: 'tagName' } } } })`

**Q: How do I upload images to ImageKit?**
A: POST file to `/api/upload-image` endpoint; it handles ImageKit API call and returns URL.

**Q: What happens if the admin forgets their password?**
A: Handled by InstantDB Auth; implement password reset flow if needed (not in MVP).

**Q: How is featured aphorisme selection handled?**
A: Admin can toggle `featured: true/false` in edit form; home page shows featured ones first (or random if not enough).

**Q: Do I need to implement comments or social sharing?**
A: No—explicitly out of scope for MVP (see PRD "Hors Scope" section).

---

## 📊 Current Project Status

### Development Phases

**Phase 1: ✅ Complete** (Setup & Scaffolding)
- Next.js 14 project with TypeScript and Tailwind
- InstantDB client initialized with query hooks
- shadcn/ui component library configured
- Environment variables setup
- Dev server runs at `http://localhost:3000` (or `http://localhost:3002` if port changes)

**Phase 2: ✅ Complete** (Database & CRUD Implementation)
- InstantDB schema configured: `aphorismes` collection with text, tags, imageUrl, featured, timestamps
- CRUD mutation functions implemented: `createAphorism()`, `updateAphorism()`, `deleteAphorism()`
- Components created:
  - `AphorismList` - Display component with real-time data
  - `AphorismForm` - Form for creating and editing aphorismes
  - Test page at `/admin/test` for manual CRUD testing
- Data flow verified end-to-end (create → display → update → delete)
- Real-time subscriptions working via InstantDB `useQuery()` hooks
- **Status**: All CRUD operations tested and working. Ready for Phase 3.

**Phase 3: ✅ Complete** (Frontend Features & UI Polish "Carnet d'auteur")
- [x] Create hero section (compact design)
- [x] Build tag cloud component (compact tiles grid)
- [x] Implement theme filtering page (`/theme/[slug]`)
- [x] Create Home Carousel for featured aphorisms
- [x] Design overhaul: "Carnet d'auteur" aesthetic (Paper/Ink/Burgundy, Garamond/Inter typography)
- [x] Create "À propos" page with biography
- [x] Optimizations: Text visibility fixes, whitespace reduction, case-insensitive filtering

**Phase 4: ✅ Complete** (Advanced Features & Admin)
- [x] Implement robust Admin Dashboard (Aphorism management)
- [x] Basic Search functionality (`/search`)
- [x] Gallery View with Lightbox (`/galerie`)
- [x] Authentication (basic admin login)
- [x] **New Features**: Aphorism Titles, Aspect Ratio & Style selection for AI Images, Text Truncation
- [x] **Refinements**: Lightbox (immersive, no captions), Carousel (stabilized with `useMemo`), Global Sorting (Newest First)

### How to Start Development

1. **Start dev server:**
   ```bash
   npm run dev
   ```
   Dev server runs at `http://localhost:3000` (or check console output)

2. **Test UI & Features:**
   - Home page: Carousel (stable speed), compact Tag Cloud
   - Theme pages: Filtering (case-insensitive), "All" collection
   - "À propos" page: Static content
   - Admin: Limited CRUD at `/admin` (includes Image Generation)

3. **Next steps for Phase 5:**
   - SEO Optimization
   - Performance Tuning (Lighthouse)

### Key Technical Details

**Real-time Data Flow:**
- All components use `useAphorismes()`, `useFeaturedAphorismes()`, or `useAphorismsByTag()` hooks.
- **Important**: These hooks now return data sorted by `createdAt` descending (newest first). The sorting result is memoized with `useMemo` to ensure stable object references and prevent re-render loops (critical for Framer Motion carousels).
- InstantDB automatically syncs data across all components.

**UI/UX Aesthetic ("Dark Cineastic"):**
- **Colors**: Background (`#18181b` Zinc-950), Card (`#27272a` Zinc-800), Text (`#e4e4e7` Zinc-200), Accent Gold (`#d4b483`)
- **Typography**: Cormorant Garamond (display, headings, aphorisms), Outfit (body, UI, navigation)
- **Components**: `CineasticCard` (glassmorphism), `TagPill` (gold accents), `HomeCarousel` (framer-motion), `HeroTitle`, `SectionTitle`
- **Layout**: Masonry grid (CSS columns), immersive hero (45vh), compact spacing
- **Image Generation**: Admin tool integrates Gemini/Imagen to create visuals with specific aspect ratios (16:9, 1:1, 4:3, etc.) and integrated titles.

---

**Last Updated:** 14 Dec 2024
**Status:** Image Generation & Gallery Refinements Complete - Robust admin tools, stable carousel, improved lightbox UX.
**Reference:** [PRD_Aphorismes_MVP.md](PRD_Aphorismes_MVP.md) | [Development Tasks](tasks/todo.md)
