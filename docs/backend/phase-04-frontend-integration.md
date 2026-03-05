# Phase 04 - Frontend Integration

## 이 단계 목표
- 로그인 페이지를 목업에서 실제 Spring API 연동으로 교체합니다.

## 초보자 핵심 개념
- 프론트에서 인증 API 호출 시 `credentials: 'include'`가 없으면 쿠키가 자동으로 오가지 않습니다.

## 왜 이 설계를 선택했는가
- 로그인 UI를 먼저 실동작으로 바꾸면 사용자 체감 품질을 빠르게 확보할 수 있습니다.
- 소셜 버튼은 Google만 유지해 복잡도를 줄였습니다.

## 코드 구조 지도(파일 역할)
- `src/lib/api/auth.ts`: 인증 API 클라이언트
- `src/app/components/LoginPageClient.tsx`: 이메일/비밀번호 + Google UI
- `src/app/components/SocialLoginButton.tsx`: Google 단일 버튼 컴포넌트
- `src/app/[lang]/login/page.tsx`: 로그인 페이지 엔트리
- `src/types/dictionary.ts`, `src/i18n/messages/*.json`: 로그인 텍스트 계약

## 요청/응답 예시(JSON)
로그인 요청:
```json
{
  "email": "user@example.com",
  "password": "Password123!"
}
```
실패 응답 예:
```json
{
  "status": 401,
  "code": "INVALID_CREDENTIALS",
  "message": "이메일 또는 비밀번호가 올바르지 않습니다."
}
```

## 실패 케이스와 디버깅 포인트
- 쿠키가 저장되지 않음: CORS `allowCredentials`, 프론트 `credentials: include`, SameSite 확인
- OAuth 후 페이지 복귀 실패: `facadely_lang` 쿠키 설정 여부 확인

## 체크리스트
- [x] Math.random/alert 목업 제거
- [x] Apple/Facebook 제거
- [x] Google 단일 버튼 유지
- [x] 이메일/비밀번호 폼 연동 완료
