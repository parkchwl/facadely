# Project Overview

Last updated: 2026-03-22

## Stack

- Next.js `16.1.1`(App Router)
- React `19.2.3`
- TypeScript `5`
- Tailwind CSS `4`
- Framer Motion `12.23.22`
- Spring Boot backend (`/backend`, Java 21, Security, JPA, Flyway, OAuth2)

## App Shape

- Root layout: `src/app/layout.tsx`
- Main localized layout: `src/app/[lang]/(main)/layout.tsx`
- Proxy entry (Next 16): `src/proxy.ts`
- Shared route clients: `src/app/components/shared/`
- Local font loader: `src/app/fonts.ts`
- Backend app root: `/backend`

## Template Routing Model

- Canonical template route:
  - `src/app/s/[slug]/page.tsx`
- User-owned site route pattern:
  - `/s/{template-slug}-{unique-suffix}`
  - template source resolution handled in `src/lib/user-site-store.ts`
- Template registry and path conversion:
  - `src/lib/template-registry.ts`
- React template runtime directories (slug-based):
  - `src/app/nexus-ai-enterprise/`
  - `src/app/velocity-saas-landing/`
  - `src/app/onepro-dashboard-white/`
- Compatibility redirect routes:
  - `src/app/5/page.tsx`
  - `src/app/6/page.tsx`
  - `src/app/7/page.tsx`

## Locales and Dictionary Behavior

- Locales: `en`, `ko`, `hi`, `id`, `vi`, `zh-TW`
- Dictionary loader: `src/lib/get-dictionary.ts`
- Behavior:
  - English (`en`) is the canonical base dictionary.
  - Other locales are loaded as partial dictionaries and merged over English fallback.

## Main Runtime Routes

Localized routes (`src/app/[lang]/(main)`):

- `/{lang}`(home)
- `/{lang}/about`
- `/{lang}/blog`
- `/{lang}/blog/{id}`
- `/{lang}/contact`
- `/{lang}/cookie`
- `/{lang}/customer-service`
- `/{lang}/generate`(redirects to editor entry)
- `/{lang}/login`
- `/{lang}/pricing`
- `/{lang}/privacy`
- `/{lang}/qa`
- `/{lang}/service`
- `/{lang}/status`
- `/{lang}/templates`
- `/{lang}/terms`

Non-localized routes:

- `/editor`(beta editor app)
- `/s/{slug}`(canonical template preview)
- `/5`, `/6`, `/7`(legacy compatibility redirects)
- `/p/{slug}`, `/t/{slug}`, `/t/{slug}/{...asset}`(publish/runtime paths)
- `/api/*`(template/editor/site/publish/font APIs)

## Current Site Workflow

- Template selection:
  - frontend template gallery creates a user-owned site via `src/app/api/sites/route.ts`
  - upstream backend source of truth: `backend/src/main/java/com/facadely/backend/site/controller/SiteController.java`
- Dashboard:
  - `src/app/[lang]/(main)/dashboard/page.tsx`
  - lists authenticated user sites from backend and links to `/editor?sitePath=...`
- Editor:
  - `src/app/editor/page.tsx`
  - bootstraps owned site list, active site, manifest, customization, and publish state through `src/app/api/editor/bootstrap/route.ts`
  - autosaves element/theme/token changes to `/api/save-code` using `siteId` as the primary identifier
  - uses the stored `templatePath` from the owned site record instead of re-deriving template identity from the URL slug
- Publish:
  - `src/app/api/publish/route.ts`
  - backend publish state source: `/api/v1/sites/publish`
  - public site resolution: `src/app/p/[slug]/page.tsx`

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
  - `/generate`changed to editor entry redirect (`NEXT_PUBLIC_BETA_EDITOR_URL`fallback to `/editor`)
  - navigation label switched from Generate to Editor
  - canonical template listing/paths unified through registry (`/s/{slug}`)
  - template runtime folders migrated from numeric route dirs to slug-based dirs while keeping `/5,/6,/7`redirects for backward compatibility
