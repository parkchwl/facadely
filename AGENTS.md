# Facadely Project Context

Last updated: 2026-03-06

This file is a lightweight, current context reference.
For full documentation, see `docs/README.md`.

## Project

- Name: `front`
- Purpose: facadely frontend (data-driven website operations platform)
- Runtime: Next.js App Router project

## Current Stack

- Next.js `16.1.1`
- React `19.2.3`
- TypeScript `5`
- Tailwind CSS `4`
- Framer Motion `12.23.22`
- Spring Boot backend (`/backend`, auth APIs + Google OAuth)

## Key App Paths

- Root layout: `src/app/layout.tsx`
- Main locale layout: `src/app/[lang]/(main)/layout.tsx`
- Proxy entry: `src/proxy.ts`
- Shared page clients: `src/app/components/shared/`
- Dictionaries: `src/i18n/messages/`
- Dictionary loader: `src/lib/get-dictionary.ts`

## Locales

- Supported: `en`, `ko`, `hi`, `id`, `vi`, `zh-TW`
- Non-English dictionaries are merged over English fallback at runtime.

## 2026-03-06 Highlights

- Template routing canonicalized to `/s/{slug}`via `src/lib/template-registry.ts`while preserving `/5`,`/6`,`/7`compatibility redirects.
- Editor integration unified: `/[lang]/generate`now redirects to `NEXT_PUBLIC_BETA_EDITOR_URL`(fallback `/editor`), and navigation label uses `Editor`.
- Front auth cut over to Spring (`/api/v1/auth/*`) with Google-only social login and Supabase auth runtime removal.
- App-wide responsive/viewport hardening and homepage UX fixes (gallery loop, marquee placement/speed, FAQ progress bar sync).
- Legacy unused UI files removed (`src/app/pages/editor.tsx`, `src/app/components/ContactPageClient.tsx`).

## Validation Commands

```bash
npm run lint
npx next build --webpack
```
