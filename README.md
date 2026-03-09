# facadely

`facadely`는 단순 랜딩 페이지 제작 프로젝트가 아니라, 다음 문제를 하나의 제품 안에서 풀어보는 것을 목표로 한 웹 플랫폼 실험입니다.

- 다국어 마케팅 사이트를 운영하면서도
- 템플릿 기반 웹사이트를 일관된 구조로 관리하고
- 비개발자도 수정할 수 있는 에디터 경험을 제공하며
- 이후 인증/회원 시스템을 Spring 백엔드로 안정적으로 전환할 수 있는 기반을 갖추는 것

즉, 이 프로젝트는 "보여주는 프론트엔드"에만 머무르지 않고, 실제 서비스 운영을 염두에 둔 구조 분리, 라우팅 전략, 편집 시스템, 인증 전환 준비까지 함께 다루는 것을 핵심 목표로 합니다.

## 프로젝트 설명

이 프로젝트에서 가장 중요하게 본 것은 "화면을 예쁘게 만드는 것"보다 "운영 가능한 구조를 만드는 것"입니다.

홈페이지, 서비스 소개, 가격, 블로그, 문의, 로그인 같은 일반 사용자 페이지는 Next.js App Router 기반으로 구성했고, 템플릿 미리보기와 편집기는 별도의 흐름으로 분리했습니다. 템플릿은 slug 기반 canonical 경로(`/s/{slug}`)로 관리하고, 과거 숫자 경로(`/5`, `/6`, `/7`)는 호환용 리다이렉트로 유지해 링크 안정성을 보장합니다. 이 구조 덕분에 템플릿이 늘어나더라도 "실제 렌더링 경로", "레거시 경로", "에디터가 참조하는 경로"를 한 군데에서 통제할 수 있습니다.

또한 템플릿을 단순 HTML 조각으로 두지 않고 `manifest + runtime component` 구조로 관리합니다. 어떤 텍스트/버튼/컨테이너가 편집 가능한지 manifest로 선언하고, 에디터는 그 선언을 기준으로 편집 UI를 노출합니다. 이 방식은 템플릿이 많아질수록 특히 중요합니다. 템플릿별 예외 처리를 에디터 안에 계속 추가하는 방식보다, "편집 가능 범위"를 템플릿 스스로 설명하게 만드는 편이 유지보수와 확장성 면에서 훨씬 유리하기 때문입니다.

반응형 품질도 중요한 축입니다. 모바일 동적 주소창, 데스크톱 줌, 고정 `vh`로 인한 레이아웃 클리핑 같은 실무형 문제를 줄이기 위해 전역 viewport 유틸리티와 헤더 오프셋 규칙을 정리했고, 템플릿/페이지 전반에서 고정 높이 의존을 줄였습니다. 이런 작업은 겉으로는 작은 CSS 수정처럼 보여도, 실제 서비스에서는 접근성과 이탈률에 직접 연결되는 부분입니다.

백엔드는 현재 Spring Boot + Gradle + PostgreSQL + Flyway 기반 인증 스택으로 실제 동작하는 상태입니다. 회원가입, 로그인, 로그아웃, 토큰 재발급, 현재 사용자 조회, Google OAuth, 인증 감사 로그 요약까지 Spring 쪽으로 옮겼고, `HttpOnly cookie`, `JWT access/refresh`, `Google OAuth`, `schema migration`, `dashboard redirect`를 하나의 흐름으로 묶어 두었습니다. 특히 OAuth2 세션과 JWT 쿠키가 충돌하던 문제를 정리해, Google 로그인 직후에도 세션 확인과 대시보드 진입이 안정적으로 동작하도록 보강했고, `next` 리다이렉트 검증 강화/보호 라우트 리다이렉트 일관화/로그아웃 재시도 UX까지 반영했습니다.

## 이 프로젝트에서 보여주고 싶은 역량

- 화면 구현과 라우팅만이 아니라, 서비스 운영 구조까지 고려한 설계 능력
- 템플릿/에디터/마케팅 페이지를 한 저장소 안에서 일관성 있게 관리하는 구조화 능력
- 레거시 경로 호환, 다국어 fallback, manifest 기반 편집 같은 유지보수 관점의 판단
- 단순 기능 추가가 아니라, 왜 이런 방식이 확장성과 디버깅 비용에 유리한지 설명할 수 있는 능력
- 프론트엔드 작업을 하더라도 인증, 스키마, 마이그레이션, 쿠키 정책 같은 백엔드 관점까지 연결해서 보는 시각

