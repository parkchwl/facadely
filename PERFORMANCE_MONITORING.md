# 🚀 Performance Monitoring & Observability Strategy
**Facadely 프로젝트 - 업계 최고 수준 성능 모니터링 구축 계획**

---

## 📊 현재 상태

- **모니터링 수준**: 0/10 (전무)
- **Web Vitals 추적**: ❌ 없음
- **에러 추적**: ❌ 없음
- **사용자 분석**: ❌ 없음
- **성능 테스트**: ❌ 없음

---

## 🎯 목표

**최종 목표: 9/10 (업계 최고 수준)**

- ✅ Real-time Core Web Vitals 모니터링
- ✅ 자동화된 에러 추적 및 알림
- ✅ Privacy-friendly 사용자 분석
- ✅ CI/CD 통합 성능 테스트
- ✅ GDPR 완벽 준수 (6개 언어 지원)

---

## 🛠️ 선정된 기술 스택

### **Phase 1: Foundation (무료)**

| 도구 | 목적 | 비용 | 우선순위 |
|------|------|------|----------|
| **Vercel Speed Insights** | Core Web Vitals RUM | 무료 (10k events) | HIGH |
| **Sentry** | 에러 추적 + 성능 | 무료 (5k errors) | HIGH |
| **Web Vitals Library** | 커스텀 추적 | 무료 | HIGH |
| **Lighthouse CI** | 자동 성능 테스트 | 무료 | HIGH |

**총 비용: $0/month**

### **Phase 2: Enhanced (유료)**

| 도구 | 목적 | 비용 | 우선순위 |
|------|------|------|----------|
| **Plausible Analytics** | Privacy-friendly 분석 | $9/mo | MEDIUM |

**총 비용: $9/month**

---

## 📐 기술 선정 근거

### 1. Vercel Speed Insights ⭐ (선택 이유)

**장점:**
- ✅ Next.js 15 공식 지원 (최적화됨)
- ✅ 설치 1줄: `<SpeedInsights />`
- ✅ Core Web Vitals 자동 추적
- ✅ 라우트별 분석 (15+ 페이지)
- ✅ 모바일/데스크톱 분리
- ✅ 무료 10,000 events/month

**vs Google Analytics:**
- 속도: 10배 빠름
- Privacy: GDPR 친화적
- 설정: 복잡도 1/10

**설치:**
```bash
npm install @vercel/speed-insights
```

**코드:**
```typescript
// src/app/layout.tsx
import { SpeedInsights } from '@vercel/speed-insights/next'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <SpeedInsights />
      </body>
    </html>
  )
}
```

---

### 2. Sentry ⭐ (선택 이유)

**장점:**
- ✅ 업계 표준 (Airbnb, Netflix 사용)
- ✅ Next.js 15 + React 19 완벽 지원
- ✅ 에러 + 성능 통합 모니터링
- ✅ Session Replay (사용자 재현)
- ✅ Source maps (디버깅 용이)
- ✅ 무료 5k errors + 10k transactions

**vs 타 솔루션:**
- LogRocket: 비쌈 ($99/mo)
- Rollbar: 기능 적음
- Bugsnag: 성능 모니터링 없음

**설치:**
```bash
npm install @sentry/nextjs
npx @sentry/wizard@latest -i nextjs
```

**자동 생성:**
- `sentry.client.config.ts`
- `sentry.server.config.ts`
- `next.config.js` 업데이트

---

### 3. Plausible Analytics ⭐ (선택 이유)

**장점:**
- ✅ **GDPR 완벽 준수** (쿠키 없음)
- ✅ 6개 언어 모두 동의 배너 불필요
- ✅ 1KB 스크립트 (Google Analytics: 45KB)
- ✅ EU 데이터 센터
- ✅ 오픈소스 (self-host 가능)

**vs Google Analytics 4:**
| 항목 | Plausible | GA4 |
|------|-----------|-----|
| 쿠키 | ❌ 없음 | ✅ 사용 (동의 필요) |
| GDPR | ✅ 준수 | ⚠️ 복잡 |
| 스크립트 | 1KB | 45KB |
| 동의 배너 | ❌ 불필요 | ✅ 필수 (6개 언어) |
| 설정 | 5분 | 2시간 |

