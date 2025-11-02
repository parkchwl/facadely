# Facadely - No-Code Website Builder 📚

**Project**: Next.js 15 + React 19 + Tailwind CSS 4 + Supabase
**Status**: Active Development (v0.1.0)
**Last Updated**: 2025-10-30

---

## 🎯 PROJECT OVERVIEW

**Facadely** is a modern, no-code website builder that enables users to create professional websites without coding. Built with Next.js 15's latest App Router, it features:

- 🌍 **6-Language Support**: English (complete), Korean, Hindi, Indonesian, Vietnamese, Traditional Chinese
- 🎨 **100+ Templates**: Pre-built, responsive website templates
- 🔐 **Authentication**: Social login via Supabase
- 📱 **Fully Responsive**: Mobile-first design across all pages
- ⚡ **Modern Stack**: React 19, Next.js 15.5.4, Tailwind CSS 4, Framer Motion
- 📝 **Blog System**: Full blog with categorization and search (NEW)

---

## 📁 PROJECT STRUCTURE

```
/Users/parkchwl/front/
├── public/
│   ├── image/                    # WebP images (13+ files)
│   └── svg/                      # SVG icons
├── src/
│   ├── app/
│   │   ├── layout.tsx            # Root layout
│   │   ├── globals.css           # Global styles & animations
│   │   ├── error.tsx             # Error boundary
│   │   ├── components/           # Shared components (14 files)
│   │   ├── pages/                # Page implementations
│   │   ├── login/                # Authentication pages
│   │   └── [lang]/               # Language-based routing
│   │       └── (main)/           # Main pages route group
│   │           ├── page.tsx      # Home
│   │           ├── about/        # About
│   │           ├── blog/         # Blog listing (NEW)
│   │           ├── blog/[id]/    # Blog post detail (NEW)
│   │           ├── contact/      # Contact
│   │           ├── customer-service/
│   │           ├── generate/     # AI generator
│   │           ├── pricing/      # Pricing tiers
│   │           ├── privacy/      # Privacy policy
│   │           ├── qa/           # Q&A section
│   │           ├── service/      # Services
│   │           ├── status/       # Status page
│   │           ├── templates/    # Template browser
│   │           └── terms/        # Terms of service
│   ├── i18n/
│   │   ├── config.ts             # Locale config (en, ko, hi, id, vi, zh-TW)
│   │   ├── utils.ts              # Language name mappings
│   │   └── messages/             # JSON translation files (6 languages)
│   ├── lib/
│   │   ├── get-dictionary.ts     # Translation loader
│   │   └── supabase/             # Supabase clients (browser, server, middleware)
│   ├── types/
│   │   └── supabase.ts           # Auto-generated DB types
│   ├── middleware.ts             # i18n routing & session protection
│   └── hooks/                    # (Empty, ready for custom hooks)
├── Configuration:
│   ├── package.json              # Dependencies & scripts
│   ├── next.config.mjs           # Build optimization
│   ├── tsconfig.json             # TypeScript config
│   ├── postcss.config.mjs        # PostCSS setup
│   ├── eslint.config.mjs         # Linting rules
│   └── I18N_IMPLEMENTATION_COMPLETE.md
└── supabase/                     # Supabase config
```

---

## 🔧 TECH STACK

### Core Framework
- **Next.js** 15.5.4 (App Router, latest)
- **React** 19.1.0 (JSX Server Components)
- **React DOM** 19.1.0
- **TypeScript** 5.x (strict mode)

### Styling & UI
- **Tailwind CSS** 4.x (via @tailwindcss/postcss)
- **PostCSS** 4.x
- **Framer Motion** 12.23.22 (animations)
- **Lucide React** 0.544.0 (icons)
- **Geist Fonts** 1.5.1 (typography)

### Backend & Auth
- **Supabase** 2.51.0 (backend-as-a-service)
- **@supabase/supabase-js** 2.75.0 (client)
- **@supabase/ssr** 0.7.0 (server sessions)

### Development
- **ESLint** 9.x + Next.js rules
- **Node.js** 18+

---

## 📋 COMPLETE FEATURES MAP

### ✅ Implemented Pages (15+)