## 핵심 구현 포인트

### 1. 마케팅 사이트와 에디터를 한 프로젝트 안에서 분리

- 사용자용 페이지: `src/app/[lang]/(main)`
- 시각 편집기: `src/app/editor/page.tsx`
- 템플릿 canonical 미리보기: `src/app/s/[slug]/page.tsx`

이렇게 분리하면 일반 사용자 경험과 내부 편집 경험이 서로 영향을 덜 주게 됩니다.

### 2. 템플릿을 slug 기반으로 표준화

- 템플릿 registry: `src/lib/template-registry.ts`
- legacy redirect: `src/app/5/page.tsx`, `src/app/6/page.tsx`, `src/app/7/page.tsx`

숫자 경로를 직접 내부 식별자로 쓰지 않고, 사람이 읽을 수 있는 slug를 canonical path로 삼아 유지보수성을 높였습니다.

### 3. manifest 기반 편집 구조

- manifest loader: `src/lib/template-manifest-store.ts`
- manifest schema: `src/lib/template-manifest-types.ts`
- editor runtime: `src/app/editor/page.tsx`

템플릿이 직접 "무엇을 수정할 수 있는지" 선언하는 구조라서, 에디터가 템플릿 내부 구현에 과도하게 결합되지 않습니다.

### 4. 실사용 중심 반응형/접근성 개선

- 전역 viewport/font/height 유틸: `src/app/globals.css`
- 루트 레이아웃: `src/app/layout.tsx`

고정 `vh`, 확대 제한, 매직 넘버 헤더 보정 같은 문제를 줄여 모바일/줌 환경에서의 안정성을 높였습니다.

### 5. 다국어 운영 구조

- 메시지 사전: `src/i18n/messages`
- dictionary loader: `src/lib/get-dictionary.ts`

영어를 기준 사전으로 두고 다른 로케일은 partial override 방식으로 병합해, 번역 누락 시 페이지가 깨지지 않도록 구성했습니다.

### 6. Spring 인증 전환

- backend root: `backend/`
- build: `backend/build.gradle`
- config: `backend/src/main/resources/application.yml`
- first migration: `backend/src/main/resources/db/migration/V1__auth_init.sql`

현재는 인증 엔드포인트, JWT/쿠키 기반 흐름, DB 스키마, Google OAuth, 로그인 후 개인 대시보드까지 로컬에서 검증 가능한 상태입니다. 프론트와 백엔드를 나중에 억지로 붙이는 방식이 아니라, 처음부터 인증 상태 관리와 DB 모델을 서비스 구조에 맞춰 설계하려는 방향입니다.

## 면접관이 보면 좋은 파일

- `src/app/editor/page.tsx`
  - 에디터 UI가 어떤 방식으로 템플릿과 연결되는지 볼 수 있습니다.
- `src/lib/template-registry.ts`
  - canonical slug, legacy path, 템플릿 식별 전략이 정리되어 있습니다.
- `src/lib/template-manifest-store.ts`
  - 템플릿 manifest를 어디서 어떻게 읽는지 확인할 수 있습니다.
- `src/proxy.ts`
  - Next 16 기준 요청 흐름 진입점을 확인할 수 있습니다.
- `src/app/pages/HomePage.tsx`
  - 실제 마케팅 페이지 구성과 인터랙션 품질을 볼 수 있습니다.
- `backend/src/main/resources/db/migration/V1__auth_init.sql`
  - 인증 중심 DB 스키마를 어떤 기준으로 잡았는지 볼 수 있습니다.
- `docs/backend/backend_starter.md`
  - 백엔드 구조를 초보자 관점에서 어떻게 설명했는지 볼 수 있습니다.

## 기술 스택

- Frontend
  - Next.js `16.1.1`
  - React `19.2.3`
  - TypeScript `5`
  - Tailwind CSS `4`
  - Framer Motion `12`

- Backend foundation
  - Spring Boot `3.5`
  - Java `21`
  - Gradle
  - PostgreSQL
  - Flyway
  - Spring Security / OAuth2 Client

## 현재 상태