**설치:**
```bash
# 클라우드 버전
# Script tag만 추가

# Self-hosted (무료)
docker run -d \
  -e DATABASE_URL=postgres://... \
  plausible/analytics:latest
```

---

### 4. Lighthouse CI (선택 이유)

**장점:**
- ✅ 완전 무료
- ✅ GitHub Actions 통합
- ✅ PR마다 자동 테스트
- ✅ Performance budgets 강제
- ✅ 회귀 방지 (regression detection)

**측정 항목:**
- Performance Score (목표: 90+)
- Accessibility Score (목표: 90+)
- Best Practices (목표: 90+)
- SEO (목표: 90+)
- Core Web Vitals

**설치:**
```bash
npm install -g @lhci/cli
```

---

## 📊 추적할 성능 지표

### A. Core Web Vitals (Google 표준)

| 지표 | Good | Needs Improvement | Poor |
|------|------|-------------------|------|
| **LCP** (Largest Contentful Paint) | ≤ 2.5s | 2.5s - 4.0s | > 4.0s |
| **INP** (Interaction to Next Paint) | ≤ 200ms | 200ms - 500ms | > 500ms |
| **CLS** (Cumulative Layout Shift) | ≤ 0.1 | 0.1 - 0.25 | > 0.25 |

**우리 목표:**
- LCP: **< 2.0s** (현재 Google "Good" 기준보다 25% 빠름)
- INP: **< 100ms** (현재 "Good" 기준보다 50% 빠름)
- CLS: **< 0.05** (현재 "Good" 기준보다 50% 낮음)

**추가 지표:**
- FCP (First Contentful Paint): < 1.8s
- TTFB (Time to First Byte): < 800ms

---

### B. Next.js 특화 지표

```typescript
// Next.js가 자동으로 추적하는 지표들
- Next.js-hydration: 클라이언트 hydration 시간
- Next.js-route-change-to-render: 라우트 변경 시간
- Next.js-render: 페이지 렌더 시간
```

---

### C. Facadely 커스텀 지표

#### **i18n 성능:**
- Dictionary 로딩 시간 (6개 언어)
- 언어 전환 latency
- 라우트별 성능 (en: `/`, ko: `/ko/`, etc.)

#### **이미지 최적화:**
- AVIF 로딩 시간
- OptimizedImage 렌더 시간
- Template 썸네일 로딩

#### **사용자 행동:**
- 템플릿 검색 속도
- FAQ 자동 순환 성능
- 모바일 메뉴 반응성

---

## 🗺️ 구현 로드맵

### **Phase 1: Foundation (Week 1-2)** - 무료

#### 목표
- Core Web Vitals 기준선 확보
- 에러 추적 시작
- 자동화된 성능 테스트

#### 작업 목록

**1.1 Vercel Speed Insights 설치**
```bash
npm install @vercel/speed-insights
```

파일 수정:
- `src/app/layout.tsx` - SpeedInsights 컴포넌트 추가

**1.2 Sentry 설정**
```bash
npm install @sentry/nextjs
npx @sentry/wizard@latest -i nextjs
```

생성될 파일:
- `sentry.client.config.ts`
- `sentry.server.config.ts`
- `sentry.edge.config.ts` (optional)

환경 변수 추가:
```bash
# .env.local
NEXT_PUBLIC_SENTRY_DSN=https://xxxxx@xxxxx.ingest.sentry.io/xxxxx
SENTRY_AUTH_TOKEN=xxxxx (for source maps)
```

**1.3 Web Vitals 커스텀 리포터**

생성할 파일:
```
src/
├── lib/
│   └── web-vitals-reporter.ts       (새로 생성)
└── app/
    └── components/
        └── WebVitalsTracker.tsx      (새로 생성)
```

**1.4 Lighthouse CI 구축**

생성할 파일:
```
.github/
└── workflows/
    └── lighthouse.yml                (새로 생성)

lighthouserc.js                       (새로 생성)
```

설치:
```bash
npm install --save-dev @lhci/cli
```

#### 예상 결과
- ✅ Real-time Web Vitals 대시보드
- ✅ 에러 발생 시 5분 내 알림
- ✅ PR마다 성능 체크
- ✅ 비용: $0

