# 🧪 Comprehensive Testing Strategy for Facadely
**업계 최고 수준 달성을 위한 테스트 인프라 설계**

---

## 📊 현재 상태 분석 (Deep Dive)

### 프로젝트 규모
- **총 소스 파일**: 78개 (.ts/.tsx)
- **클라이언트 컴포넌트**: 20개 ('use client')
- **서버 컴포넌트**: 19개
- **상태 관리 컴포넌트**: 18개 (useState/useEffect 사용)
- **재사용 가능 컴포넌트**: 9개 (core components)
- **페이지 라우트**: 15+ pages
- **다국어 지원**: 6개 언어 (en, ko, hi, id, vi, zh-TW)

### 기술 스택
- **Next.js**: 15.5.4 (App Router, RSC)
- **React**: 19.1.0 (최신 - 중요!)
- **TypeScript**: 5.x (strict mode)
- **Build Tool**: Turbopack (Next.js 15 기본)

### 핵심 테스트 대상
1. **i18n 라우팅 시스템** - `/` (English) vs `/ko/*` (Korean)
2. **타입 안전성** - Dictionary 타입 시스템
3. **이미지 최적화** - OptimizedImage + AVIF
4. **클라이언트 상호작용** - FAQ, 템플릿 검색, 언어 전환
5. **폼 제출** - Contact, Login
6. **미들웨어 리다이렉션** - `/en` → `/`
7. **서버 컴포넌트** - getDictionary, 데이터 페칭

---

## 🎯 테스트 전략 철학

### 1. **Test Pyramid (업계 표준)**

```
        /\
       /  \
      / E2E \          ← 10% (Critical User Flows)
     /------\
    /        \
   / Integration \     ← 20% (Component Integration)
  /------------\
 /              \
/  Unit Tests    \    ← 70% (Logic, Utils, Hooks)
------------------
```

**우리 프로젝트 적용:**
- **70% Unit**: Utils, hooks, 타입 체크, 순수 함수
- **20% Integration**: 컴포넌트 렌더링, 이벤트 핸들링, i18n
- **10% E2E**: 언어 전환, 템플릿 검색, 페이지 네비게이션

### 2. **Testing Trophy (Kent C. Dodds 방식)**

```
        /\
       /  \
      / E2E \          ← Static (TypeScript)
     /------\          ← E2E (Playwright)
    /        \
   /Integration\       ← Integration (RTL)
  /------------\       ← Unit (Vitest)
```

**이 프로젝트에 최적:**
- 이미 TypeScript strict mode 사용 중 ✅
- Next.js 15 + React 19 = Integration 테스트가 중요
- RSC (Server Components) 테스트 전략 필요

---

## 🛠️ 프레임워크 선택 (심층 분석)

### A. Unit & Integration Testing

#### **Option 1: Vitest ⭐ (권장)**

**장점:**
- ✅ **속도**: Jest보다 10-20배 빠름 (Vite 기반)
- ✅ **Next.js 15 호환**: 공식 지원
- ✅ **ESM 네이티브**: 최신 모듈 시스템
- ✅ **Zero Config**: 설정 최소화
- ✅ **UI Mode**: 브라우저에서 테스트 실행
- ✅ **타입스크립트**: 완벽 지원
- ✅ **React 19 호환**: 최신 React 기능 지원

**단점:**
- ⚠️ 커뮤니티가 Jest보다 작음 (하지만 빠르게 성장 중)

**설정 예시:**
```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./tests/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'tests/',
        '**/*.d.ts',
        '**/*.config.*',
        '**/mockData',
      ],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
```

#### **Option 2: Jest** (전통적 선택)

**장점:**
- ✅ 거대한 커뮤니티
- ✅ 많은 레퍼런스

**단점:**
- ❌ 느림
- ❌ Next.js 15 설정 복잡
- ❌ ESM 지원 불완전

**결론: Vitest 선택** 🎯

---

### B. React Component Testing

#### **React Testing Library (RTL) ⭐ (필수)**

**선택 이유:**
- ✅ **업계 표준**: 거의 모든 React 프로젝트 사용
- ✅ **사용자 중심**: "테스트가 사용자와 유사하게 동작"
- ✅ **접근성 강조**: a11y 베스트 프랙티스
- ✅ **React 19 지원**: 공식 호환
- ✅ **Next.js RSC 지원**: Server Components 테스트 가능

