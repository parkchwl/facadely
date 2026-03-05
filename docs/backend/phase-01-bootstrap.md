# Phase 01 - Bootstrap

## 이 단계 목표
- Spring Boot 앱 기동, DB 연결, 헬스체크까지 최소 실행 단위를 확보합니다.

## 초보자 핵심 개념
- "기동 가능한 최소 단위"가 없으면 이후 인증 문제를 어디서부터 디버깅해야 할지 모호해집니다.

## 왜 이 설계를 선택했는가
- 인증 기능은 의존성이 많습니다.
- 먼저 `health` + `datasource` + `flyway`를 확인해 인프라/설정 문제를 선제 분리합니다.

## 코드 구조 지도(파일 역할)
- `backend/build.gradle`: 백엔드 의존성
- `backend/src/main/resources/application.yml`: 실행 설정
- `backend/docker-compose.yml`: 로컬 PostgreSQL
- `backend/src/main/java/com/facadely/backend/health/HealthController.java`: 헬스 API

## 요청/응답 예시(JSON)
요청:
```http
GET /api/v1/health
```
응답:
```json
{
  "status": "UP",
  "service": "facadely-backend",
  "timestamp": "2026-03-03T00:00:00Z"
}
```

## 실패 케이스와 디버깅 포인트
- DB 연결 실패: `SPRING_DATASOURCE_*` 값 확인
- Flyway 실패: `db/migration` SQL 문법과 순서 확인

## 체크리스트
- [x] Spring 프로젝트 생성
- [x] Health API 추가
- [x] PostgreSQL 도커 구성 추가
- [x] 실행 환경 변수 샘플 추가
