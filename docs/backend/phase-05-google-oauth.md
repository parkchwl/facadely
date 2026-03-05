# Phase 05 - Google OAuth

## 이 단계 목표
- Google OAuth 로그인 경로를 추가하고 내부 계정과 연결합니다.

## 초보자 핵심 개념
- OAuth는 "비밀번호를 우리 서버가 직접 받지 않고" 외부 인증 제공자 결과를 받아 계정 연동하는 방식입니다.

## 왜 이 설계를 선택했는가
- Google만 먼저 구현해 성공 경로를 단순화했습니다.
- 콜백 성공 시 동일한 쿠키 발급 로직(AuthBundle)을 재사용해 인증 체계를 통일했습니다.

## 코드 구조 지도(파일 역할)
- `backend/src/main/java/com/facadely/backend/auth/config/SecurityConfig.java`
- `backend/src/main/java/com/facadely/backend/auth/security/OAuth2LoginSuccessHandler.java`
- `backend/src/main/java/com/facadely/backend/auth/security/OAuth2LoginFailureHandler.java`
- `backend/src/main/java/com/facadely/backend/auth/service/AuthService.java` (`handleGoogleLogin`)

## 요청/응답 예시(JSON)
인증 시작:
```http
GET /api/v1/auth/oauth2/authorization/google
```
성공 후 흐름:
```json
{
  "oauth": "success",
  "next": "/{lang}/login",
  "cookies": ["facadely_at", "facadely_rt"]
}
```

## 실패 케이스와 디버깅 포인트
- `invalid_client`: Google Client ID/Secret 설정 확인
- callback mismatch: Google Console redirect URI와 backend 설정 일치 확인
- 성공 후 세션 없음: success handler의 Set-Cookie 헤더 확인

## 체크리스트
- [x] Google OAuth 엔드포인트 연결
- [x] Google sub 계정 매핑 테이블 연동
- [x] 성공/실패 리다이렉트 처리