| Page | Route | Type | Features |
|------|-------|------|----------|
| **Home** | `/[lang]/` | Server + Client | Hero, FAQ, Features, CTA, Template showcase |
| **Templates** | `/[lang]/templates` | Server + Client | Search, filter by category, grid/list toggle |
| **Generate** | `/[lang]/generate` | Server | AI website generation UI |
| **Service** | `/[lang]/service` | Server + Client | Features, how-it-works, FAQ, CTA |
| **Pricing** | `/[lang]/pricing` | Server + Client | 3-tier pricing, yearly/monthly toggle, comparison |
| **Q&A** | `/[lang]/qa` | Server + Client | Search, category filtering, expandable items |
| **Blog** | `/[lang]/blog` | Server + Client | Post listing, categorization, featured articles, search |
| **Blog Detail** | `/[lang]/blog/[id]` | Server + Client | Full post, metadata, author bio, related posts |
| **About** | `/[lang]/about` | Server | Company information |
| **Contact** | `/[lang]/contact` | Server | Contact form (frontend only) |
| **Customer Service** | `/[lang]/customer-service` | Server | Support channels |
| **Privacy** | `/[lang]/privacy` | Server + Client | Policy content |
| **Terms** | `/[lang]/terms` | Server + Client | ToS content |
| **Cookie** | `/[lang]/cookie` | Server + Client | Cookie policy |
| **Status** | `/[lang]/status` | Server | Server status page |
| **Login** | `/login` | Server + Client | Social auth |

### 🎨 UI Components (14 Reusable)

1. **Layout.tsx** (346 lines) - Main header, nav, footer, language selector
2. **HomePage.tsx** (460 lines) - Home page with all sections
3. **TemplateCard.tsx** - Memoized template card with image + hover effects
4. **ErrorBoundary.tsx** - React error boundary with fallback UI
5. **ScrollingBanner.tsx** - Infinite scrolling marquee text
6. **TermsAgreementModal.tsx** - Terms acceptance modal
7. **TermsCheckbox.tsx** - Checkbox component
8. **SocialLoginButton.tsx** - Social login UI
9. **PolicyPageHeader.tsx** - Reusable policy header
10. **BlogListClient.tsx** (NEW) - Blog listing with filters
11. **BlogPostDetailClient.tsx** (NEW) - Individual blog post display
12. **TemplatesPageClient.tsx** - Template search/filter
13. **PricingPageClient.tsx** - Pricing UI with toggles
14. **QAPageClient.tsx** - Q&A with search

### 🌍 Internationalization

**Languages** (6 total):
- 🇬🇧 **English** - 100% complete (965 lines)
- 🇰🇷 **Korean** - Structure only (877 lines)
- 🇮🇳 **Hindi** - Structure only (877 lines)
- 🇮🇩 **Indonesian** - Structure only (877 lines)
- 🇻🇳 **Vietnamese** - Structure only (877 lines)
- 🇹🇼 **Traditional Chinese** - Structure only (877 lines)

**i18n Architecture**:
- URL-based locale detection (`/en/page`, `/ko/page`)
- Server-side dictionary loading
- Dynamic imports per language
- Middleware for automatic language redirection
- Language selector in header + mobile menu

---

## 🎨 DESIGN SYSTEM & STYLING

### CSS Architecture
- **Tailwind CSS v4** - Utility-first CSS
- **Global CSS** (`globals.css`) - Custom animations, fonts, variables
- **CSS Variables** - Light/dark theme support
- **Custom Animations** - fadeInUp, shimmer, scroll effects, progressBar

### Design Principles
- **Mobile-First**: Responsive breakpoints (sm, md, lg, xl, 2xl)
- **Minimal Palette**: Black/white + subtle accents (blue, green)
- **Typography**: Multiple font families for hierarchy
  - Geist (default sans-serif)
  - Montserrat (headings)
  - Cardo (decorative)
  - DM Serif (display)
- **Spacing**: Generous padding/margins for breathing room
- **Effects**: Glassmorphism, gradients, shadows, blur