- 구현 완료
  - 다국어 마케팅 사이트
  - slug 기반 템플릿 라우팅
  - 템플릿 manifest 로딩 구조
  - 비주얼 에디터 엔트리
  - 반응형/viewport 안정화
  - 로컬 폰트 번들링
  - Spring 인증 API (`signup`, `login`, `logout`, `refresh`, `me`, `audit-summary`)
  - PostgreSQL + Flyway 기반 인증 스키마
  - Docker/Colima 기반 로컬 PostgreSQL 실행 환경
  - Google OAuth 로컬 로그인 검증
  - OAuth2 세션/JWT 충돌 해결 및 회귀 테스트
  - 로그인 후 개인 대시보드 (`/[lang]/dashboard`)
  - 로그인 `next` 경로 검증 강화 및 보호 라우트 `/login?next=...` 정책 반영
  - 로그아웃 실패 시 재시도 + 사용자 피드백(UI 에러 메시지) 추가
  - Playwright + mock auth server 기반 인증 회귀 E2E 테스트 추가

- 진행 중 또는 확장 예정
  - 헤더/네비게이션의 로그인 상태 반영
  - 템플릿 썸네일/프리뷰 고도화
  - draft/published customization 저장소 분리

## Requirements

- Node.js 20+
- npm 10+
- Java 21
- Docker + Docker Compose
  - macOS라면 Docker Desktop 또는 `colima` 조합 중 하나
- PostgreSQL
  - 직접 설치하거나, 아래 `docker compose`로 실행 가능

## Quick Start

로컬 기준 포트:

- frontend: `http://localhost:3001`
- backend: `http://localhost:8080`
- postgres: `localhost:5432`

프론트/백엔드 환경 변수 준비:

```bash
cp .env.example .env.local
cd backend
cp .env.example .env
cd ..
```

의존성 설치:

```bash
npm install
```

PostgreSQL 실행:

```bash
cd backend
docker compose up -d
```

macOS에서 Docker Desktop 대신 Colima를 쓴다면 먼저 한 번 실행합니다.

```bash
colima start
```

백엔드 실행:

```bash
cd backend
./gradlew bootRun
```

프런트 실행:

```bash
npm run dev -- --port 3001
```

브라우저에서 아래 주소를 엽니다.

- `http://localhost:3001/en`
- `http://localhost:3001/en/login`
- 로그인 성공 후 기본 이동 경로: `http://localhost:3001/en/dashboard`

프론트 환경 변수 핵심 키:

- `NEXT_PUBLIC_API_BASE_URL`
  - 브라우저가 호출하는 Spring API 베이스 URL
- `INTERNAL_API_BASE_URL`
  - Next 서버/프록시가 내부적으로 호출하는 Spring API 베이스 URL
- `NEXT_PUBLIC_SITE_URL`
  - 메타데이터/공유 URL 기준이 되는 프론트 주소. 로컬 기준 `http://localhost:3001`
- `NEXT_PUBLIC_BETA_EDITOR_URL`
  - `/generate` 및 내비게이션이 연결할 에디터 진입점
- `FACADELY_ENABLE_TEMPLATE_CODEGEN`
  - 런타임 페이지 코드 생성 API 활성화 스위치. 기본값 `false`

백엔드 환경 변수 핵심 키:

- `FRONTEND_ORIGIN`
- `SPRING_DATASOURCE_URL`
- `JWT_ACCESS_SECRET`
- `COOKIE_SECURE`
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`

비로컬 환경에서는 placeholder 시크릿이나 `COOKIE_SECURE=false` 상태로 부팅되지 않도록 fail-fast 검증을 걸어두었습니다.

## Google OAuth Local Setup

Google 로그인까지 실제로 검증하려면 Google Cloud Console에서 `OAuth client ID`를 `Web application`으로 만들고 아래 값을 정확히 등록해야 합니다.

- `Authorized JavaScript origins`
  - `http://localhost:3001`
- `Authorized redirect URIs`
  - `http://localhost:8080/api/v1/auth/oauth2/callback/google`

생성된 값을 `backend/.env`에 채웁니다.

```env
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret
```

동의 화면이 `Testing` 상태라면 테스트 사용자도 추가해야 합니다.

## Security Notes