- Site lifecycle backend:
  - added Spring site domain (`sites`) with owned site CRUD, customization persistence, and publish/unpublish lifecycle
  - editor/runtime APIs now proxy to backend site APIs instead of local file stores
  - dashboard now renders real owned sites instead of mock cards
  - editor no longer exposes canonical templates as save targets
  - direct text editing now marks editor dirty on input, not only on blur
  - editor bootstrap flow now consolidates site list, manifest, draft customization, and publish state into one authenticated request
  - site save/publish paths now accept `siteId` so routing slugs are no longer the primary backend identifier
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
  - centralized `next`redirect sanitization in `src/lib/auth-redirect.ts`
  - protected route fallback policy standardized to `/login?next=...`
  - logout UX now retries once and surfaces explicit failure copy in dashboard/header account actions
- Browser regression automation:
  - Playwright setup added (`playwright.config.ts`)
  - auth flow regression scenarios added under `e2e/specs/`
  - local mock auth backend for deterministic browser tests (`e2e/mock-auth-server.mjs`)
- Repository cleanup:
  - removed unused legacy editor/client files
  - removed macOS `.DS_Store`artifacts

## Security and Runtime Model

- Next-side auth/origin guard:
  - `src/lib/server/api-security.ts`
  - used by:
    - `src/app/api/pages/route.ts`
    - `src/app/api/save-code/route.ts`
    - `src/app/api/fonts/upload/route.ts`
    - `src/app/api/publish/route.ts`
    - `src/app/api/template-manifest/route.ts`
- Protected frontend entry routes:
  - `/editor`
  - `/generate`
  - `/dashboard`
  - enforced in `src/proxy.ts`
- Runtime writable storage:
  - site customization / publish state: PostgreSQL `sites`table via Spring backend
  - uploaded fonts: `public/uploads/fonts`
- Backend public read surface:
  - `GET /api/v1/sites/public/{slug}`
  - `GET /api/v1/sites/public/{slug}/customization`
  - published runtime resolves only published site metadata/customization without an authenticated editor session
- Backend owner-only draft surface:
  - `GET /api/v1/sites/customization`
  - `GET /api/v1/sites/publish`
  - draft customization and publish state now require authentication plus ownership checks

## Env and Boot Assumptions

Frontend:

- `.env.local`should be based on `.env.example`
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

- `.env`should be based on `backend/.env.example`
- loaded automatically through `backend/src/main/resources/application.yml`
- fail-fast validation entry:
  - `backend/src/main/java/com/facadely/backend/auth/config/AuthConfigurationValidator.java`
- validation rules:
  - non-local `FRONTEND_ORIGIN`cannot use a placeholder `JWT_ACCESS_SECRET`
  - non-local `FRONTEND_ORIGIN`cannot use placeholder Google OAuth credentials
  - `COOKIE_SECURE`must be `true`outside local development
  - `COOKIE_SAME_SITE=None`requires `COOKIE_SECURE=true`
- current Railway deployment:
  - project: `facadely-backend`
  - service: `backend`
  - public URL: `https://api.facadely.com`
  - health check: `https://api.facadely.com/api/v1/health`
  - Google OAuth callback to register:
    - `https://api.facadely.com/api/v1/auth/oauth2/callback/google`
  - runtime launch path is pinned by `backend/Procfile`
  - Railway backend is connected to the service named `Postgres`

## Current Publication Model

- Draft editor state and published runtime state are now separated at the API boundary.
- Draft customization is loaded only through authenticated owner-scoped endpoints.
- Published runtime reads through `/p/{slug}` -> published site lookup -> canonical `/s/{templateSlug}?published=...` runtime hydration.
- The current persistence model still stores customization on the owned site record itself.

## Next Architecture Step

- If facadely starts supporting “edited template variants assigned across multiple user spaces,” the next backend refactor should introduce a distinct revision layer:
  - draft editor storage
  - published runtime snapshot storage
  - reusable template revision / assignment records

## Validation Baseline

- Frontend:
  - `npm run lint`
  - `npm run build`
  - `npm run test:e2e`
- Backend:
  - `cd backend && ./gradlew test`