---

### **Phase 2: Enhanced Analytics (Week 3-4)** - $9/month

#### 목표
- Privacy-friendly 사용자 분석
- 전환율 추적
- 사용자 여정 이해

#### 작업 목록

**2.1 Plausible Analytics 설치**

옵션 A: 클라우드 ($9/mo)
```typescript
// src/app/layout.tsx
<Script
  defer
  data-domain="facadely.com"
  src="https://plausible.io/js/script.js"
/>
```

옵션 B: Self-hosted (무료, 서버 필요)
```bash
docker-compose up -d
```

**2.2 커스텀 이벤트 추적**
```typescript
// 템플릿 클릭
plausible('Template Click', { props: { template: 'portfolio' } })

// 언어 전환
plausible('Language Switch', { props: { from: 'en', to: 'ko' } })

// 폼 제출
plausible('Contact Form', { props: { success: true } })
```

**2.3 전환 퍼널 설정**
```
Home → Templates → (Sign Up Goal)
Home → Pricing → (Sign Up Goal)
Blog → (Newsletter Goal)
```

#### 예상 결과
- ✅ GDPR 준수 (6개 언어)
- ✅ 동의 배너 불필요
- ✅ 실시간 사용자 추적
- ✅ 전환율 데이터
- ✅ 비용: $9/month

---

### **Phase 3: Advanced Monitoring (Week 5-6)** - $26/month (선택)

#### 목표
- Session Replay
- 고급 에러 분석
- 커스텀 대시보드

#### 작업 목록

**3.1 Sentry 업그레이드 (Team Plan)**
- Session Replay 활성화
- 50k errors/month
- 100k transactions/month

**3.2 Advanced Configuration**
```typescript
// sentry.client.config.ts
Sentry.init({
  replaysSessionSampleRate: 0.1,  // 10% 세션 기록
  replaysOnErrorSampleRate: 1.0,  // 에러 시 100%

  integrations: [
    Sentry.replayIntegration({
      maskAllText: false,
      blockAllMedia: false,
    }),
  ],
})
```

**3.3 Performance Budgets**
```javascript
// lighthouserc.js
assertions: {
  'largest-contentful-paint': ['error', { maxNumericValue: 2000 }], // 2초
  'cumulative-layout-shift': ['error', { maxNumericValue: 0.05 }],
  'total-blocking-time': ['error', { maxNumericValue: 150 }],
}
```

#### 예상 결과
- ✅ 에러 발생 시 사용자 화면 재생
- ✅ 디버깅 시간 80% 단축
- ✅ 성능 회귀 자동 차단
- ✅ 비용: $26/month

---

### **Phase 4: Optimization Loop (Ongoing)**

#### 목표
- 지속적인 성능 개선
- 데이터 기반 의사결정

#### 작업 목록

**4.1 주간 성능 리뷰**
- 가장 느린 페이지 Top 5 분석
- 에러율 추이 확인
- Core Web Vitals 트렌드

**4.2 A/B 테스트 프레임워크**
```typescript
// 성능 영향 측정
const variant = useABTest('image-format')

// AVIF vs WebP 성능 비교
<OptimizedImage format={variant} />
```

**4.3 자동화된 최적화**
- Image optimization (이미 완료 ✅)
- Bundle size 모니터링
- Tree-shaking 검증
- Code splitting 분석

#### 예상 결과
- ✅ 월 1% 성능 향상
- ✅ 에러율 지속 감소
- ✅ SEO 순위 상승 (Core Web Vitals는 랭킹 요소)

---

## 💻 구현 코드 예시

### 1. Web Vitals Reporter

