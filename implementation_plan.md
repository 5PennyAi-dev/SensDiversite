# Implementation Plan: Dark Cineastic Redesign

## Goal
Transform the "Sens & Diversité" website into a high-end, immersive "Dark Cineastic" experience. This involves a complete visual overhaul using a dark color palette, dramatic typography, and fluid layout structures.

## User Review Required
> [!IMPORTANT]
> This is a major visual change. The entire light/paper theme will be replaced by a dark theme. Please verify the font choices (Cormorant Garamond & Outfit) and the requested "Dark but not pitch black" background color.

## Proposed Changes

### 1. Foundation & Design Tokens
**File**: `app/globals.css`
*   [MODIFY] Replace `:root` variables.
    *   **Background**: Change from `paper` (#F6F1EA) to `cineastic-dark` (#18181b - Zinc 900) or a refined gradient.
    *   **Text**: Change from `ink` (#1E1B18) to `cineastic-light` (#E4E4E7 - Zinc 200) and `cineastic-gold` (#D4B483) for accents.
    *   **Font-Family**: Introduce `--font-display` (Cormorant Garamond) and `--font-body` (Outfit/Inter).

**File**: `app/layout.tsx`
*   [MODIFY] Import new Google Fonts: `Cormorant Garamond` (Weights: 400, 600, 700) and `Outfit` (Weights: 300, 400, 500).
*   [MODIFY] Update `body` classes to use the new dark background and text colors.

### 2. Components
**File**: `components/ui/PaperCard.tsx` -> **Rename/Refactor to** `app/components/ui/CineasticCard.tsx`
*   [NEW/MODIFY] A new card component:
    *   **Background**: `bg-white/5` (glassmorphism) or `bg-zinc-800/50`.
    *   **Border**: Standard border removed. Use subtle `ring-1 ring-white/10`.
    *   **Interaction**: `hover:scale-[1.02]`, `hover:ring-gold/30`, `transition-all duration-500`.
    *   **Typography**: Serif for the aphorism text, larger size, increased line-height.

**File**: `components/common/HeroSection.tsx`
*   [MODIFY] Redesign for "Immersive" feel.
    *   **Layout**: Full viewport height (`min-h-[80vh]`).
    *   **Content**: Large, centered or left-aligned display text (`text-6xl` to `text-8xl`).
    *   **Animation**: Simple fade-in and slide-up for text elements.

**File**: `components/aphorism/AphorismList.tsx`
*   [MODIFY] Implement Masonry Layout.
    *   Use CSS columns (`columns-1 md:columns-2 lg:columns-3 gap-6`) or a library like `react-masonry-css` if strictly necessary (CSS columns usually sufficient for text).
    *   Ensure cards don't break inside (`break-inside-avoid`).

### 3. Pages
**File**: `app/page.tsx`
*   [MODIFY] Update page structure to use the new components.
*   [MODIFY] Remove "SectionSeparator" if it breaks the flow; use whitespace instead.

## Verification Plan

### Automated Tests
*   **Linting**: Run `npm run lint` to ensure no regression.
*   **Build**: Run `npm run build` to verify standard build passes.

### Manual Verification
1.  **Visual Check (Desktop/Mobile)**:
    *   Verify the background is dark charcoal (Zinc-900), not black.
    *   Confirm fonts are strictly *Cormorant Garamond* (Headings) and *Outfit/Inter* (Body).
    *   Check contrast legibility (Gold on Dark).
2.  **Interaction**:
    *   Hover over cards -> Should have a smooth lift effect.
    *   Scroll down -> Masonry layout should flow naturally.
3.  **Responsiveness**:
    *   Check mobile view: Cards should stack (1 column), Hero text should scale down but remain readable.
