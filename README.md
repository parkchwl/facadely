# facadely Frontend

Next.js App Router frontend for facadely.

## Requirements

- Node.js 20+
- npm 10+

## Quick Start

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Available Scripts

- `npm run dev` - start dev server
- `npm run build` - production build
- `npm run start` - start production server
- `npm run lint` - run ESLint

## Core Structure

- `src/app` - App Router routes and layouts
- `src/app/fonts.ts` - local font loader (`next/font/local`)
- `src/app/fonts/` - bundled variable font assets (sans/mono)
- `src/app/components` - page-level and shared UI components
- `src/app/components/shared` - shared route clients used by real pages
- `src/i18n/messages` - locale dictionaries (with English fallback merge)
- `src/lib/get-dictionary.ts` - dictionary loading and fallback merge
- `src/proxy.ts` - Next 16 proxy entry (replaces legacy `middleware.ts`)

## Validation

```bash
npm run lint
npx next build --webpack
```

If Turbopack networking/ports are restricted in your local environment, use webpack build validation as above.

## Documentation

- `CHANGELOG.md` - chronological changes
- `docs/README.md` - documentation index and maintenance policy
- `docs/PROJECT_OVERVIEW.md` - current architecture and route overview
- `docs/archive/2025-legacy/` - archived legacy analysis/report documents