```typescript
// src/lib/web-vitals-reporter.ts
import { onCLS, onINP, onLCP, onFCP, onTTFB, Metric } from 'web-vitals'

type AnalyticsEvent = {
  name: string
  value: number
  id: string
  rating: 'good' | 'needs-improvement' | 'poor'
  delta: number
}

function sendToAnalytics(metric: Metric) {
  const body: AnalyticsEvent = {
    name: metric.name,
    value: metric.value,
    id: metric.id,
    rating: metric.rating,
    delta: metric.delta,
  }

  // Production: Send to API
  if (process.env.NODE_ENV === 'production') {
    fetch('/api/analytics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      keepalive: true,
    }).catch(console.error)
  }

  // Development: Log to console
  if (process.env.NODE_ENV === 'development') {
    console.log(`[Web Vitals] ${metric.name}:`, {
      value: Math.round(metric.value),
      rating: metric.rating,
    })
  }

  // Send to Plausible (if installed)
  if (typeof window !== 'undefined' && window.plausible) {
    window.plausible(metric.name, {
      props: {
        value: Math.round(metric.value),
        rating: metric.rating,
      },
    })
  }
}

export function initWebVitals() {
  onCLS(sendToAnalytics)
  onINP(sendToAnalytics)
  onLCP(sendToAnalytics)
  onFCP(sendToAnalytics)
  onTTFB(sendToAnalytics)
}

declare global {
  interface Window {
    plausible?: (event: string, options?: { props: Record<string, unknown> }) => void
  }
}
```

---

### 2. WebVitals Tracker Component

```typescript
// src/app/components/WebVitalsTracker.tsx
'use client'

import { useEffect } from 'react'
import { initWebVitals } from '@/lib/web-vitals-reporter'

export default function WebVitalsTracker() {
  useEffect(() => {
    if (process.env.NODE_ENV === 'production') {
      initWebVitals()
    }
  }, [])

  return null // 렌더링 없음, 추적만
}
```

---

### 3. Root Layout 통합

```typescript
// src/app/layout.tsx
import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { SpeedInsights } from '@vercel/speed-insights/next'
import Script from 'next/script'
import WebVitalsTracker from './components/WebVitalsTracker'
import "./globals.css";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "facadely",
  description: "Build a professional website in minutes — No code, no hassle",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const isProduction = process.env.NODE_ENV === 'production'

  return (
    <html lang="en">
      <head>
        {/* Plausible Analytics - Privacy-friendly */}
        {isProduction && (
          <Script
            defer
            data-domain="facadely.com"
            src="https://plausible.io/js/script.js"
          />
        )}
      </head>
      <body
        className={`${GeistSans.variable} ${GeistMono.variable} ${montserrat.variable} antialiased`}
      >
        {/* Web Vitals Tracking */}
        <WebVitalsTracker />

        {children}

        {/* Vercel Speed Insights */}
        {isProduction && <SpeedInsights />}
      </body>
    </html>
  );
}
```

---

### 4. Sentry Configuration

```typescript
// sentry.client.config.ts
import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Performance monitoring
  tracesSampleRate: 1.0, // 100% for low traffic

  // Session replay (Phase 3)
  replaysSessionSampleRate: 0.1,  // 10% of sessions
  replaysOnErrorSampleRate: 1.0,  // 100% when errors occur

  integrations: [
    Sentry.browserTracingIntegration({
      tracingOrigins: ['localhost', 'facadely.com', /^\//],
    }),
    Sentry.replayIntegration({
      maskAllText: false,
      blockAllMedia: false,
    }),
  ],

  // Filter development errors
  beforeSend(event, hint) {
    if (process.env.NODE_ENV === 'development') return null

    // Filter known benign errors
    if (event.exception?.values?.[0]?.value?.includes('ResizeObserver')) {
      return null
    }

    return event
  },

  environment: process.env.NODE_ENV,
  release: process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA,
})
```

```typescript
// sentry.server.config.ts
import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 1.0,
  environment: process.env.NODE_ENV,
  release: process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA,
})
```

---

### 5. Lighthouse CI Setup

