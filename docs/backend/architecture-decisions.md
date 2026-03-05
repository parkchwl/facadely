# Architecture Decisions

## ADR-001: 인증 저장소를 레거시 Auth 스택에서 Spring + PostgreSQL로 전환
- 이유: 인증의 소스 오브 트루스를 백엔드(Spring)로 일원화하고, 학습/운영 제어권을 확보하기 위해.

## ADR-002: 세션 전달을 HttpOnly 쿠키로 선택
- 이유: 브라우저 저장소(localStorage)에 토큰을 두는 방식보다 XSS 노출면에서 안전함.

## ADR-003: Access/Refresh 이중 토큰 구조
- 이유: 보안(짧은 Access 수명)과 UX(Refresh로 재로그인 최소화)를 동시에 만족.

## ADR-004: 소셜 로그인은 Google 단일 지원
- 이유: 초기 복잡도를 낮추고 성공 경로를 먼저 완성하기 위해.

## ADR-005: 문서-코드 동기화 강제
- 이유: 백엔드 입문 관점에서 "왜"를 추적할 수 있어야 유지보수가 쉬움.
