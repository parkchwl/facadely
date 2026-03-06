# Changelog

All notable changes to this project are documented in this file.

## 2026-03-07

- Hardened Next editor/runtime APIs:
  - Added shared server-side auth/origin guard in `src/lib/server/api-security.ts`.
  - Protected `pages`, `save-code`, `fonts/upload`, `publish`, and `template-manifest` APIs with authentication checks.
  - Added same-origin enforcement for mutation routes.
  - Disabled runtime page TSX generation by default behind `FACADELY_ENABLE_TEMPLATE_CODEGEN`.
  - Removed code injection risk in `src/app/api/pages/route.ts` by serializing user-provided page names instead of embedding them as executable source.
- Tightened editor input validation:
  - Restricted editable `href` to safe relative links, anchors, `http(s)`, `mailto`, and `tel`.
  - Restricted editable `src` to safe relative paths or `http(s)`.
  - Restricted custom font registration to local `.woff2` paths under `/uploads/fonts` or `/fonts`.
  - Applied validation both at API boundary and persisted runtime store normalization.
- Separated runtime-writable state from tracked project data:
  - Moved site customization writes to `.runtime/sites`.
  - Moved publish state writes to `.runtime/publish`.
  - Ignored `.runtime/` and `public/uploads/` in Git while keeping legacy read compatibility for existing `data/sites/*.json`.
- Hardened frontend route access:
  - Protected `/editor`, `/generate`, and `/dashboard` in `src/proxy.ts` using backend `/auth/me`.
- Hardened Spring auth configuration and request validation:
  - Added automatic backend `.env` loading via `spring.config.import`.
  - Added fail-fast validation for JWT secrets, Google OAuth credentials, and secure cookie requirements in non-local environments.
  - Added auth POST origin/referer validation filter and wired it into Spring Security.
- Documentation update:
  - Refreshed `README.md` and `docs/PROJECT_OVERVIEW.md` with current security/runtime/env assumptions.

## 2026-03-06

- Canonicalized template routing and listing:
  - Added canonical route `/s/{slug}` and unified template metadata through `src/lib/template-registry.ts`.
  - Kept legacy numeric routes `/5`, `/6`, `/7` as compatibility redirects.
  - Updated editor/template/API path handling to normalize canonical/legacy paths consistently.
  - Completed phase-2 template folder refactor:
    - Moved React template runtime assets from numeric folders to slug folders:
      - `src/app/nexus-ai-enterprise/*`
      - `src/app/velocity-saas-landing/*`
      - `src/app/onepro-dashboard-white/*`
    - Left `src/app/5`, `src/app/6`, `src/app/7` as redirect-only compatibility routes.
- Refined editor integration:
  - `/[lang]/generate` now redirects to `NEXT_PUBLIC_BETA_EDITOR_URL` (fallback `/editor`).
  - Navigation terminology switched from Generate to Editor in i18n/UI paths.
  - Editor top branding click now returns to the main site entry.
- Cleaned template/runtime consistency:
  - Updated Velocity template naming/description and internal brand copy alignment.
  - Removed duplicate template listing behavior and stabilized template key usage.
- Addressed hydration/runtime issues:
  - Applied root layout hydration guard strategy and deterministic root theme variable handling.
  - Removed stale fullscreen/fixed-height patterns where they caused mismatch/clipping risk.
- Repository cleanup:
  - Removed unused legacy files `src/app/pages/editor.tsx` and `src/app/components/ContactPageClient.tsx`.
  - Removed `.DS_Store` artifacts from the repository.
- Documentation refresh:
  - Updated `README.md`, `docs/README.md`, `docs/PROJECT_OVERVIEW.md`, and `claude.md` to reflect current architecture and routes.

## 2026-03-03

- Added Spring backend project at `/backend` with:
  - Auth API: `signup`, `login`, `logout`, `refresh`, `me`, `terms/agree`
  - Google OAuth login flow (`/api/v1/auth/oauth2/authorization/google`, callback)
  - JWT access/refresh token flow with HttpOnly cookies
  - Flyway migration for auth tables (`users`, `user_credentials`, `refresh_tokens`, `terms_agreements`, `auth_audit_logs`, `oauth_google_accounts`)
  - Docker Compose for local PostgreSQL
- Migrated frontend login flow from mock logic to real API integration:
  - Added `src/lib/api/auth.ts`
  - Rewrote `src/app/components/LoginPageClient.tsx` to support email/password sign-in and sign-up
  - Removed Apple/Facebook login options and kept Google only
  - Simplified `src/app/components/SocialLoginButton.tsx` to Google single-provider button
- Updated i18n/type contracts for login page:
  - `src/types/dictionary.ts`
  - `src/i18n/messages/{en,ko,hi,id,vi,zh-TW}.json`
- Removed legacy auth runtime dependency:
  - Proxy now verifies auth via backend `/auth/me`
  - Removed legacy auth schema/code artifacts from the repository
  - Updated `.env.example` to use `NEXT_PUBLIC_API_BASE_URL`
  - Removed legacy auth-related frontend packages
- Added backend learning documentation:
  - `docs/backend/README.md`
  - `docs/backend/backend_starter.md` (초보자용 백엔드 입문/상호작용 설명)
  - `docs/backend/glossary.md`
  - `docs/backend/architecture-decisions.md`
  - `docs/backend/phase-00-foundation.md` ... `docs/backend/phase-06-cutover.md`
- Switched backend build system from Maven to Gradle:
  - Added `backend/build.gradle`, `backend/settings.gradle`, `backend/gradlew`, `backend/gradle/wrapper/*`
  - Removed `backend/pom.xml`, `backend/mvnw*`, `backend/.mvn`

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