**핵심 원칙:**
> "The more your tests resemble the way your software is used, the more confidence they can give you."

**설치:**
```bash
npm install -D @testing-library/react @testing-library/jest-dom @testing-library/user-event
```

**예시:**
```typescript
// OptimizedImage.test.tsx
import { render, screen } from '@testing-library/react';
import OptimizedImage, { ImageType } from '@/app/components/OptimizedImage';

describe('OptimizedImage', () => {
  it('renders native img tag for AVIF static backgrounds', () => {
    render(
      <OptimizedImage
        src="/image/Title.avif"
        alt="Hero background"
        type={ImageType.STATIC_BACKGROUND}
      />
    );

    const img = screen.getByRole('img', { name: /hero background/i });
    expect(img.tagName).toBe('IMG');
    expect(img).toHaveAttribute('src', '/image/Title.avif');
    expect(img).toHaveAttribute('loading', 'eager');
  });

  it('uses Next.js Image for dynamic content', () => {
    // Test Next.js Image rendering
  });
});
```

---

### C. End-to-End Testing

#### **Playwright ⭐ (권장)**

**vs Cypress 비교:**

| 기능 | Playwright | Cypress |
|------|-----------|---------|
| **속도** | ⚡ 더 빠름 | 🐢 느림 |
| **브라우저** | Chrome, Firefox, Safari, Edge | Chrome 중심 |
| **병렬 실행** | ✅ 기본 지원 | ⚠️ 유료 |
| **i18n 테스트** | ✅ 탁월 | ✅ 가능 |
| **API 모킹** | ✅ 네이티브 | ⚠️ 플러그인 |
| **Next.js 15** | ✅ 공식 지원 | ✅ 지원 |
| **커뮤니티** | 🔥 급성장 | 📈 성숙 |

**결론: Playwright 선택** 🎯

**이유:**
1. **속도**: CI/CD에서 중요
2. **크로스 브라우저**: Safari 테스트 가능 (i18n 버그 발견 가능)
3. **API 모킹**: 레거시 인증 API 테스트
4. **병렬 실행**: 무료로 빠른 테스트

**설치:**
```bash
npm init playwright@latest
```

**예시:**
```typescript
// e2e/i18n-navigation.spec.ts
import { test, expect } from '@playwright/test';

test('redirects /en to / (English default)', async ({ page }) => {
  await page.goto('/en');
  await expect(page).toHaveURL('/');
});

test('Korean URL maintains /ko prefix', async ({ page }) => {
  await page.goto('/ko');
  await expect(page).toHaveURL('/ko');
  await expect(page.locator('h1')).toContainText('템플릿'); // Korean text
});

test('language switcher changes locale', async ({ page }) => {
  await page.goto('/');
  await page.click('[data-testid="language-dropdown"]');
  await page.click('text=한국어');

  await expect(page).toHaveURL('/ko');
  await expect(page.locator('nav')).toContainText('템플릿');
});

test('search templates and filter', async ({ page }) => {
  await page.goto('/templates');
  await page.fill('[placeholder="Search templates..."]', 'portfolio');
  await page.click('text=Portfolio');

  const templates = page.locator('[data-testid="template-card"]');
  await expect(templates).toHaveCount(5);
});
```

---

## 📁 테스트 파일 구조

```
/Users/parkchwl/front/
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── OptimizedImage.tsx
│   │   │   └── __tests__/               ← Unit tests (컴포넌트 옆)
│   │   │       ├── OptimizedImage.test.tsx
│   │   │       ├── Layout.test.tsx
│   │   │       └── TemplateCard.test.tsx
│   │   └── pages/
│   │       ├── HomePage.tsx
│   │       └── __tests__/
│   │           └── HomePage.test.tsx
│   ├── lib/
│   │   ├── get-dictionary.ts
│   │   └── __tests__/
│   │       ├── get-dictionary.test.ts
│   │       └── imageLoader.test.ts
│   └── types/
│       ├── dictionary.ts
│       └── __tests__/
│           └── dictionary.test.ts       ← Type validation tests
├── tests/
│   ├── setup.ts                         ← Vitest global setup
│   ├── mocks/
│   │   ├── dictionary.ts                ← Mock translations
│   │   └── legacy-auth.ts               ← Mock legacy auth client
│   ├── integration/                     ← Integration tests
│   │   ├── i18n-routing.test.tsx
│   │   ├── image-optimization.test.tsx
│   │   └── form-submission.test.tsx
│   └── e2e/                             ← Playwright E2E tests
│       ├── home.spec.ts
│       ├── language-switching.spec.ts
│       ├── template-search.spec.ts
│       └── blog-navigation.spec.ts
├── vitest.config.ts
├── playwright.config.ts
└── package.json
```

