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

**Le Sens et la Diversité** is an elegant web platform for discovering philosophical aphorisms and reflections. The site presents a curated collection of aphorismes with artistic visuals, organized by theme with an interactive tag cloud, and includes a simple admin interface for managing content.

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
- [x] **New Features**: Aphorism Titles, Text Truncation
- [x] **Refinements**: Lightbox (immersive, no captions), Carousel (stabilized with `useMemo`), Global Sorting (Newest First)
- [x] **Image Generation 3.0**: Admin tool uses Gemini with a specialized "Art Director" meta-prompt. Features:
    - **10 Style Families**: Minimalist, Cinematic, Paper Cut, Digital Dream, Brutalist, etc.
    - **Smart Typography**: Choice of font styles (Sans, Serif, Brush, Condensed).
    - **Content Integration**: Optional Title (Corner or Integrated) and Author signature.

---

**Phase 5: ✅ Complete** (Module "Réflexions")
- [x] **Core Feature**: New content type "Réflexion" (Long-form content vs short aphorisms) based on Markdown.
- [x] **Public Interface**:
  - List page (`/reflexions`) with grid layout.
  - Detail page (`/reflexions/[id]`) with immersive header, reading mode, and responsive layout.
- [x] **Admin Interface**:
  - Full CRUD management.
  - **Live Preview Mode**: Toggle between Edit/Preview to verify layout.
  - **Image Integration**: Insert images via Drag & Drop (Left/Center/Right alignment).
  - **"Remove from Text"**: One-click removal of images from content.
  - **Expanded Image Gen**: Included in the editor side-panel.
- [x] **Navigation**: Added "Reflections" and "Administration" links to global nav.

**Phase 6: ✅ Complete** (UI Consistency & Admin Refinements)
- [x] **UI Consistency**:
  - Standardized "Aphorismes", "Réflexions", and "À propos" page headers (Font, Size, Spacing).
  - Implemented tag filtering on "Réflexions" page.
- [x] **Admin Polish**:
  - **Unified Aphorism Editor**: Combined creation form and Image Generator into a tabbed interface ("Édition" / "Studio Visuel").
  - **Tag Management**: Renamed to "Gestion des thèmes", moved to logical location in sidebar, improved contrast.
  - **Contrast Fixes**: Resolved low-contrast text issues throughout admin dashboard and editor components.
  - **Reflections Editor**: Added Markdown Toolbar (H2, H3, Bold, Italic, Layout Blocks) and reorganized sidebar.
- [x] **Architecture**: Removed separate Image Generator page in favor of integrated component.

**Phase 7: ✅ Complete** (Homepage Restructuring & Branding)
- [x] **Homepage Layout**: Removed existing carousel; separated content into distinct "Aphorismes" and "Réflexions" sections.
- [x] **Pagination**: Implemented 24-item limit per section, displayed in pages of 6, with slide-animated navigation controls.
- [x] **Branding**: Renamed site to "**Le Sens et la Diversité**" across all components (Hero, Nav, Footer, Metadata).

**Reference:** [PRD_Aphorismes_MVP.md](PRD_Aphorismes_MVP.md) | [Development Tasks](tasks/todo.md)

**Phase 8: ✅ Complete** (Image Gen 4.0: Library & Advanced Control)
- [x] **Persistent Image Library**: Images generated for an aphorism are now saved to a persistent library within the editor, not just session history.
- [x] **"Scene" Parameter**: Added optional text input for specific visual scene instructions (e.g., "A solitary tree on a hill").
- [x] **Typography 2.0**:
    - **Curated Styles**: 10 distinct typography options + "Random/Free" choice.
    - **Visual Preview**: Dropdown displays options in their actual font style.
    - **Optimization**: Prompt now only sends the SINGLE relevant style description to save tokens.