- 편집/배포/폰트 업로드/런타임 페이지 생성 API는 인증 세션과 same-origin 요청이 모두 필요합니다.
- 런타임 페이지 생성 API는 기본 비활성화 상태이며, `FACADELY_ENABLE_TEMPLATE_CODEGEN=true`일 때만 동작합니다.
- 에디터와 배포 상태 데이터는 Git 추적 경로가 아닌 `.runtime/` 아래에 저장됩니다.
- 업로드 폰트는 `public/uploads/` 아래에 저장되지만, 해당 경로는 `.gitignore`로 제외해 실수 커밋을 막습니다.
- Spring auth는 CORS 허용 origin과 별도로 POST 계열 auth 요청에 origin/referer 검증 필터를 적용합니다.
- Google OAuth 콜백 뒤에는 임시 `JSESSIONID`를 정리하고, 이후 요청에서는 JWT 쿠키 인증이 우선 적용되도록 구성했습니다.
- `GET /api/save-code`는 현재 공개 상태입니다. 이유는 정적 템플릿 런타임(`/t/{slug}`)이 공개 커스터마이징을 읽기 때문입니다. 초안과 공개 상태를 완전히 분리하려면 draft/published 저장소를 분리하는 2차 구조 개선이 필요합니다.

## Troubleshooting

### 1) 로그아웃 버튼을 눌러도 로그인 상태가 유지되는 경우

- 증상
  - `POST /api/v1/auth/logout` 이후에도 `GET /api/v1/auth/me`가 `200`으로 응답
- 원인
  - access/refresh 쿠키만 삭제되고, 세션 인증(`JSESSIONID`)이 남아 `/auth/me`가 계속 통과
- 수정
  - `AuthController.logout()`에서 `session.invalidate()` + `SecurityContextHolder.clearContext()` 수행
  - `Set-Cookie: JSESSIONID=; Max-Age=0`를 함께 내려 세션 쿠키도 즉시 제거
- 검증 기준
  - `me -> logout -> me` 순서에서 마지막 `me`가 `401 UNAUTHORIZED`여야 정상

### 2) 로그아웃/인증 POST가 403(`Invalid CORS request`)로 실패하는 경우

- 증상
  - 로그인은 되어 보이는데 로그아웃이 동작하지 않음
  - 네트워크 탭에서 `/api/v1/auth/logout`이 `403`
- 원인
  - 프런트 실행 origin(`http://localhost:3000` 또는 `:3001`)과 `backend/.env`의 `FRONTEND_ORIGIN` 불일치
- 수정
  - 프런트 실제 포트와 `FRONTEND_ORIGIN`을 동일하게 맞춘 뒤 백엔드 재시작
  - 예: 프런트가 `http://localhost:3000`이면 `FRONTEND_ORIGIN=http://localhost:3000`

## Available Scripts

- `npm run dev` - Next.js dev server
- `npm run build` - production build
- `npm run start` - production server
- `npm run lint` - ESLint
- `npm run test:e2e` - Playwright E2E (mock auth server + frontend dev server 자동 기동)
- `npm run test:e2e:headed` - Playwright E2E headed 모드
- `cd backend && docker compose up -d` - local PostgreSQL start
- `cd backend && docker compose down` - local PostgreSQL stop
- `cd backend && ./gradlew bootRun` - Spring backend
- `cd backend && ./gradlew test` - backend test

## Core Structure

- `src/app` - App Router routes and layouts
- `src/app/fonts.ts` - local font loader (`next/font/local`)
- `src/app/components` - UI components
- `src/app/components/shared` - shared page clients
- `src/app/editor/page.tsx` - visual editor
- `src/app/s/[slug]/page.tsx` - canonical template route
- `src/app/{nexus-ai-enterprise,velocity-saas-landing,onepro-dashboard-white}` - current React template runtimes
- `src/lib/template-registry.ts` - canonical/legacy template mapping
- `src/lib/template-manifest-store.ts` - manifest discovery/loading
- `src/lib/server/api-security.ts` - Next server-side auth/origin guards
- `src/lib/api/auth.ts` - frontend auth API client
- `src/i18n/messages` - locale dictionaries
- `src/proxy.ts` - Next 16 proxy entry
- `.runtime/` - git-tracked 밖의 editor/publish runtime state
- `backend/` - Spring backend foundation
- `docs/backend/` - backend learning and implementation documents

## Validation

```bash
npm run lint
npm run build
npx playwright install chromium
npm run test:e2e
cd backend && ./gradlew test
```

## Documentation

- `CHANGELOG.md` - chronological changes
- `docs/README.md` - documentation index
- `docs/PROJECT_OVERVIEW.md` - current architecture and route overview
- `docs/backend/README.md` - backend documentation index
- `docs/archive/2025-legacy/` - archived legacy documents