**파일 명명 규칙:**
- Unit: `*.test.tsx` (컴포넌트 옆 `__tests__/`)
- Integration: `*.test.tsx` (`tests/integration/`)
- E2E: `*.spec.ts` (`tests/e2e/`)

---

## 🎯 테스트 우선순위 (Phase별)

### **Phase 1: Foundation (Week 1-2)** ⚡ HIGH PRIORITY

#### 1.1 Setup & Configuration
```bash
# Vitest + RTL
npm install -D vitest @vitejs/plugin-react jsdom
npm install -D @testing-library/react @testing-library/jest-dom @testing-library/user-event

# Playwright
npm init playwright@latest

# Coverage
npm install -D @vitest/coverage-v8
```

#### 1.2 Core Unit Tests (15 tests)
- [x] `lib/get-dictionary.test.ts` - 번역 로딩
- [x] `lib/imageLoader.test.ts` - 이미지 로더
- [x] `lib/image-config.test.ts` - 이미지 전략
- [x] `types/dictionary.test.ts` - 타입 검증
- [x] `i18n/utils.test.ts` - Language names

**Target Coverage**: 80%+

#### 1.3 Critical Component Tests (10 tests)
- [x] `OptimizedImage.test.tsx` - AVIF 렌더링
- [x] `Layout.test.tsx` - 네비게이션, 언어 드롭다운
- [x] `TemplateCard.test.tsx` - 카드 렌더링, hover
- [x] `AboutPageContent.test.tsx` - 공통 페이지
- [x] `ErrorBoundary.test.tsx` - 에러 처리

**Target Coverage**: 70%+

#### 1.4 E2E Critical Flows (5 tests)
- [x] `language-switching.spec.ts` - 언어 전환
- [x] `template-search.spec.ts` - 템플릿 검색
- [x] `home-navigation.spec.ts` - 홈 네비게이션
- [x] `middleware-redirect.spec.ts` - /en → / 리다이렉트
- [x] `blog-reading.spec.ts` - 블로그 읽기

**목표**: **Critical User Flows 100% 커버**

---

### **Phase 2: Expansion (Week 3-4)** 🔥 MEDIUM PRIORITY

#### 2.1 Integration Tests (20 tests)
- [ ] `i18n-routing.test.tsx` - 라우팅 시스템 전체
- [ ] `form-validation.test.tsx` - Contact, Login 폼
- [ ] `image-optimization.test.tsx` - 이미지 로딩 전략
- [ ] `server-components.test.tsx` - RSC 렌더링
- [ ] `middleware.test.tsx` - 미들웨어 로직

#### 2.2 Advanced Component Tests (15 tests)
- [ ] `HomePage.test.tsx` - FAQ 자동 순환, 스크롤
- [ ] `ServicePageClient.test.tsx` - 인터랙션
- [ ] `PricingPageClient.test.tsx` - 월/년 토글
- [ ] `QAPageClient.test.tsx` - 검색, 필터
- [ ] `BlogListClient.test.tsx` - 카테고리 필터

#### 2.3 E2E User Journeys (10 tests)
- [ ] `signup-flow.spec.ts` - 회원가입 전체 과정
- [ ] `template-to-publish.spec.ts` - 템플릿 선택 → 게시
- [ ] `pricing-selection.spec.ts` - 가격 플랜 선택
- [ ] `contact-form.spec.ts` - 문의 폼 제출
- [ ] `mobile-navigation.spec.ts` - 모바일 메뉴

**목표**: **Test Coverage 70%+**

---

### **Phase 3: Comprehensive (Week 5-8)** 📈 NICE TO HAVE

#### 3.1 Visual Regression Testing
```bash
npm install -D @playwright/test
```

**스크린샷 테스트:**
- [ ] 모든 페이지 스크린샷 (6개 언어 × 15 페이지)
- [ ] 다크모드 (미래)
- [ ] 반응형 (mobile, tablet, desktop)

