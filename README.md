✦facadely 

## 서비스 소개

facadely는 사용자가 템플릿을 선택해 웹사이트를 빠르게 제작하고 배포할 수 있는 멀티랭귀지 웹 빌더 서비스입니다.  
이 저장소의 백엔드는 회원 인증, 세션 유지, OAuth 연동, 인증 감사 로그를 담당합니다.

프론트엔드가 함께 있는 저장소지만, 이 문서는 **백엔드 이력서/포트폴리오 기준**으로 작성된 백엔드 전용 README입니다.

## 1) 프로젝트 한 줄 요약

Spring Boot 기반 인증 서버를 설계/구현하여  
**JWT Access Token + DB 해시 저장 Refresh Token 회전 + Google OAuth2**를 하나의 인증 흐름으로 통합했습니다.

## 2) 이력서에 바로 넣을 핵심 포인트

- Spring Security 필터 체인 직접 구성 (`JWT 인증 + Origin/Referer 검증 + OAuth2 로그인 핸들러`)
- Refresh Token 원문 미저장(해시 저장) + 회전/폐기 로직 구현으로 재사용 공격 대응
- 인증 경계 보강: CORS 단일 Origin, 인증 POST 요청 출처 검증, 쿠키 정책 강제
- 운영 안정성: 부팅 단계 Fail-fast 설정 검증 (`JWT/OAuth placeholder, secure cookie 정책`)
- 통합 테스트 자동화로 주요 회귀 시나리오 검증 (signup/login/refresh/logout/me/audit/origin)

## 3) 담당 문제와 해결

### 문제
- OAuth 세션과 JWT 인증이 혼재되면 인증 상태 경계가 모호해지고, 로그아웃 후 잔존 세션 이슈가 발생할 수 있음
- Refresh Token을 원문 저장하면 유출 시 피해가 큼

### 해결
- `/api/v1/auth/*`로 인증 API를 단일화하고 쿠키 기반 JWT 인증을 표준 경로로 통합
- Refresh Token은 SHA-256 해시만 DB 저장, `refresh` 호출 시 기존 토큰 즉시 폐기 후 신규 발급(회전)
- `logout` 시 Access/Refresh/JSESSIONID 동시 무효화 및 SecurityContext 정리

## 4) 기술 스택

- Java 21
- Spring Boot 3.5.0
- Spring Security / OAuth2 Client
- Spring Data JPA (Hibernate)
- PostgreSQL / Flyway
- Gradle
- JUnit5 / MockMvc / Testcontainers(PostgreSQL)

## 5) 핵심 기능

### 인증 API
- `POST /api/v1/auth/signup`
- `POST /api/v1/auth/login`
- `POST /api/v1/auth/refresh`
- `POST /api/v1/auth/logout`
- `GET /api/v1/auth/me`
- `POST /api/v1/auth/terms/agree`
- `GET /api/v1/auth/audit-summary`

### OAuth2 API
- `GET /api/v1/auth/oauth2/authorization/google`
- `GET /api/v1/auth/oauth2/callback/google`

### 동작 포인트
- 비밀번호 Argon2 해시
- 로그인 시도 제한: 이메일+IP 기준 15분 윈도우 내 5회 실패 시 잠금
- OAuth 성공/실패 모두 세션 정리 후 프론트엔드로 리다이렉트

## 6) 보안 설계

- `AuthOriginValidationFilter`: 인증 관련 POST 요청 Origin/Referer 검증
- `JwtAuthenticationFilter`: Access Token 쿠키 기반 사용자 인증 주입
- `CookieFactory`: HttpOnly/SameSite/Secure 정책 일관 적용, Refresh 쿠키 Path 제한
- `AuthConfigurationValidator`: 비로컬 환경의 insecure 설정을 부팅 단계에서 차단

### 트레이드오프: HttpOnly Cookie + JWT를 선택한 이유

- 선택한 방식: 브라우저 저장은 `HttpOnly Cookie`, 서버 인증은 `JWT` 기반으로 구성
- 장점: 토큰을 JavaScript에서 직접 읽을 수 없어(XSS 상황) 탈취 난이도를 낮출 수 있고, 서버 확장 시 인증 상태를 비교적 단순하게 유지할 수 있음
- `localStorage` 미채택 이유: 스크립트로 토큰 접근이 가능해 XSS 발생 시 토큰 유출 위험이 커짐
- 세션 전면 방식 미채택 이유: 중앙 세션 저장소/스티키 세션 등 운영 복잡도가 증가할 수 있음
- 보완 포인트: 쿠키 기반 인증의 CSRF 리스크를 줄이기 위해 인증 POST 요청에 Origin/Referer 검증을 추가 적용

## 7) 데이터 모델

Flyway 마이그레이션: `backend/src/main/resources/db/migration/V1__auth_init.sql`

- `users`
- `user_credentials`
- `refresh_tokens`
- `terms_agreements`
- `auth_audit_logs`
- `oauth_google_accounts`

## 8) 테스트 전략

통합 테스트: `backend/src/test/java/com/facadely/backend/auth/AuthControllerIntegrationTest.java`

검증하는 핵심 시나리오:
- signup 시 인증 쿠키 발급 + 약관 동의 저장
- refresh 토큰 회전 및 기존 토큰 재사용 거절
- audit-summary 집계 정확성
- JWT 쿠키가 비정상 세션 인증보다 우선 적용되는지 검증
- logout 후 세션/인증 상태 정리 확인
- 허용되지 않은 Origin 요청 차단

## 9) 로컬 실행 (백엔드만)

요구사항: Java 21, Docker

```bash
cd backend
cp .env.example .env
docker compose up -d
./gradlew bootRun
```

헬스체크:

```bash
curl http://localhost:8080/api/v1/health
```

테스트:

```bash
cd backend
./gradlew test
```

## 10) 주요 환경 변수

`backend/.env.example` 기준

- `FRONTEND_ORIGIN`
- `SPRING_DATASOURCE_URL`
- `SPRING_DATASOURCE_USERNAME`
- `SPRING_DATASOURCE_PASSWORD`
- `JWT_ACCESS_SECRET`
- `JWT_ACCESS_TTL_SECONDS`
- `JWT_REFRESH_TTL_SECONDS`
- `COOKIE_SECURE`
- `COOKIE_SAME_SITE`
- `COOKIE_ACCESS_NAME`
- `COOKIE_REFRESH_NAME`
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`

## 11) 면접에서 설명하기 좋은 코드 포인트

- `backend/src/main/java/com/facadely/backend/auth/config/SecurityConfig.java`
- `backend/src/main/java/com/facadely/backend/auth/security/AuthOriginValidationFilter.java`
- `backend/src/main/java/com/facadely/backend/auth/service/AuthService.java`
- `backend/src/main/java/com/facadely/backend/auth/security/OAuth2LoginSuccessHandler.java`
- `backend/src/main/java/com/facadely/backend/auth/config/AuthConfigurationValidator.java`
- `backend/src/test/java/com/facadely/backend/auth/AuthControllerIntegrationTest.java`