### Performance Optimizations
- **Image optimization**: AVIF/WebP, 75% quality
- **Font display**: `swap` strategy for web fonts
- **Lazy loading**: Intersection observers for images
- **CSS-based animations**: Minimal JavaScript animations
- **Framer Motion**: Performant React animations

---

## 🔐 STATE MANAGEMENT & ARCHITECTURE

### State Management Pattern: **React Hooks + Props Drilling**

**No external state library** (no Redux, Zustand, Context API yet)

#### Hook Usage:
- **useState** - Local component state
- **useEffect** - Side effects, scroll listeners
- **useMemo** - Expensive computations
- **useCallback** - Function memoization (currently missing)
- **useParams** - URL parameters
- **useRouter** - Navigation
- **useRef** - DOM access

#### Data Flow:
```
Server Component (fetches data)
    ↓
Client Component (receives as props)
    ↓
Nested Client Components (props drilling)
```

#### Known Issue:
- Props drilling causes verbose code
- Dictionary objects passed through multiple levels
- **Solution**: Implement React Context API for i18n

---

## 📡 API & DATA FETCHING

### Data Sources:

#### 1. **Translations (i18n)**
- Server-side dynamic import per language
- JSON files in `/src/i18n/messages/`
- Loaded in page.tsx → passed to client components

#### 2. **Supabase**
```typescript
// Authentication
- Social login (Google, GitHub)
- Session management via middleware
- User profiles table

// Database Tables (configured but not queried):
- profiles (user info)
- subscriptions (billing)
- templates (template library)
- websites (user websites)
- website_analytics (analytics)
```

#### 3. **Mock Data**
- Blog posts hardcoded in `en.json`
- Templates hardcoded in component state
- Contact form not connected to backend

### Missing:
- ❌ API routes for form submissions
- ❌ Real database queries
- ❌ Backend for contact/support forms
- ❌ Blog post API

---

## 🚀 BUILD & DEPLOYMENT

### Development
```bash
npm run dev
# Runs on http://localhost:3000
# Hot reload enabled
```

### Production Build
```bash
npm run build
# Outputs to .next/
# Optimizes all assets
```

### Start Production Server
```bash
npm start
# Serves optimized bundle
```

### Linting
```bash
npm run lint
# ESLint with Next.js rules
```

### Build Optimizations (in next.config.mjs):
- Image format conversion (AVIF/WebP)
- Console log removal (production)
- Security headers (STS, CSP, X-Frame-Options)
- CORS restrictions
- Cache headers

### Environment Variables:
```env
NEXT_PUBLIC_SUPABASE_URL=<your-supabase-project-url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-supabase-anon-key>
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

**Note:** Actual values are stored in `.env.local` (not committed to git). See `.env.example` for template.

---

## 🏛️ ARCHITECTURAL PATTERNS

### 1. Server + Client Component Split
```typescript
// page.tsx (Server)
const dictionary = await getDictionary(lang);
return <ClientComponent dictionary={dictionary} />;

// ClientComponent.tsx ('use client')
export default function ClientComponent({ dictionary }) { }
```

### 2. Memoization
- `React.memo()` for pure components
- `useMemo()` for expensive calculations
- **Missing**: useCallback for event handlers

### 3. URL-Based Routing
- Language in URL: `/[lang]/[page]`
- Blog ID: `/blog/[id]`
- Enables bookmarking and deep linking

### 4. Lazy Loading
- Intersection Observer for image loading
- Conditional rendering based on visibility
- Auto-cycling FAQ with pause on hover

### 5. Error Boundaries
- Class component error boundary
- Fallback UI for errors
- Development error details

### 6. Responsive Design
Mobile-first approach with Tailwind breakpoints:
```typescript
className="
  text-base          // Mobile
  sm:text-lg         // 640px+
  lg:text-2xl        // 1024px+
  xl:text-3xl        // 1280px+