#### 3.2 Performance Testing
```typescript
// playwright-lighthouse integration
test('homepage performance', async ({ page }) => {
  await page.goto('/');
  const metrics = await page.evaluate(() => {
    const paint = performance.getEntriesByType('paint');
    return {
      FCP: paint.find(p => p.name === 'first-contentful-paint')?.startTime,
      LCP: ...,
    };
  });

  expect(metrics.FCP).toBeLessThan(1800); // < 1.8s
  expect(metrics.LCP).toBeLessThan(2500); // < 2.5s
});
```

#### 3.3 Accessibility Testing
```bash
npm install -D @axe-core/playwright
```

```typescript
import { injectAxe, checkA11y } from 'axe-playwright';

test('homepage accessibility', async ({ page }) => {
  await page.goto('/');
  await injectAxe(page);
  await checkA11y(page, null, {
    detailedReport: true,
  });
});
```

#### 3.4 Load & Stress Testing
- [ ] Artillery.io 또는 k6 for API endpoints
- [ ] Concurrent user simulation

**목표**: **Test Coverage 85%+, A11y 100%**

---

## 🔬 테스트 예시 (Best Practices)

### 1. Unit Test Example

```typescript
// src/lib/__tests__/get-dictionary.test.ts
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { getDictionary } from '../get-dictionary';
import type { Locale } from '@/i18n/config';

// Mock dynamic imports
vi.mock('@/i18n/messages/en.json', () => ({
  default: {
    navigation: { templates: 'Templates' },
    homePage: { hero: { title: 'Test' } },
  },
}));

describe('getDictionary', () => {
  it('loads English dictionary for en locale', async () => {
    const dict = await getDictionary('en' as Locale);

    expect(dict).toBeDefined();
    expect(dict.navigation.templates).toBe('Templates');
  });

  it('returns typed Dictionary object', async () => {
    const dict = await getDictionary('en' as Locale);

    // TypeScript should allow this
    expect(dict.homePage.hero.title).toBeDefined();
  });

  it('loads all 6 supported locales', async () => {
    const locales: Locale[] = ['en', 'ko', 'hi', 'id', 'vi', 'zh-TW'];

    for (const locale of locales) {
      const dict = await getDictionary(locale);
      expect(dict).toBeDefined();
    }
  });
});
```

### 2. Component Test Example

```typescript
// src/app/components/__tests__/Layout.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Layout from '../Layout';
import { mockDictionary } from '@/tests/mocks/dictionary';

// Mock usePathname
vi.mock('next/navigation', () => ({
  usePathname: () => '/about',
}));

describe('Layout Component', () => {
  it('renders navigation with dictionary translations', () => {
    render(
      <Layout dictionary={mockDictionary}>
        <div>Test Content</div>
      </Layout>
    );

    expect(screen.getByText('Templates')).toBeInTheDocument();
    expect(screen.getByText('Pricing')).toBeInTheDocument();
  });

  it('opens language dropdown on click', async () => {
    const user = userEvent.setup();
    render(<Layout dictionary={mockDictionary}><div /></Layout>);

    const dropdown = screen.getByLabelText(/choose language/i);
    await user.click(dropdown);

    await waitFor(() => {
      expect(screen.getByText('한국어')).toBeVisible();
      expect(screen.getByText('中文 (繁體)')).toBeVisible();
    });
  });

  it('changes URL when selecting different language', async () => {
    const user = userEvent.setup();
    render(<Layout dictionary={mockDictionary}><div /></Layout>);

    await user.click(screen.getByLabelText(/choose language/i));
    await user.click(screen.getByText('한국어'));

    // Check that Link href is correct
    const link = screen.getByRole('link', { name: /한국어/ });
    expect(link).toHaveAttribute('href', '/ko/about');
  });

  it('shows mobile menu on small screens', async () => {
    global.innerWidth = 375;
    const user = userEvent.setup();

    render(<Layout dictionary={mockDictionary}><div /></Layout>);

    const mobileMenuButton = screen.getByLabelText(/open menu/i);
    await user.click(mobileMenuButton);

    expect(screen.getByRole('navigation', { name: /mobile/i })).toBeVisible();
  });

  it('applies scroll shadow when scrolled', () => {
    render(<Layout dictionary={mockDictionary}><div /></Layout>);

    // Simulate scroll
    fireEvent.scroll(window, { target: { scrollY: 100 } });

    const header = screen.getByRole('banner');
    expect(header).toHaveClass('shadow-md');
  });
});
```

