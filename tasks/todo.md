# Task: Visual Studio Redesign & Style Definitions

- [x] Create `lib/visual-styles-data.ts` with the 15 style definitions.
- [x] Redesign `UnifiedAphorismEditor.tsx` to display style info:
    - [x] Import style data.
    - [x] Create a "Style Info" display component/section.
    - [x] Apply "Frontend Design" principles (animations, typography, layout).
- [x] Verify the UI updates correctly when styles change.
- [x] Ensure "Frontend Design" quality (no generic looks).
- [x] Refactor layout to "Control Deck" (User Request).
- [x] Refine layout: Fix image cropping & style info scrolling (User Request).
- [x] Optimize for small screens: Implement "Compact Mode" for Control Deck & Library.
- [x] Redistribute Control Deck columns: 12-col grid (25% / 50% / 25%) to widen Style Info (User Request).

## Review Summary
- **Final Refinements:**
    - **Ultra Wide Style Column**: Switched to a 12-column grid. "Visual Style" now takes up 50% of the width (`col-span-6`), preventing description overflow.
    - **Stacked Render Options**: "Format" and "Typography" are now stacked vertically in the "Render" column (`col-span-3`), matching the new layout balance.
    - **Compact Control Deck**: Reduced padding, margins, and font sizes to maximize vertical space for the image preview.
    - **Compact Library**: Reduced height of the library strip.
    - **Adaptive Preview**: Removed conflicting constraints; the image now uses `flex-1` and `object-contain` to fill all available space regardless of aspect ratio.
    - Verified build functionality.

# Task: Fix Image Library Icons (User Request)
- [x] Replace confusing "Left" and "Right" icons in `ReflectionForm.tsx` with explicit `ArrowLeft` and `ArrowRight` icons.
- [x] Update "Center" icon to `LayoutTemplate` for better visual clarity.

## Review Summary
- Replaced custom CSS shape icons with standard Lucide icons (`ArrowLeft`, `ArrowRight`, `LayoutTemplate`) in the "Bibliothèque d'images" section of the Reflection Editor.
- This resolves the user confusion regarding the directional buttons.

# Task: Enable Full-Screen Image Preview (User Request)
- [x] Add `previewImage` state to `ReflectionForm.tsx`.
- [x] Make image thumbnails in the library clickable.
- [x] Implement a full-screen, responsive modal overlay to display the selected image.
- [x] Ensure the modal can be closed via a button or clicking the backdrop.

## Review Summary
- Added a full-screen lightbox feature for the "Bibliothèque d'images".
- Users can now click on the small thumbnails to see the high-resolution generated image in detail before inserting it.

# Task: Increase Image Library Limit (User Request)
- [x] Update `ReflectionForm.tsx`: Increase limit from 4 to 10 images.
- [x] Update `UnifiedAphorismEditor.tsx`: Increase limit from 5 to 10 images.
- [x] Update UI counters and error messages to reflect the new limit.

## Review Summary
- The image library for both Reflections and Aphorisms now supports up to 10 generated images.
- Users can now generate and store more variations before choosing the best one.

# Task: Enable Aphorism Library Preview (User Request)
- [x] Add `previewImage` state and Modal to `UnifiedAphorismEditor.tsx`.
- [x] Update library thumbnails to support full-screen "Lightbox" preview on click.
- [x] Add "Eye" icon overlay on hover to indicate viewability.
- [x] Ensure modal matches the style of the Reflection modal.

## Review Summary
- Clicking an image in the Aphorism Studio library now opens it in a full-screen lightbox.
- Added a hover effect with an Eye icon to make the action discoverable.
- The image is also selected for editing/applying in the background, maintaining workflow efficiency.

# Task: Adjust Aphorism Preview Trigger (User Request)
- [x] Revert library thumbnail behavior: Clicking only selects the image for the main studio view.
- [x] Enable preview on main image: Clicking the large image in the studio view now triggers the full-screen modal.
- [x] Add `cursor-zoom-in` utility to the main image to indicate interactivity.

## Review Summary
- The workflow has been refined: Click a thumbnail to load it into the studio; click the studio image to inspect it in full screen.
- This prevents accidental modal openings when simply browsing or selecting images.
