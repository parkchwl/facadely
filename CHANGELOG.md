# Changelog

All notable changes to this project are documented in this file.

## 2026-02-19

- Migrated root typography from package-based Geist imports to project-local fonts via `next/font/local`.
  - Added local font assets under `src/app/fonts/`.
  - Added font loader module: `src/app/fonts.ts`.
  - Updated root layout to use local font variables: `src/app/layout.tsx`.
  - Removed `geist` dependency from `package.json` and `package-lock.json`.
- Restored homepage infinite gallery to CSS-driven continuous left/right marquee behavior.
  - Removed side fade masking and scroll-linked Framer Motion transforms.
  - Added gallery keyframes/utilities in `src/app/globals.css`.
  - Tuned gallery speed to slower loop timing for readability.
- Repositioned homepage marquee banner (`ScrollingBanner`) directly below the "facadely solves the problems" section.
- Fixed homepage FAQ progress bar desynchronization.
  - Progress now resets and starts from zero consistently on section entry, manual question changes, and resume from pause.
  - Prevented pre-filled/instantly-full progress behavior when FAQ section was not in view.
- Removed unused `motion` import from `src/app/components/TemplateCard.tsx`.

## 2026-02-17 (Documentation Overhaul)

- Reorganized documentation into active docs and archived legacy docs.
- Moved outdated/analysis-heavy 2025 documents into `docs/archive/2025-legacy/`.
- Added `docs/README.md` as the documentation index and maintenance guideline.
- Added `docs/PROJECT_OVERVIEW.md` as the current architecture and route reference.
- Rewrote `README.md` to align with current project state.
- Replaced stale root `claude.md` content with current project context.

## 2026-02-17

### `f154cbd` - Apply full responsive and app-wide stability updates

- Implemented broad responsive and viewport stability improvements across real routes and shared components.
- Added viewport utility classes and layout offsets in `src/app/globals.css`.
- Updated root app viewport policy and layout behavior in `src/app/layout.tsx`.
- Migrated Next 16 middleware entry from `src/middleware.ts` to `src/proxy.ts`.
- Consolidated several locale route client files to shared component exports.
- Hardened module resolution in `next.config.mjs` by pinning project roots and local module resolution order.
- Added image assets:
  - `public/image/11.webp`
  - `public/image/12.webp`
  - `public/image/13.webp`

### `1775c41` - Move It is Essential content to blog and remove home section

- Added a dedicated "It is Essential" article to `src/i18n/messages/en.json` (`blogPage.posts`, id `6`).
- Removed the existing "It is Essential" section from `src/app/pages/HomePage.tsx`.

## 2026-02-17 (Earlier Commits)

- `f50f37e` - remove gallery hover pause effect for continuous animation.
- `3d77a8b` - switch to CSS auto-animation gallery with optimizations.
- `5e51cf5` - major gallery performance optimizations.
- `673fed9` - switch gallery images from AVIF to WebP for faster decoding.
- `965af8c` - optimize gallery with non-linear easing parallax.
- `e91cb10` - optimize infinite gallery for mobile.
