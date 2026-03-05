# Phase 03 - Email Auth

## 이 단계 목표
- 이메일/비밀번호 기반 인증 사이클(signup/login/logout/refresh/me)을 완성합니다.

## 초보자 핵심 개념
- Access Token: API 접근용 단기 토큰
- Refresh Token: Access 재발급용 장기 토큰
- 두 토큰을 분리하면 보안과 사용자 경험을 균형 있게 가져갈 수 있습니다.

## 왜 이 설계를 선택했는가
- 비밀번호는 Argon2로 해시 저장
- Refresh Token은 원문 저장 대신 해시 저장(유출 리스크 감소)
- 쿠키는 HttpOnly로 발급해 JS 접근 차단

## 코드 구조 지도(파일 역할)
- `backend/src/main/java/com/facadely/backend/auth/controller/AuthController.java`
- `backend/src/main/java/com/facadely/backend/auth/service/AuthService.java`
- `backend/src/main/java/com/facadely/backend/auth/security/JwtTokenProvider.java`
- `backend/src/main/java/com/facadely/backend/auth/config/CookieFactory.java`
- `backend/src/main/java/com/facadely/backend/common/exception/GlobalExceptionHandler.java`

## 요청/응답 예시(JSON)
회원가입 요청:
```json
{
  "email": "user@example.com",
  "password": "Password123!",
  "name": "Demo User",
  "locale": "ko",
  "agreeTerms": true
}
```
`GET /auth/me` 응답:
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "name": "Demo User",
  "role": "USER",
  "termsAgreed": true
}
```

## 실패 케이스와 디버깅 포인트
- 401 반복: 쿠키(`facadely_at`, `facadely_rt`) 발급/전달 확인
- 로그인 실패 과다: `LoginAttemptService`의 잠금 상태 확인
- refresh 실패: DB에 저장된 refresh hash/만료/폐기 시점 확인

## 체크리스트
- [x] signup/login/logout/refresh/me 구현
- [x] Argon2 비밀번호 해시 적용
- [x] Refresh 토큰 회전 구현
- [x] 표준 에러 응답 처리 적용