```javascript
// lighthouserc.js
module.exports = {
  ci: {
    collect: {
      numberOfRuns: 3,
      startServerCommand: 'npm run start',
      url: [
        'http://localhost:3000/',
        'http://localhost:3000/templates',
        'http://localhost:3000/pricing',
        'http://localhost:3000/blog',
        'http://localhost:3000/ko/',  // Test i18n
      ],
    },
    assert: {
      preset: 'lighthouse:recommended',
      assertions: {
        // Overall scores
        'categories:performance': ['error', { minScore: 0.85 }],
        'categories:accessibility': ['error', { minScore: 0.9 }],
        'categories:best-practices': ['error', { minScore: 0.9 }],
        'categories:seo': ['error', { minScore: 0.9 }],

        // Core Web Vitals
        'largest-contentful-paint': ['error', { maxNumericValue: 2500 }],
        'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }],
        'total-blocking-time': ['error', { maxNumericValue: 200 }],

        // Additional metrics
        'first-contentful-paint': ['warn', { maxNumericValue: 1800 }],
        'speed-index': ['warn', { maxNumericValue: 3000 }],
      },
    },
    upload: {
      target: 'temporary-public-storage',
    },
  },
}
```

---

### 6. GitHub Actions Workflow

```yaml
# .github/workflows/lighthouse.yml
name: Lighthouse CI

on:
  pull_request:
    branches: [main]
  push:
    branches: [main]

jobs:
  lighthouse:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build application
        run: npm run build

      - name: Install Lighthouse CI
        run: npm install -g @lhci/cli

      - name: Run Lighthouse CI
        run: lhci autorun
        env:
          LHCI_GITHUB_APP_TOKEN: ${{ secrets.LHCI_GITHUB_APP_TOKEN }}

      - name: Upload results
        uses: actions/upload-artifact@v3
        if: always()
        with:
          name: lighthouse-results
          path: .lighthouseci
```

---

## 📈 성공 지표 (KPIs)

### Week 1-2 (Foundation 완료 후)
- ✅ Core Web Vitals 기준선 확보 (모든 라우트)
- ✅ 에러 추적 활성화 (0 누락)
- ✅ Lighthouse CI 통과율 100%
- ✅ Real-time 알림 작동

**측정 방법:**
```bash
# Vercel Dashboard에서 확인
- LCP, INP, CLS 평균값
- 75th percentile 값

# Sentry Dashboard에서 확인
- 에러율 < 1%
- 응답 시간 < 2초

# GitHub Actions에서 확인
- Lighthouse Score > 85
```

---

### Month 1 (Phase 2 완료 후)
- ✅ 90% 페이지가 "Good" Web Vitals
- ✅ LCP < 2.5s (모든 라우트)
- ✅ 사용자 분석 데이터 수집
- ✅ 전환율 추적 시작

**측정 방법:**
```bash
# Plausible Dashboard
- Pageviews: 일별 추이
- Bounce rate: < 50%
- Top pages: 성능 상위 5개

# Vercel Speed Insights
- Good: 90%+
- Needs Improvement: < 8%
- Poor: < 2%
```

---

### Month 3 (Optimization 완료 후)
- ✅ 95%+ 페이지가 "Good" Web Vitals
- ✅ LCP < 2.0s (Google 기준보다 25% 빠름)
- ✅ INP < 100ms (Google 기준보다 50% 빠름)
- ✅ CLS < 0.05 (Google 기준보다 50% 낮음)
- ✅ 에러율 < 0.1%
- ✅ 성능 회귀 0건 (Lighthouse CI가 차단)

**측정 방법:**
```bash
# 종합 대시보드
1. Vercel Speed Insights - Core Web Vitals
2. Sentry Performance - Transaction times
3. Plausible - User behavior
4. GitHub Actions - Performance budgets

# 목표 달성 여부
if (LCP < 2.0 && INP < 100 && CLS < 0.05):
    print("✅ 업계 최고 수준 달성!")
```

---

## 💰 비용 분석

### Startup Phase (0-1000 users/day)
| 도구 | 플랜 | 비용/월 | 이벤트 |
|------|------|---------|--------|
| Vercel Speed Insights | Free | $0 | 10k |
| Sentry | Developer | $0 | 5k errors + 10k trans |
| Plausible | Growth | $9 | 10k pageviews |
| Lighthouse CI | Free | $0 | Unlimited |
| **합계** | | **$9/월** | |

**연간 비용: $108**

---

### Growth Phase (1k-10k users/day)
| 도구 | 플랜 | 비용/월 | 이벤트 |
|------|------|---------|--------|
| Vercel Speed Insights | Pro (포함) | $0 | 25k |
| Sentry | Team | $26 | 50k errors + 100k trans |
| Plausible | Business | $19 | 100k pageviews |
| Lighthouse CI | Free | $0 | Unlimited |
| **합계** | | **$45/월** | |