- [x] **Metadata Persistence**: The exact prompt used for generation is now saved with the image and can be viewed/restored.
- [x] **Style Updates**: Replaced less relevant styles with "Noir & Blanc Argentique", "Bauhaus / Suisse", and "Aquarelle / Lavis".
- [x] **UI Polish**: Improved button layout, "See Prompt" modal, and synced Reflection preview fonts with public pages.

**Phase 9: ✅ Complete** (Dual Theme System - Light/Dark Mode)
- [x] **Theme Infrastructure**: Implemented `next-themes` package with `ThemeProvider` wrapper.
- [x] **Theme Toggle**: Animated sun/moon toggle button in NavBar (desktop & mobile).
- [x] **Light Mode "Papier Ancien"**: Warm cream/ivory aesthetic with deep brown text.
    - Background: `#faf8f4` (warm paper white)
    - Card: `#e8e2d6` (ivory with good contrast)
    - Text: `#271f17` (deep warm brown)
    - Primary: `#b17f2e` (rich amber/gold)
- [x] **Dark Mode "L'Encre et la Lumière"**: Cinematic ink-black with amber accents.
    - Background: `#0a0908` (velvety ink black)
    - Card: `#151311` (rich charcoal)
    - Text: `#f5f0e8` (warm ivory)
    - Primary: `#d4a574` (amber/gold candlelight)
- [x] **Reflection Reading Zone**: Custom comfortable palettes for long-form reading.
    - Light: `#f8f5f0` bg with `#3d3428` text
    - Dark: `#1a1816` bg with `#c5bba8` text (soft "Parchemin de Nuit")
- [x] **Admin Forms**: Fixed light mode contrast issues (replaced `text-white` with `text-foreground`).
- [x] **Georgia Serif**: Optimal reading font for reflection content.

**Last Updated:** 28 Dec 2024

**Phase 10: ✅ Complete** (Social Interactions)
- [x] **Comment Counts**: Displayed comment count (icon + number) on Aphorism and Reflection cards.
- [x] **Toggle Likes**: Implemented interactive Like/Unlike toggle.
    - **Aphorisms**: Fully interactive toggle on cards (Home/Gallery).
    - **Reflections**: Interactive toggle on Detail Page (cards read-only).
- [x] **Dislike Toggle**: Implemented interactive Dislike/Undislike toggle on Reflection Detail Page.
- [x] **Data Persistence**: Local storage used to track user interactions and prevent duplicate actions.

**Phase 11: ✅ Complete** (Contact Functionality)
- [x] **Global Contact Modal**: implemented accessible via NavBar and Footer.
- [x] **Server Action**: Secure `POST` submission to n8n webhook via Next.js Server Actions (avoids CORS).
- [x] **n8n Integration**: connected to external workflow for email processing.
- [x] **Form UI**: "Atelier" aesthetic inputs (Name, Email, Subject, Message) with real-time validation and success states.

**Phase 12: ✅ Complete** (Reflection Admin UI Redesign)
- [x] **UI Layout Redesign**: Moved the "AI Generator" section from the sidebar to the main column (top) for better usability.
- [x] **Enhanced Image Gen**: added a dedicated "Scène Description" input for precise visual instructions.
- [x] **Preview Logic**: fixed styling issues where reflection previews were stuck in "Dark Mode" regardless of system theme.
- [x] **Prompt Logic**: integrated the new Scene parameter into the Gemini meta-prompt structure.


**Phase 13: ✅ Complete** (Social Sharing for Aphorisms)
- [x] **Social Icons**: Added Facebook and X (Twitter) buttons to Aphorism Cards (Home & Gallery).
- [x] **Dedicated Route**: Created `/aphorisme/[id]` with server-side metadata generation.
- [x] **Rich Previews**: Implemented Open Graph (`og:image`) and Twitter Card (`summary_large_image`) meta tags for correct visual sharing.
- [x] **Share Logic**:
    - **X**: Opens tweet composer with title and link.
    - **Facebook**: Opens share dialog (requires production URL for image preview).
