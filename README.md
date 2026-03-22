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
- 초안 편집 데이터는 소유자 인증 기준으로만 조회

### 3. 발행 모델
- 초안과 공개 상태를 백엔드 수명주기에서 분리
- 공개 런타임은 발행된 slug만 조회
- 비발행 시 공개 접근 즉시 차단
- 공개 커스터마이징은 published slug 기준으로만 노출

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

### 1. 운영 환경에서 Google OAuth 로그인 성공 후 다시 로그인 페이지로 돌아가던 문제

배포 환경에서 Google OAuth 자체는 정상적으로 완료되었지만, 로그인 직후 다시 로그인 페이지로 되돌아가는 문제가 있었습니다.
원인을 추적한 결과 OAuth 연동 실패가 아니라, 인증 쿠키가 `api.facadely.com`에만 설정되어 `facadely.com`의 보호 라우트가 로그인 상태를 인식하지 못하는 쿠키 스코프 문제였습니다.

이를 해결하기 위해 인증 쿠키 발급 로직에 `COOKIE_DOMAIN=facadely.com` 설정을 추가하고, 프론트/백엔드 도메인 구조를 함께 정렬해 운영 환경에서도 세션이 일관되게 유지되도록 개선했습니다.

### 2. Google OAuth `redirect_uri_mismatch` 및 배포 도메인 정합성 문제 해결

로컬 환경에서는 정상 동작하던 Google 로그인 기능이 배포 후 `redirect_uri_mismatch` 오류로 실패하는 문제가 있었습니다.
원인은 Google Cloud Console에 등록된 Redirect URI와 실제 운영 백엔드 도메인, 프록시 환경에서 생성되는 callback URL이 서로 맞지 않았기 때문입니다.

이를 해결하기 위해 Railway custom domain을 기준으로 OAuth callback 경로를 재정렬하고, Google OAuth Redirect URI, 프론트 API base URL, 백엔드 운영 도메인을 동일한 기준으로 통일했습니다.
이 과정을 통해 OAuth 기능은 단순 코드 구현만으로 끝나는 것이 아니라, 배포 도메인과 외부 인증 설정까지 함께 맞아야 안정적으로 동작한다는 점을 검증했습니다.

### 3. OAuth 성공 후 로그인 상태 연결을 클라이언트 재시도에 의존하던 구조 개선

초기에는 Google 로그인 성공 후 `/login?oauth=success` 페이지로 이동한 뒤, 프론트엔드가 `me()` 또는 `refresh()`를 다시 호출해 로그인 상태를 복구하는 구조였습니다.
이 방식은 네트워크 상황이나 쿠키 전달 타이밍에 따라 로그인 완료 후에도 상태 연결이 불안정해질 수 있었습니다.

이를 개선하기 위해 OAuth 성공 시 서버가 직접 `next` 또는 `/dashboard`로 리다이렉트하도록 변경하고, 로그인 성공 후 상태 연결을 클라이언트 후처리가 아니라 서버 응답 흐름 안에서 마무리하도록 정리했습니다.
그 결과 로그인 완료 흐름이 더 단순해졌고, 인증 성공 이후 사용자 이동 경로도 더 안정적으로 통제할 수 있게 되었습니다.

검증 포인트:
- 수정 이후 운영 환경에서 Google OAuth 로그인부터 보호 라우트 진입까지 실제 브라우저 기준으로 재검증했습니다.
- Redirect URI, API base URL, cookie domain을 동일한 운영 기준으로 맞춰 재발 가능성을 줄였습니다.
- 구조 개선 이후 로그인 성공 후 상태 연결을 클라이언트 재시도에 의존하지 않도록 정리했습니다.

안정성 관점 보완:
- 이후에는 `COOKIE_DOMAIN`, JWT secret, OAuth 자격 증명 설정이 잘못된 상태로 배포되지 않도록 fail-fast 검증도 함께 추가했습니다.
- 운영 이슈를 해결하는 데서 끝나지 않고, 같은 유형의 설정 오류가 재발하지 않도록 인증 설정 검증 로직을 보강했습니다.

보안 / 운영 시야:
- 이 경험을 통해 인증 문제는 단순 로그인 로직이 아니라 브라우저, 도메인, 프록시, 외부 인증 설정이 함께 맞물리는 운영 문제라는 점을 체감했습니다.

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