"
```

---

## 🐛 KNOWN ISSUES & TECHNICAL DEBT

### 🔴 Critical Issues

1. **TypeScript `any` Types**
   - Dictionary props typed as `any`
   - Breaks strict type safety
   - Files: Layout.tsx, HomePage.tsx, page components
   - **Fix**: Create proper dictionary interfaces

2. **Incomplete i18n**
   - Only English complete (965 lines)
   - Other languages: structure only (877 lines each)
   - **Status**: Translation needed

3. **Hardcoded Mock Data**
   - Blog posts in `en.json`
   - Templates in components
   - No API integration
   - **Issue**: Can't update without code changes

4. **Blog Routes Not Committed**
   - `/src/app/[lang]/(main)/blog/` not tracked
   - **Status**: In progress

5. **Supabase Not Connected**
   - Database schema defined but not queried
   - Authentication setup incomplete
   - **Status**: Infrastructure ready

### 🟡 High Priority Issues

6. **Props Drilling**
   - Dictionary deeply nested through components
   - **Solution**: Implement React Context

7. **No Global State**
   - All state is local to components
   - Language preference not persisted
   - **Solution**: Add Context API or Zustand

8. **Client Components Overuse**
   - 20 client vs 19 server components
   - Could reduce JS bundle size
   - **Solution**: Convert non-interactive components to server

9. **Missing useCallback**
   - Event handlers recreated every render
   - Can cause unnecessary re-renders
   - Files: Layout.tsx, HomePage.tsx

10. **No API Routes**
    - `/api/` directory not implemented
    - Contact forms non-functional
    - **Missing**: POST routes for submissions

### 🟡 Performance Issues

11. **Large Image Files**
    - 13+ WebP files not fully optimized
    - Mobile optimization opportunity

12. **Multiple Font Families**
    - 4 custom fonts loaded
    - **Opportunity**: Reduce to 2-3

13. **Infinite Scroll Inefficiency**
    - Templates duplicated in memory
    - Works but not scalable
    - **Better**: CSS-based infinite scroll

### 🟡 DevOps & Testing

14. **No Environment Configuration**
    - Only .env.local documented
    - Missing .env.production setup

15. **No Tests**
    - No Jest/Vitest/E2E tests
    - **Missing**: Unit tests, integration tests

---

## 📊 PROJECT STATISTICS

| Metric | Value |
|--------|-------|
| Total .tsx Files | 39 |
| Client Components | 20 |
| Server Components | 19 |
| Main Pages | 15+ |
| Languages | 6 (1 complete) |
| Components | 14 reusable |
| Git Commits | 30+ |
| Translation Lines | 5,350 |
| Lines of CSS | 150+ |
| Package Size | ~350 MB (with node_modules) |

---

## 🛠️ COMMON DEVELOPMENT TASKS

### Adding a New Page

1. Create directory: `/src/app/[lang]/(main)/[page-name]/`
2. Create `page.tsx` (server component):
```typescript
import { getDictionary } from '@/lib/get-dictionary';
import ClientComponent from './ClientComponent';

