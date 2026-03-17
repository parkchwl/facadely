# Project Overview

Last updated: 2026-03-17

## Stack

- Next.js `16.1.1` (App Router)
- React `19.2.3`
- TypeScript `5`
- Tailwind CSS `4`
- Framer Motion `12.23.22`
- Spring Boot backend (`/backend`, Java 21, Security, JPA, Flyway, OAuth2)

## App Shape

- Root layout: `/Users/parkchwl/front/src/app/layout.tsx`
- Main localized layout: `/Users/parkchwl/front/src/app/[lang]/(main)/layout.tsx`
- Proxy entry (Next 16): `/Users/parkchwl/front/src/proxy.ts`
- Shared route clients: `/Users/parkchwl/front/src/app/components/shared/`
- Local font loader: `/Users/parkchwl/front/src/app/fonts.ts`
- Backend app root: `/Users/parkchwl/front/backend`

## Template Routing Model

- Canonical template route:
  - `/Users/parkchwl/front/src/app/s/[slug]/page.tsx`
- User-owned site route pattern:
  - `/s/{template-slug}-{unique-suffix}`
  - template source resolution handled in `/Users/parkchwl/front/src/lib/user-site-store.ts`
- Template registry and path conversion:
  - `/Users/parkchwl/front/src/lib/template-registry.ts`
- React template runtime directories (slug-based):
  - `/Users/parkchwl/front/src/app/nexus-ai-enterprise/`
  - `/Users/parkchwl/front/src/app/velocity-saas-landing/`
  - `/Users/parkchwl/front/src/app/onepro-dashboard-white/`
- Compatibility redirect routes:
  - `/Users/parkchwl/front/src/app/5/page.tsx`
  - `/Users/parkchwl/front/src/app/6/page.tsx`
  - `/Users/parkchwl/front/src/app/7/page.tsx`

## Locales and Dictionary Behavior

- Locales: `en`, `ko`, `hi`, `id`, `vi`, `zh-TW`
- Dictionary loader: `/Users/parkchwl/front/src/lib/get-dictionary.ts`
- Behavior:
  - English (`en`) is the canonical base dictionary.
  - Other locales are loaded as partial dictionaries and merged over English fallback.

## Main Runtime Routes

Localized routes (`src/app/[lang]/(main)`):

- `/{lang}` (home)
- `/{lang}/about`
- `/{lang}/blog`
- `/{lang}/blog/{id}`
- `/{lang}/contact`
- `/{lang}/cookie`
- `/{lang}/customer-service`
- `/{lang}/generate` (redirects to editor entry)
- `/{lang}/login`
- `/{lang}/pricing`
- `/{lang}/privacy`
- `/{lang}/qa`
- `/{lang}/service`
- `/{lang}/status`
- `/{lang}/templates`
- `/{lang}/terms`

Non-localized routes:

- `/editor` (beta editor app)
- `/s/{slug}` (canonical template preview)
- `/5`, `/6`, `/7` (legacy compatibility redirects)
- `/p/{slug}`, `/t/{slug}`, `/t/{slug}/{...asset}` (publish/runtime paths)
- `/api/*` (template/editor/site/publish/font APIs)

## Current Site Workflow

- Template selection:
  - frontend template gallery creates a user-owned site via `/Users/parkchwl/front/src/app/api/sites/route.ts`
  - upstream backend source of truth: `/Users/parkchwl/front/backend/src/main/java/com/facadely/backend/site/controller/SiteController.java`
- Dashboard:
  - `/Users/parkchwl/front/src/app/[lang]/(main)/dashboard/page.tsx`
  - lists authenticated user sites from backend and links to `/editor?sitePath=...`
- Editor:
  - `/Users/parkchwl/front/src/app/editor/page.tsx`
  - loads only owned sites
  - autosaves element/theme/token changes to `/api/save-code`
  - resolves template manifests through the owning site path
- Publish:
  - `/Users/parkchwl/front/src/app/api/publish/route.ts`
  - backend publish state source: `/api/v1/sites/publish`
  - public site resolution: `/Users/parkchwl/front/src/app/p/[slug]/page.tsx`

## Architecture-Significant Changes

- Replaced legacy middleware entry with proxy (`src/proxy.ts`).
- App-wide responsive/viewport stabilization:
  - viewport utility classes and variables in `src/app/globals.css`
  - route roots aligned to app viewport utility classes
  - zoom restriction removed from root viewport metadata
- Root font strategy migrated to local assets via `next/font/local`.
- Homepage interaction refinements:
  - infinite gallery restored to CSS loop animation without side fade mask
  - marquee location/speed tuned
  - FAQ progress bar reset/play behavior synchronized
- Editor/template integration:
  - `/generate` changed to editor entry redirect (`NEXT_PUBLIC_BETA_EDITOR_URL` fallback to `/editor`)
  - navigation label switched from Generate to Editor
  - canonical template listing/paths unified through registry (`/s/{slug}`)
  - template runtime folders migrated from numeric route dirs to slug-based dirs while keeping `/5,/6,/7` redirects for backward compatibility
