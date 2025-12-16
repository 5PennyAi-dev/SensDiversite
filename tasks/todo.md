# Task List: Dark Cineastic Redesign

## Phase 1: Foundation (The Vibe)
- [x] **1. Project Setup**
    - [x] Create git branch `feature/dark-cineastic-redesign`.
    - [x] Clean up previous "Paper" theme variables in `globals.css`.
- [x] **2. Design Tokens & Typography**
    - [x] **Fonts**: Install/Configure `Cormorant Garamond` (Hero/Headings) and `Outfit` or `Inter` (Body).
    - [x] **Palette**: Define `slate-900` / `zinc-900` base, `gold/warm-white` text, and subtle gradients in `globals.css`.
    - [x] **Reset**: Apply dark background globally to `body`.

## Phase 2: Core Components
- [x] **3. UI Kit Updates**
    - [x] **CineasticCard**: Create a frameless, shadow-based card component interaction (hover spotlight).
    - [x] **Typography**: Create `SectionTitle` and `HeroTitle` components with dramatic sizing.
    - [x] **Navigation**: Build a minimal sticky nav or floating menu.

## Phase 3: Page Layouts
- [x] **4. Home Refresh**
    - [x] **Hero**: Implement full-screen immersive hero with fade-in animation.
    - [x] **Masonry Grid**: Rebuild `AphorismList` as a responsive masonry grid (using CSS columns).
    - [x] **Featured Section**: Redesign as a "Cinematic Spotlight" (large text, dark overlay).
    - [x] **TagCloud**: Update theme index to use glassmorphism cards.
    - [x] **Footer**: Update to match dark theme.
- [ ] **5. Gallery Integration**
    - [ ] Style the Lightbox/Gallery view to match the dark theme (backdrop blur, refined controls).

## Phase 4: Polish & Interact
- [x] **6. Micro-interactions**
    - [x] Add smooth scroll behavior.
    - [x] Add staggered entrance animations for grid items.
    - [x] (Optional) Custom cursor.
- [x] **7. Review**
    - [x] Verify accessibility (contrast ratios on dark mode).
    - [x] Mobile responsiveness check.

## Verification Results
- [x] **Foundation**: `globals.css` and `layout.tsx` fully updated with dark theme tokens and fonts.
- [x] **Components**: `CineasticCard` created and implemented.
- [x] **HomePage**: `HeroSection` and `AphorismList` updated.
- [!] **Deviations**:
    - `HeroSection` height is `45vh` (Plan: `80vh`).
    - `SectionSeparator` is still present (Plan: "Remove if it breaks").
- [x] **Corrected**:
    - `app/apropos/page.tsx` migrated to `CineasticCard` and Dark Cineastic theme.
    - `app/theme/[slug]/page.tsx` cleaned up (unused import removed, paper variables replaced).
    - `components/ui/PaperCard.tsx` deleted.
