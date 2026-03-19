# ✦ facadely

[라이브 서비스](https://facadely.com) | [백엔드 문서](./docs/backend/README.md) | [프로젝트 개요](./docs/PROJECT_OVERVIEW.md)

## 서비스 소개

facadely는 사용자가 템플릿을 선택하고, 에디터에서 수정한 뒤, 실제 사이트로 발행할 수 있는 멀티랭귀지 웹 빌더입니다.

이 저장소에는 프론트엔드 제품과 함께, 아래 흐름을 담당하는 Spring Boot 백엔드가 포함되어 있습니다.
- 회원 인증 및 세션 수명주기 관리
- Google OAuth 로그인
- 사용자 소유 사이트 생성 및 수명주기 관리
- 에디터 커스터마이징 저장
- 발행 / 비발행 흐름 관리

## 백엔드 핵심 흐름

이 백엔드는 아래 한 가지 제품 흐름을 중심으로 설계했습니다.

`템플릿 선택 -> 사용자 사이트 생성 -> 에디터 자동 저장 -> 재방문 복원 -> 발행`

핵심 구현 포인트:
- Spring Security 기반 인증 구조와 Access/Refresh 쿠키 인증 흐름
- DB 저장형 Refresh Token 회전 및 폐기 로직
- Google OAuth2 로그인을 동일한 인증 모델 안으로 통합
- `sites` 도메인 기반 사용자 소유 사이트 관리
- `DRAFT` / `PUBLISHED` 상태 분리
- PostgreSQL 기반 커스터마이징 저장 및 공개 slug 조회
- JWT/OAuth/쿠키 설정에 대한 fail-fast 부팅 검증
- 인증 및 사이트 수명주기 회귀 테스트 자동화

## 아키텍처 포인트

### 1. 인증 및 세션 구조
- `HttpOnly` 쿠키 기반 Access / Refresh 인증 흐름
- Refresh Token 해시 저장 및 재발급 시 회전 처리
- 로그아웃 시 Access / Refresh / 세션 상태를 함께 정리
- 인증 관련 POST 요청에 Origin / Referer 검증 추가

### 2. 사용자 사이트 모델
- 템플릿 원본과 사용자 소유 사이트를 분리
- 각 사이트는 소유자 기준으로 독립 저장
- 내부 작업 경로와 공개 경로를 별도 모델로 관리
- 에디터 수정값을 사이트 단위로 저장하고 재방문 시 복원

### 3. 발행 모델
- 초안과 공개 상태를 백엔드 수명주기에서 분리
- 공개 런타임은 발행된 slug만 조회
- 비발행 시 공개 접근 즉시 차단

## 보안 및 안정성

적용한 보호 장치:
- Argon2 비밀번호 해시
- Refresh Token 회전 및 재사용 방지
- 로그인 시도 제한
- 회원가입 요청 rate limit
- 운영 환경 쿠키 정책 부팅 시 검증
- 비로컬 환경 `COOKIE_DOMAIN` fail-fast 검증
- OAuth 성공 후 클라이언트 재시도 대신 서버 직행 리다이렉트

## 운영 이슈 해결 사례

이 프로젝트에서 가장 의미 있었던 운영 이슈 중 하나는 Google OAuth 로그인 실패 문제였습니다.
처음에는 OAuth 연동 자체의 문제처럼 보였지만, 실제 원인은 쿠키 스코프 문제였습니다.

운영 환경에서 프론트엔드는 `facadely.com`, 백엔드는 `api.facadely.com`을 사용했습니다.
OAuth 자체는 정상적으로 완료되었지만, 인증 쿠키 범위가 좁게 설정되어 보호 라우트가 로그인 상태를 인식하지 못했습니다.

해결 과정:
- 프론트엔드 / 백엔드 운영 도메인 정렬
- Google OAuth Redirect URI 운영 도메인 기준으로 재설정
- `COOKIE_DOMAIN=facadely.com` 적용
- 잘못된 쿠키 / 보안 설정이 배포되지 않도록 부팅 시 검증 추가
- OAuth 성공 후 로그인 페이지 브리지 대신 최종 목적지로 바로 이동하도록 리다이렉트 구조 개선

이 경험을 통해 인증 문제를 브라우저 동작, 프록시/배포 환경, 프론트 인증 상태, 백엔드 쿠키 정책까지 함께 연결해 진단하고 해결할 수 있었습니다.

## 기술 스택

### Backend
- Java 21
- Spring Boot 3.5
- Spring Security
- OAuth2 Client
- Spring Data JPA
- PostgreSQL
- Flyway
- Gradle
- JUnit 5 / MockMvc

### Frontend
- Next.js 16 App Router
- React 19
- TypeScript
- Tailwind CSS 4
- Framer Motion

## 핵심 도메인 모델

주요 테이블:
- `users`
- `user_credentials`
- `refresh_tokens`
- `oauth_google_accounts`
- `auth_audit_logs`
- `sites`

사이트 주요 필드:
- `owner_user_id`
- `site_slug`
- `site_path`
- `template_id`
- `customization_json`
- `lifecycle_status`
- `published_slug`
- `custom_domain`

## 검증 방법

### Backend
```bash
cd backend
./gradlew test
```

### Frontend
```bash
npm run lint
npm run build
```

## 로컬 실행

### Backend
```bash
cd backend
cp .env.example .env
docker compose up -d
./gradlew bootRun
```

### Frontend
```bash
cp .env.example .env.local
npm install
npm run dev
```

헬스체크:
```bash
curl http://localhost:8080/api/v1/health
```

## 문서

- [프로젝트 개요](./docs/PROJECT_OVERVIEW.md)
- [백엔드 문서](./docs/backend/README.md)
- [아키텍처 결정 기록](./docs/backend/architecture-decisions.md)
- [백엔드 아키텍처 워크스루](./docs/backend/backend-architecture-walkthrough.md)