export default async function Page({ params }) {
  const { lang } = await params;
  const dictionary = await getDictionary(lang);
  return <ClientComponent dictionary={dictionary} />;
}
```
3. Create `ClientComponent.tsx` ('use client')
4. Add to i18n: Update all 6 language files in `/src/i18n/messages/`
5. Add to navigation: Update Layout.tsx

### Adding Translations

1. Edit JSON files in `/src/i18n/messages/`
2. Maintain same key structure across all languages
3. Pass dictionary to client components
4. Access with `dictionary.key.subkey`

### Creating Components

1. Create `.tsx` file in `/src/app/components/`
2. Add TypeScript interfaces for props
3. Export component (memoize if pure)
4. Use in pages or other components

### Styling Components

1. Use Tailwind utility classes (primary method)
2. Add custom CSS in globals.css if needed
3. Use Framer Motion for animations
4. Follow mobile-first responsive pattern

---

## 🚀 NEXT IMMEDIATE TASKS

### 1. **Complete Blog Feature** (In Progress)
- ✅ BlogListClient implemented
- ✅ BlogPostDetailClient implemented
- ✅ Hero section styling applied
- ⏳ Commit blog directory to git
- ⏳ Add real blog post data fetching

### 2. **Fix TypeScript Types**
- Replace dictionary `any` types
- Create proper interfaces
- Run type checking

### 3. **Complete i18n Translations**
- Translate 5 languages from English
- Test language switching

### 4. **Add API Routes**
- `/api/contact` - Contact form submission
- `/api/blog` - Blog post fetching
- `/api/templates` - Template browsing

### 5. **Connect Supabase**
- Query database for real data
- Implement user authentication
- Set up webhooks for updates

---

## 📝 CODE STYLE & CONVENTIONS

### File Naming
- Pages: `page.tsx`
- Server components: `[name].tsx`
- Client components: `[Name]Client.tsx`
- Shared components: `[Name].tsx` in `/components/`

### TypeScript
- Strict mode enabled
- Interfaces for complex types
- Props typing mandatory
- Avoid `any` type

### Components
- Functional components (no class components except ErrorBoundary)
- PropTypes optional (TS types preferred)
- Memoize pure components
- Use Framer Motion for animations

### Styling
- Tailwind classes primary
- Mobile-first responsive design
- Global CSS for animations/variables
- Inline styles only for dynamic values

### i18n
- All user-facing text in JSON
- English as source language
- Consistent key naming across files
- No hardcoded strings in components

---

## 🔍 KEY FILE LOCATIONS

| File | Purpose |
|------|---------|
| `/src/app/components/Layout.tsx` | Main layout (header, nav, footer) |
| `/src/app/pages/HomePage.tsx` | Home page implementation |
| `/src/app/[lang]/(main)/blog/BlogListClient.tsx` | Blog listing (NEW) |
| `/src/app/[lang]/(main)/blog/BlogPostDetailClient.tsx` | Blog post detail (NEW) |
| `/src/i18n/config.ts` | i18n configuration |
| `/src/i18n/messages/en.json` | English translations |
| `/src/lib/get-dictionary.ts` | Translation loader |
| `/src/lib/supabase/client.ts` | Browser Supabase client |
| `/src/lib/supabase/server.ts` | Server Supabase client |
| `/src/app/globals.css` | Global styles & animations |
| `/next.config.mjs` | Build configuration |

---

## 📞 SUPPORT & DEBUGGING

### Common Issues

**Issue**: Language not switching
- Check middleware.ts for locale detection
- Verify URL structure: `/[lang]/[page]`
- Clear browser cache

**Issue**: Component not rendering
- Check Error Boundary in app/error.tsx
- Verify dictionary passed correctly
- Check browser console for errors

**Issue**: Build fails
- Check TypeScript errors: `npm run lint`
- Clear `.next/` cache
- Verify all imports are correct

**Issue**: Images not loading
- Check `/public/image/` directory
- Verify image paths in code
- Check next.config.mjs image settings

---

## 📈 FUTURE ROADMAP

### Phase 1 (Current)
- ✅ Blog feature launch
- ⏳ Complete all translations
- ⏳ Connect Supabase database
- ⏳ Implement form backends

### Phase 2
- API routes for all operations
- User dashboard
- Website management
- Analytics dashboard

### Phase 3
- Editor interface (drag & drop)
- Template customization
- Publishing & hosting
- Domain management

### Phase 4
- Mobile app
- Advanced analytics
- Team collaboration
- White-label option

---

## 🎓 LEARNING RESOURCES

### Key Concepts Used
- **Next.js 15**: App Router, Server/Client Components, Middleware
- **React 19**: Hooks, JSX Server Components, Suspense
- **Tailwind CSS 4**: Utility classes, responsive design, PostCSS
- **Framer Motion**: Animation library, gesture controls
- **TypeScript**: Type safety, interfaces, generics
- **Supabase**: Authentication, real-time databases, storage

### Docs to Review
- Next.js: https://nextjs.org/docs
- React: https://react.dev
- Tailwind: https://tailwindcss.com
- Framer Motion: https://framer.com/motion
- Supabase: https://supabase.com/docs

---

## 📄 LICENSE & METADATA

**Project Name**: Facadely
**Version**: 0.1.0
**Repository**: Git (main branch)
**Owner**: parkchwl
**Status**: Active Development
**Last Commit**: d203730 - Complete i18n implementation overhaul

---

**Generated**: 2025-10-30
**Total Pages**: 50+ (comprehensive project documentation)
**Use Case**: Internal development reference, onboarding, debugging
