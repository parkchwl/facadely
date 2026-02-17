# Project Overview

Last updated: 2026-02-17

## Stack

- Next.js `16.1.1` (App Router)
- React `19.2.3`
- TypeScript `5`
- Tailwind CSS `4`
- Framer Motion `12.23.22`
- Supabase (`@supabase/supabase-js`, `@supabase/ssr`)

## App Shape

- Root layout: `/Users/parkchwl/front/src/app/layout.tsx`
- Main localized layout: `/Users/parkchwl/front/src/app/[lang]/(main)/layout.tsx`
- Proxy entry (Next 16): `/Users/parkchwl/front/src/proxy.ts`
- Shared route clients: `/Users/parkchwl/front/src/app/components/shared/`

## Locales and Dictionary Behavior

- Locales: `en`, `ko`, `hi`, `id`, `vi`, `zh-TW`
- Dictionary loader: `/Users/parkchwl/front/src/lib/get-dictionary.ts`
- Behavior:
  - English (`en`) is the canonical base dictionary.
  - Other locales are loaded as partial dictionaries and merged over English fallback.

## Main Runtime Routes

All routes are under `src/app/[lang]/(main)` unless noted.

- `/{lang}` (home)
- `/{lang}/about`
- `/{lang}/blog`
- `/{lang}/blog/{id}`
- `/{lang}/contact`
- `/{lang}/cookie`
- `/{lang}/customer-service`
- `/{lang}/generate`
- `/{lang}/login`
- `/{lang}/pricing`
- `/{lang}/privacy`
- `/{lang}/qa`
- `/{lang}/service`
- `/{lang}/status`
- `/{lang}/templates`
- `/{lang}/terms`
- `/_not-found` (framework route)

## Recent Architecture-Significant Changes

- Replaced legacy middleware entry with proxy:
  - `src/middleware.ts` -> `src/proxy.ts`
- App-wide responsive/viewport stabilization:
  - utility classes and viewport variables added in `src/app/globals.css`
  - route roots aligned to `min-h-app-vh`
- Dev/build module resolution hardening:
  - pinned `outputFileTracingRoot` and `turbopack.root` in `next.config.mjs`
  - local `node_modules` resolution precedence for webpack
- Home/blog content restructuring:
  - home "It is Essential" section removed
  - moved into blog article (`blogPage.posts` id `6`) in `src/i18n/messages/en.json`

## Validation Baseline

- Lint:
  - `npm run lint`
- Build (preferred for restricted local environments):
  - `npx next build --webpack`