- Site lifecycle backend:
  - added Spring site domain (`sites`) with owned site CRUD, customization persistence, and publish/unpublish lifecycle
  - editor/runtime APIs now proxy to backend site APIs instead of local file stores
  - dashboard now renders real owned sites instead of mock cards
  - editor no longer exposes canonical templates as save targets
  - direct text editing now marks editor dirty on input, not only on blur
- Backend auth cutover:
  - frontend auth source unified to Spring `/api/v1/auth/*`
  - Google OAuth only; Apple/Facebook removed from login flow
  - legacy Supabase auth runtime code removed
- Security hardening:
  - Next mutation APIs now require authenticated session checks plus same-origin validation
  - unsupported runtime page code generation path is now explicitly disabled in `/api/pages`
  - editor/publish runtime state is persisted in backend PostgreSQL via `/api/v1/sites/*`
  - backend startup now fails fast on placeholder JWT/OAuth secrets outside local origins
  - backend auth POST flows add explicit origin/referer validation on top of CORS
- Auth redirect/runtime hardening:
  - centralized `next` redirect sanitization in `/Users/parkchwl/front/src/lib/auth-redirect.ts`
  - protected route fallback policy standardized to `/login?next=...`
  - logout UX now retries once and surfaces explicit failure copy in dashboard/header account actions
- Browser regression automation:
  - Playwright setup added (`/Users/parkchwl/front/playwright.config.ts`)
  - auth flow regression scenarios added under `/Users/parkchwl/front/e2e/specs/`
  - local mock auth backend for deterministic browser tests (`/Users/parkchwl/front/e2e/mock-auth-server.mjs`)
- Repository cleanup:
  - removed unused legacy editor/client files
  - removed macOS `.DS_Store` artifacts

## Security and Runtime Model

- Next-side auth/origin guard:
  - `/Users/parkchwl/front/src/lib/server/api-security.ts`
  - used by:
    - `/Users/parkchwl/front/src/app/api/pages/route.ts`
    - `/Users/parkchwl/front/src/app/api/save-code/route.ts`
    - `/Users/parkchwl/front/src/app/api/fonts/upload/route.ts`
    - `/Users/parkchwl/front/src/app/api/publish/route.ts`
    - `/Users/parkchwl/front/src/app/api/template-manifest/route.ts`
- Protected frontend entry routes:
  - `/editor`
  - `/generate`
  - `/dashboard`
  - enforced in `/Users/parkchwl/front/src/proxy.ts`
- Runtime writable storage:
  - site customization / publish state: PostgreSQL `sites` table via Spring backend
  - uploaded fonts: `/Users/parkchwl/front/public/uploads/fonts`
- Backend public read surface:
  - `GET /api/v1/sites/customization`
  - `GET /api/v1/sites/public/{slug}`
  - these are intentionally public so published runtime/customization can be resolved without an authenticated editor session

## Env and Boot Assumptions

Frontend:

- `.env.local` should be based on `/Users/parkchwl/front/.env.example`
- required keys for normal local integration:
  - `NEXT_PUBLIC_API_BASE_URL`
  - `INTERNAL_API_BASE_URL`
  - `NEXT_PUBLIC_SITE_URL`
  - `NEXT_PUBLIC_BETA_EDITOR_URL`
- production example:
  - `NEXT_PUBLIC_API_BASE_URL=https://api.facadely.com/api/v1`
  - `INTERNAL_API_BASE_URL=https://api.facadely.com/api/v1`
  - `NEXT_PUBLIC_SITE_URL=https://facadely.com`

Backend:

- `.env` should be based on `/Users/parkchwl/front/backend/.env.example`
- loaded automatically through `/Users/parkchwl/front/backend/src/main/resources/application.yml`
- fail-fast validation entry:
  - `/Users/parkchwl/front/backend/src/main/java/com/facadely/backend/auth/config/AuthConfigurationValidator.java`
- validation rules:
  - non-local `FRONTEND_ORIGIN` cannot use a placeholder `JWT_ACCESS_SECRET`
  - non-local `FRONTEND_ORIGIN` cannot use placeholder Google OAuth credentials
  - `COOKIE_SECURE` must be `true` outside local development
  - `COOKIE_SAME_SITE=None` requires `COOKIE_SECURE=true`
- current Railway deployment:
  - project: `facadely-backend`
  - service: `backend`
  - public URL: `https://api.facadely.com`
  - health check: `https://api.facadely.com/api/v1/health`
  - Google OAuth callback to register:
    - `https://api.facadely.com/api/v1/auth/oauth2/callback/google`
  - runtime launch path is pinned by `/Users/parkchwl/front/backend/Procfile`
  - Railway backend is connected to the service named `Postgres`

## Known Deliberate Exception

- `GET /api/save-code` remains public because the runtime path ultimately needs read access to site customization without going through an authenticated editor session.
- The current model therefore treats persisted customization JSON as presentation data.
- If draft state and published state need to diverge later, the next refactor should separate:
  - draft editor storage
  - published runtime snapshot storage
  - publication snapshot generation

## Validation Baseline

- Frontend:
  - `npm run lint`
  - `npm run build`
  - `npm run test:e2e`
- Backend:
  - `cd backend && ./gradlew test`