**연간 비용: $540**

---

### Scale Phase (10k+ users/day)
| 도구 | 플랜 | 비용/월 | 이벤트 |
|------|------|---------|--------|
| Vercel Speed Insights | Enterprise | $50+ | 500k+ |
| Sentry | Business | $80 | Custom |
| Plausible | Enterprise | $69+ | 1M+ pageviews |
| **합계** | | **$200-400/월** | |

**연간 비용: $2,400-4,800**

---

## 🔒 Privacy & GDPR 준수

### Facadely의 6개 언어 지원 고려사항

#### 선택한 스택의 GDPR 준수 상태

**Plausible Analytics:**
- ✅ **쿠키 없음** (완전 cookieless)
- ✅ **개인정보 수집 없음** (IP 익명화)
- ✅ **동의 배너 불필요** (모든 언어)
- ✅ **EU 데이터 센터** (데이터 주권)
- ✅ **100% GDPR/CCPA 준수**

**Vercel Speed Insights:**
- ✅ 익명 성능 데이터만
- ✅ PII (개인 식별 정보) 수집 안 함
- ✅ GDPR 준수

**Sentry:**
- ⚠️ **설정 필요** (기본값은 일부 데이터 수집)
- ✅ **PII 제거 설정** 가능:
```typescript
beforeSend(event) {
  // 쿠키 제거
  if (event.request?.cookies) delete event.request.cookies

  // 이메일 제거
  if (event.user?.email) delete event.user.email

  // IP 익명화
  if (event.user?.ip_address) event.user.ip_address = null

  return event
}
```

**Google Analytics 4:**
- ❌ **사용 안 함** (Facadely에서)
- 이유:
  1. 쿠키 사용 (6개 언어로 동의 배너 필요)
  2. GDPR 준수 복잡
  3. Plausible로 충분

---

### 권장 Privacy Policy 문구

```markdown
## 성능 모니터링 및 분석

당사는 웹사이트 성능 개선을 위해 다음 도구를 사용합니다:

1. **Vercel Speed Insights**: 익명 성능 데이터 (쿠키 없음)
2. **Plausible Analytics**: Privacy-friendly 분석 (쿠키 없음)
3. **Sentry**: 에러 추적 (개인정보 제거 후)

모든 도구는 GDPR/CCPA를 준수하며, 개인 식별 정보를 수집하지 않습니다.
동의 배너 없이 사용 가능합니다.
```

---

## 🎓 업계 벤치마크

### Airbnb
- Core Web Vitals: 모든 페이지 추적
- 전환 퍼널: 성능 영향 측정
- A/B 테스트: 성능 변화 분리

### Netflix
- Atlas: 실시간 텔레메트리 (자체 개발)
- 99.99% uptime 목표
- 초당 수백만 이벤트 처리

### Vercel (Next.js 팀)
- Speed Insights: 자체 제품 사용
- Real User Monitoring 우선
- Lighthouse CI 강제 (모든 PR)
- 성능 회귀 = PR 차단

### Shopify
- 85%+ 테스트 커버리지
- Core Web Vitals: "Good" 95%+
- 성능 팀: 전담 10명

**우리 목표: Vercel 수준 (현실적이고 달성 가능)** 🎯

---

## 📚 학습 자료

### 공식 문서
- **Vercel Speed Insights**: https://vercel.com/docs/speed-insights
- **Sentry Next.js**: https://docs.sentry.io/platforms/javascript/guides/nextjs/
- **Plausible**: https://plausible.io/docs
- **Web Vitals**: https://web.dev/vitals/
- **Lighthouse CI**: https://github.com/GoogleChrome/lighthouse-ci

### Best Practices
- **Google Core Web Vitals**: https://web.dev/articles/vitals
- **Next.js Performance**: https://nextjs.org/docs/app/building-your-application/optimizing
- **Vercel Observability Guide**: https://vercel.com/blog/real-time-performance-monitoring

