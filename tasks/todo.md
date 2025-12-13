# Phase 1: Project Setup

## Todo List

- [x] Initialize Next.js 14 project with TypeScript + Tailwind
- [x] Install core dependencies (InstantDB, Framer Motion, Lucide, ImageKit)
- [x] Initialize shadcn/ui
- [x] Create folder structure (/components, /lib, /types)
- [x] Create .env.local with credentials
- [x] Setup InstantDB client (/lib/instant.ts)
- [x] Setup ImageKit client (/lib/imagekit.ts)
- [x] Create Aphorism type definition (/types/aphorism.ts)
- [x] Configure typography in layout (Crimson Text + Inter)
- [x] Extend Tailwind config with custom fonts/colors
- [x] Verify dev server runs successfully

---

## Review

### Summary
Phase 1 complete. Project scaffold is fully set up and ready for feature development.

### Files Created
- `package.json` - npm scripts (dev, build, start, lint)
- `tsconfig.json` - TypeScript configuration
- `next.config.js` - ImageKit domain configured
- `tailwind.config.ts` - Custom fonts + shadcn/ui colors
- `postcss.config.js` - Tailwind/autoprefixer setup
- `components.json` - shadcn/ui configuration
- `.env.local` - InstantDB + ImageKit credentials
- `.env.local.example` - Template for other developers
- `.gitignore` - Standard Next.js ignores
- `app/layout.tsx` - Root layout with Google Fonts (Crimson Text + Inter)
- `app/page.tsx` - Minimal homepage
- `app/globals.css` - Tailwind + shadcn CSS variables
- `lib/instant.ts` - InstantDB client + query hooks
- `lib/imagekit.ts` - ImageKit URL helper + Next.js Image loader
- `lib/utils.ts` - shadcn utility (cn function)
- `types/aphorism.ts` - Aphorism TypeScript interface

### Folder Structure Created
```
/components
  /admin
  /common
  /aphorism
  /gallery
  /tags
/lib
/types
/tasks
```

### Dependencies Installed
- next@14, react@18, typescript
- @instantdb/react
- framer-motion
- lucide-react
- imagekit
- tailwindcss@3, postcss, autoprefixer
- shadcn/ui (clsx, tailwind-merge, tailwindcss-animate)

### Verified Working
- Dev server starts: `npm run dev`
- Homepage loads: HTTP 200 at localhost:3000
- No TypeScript or compile errors

### Next Steps (Phase 2)
Per PRD: Configure InstantDB schema + auth, test CRUD operations.

---

# Phase 2: Database & CRUD Implementation

## Todo List

- [x] Enhance /lib/instant.ts with mutation functions (create, update, delete)
- [x] Create /components/aphorism/AphorismList.tsx component
- [x] Create /components/admin/AphorismForm.tsx component
- [x] Create /app/admin/test/page.tsx test page
- [x] Update /app/page.tsx to display real data
- [x] Test CRUD operations end-to-end

## Review

### Summary
Phase 2 complete. CRUD operations fully implemented, tested, and verified working end-to-end. Real-time data flow confirmed. All components rendering with proper error handling and loading states. Ready for Phase 3 frontend feature development.

### What Was Built

**Mutation Functions** (`/lib/instant.ts`)
- `createAphorism(data)` - Creates new aphorism with auto-generated ID and timestamps
- `updateAphorism(id, data)` - Updates existing aphorism with auto-updated timestamp
- `deleteAphorism(id)` - Deletes aphorism by ID
- All mutations use InstantDB transaction pattern: `db.transact()`

**Display Component** (`/components/aphorism/AphorismList.tsx`)
- Fetches all aphorismes using `useAphorismes()` real-time hook
- Shows animated loading skeleton while fetching
- Displays error state with user-friendly message if query fails
- Renders empty state "No aphorismes yet" when database is empty
- Shows aphorism text (serif font), tags (pills), and featured badge
- Smooth hover transitions on cards
- Fully responsive card layout with Tailwind

**Form Component** (`/components/admin/AphorismForm.tsx`)
- **Create mode**: Empty form for new aphorism
- **Edit mode**: Form pre-populated with existing aphorism data
- **Fixed**: Added `useEffect` hook to properly sync form fields when `aphorism` prop changes
- Textarea for aphorism text with validation
- Tags input (comma-separated, auto-trimmed)
- Featured checkbox toggle
- Loading state: Button shows "Saving..." and form fields disabled during submission
- Error handling: Displays validation errors in red banner
- Success callback: Notifies parent component when form completes
- Button text dynamically changes: "Create" vs "Update"

**Test Page** (`/app/admin/test/page.tsx`)
- **Left side**: AphorismForm for creating/editing with full form
- **Right side**: Live list of all aphorismes with edit/delete controls
- **Workflow**: Click Edit to load aphorism into form, button changes to Update, save, form clears
- **Delete**: Delete button with browser confirmation dialog before removal
- **Auto-refresh**: No manual refresh needed - InstantDB auto-updates list in real-time
- **Fixed**: Removed non-existent `refetch()` calls and `refreshKey` state that were causing blank page