### 3. Integration Test Example

```typescript
// tests/integration/i18n-routing.test.tsx
import { render, screen } from '@testing-library/react';
import { getDictionary } from '@/lib/get-dictionary';
import AboutPageContent from '@/app/components/pages/AboutPageContent';

describe('i18n Routing Integration', () => {
  it('renders English content at root path', async () => {
    const dictionary = await getDictionary('en');

    render(<AboutPageContent dictionary={dictionary.aboutPage} />);

    expect(screen.getByRole('heading', { level: 1 }))
      .toHaveTextContent('About Us');
  });

  it('renders Korean content at /ko path', async () => {
    const dictionary = await getDictionary('ko');

    render(<AboutPageContent dictionary={dictionary.aboutPage} />);

    expect(screen.getByRole('heading', { level: 1 }))
      .toHaveTextContent('회사 소개');
  });

  it('maintains structure across all languages', async () => {
    const locales = ['en', 'ko', 'hi', 'id', 'vi', 'zh-TW'] as const;

    for (const locale of locales) {
      const dict = await getDictionary(locale);
      const { container } = render(
        <AboutPageContent dictionary={dict.aboutPage} />
      );

      // All languages should have same structure
      expect(container.querySelectorAll('section')).toHaveLength(3);
      expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
    }
  });
});
```

### 4. E2E Test Example

```typescript
// tests/e2e/language-switching.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Language Switching', () => {
  test('switches from English to Korean', async ({ page }) => {
    // Start at English homepage
    await page.goto('/');
    await expect(page).toHaveURL('/');
    await expect(page.locator('h1')).toContainText('Customers are');

    // Open language dropdown
    await page.click('[data-testid="language-dropdown"]');

    // Select Korean
    await page.click('text=한국어');

    // Verify URL and content changed
    await expect(page).toHaveURL('/ko');
    await expect(page.locator('h1')).toContainText('고객이');
    await expect(page.locator('nav')).toContainText('템플릿');
  });

  test('maintains page context when switching language', async ({ page }) => {
    // Go to About page in English
    await page.goto('/about');

    // Switch to Korean
    await page.click('[data-testid="language-dropdown"]');
    await page.click('text=한국어');

    // Should still be on About page, just in Korean
    await expect(page).toHaveURL('/ko/about');
    await expect(page.locator('h1')).toContainText('회사 소개');
  });

  test('redirects /en to / automatically', async ({ page }) => {
    await page.goto('/en');
    await expect(page).toHaveURL('/');
  });

  test('all navigation links work in Korean', async ({ page }) => {
    await page.goto('/ko');

    // Click Templates link
    await page.click('nav >> text=템플릿');
    await expect(page).toHaveURL('/ko/templates');

    // Click Pricing link
    await page.click('nav >> text=가격');
    await expect(page).toHaveURL('/ko/pricing');
  });
});
```

---

## 📈 Coverage Goals

### **Target Coverage by Phase**

| Phase | Unit | Integration | E2E | Overall |
|-------|------|-------------|-----|---------|
| Phase 1 (Week 2) | 80% | 50% | Critical Flows | 60% |
| Phase 2 (Week 4) | 85% | 70% | Major Flows | 75% |
| Phase 3 (Week 8) | 90% | 80% | All Flows | 85% |

### **Industry Benchmarks**

- **Airbnb**: 70%+ coverage
- **Netflix**: 75%+ coverage
- **Vercel**: 80%+ coverage (Next.js team)
- **Shopify**: 85%+ coverage

**Our Target: 85%+** 🎯

---

## 🔧 CI/CD Integration

### GitHub Actions Workflow

```yaml
# .github/workflows/test.yml
name: Tests

on:
  pull_request:
    branches: [main]
  push:
    branches: [main]

jobs:
  unit-integration:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'

      - run: npm ci
      - run: npm run test:unit
      - run: npm run test:coverage

      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/coverage-final.json

  e2e:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'

      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npm run build
      - run: npm run test:e2e

      - uses: actions/upload-artifact@v3
        if: failure()
        with:
          name: playwright-report
          path: playwright-report/
```

### package.json Scripts

