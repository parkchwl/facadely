# Phase 00 - Foundation

## 이 단계 목표
- 백엔드 작업을 이해하면서 따라갈 수 있도록 학습형 문서 구조를 먼저 고정합니다.

## 초보자 핵심 개념
- 구현 전에 용어/결정 기준을 명확히 하면, 코드가 바뀌어도 판단 기준이 흔들리지 않습니다.

## 왜 이 설계를 선택했는가
- 백엔드 입문자는 "코드"보다 먼저 "맥락"을 알아야 디버깅이 쉬워집니다.
- 따라서 문서 레일(README, glossary, ADR)을 먼저 만들었습니다.

## 코드 구조 지도(파일 역할)
- `docs/backend/README.md`: 문서 읽는 순서와 목적
- `docs/backend/glossary.md`: 용어 사전
- `docs/backend/architecture-decisions.md`: 핵심 설계 결정 기록

## 요청/응답 예시(JSON)
```json
{
  "phase": "00",
  "status": "completed",
  "artifacts": ["README", "glossary", "architecture-decisions"]
}
```

## 실패 케이스와 디버깅 포인트
- 문서가 코드와 분리되면 즉시 낡아집니다.
- 이후 phase에서 변경이 생길 때 문서 업데이트를 항상 같이 커밋합니다.

## 체크리스트
- [x] 백엔드 학습 문서 루트 생성
- [x] 용어집 생성
- [x] 설계 의사결정 문서 생성
