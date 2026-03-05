# Phase 02 - Schema

## 이 단계 목표
- 인증 도메인의 데이터 계약을 Flyway로 고정합니다.

## 초보자 핵심 개념
- 테이블 설계는 백엔드 API의 바닥 계약입니다.
- 계약이 먼저 고정되면 서비스/컨트롤러 구현이 흔들리지 않습니다.

## 왜 이 설계를 선택했는가
- `users`(계정), `user_credentials`(비밀번호), `refresh_tokens`(세션 갱신), `terms_agreements`(약관), `oauth_google_accounts`(소셜 연동)를 분리해 책임을 명확히 했습니다.

## 코드 구조 지도(파일 역할)
- `backend/src/main/resources/db/migration/V1__auth_init.sql`
  - 인증 관련 테이블/인덱스/trigger 생성

## 요청/응답 예시(JSON)
```json
{
  "migration": "V1__auth_init.sql",
  "tables": [
    "users",
    "user_credentials",
    "refresh_tokens",
    "terms_agreements",
    "auth_audit_logs",
    "oauth_google_accounts"
  ]
}
```

## 실패 케이스와 디버깅 포인트
- UUID/확장 함수 에러: PostgreSQL 버전과 확장 활성화 확인
- 인덱스/제약 충돌: 기존 스키마 잔재 여부 확인

## 체크리스트
- [x] 인증 핵심 테이블 설계 반영
- [x] 리프레시 토큰 회전 저장 구조 반영
- [x] Google OAuth 연동 테이블 반영
