# facadely

[Live Service](https://facadely.com) | [Backend Docs](./docs/backend/README.md) | [Project Overview](./docs/PROJECT_OVERVIEW.md)

## Overview

facadely is a multi-language website builder where users choose a template, customize it in the editor, and publish a live site.

This repository includes the frontend product and the Spring Boot backend that powers:
- authentication and session lifecycle
- Google OAuth login
- owned site creation and lifecycle management
- editor customization persistence
- publish / unpublish flow

## Backend Focus

The backend is designed around one product flow:

`template selection -> owned site creation -> editor autosave -> revisit restore -> publish`

Core backend capabilities:
- Spring Security based auth with JWT access cookies and DB-backed refresh rotation
- Google OAuth2 login integrated into the same auth/session model
- owned `sites` domain with `DRAFT` / `PUBLISHED` lifecycle separation
- PostgreSQL persistence for site customization and public slug resolution
- fail-fast runtime validation for JWT, OAuth, secure cookie, and cookie domain settings
- integration and regression tests for auth and site lifecycle flows

## Architecture Highlights

### 1. Auth and Session Model
- `HttpOnly` cookie-based access/refresh token flow
- refresh token hash persistence and rotation on refresh
- logout invalidates access, refresh, and servlet session state together
- origin / referer validation added on auth-related POST requests

### 2. Owned Site Model
- templates and user-owned sites are separated
- each site is bound to an owner and stored as its own record
- internal working route and public route are modeled separately
- editor changes are persisted per site and restored on revisit

### 3. Publish Model
- draft and published state are separated in the backend lifecycle
- public runtime resolves only published slugs
- unpublish immediately removes public visibility

## Security and Reliability

Implemented protections:
- Argon2 password hashing
- refresh token reuse defense through rotation and revocation
- login attempt throttling
- signup request rate limiting
- secure cookie policy validation at startup
- `COOKIE_DOMAIN` fail-fast validation for non-local environments
- server-side OAuth success redirect instead of client-side retry recovery

## Production Troubleshooting Highlight

One of the most useful production issues in this project was a Google OAuth login failure that looked like an OAuth problem but turned out to be a cookie scope problem.

The deployed frontend used `facadely.com` while the backend used `api.facadely.com`. OAuth completed successfully, but the protected frontend routes could not see the authenticated session because cookies were scoped too narrowly.

To fix this, I:
- aligned the deployed frontend and backend domains
- updated Google OAuth redirect URIs to match the production backend domain
- introduced `COOKIE_DOMAIN=facadely.com`
- validated cookie/security config at boot time to prevent silent misconfiguration
- changed OAuth success handling to redirect directly to the final destination instead of relying on a client retry bridge

This was a good example of debugging across browser behavior, proxy/deployment setup, frontend auth state, and backend cookie policy together.

## Stack

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

## Key Domain Models

Main tables:
- `users`
- `user_credentials`
- `refresh_tokens`
- `oauth_google_accounts`
- `auth_audit_logs`
- `sites`

Important site fields:
- `owner_user_id`
- `site_slug`
- `site_path`
- `template_id`
- `customization_json`
- `lifecycle_status`
- `published_slug`
- `custom_domain`

## Validation

Backend:
```bash
cd backend
./gradlew test
```

Frontend:
```bash
npm run lint
npm run build
```

## Local Run

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

Health check:
```bash
curl http://localhost:8080/api/v1/health
```

## Docs

- [Project Overview](./docs/PROJECT_OVERVIEW.md)
- [Backend Documentation](./docs/backend/README.md)
- [Architecture Decisions](./docs/backend/architecture-decisions.md)
- [Backend Architecture Walkthrough](./docs/backend/backend-architecture-walkthrough.md)