```json
{
  "scripts": {
    "test": "vitest",
    "test:unit": "vitest run",
    "test:watch": "vitest watch",
    "test:coverage": "vitest run --coverage",
    "test:ui": "vitest --ui",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "test:e2e:debug": "playwright test --debug",
    "test:all": "npm run test:unit && npm run test:e2e"
  }
}
```

---

## 🎓 Testing Standards & Conventions

### 1. **AAA Pattern (Arrange-Act-Assert)**

```typescript
test('template card shows image on load', async () => {
  // Arrange
  const template = { id: 1, title: 'Test', image: '/test.avif' };

  // Act
  render(<TemplateCard template={template} index={0} />);

  // Assert
  expect(screen.getByRole('img')).toHaveAttribute('src', '/test.avif');
});
```

### 2. **Test Naming Convention**

```typescript
// ✅ Good
test('displays error message when form is invalid')
test('redirects to dashboard after successful login')

// ❌ Bad
test('test 1')
test('it works')
```

### 3. **Data-testid Usage**

```typescript
// Only use when necessary (accessibility attributes preferred)
<button data-testid="language-dropdown" aria-label="Choose language">

// Prefer semantic queries
screen.getByRole('button', { name: /choose language/i })  // ✅
screen.getByTestId('language-dropdown')  // ⚠️ Last resort
```

### 4. **Mock Only External Dependencies**

```typescript
// ✅ Good - Mock external API
vi.mock('legacy-auth-client', () => ({
  createClient: vi.fn(),
}));

// ❌ Bad - Don't mock internal logic
vi.mock('../get-dictionary');  // Test the real implementation!
```

---

## 🚨 Common Pitfalls to Avoid

1. **Testing Implementation Details**
   - ❌ `expect(component.state.count).toBe(5)`
   - ✅ `expect(screen.getByText('Count: 5')).toBeInTheDocument()`

2. **Over-mocking**
   - ❌ Mock everything
   - ✅ Mock only external dependencies (APIs, time, randomness)

3. **Brittle Selectors**
   - ❌ `container.querySelector('.css-class-123')`
   - ✅ `screen.getByRole('button', { name: /submit/i })`

4. **Not Testing Edge Cases**
   - ❌ Only happy path
   - ✅ Error states, loading states, empty states

5. **Slow E2E Tests**
   - ❌ Test every detail in E2E
   - ✅ E2E only for critical user journeys

---

## 📊 Success Metrics

### **Week 2 Goals:**
- ✅ Vitest + Playwright setup complete
- ✅ 30 tests passing
- ✅ 60% coverage
- ✅ CI/CD pipeline running

### **Week 4 Goals:**
- ✅ 60 tests passing
- ✅ 75% coverage
- ✅ All critical flows covered

### **Week 8 Goals:**
- ✅ 100+ tests passing
- ✅ 85%+ coverage
- ✅ Visual regression tests
- ✅ A11y tests passing
- ✅ Performance budgets enforced

---

## 🎯 Final Recommendation

### **Optimal Tech Stack:**

1. **Unit & Integration**: Vitest + React Testing Library
2. **E2E**: Playwright
3. **Coverage**: @vitest/coverage-v8
4. **CI/CD**: GitHub Actions
5. **Reporting**: Codecov.io

### **Timeline:**

- **Week 1-2**: Setup + Critical Tests (Phase 1)
- **Week 3-4**: Expand Coverage (Phase 2)
- **Week 5-8**: Comprehensive Suite (Phase 3)

### **Cost:**

- All tools: **FREE** (open source)
- CI minutes: GitHub Free tier (2000 min/month)
- Codecov: Free for open source

---

## 💡 업계 최고 수준 달성 체크리스트

- [ ] 85%+ Test Coverage
- [ ] 100% Critical User Flows E2E tested
- [ ] CI/CD with automated testing
- [ ] Visual regression testing
- [ ] Accessibility testing (WCAG 2.1 AA)
- [ ] Performance budgets enforced
- [ ] Type-safe test mocks
- [ ] Comprehensive test documentation
- [ ] Fast feedback loop (< 2 min unit, < 5 min E2E)

---

**이 전략을 따르면 Facadely는 Airbnb/Netflix/Vercel 수준의 테스트 인프라를 갖추게 됩니다.** 🚀

**현재 0/10 → 목표 9/10** ⬆️ (+9)