### 커뮤니티
- **Next.js Discord**: https://nextjs.org/discord
- **Sentry Discord**: https://discord.gg/sentry
- **Web Perf Slack**: https://webperformance.slack.com

---

## 🚀 실행 체크리스트

### Phase 1: Foundation (Week 1-2)
- [ ] Vercel Speed Insights 설치
- [ ] Sentry 설정 (클라이언트 + 서버)
- [ ] Web Vitals 커스텀 리포터 구현
- [ ] WebVitalsTracker 컴포넌트 생성
- [ ] Root layout에 통합
- [ ] Lighthouse CI 설정
- [ ] GitHub Actions workflow 추가
- [ ] 환경 변수 설정 (.env.local)
- [ ] 첫 배포 및 데이터 확인
- [ ] 기준선 지표 기록

### Phase 2: Enhanced (Week 3-4)
- [ ] Plausible 계정 생성 ($9/mo)
- [ ] Plausible 스크립트 추가
- [ ] 커스텀 이벤트 추적 구현
- [ ] 전환 퍼널 설정
- [ ] 대시보드 구성
- [ ] 팀원들과 공유

### Phase 3: Advanced (Week 5-6) - Optional
- [ ] Sentry Team 플랜 업그레이드 ($26/mo)
- [ ] Session Replay 활성화
- [ ] Performance budgets 강화
- [ ] 커스텀 대시보드 생성
- [ ] 알림 규칙 세밀화

### Phase 4: Optimization (Ongoing)
- [ ] 주간 성능 리뷰 루틴 확립
- [ ] 가장 느린 페이지 개선
- [ ] 에러율 추이 모니터링
- [ ] A/B 테스트 프레임워크
- [ ] 자동화된 최적화 PR

---

## 💡 Quick Start (최소 구현)

**"오늘 30분 만에 시작하기"**

```bash
# 1. 설치 (2분)
npm install @vercel/speed-insights @sentry/nextjs web-vitals

# 2. Sentry 설정 (5분)
npx @sentry/wizard@latest -i nextjs

# 3. Layout 수정 (10분)
# src/app/layout.tsx에 SpeedInsights 추가

# 4. Web Vitals Tracker 생성 (10분)
# src/lib/web-vitals-reporter.ts
# src/app/components/WebVitalsTracker.tsx

# 5. 환경 변수 설정 (3분)
# .env.local에 SENTRY_DSN 추가

# 6. 배포 및 확인 (즉시)
npm run build && npm run start
```

**결과:**
- ✅ Core Web Vitals 추적 시작
- ✅ 에러 모니터링 활성화
- ✅ 비용: $0

---

## 📞 지원 및 문의

**도구별 지원:**
- Vercel: support@vercel.com
- Sentry: support@sentry.io
- Plausible: hello@plausible.io

**긴급 이슈:**
- Sentry Status: https://status.sentry.io
- Vercel Status: https://vercel-status.com
- Plausible Status: https://status.plausible.io

---

## 🎯 최종 결론

**현재: 0/10 → 목표: 9/10**

**선택한 스택:**
- Vercel Speed Insights (FREE)
- Sentry (FREE → $26/mo)
- Plausible ($9/mo)
- Lighthouse CI (FREE)

**총 비용:**
- **지금**: $0/month
- **Phase 2**: $9/month
- **Scale**: $45/month

**구현 시간:**
- **최소 (Phase 1)**: 2주
- **완전 (Phase 3)**: 6주
- **최적화 (Phase 4)**: 지속적

**예상 성과:**
- Week 2: 기준선 확보
- Month 1: 90% "Good" Web Vitals
- Month 3: 95%+ "Good", 업계 최고 수준 달성

**핵심 장점:**
1. ✅ 완전 무료로 시작 가능
2. ✅ Next.js 15 최적화
3. ✅ GDPR 완벽 준수 (6개 언어)
4. ✅ 업계 표준 도구 (Airbnb/Netflix 사용)
5. ✅ 확장 가능 (10만 사용자까지)

**이 계획을 따르면 Facadely는 Vercel/Airbnb 수준의 성능 모니터링을 갖추게 됩니다.** 🚀

---

**문서 생성일**: 2025-11-01
**버전**: 1.0
**다음 업데이트**: Phase 1 완료 후
