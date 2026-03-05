# Project Overview

Last updated: 2026-03-06

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
- Template registry and path conversion:
  - `/Users/parkchwl/front/src/lib/template-registry.ts`
- Compatibility redirect routes:
  - `/Users/parkchwl/front/src/app/5/page.tsx`
  - `/Users/parkchwl/front/src/app/6/page.tsx`
  - `/Users/parkchwl/front/src/app/7/page.tsx`
- Runtime template views:
  - `/Users/parkchwl/front/src/app/5/TemplateView.tsx`
  - `/Users/parkchwl/front/src/app/6/TemplateView.tsx`
  - `/Users/parkchwl/front/src/app/7/TemplateView.tsx`

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
- `/api/*` (template/editor/publish/font APIs)

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
- Backend auth cutover:
  - frontend auth source unified to Spring `/api/v1/auth/*`
  - Google OAuth only; Apple/Facebook removed from login flow
  - legacy Supabase auth runtime code removed
- Repository cleanup:
  - removed unused legacy editor/client files
  - removed macOS `.DS_Store` artifacts

## Validation Baseline

- Frontend:
  - `npm run lint`
  - `npm run build`
- Backend:
  - `cd backend && ./gradlew test`