**Updated Home Page** (`/app/page.tsx`)
- Displays AphorismList component showing all aphorismes
- Hero section with title ("Aphorismes Philosophiques") and subtitle
- Link to admin test page for easy access during development
- Ready for Phase 3 hero section enhancement with featured carousel

### Files Created/Modified
- `/lib/instant.ts` - Added 3 mutation functions (create, update, delete)
- `/components/aphorism/AphorismList.tsx` - Display component (new)
- `/components/admin/AphorismForm.tsx` - Form component (new) with edit sync fix
- `/app/admin/test/page.tsx` - Test page (new) with bugs fixed
- `/app/page.tsx` - Updated to display real data

### Bugs Fixed During Development

**Bug 1: Edit functionality not working**
- **Problem**: Clicking Edit button did nothing; form stayed blank
- **Root Cause**: Form fields initialized via `useState()` but didn't sync when `aphorism` prop changed
- **Solution**: Added `useEffect` hook with `[aphorism]` dependency to sync all form fields when prop changes
- **Result**: Edit button now properly loads aphorism into form, ready for update

**Bug 2: Admin test page loading blank**
- **Problem**: Page loaded but entire content was invisible
- **Root Cause**: Code called `refetch?.()` which doesn't exist in InstantDB's `useQuery()` return; also tried to use `refreshKey` state
- **Solution**: Removed all `refetch` calls and `refreshKey` state; InstantDB auto-updates in real-time
- **Result**: Page now displays form and list correctly, auto-updates when mutations complete

### Test Results - CRUD Operations Verified
✅ **Create**: New aphorism created and appears in list immediately (real-time)
✅ **Read**: Home page displays all aphorismes; admin test page shows live list
✅ **Update**: Edit button loads data into form, form syncs properly, Update button saves changes
✅ **Delete**: Delete button removes aphorism after confirmation
✅ **Pages Load**: Homepage and admin test page both HTTP 200
✅ **No Errors**: No TypeScript errors, no compile errors, no console warnings
✅ **Real-time Sync**: Changes visible instantly across all pages without refresh

### How to Test Manually

1. **Start dev server**
   ```bash
   npm run dev
   ```

2. **Visit homepage** - http://localhost:3000 (or http://localhost:3002)
   - Should show "No aphorismes yet" message initially
   - Admin Test Page link visible in hero section

3. **Go to admin test page** - http://localhost:3000/admin/test
   - **Create test**:
     - Fill in form with sample text and tags
     - Click "Create" button
     - Aphorism appears in right-side list immediately
   - **Edit test**:
     - Click Edit button on any aphorism
     - Form populates with data
     - Modify text/tags
     - Button changes to "Update"
     - Click Update - list updates immediately
   - **Delete test**:
     - Click Delete button
     - Confirm in dialog
     - Aphorism disappears from list

4. **Back to homepage**
   - New aphorism displays in Collection section
   - All changes are reflected in real-time

### Data Flow Architecture
```
AphorismForm (create/edit)
    ↓
createAphorism() or updateAphorism() mutations
    ↓
db.transact() - InstantDB transaction
    ↓
InstantDB database updated
    ↓
useAphorismes() query (subscribes to changes)
    ↓
All components using hook auto-update
    ↓
AphorismList & Test page render new data
```

### Design Decisions
- **No authentication in Phase 2**: InstantDB doesn't provide built-in email/password auth; skipped for now, will add in Phase 4 proper admin UI
- **Real-time over polling**: Using InstantDB's `useQuery()` subscriptions for instant updates instead of manual refetch
- **Test page as temporary tool**: Will be replaced with proper admin dashboard in Phase 4
- **Simple form validation**: Only required fields and text trimming; comprehensive validation added later in Phase 3+
- **Client Components**: All data components use `'use client'` since they need React hooks

### Known Limitations
- No authentication (anyone can create/edit/delete) - by design for Phase 2
- No image upload (imageUrl always null) - deferred to Phase 3+
- No tag filtering/search - Phase 3 features
- Test page UI minimal - will be replaced with proper admin dashboard
- No form field validation messages beyond required checks

### Next Steps (Phase 3)
Per PRD - Frontend Features:
- [ ] Create hero section with featured aphorismes carousel
- [ ] Build tag cloud component with proportional sizing
- [ ] Implement theme filtering page (`/theme/[slug]`)
- [ ] Create gallery view with masonry layout (`/galerie`)
- [ ] Implement search functionality (`/search`)
- [ ] Build proper admin dashboard (`/admin`)

### Developer Notes for Next Session
- **Real-time pattern**: All components use InstantDB query hooks - changes auto-sync across pages
- **Form editing pattern**: Use `useEffect` to sync form when props change (ref: AphorismForm component)
- **Mutation pattern**: Wrap all DB operations in `db.transact()` for consistency
- **Error handling**: Components already show user-friendly error messages
- **TypeScript**: All components fully typed with Aphorism interface
- **Tailwind styling**: Consistent use of Tailwind utilities; shadcn/ui colors for consistency
- **Component composition**: AphorismList displays, AphorismForm handles input, pages wire them together
- **Port**: Dev server runs on http://localhost:3000 (check console if different)
- **Test page location**: http://localhost:3000/admin/test - use for manual CRUD testing before building production UI
