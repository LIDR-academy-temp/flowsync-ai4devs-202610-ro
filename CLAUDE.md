# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

FlowSync is a TypeScript monorepo with two independent apps:

- `backend/` — AdonisJS 7 API (Node.js 24+, SQLite via better-sqlite3). **The backend is complete and should not be modified.**
- `frontend/` — React 19 + Vite 8, currently a blank scaffold. This is where new features are implemented.

## Commands

### Backend (`backend/`)

```bash
npm run dev        # Dev server with HMR → http://localhost:3333
npm run test       # Japa test suite
npm run lint       # ESLint
npm run typecheck  # tsc --noEmit
npm run build      # Production build

# Database
node ace migration:run    # Apply pending migrations
node ace migration:fresh  # Drop and recreate all tables
```

First-time setup:
```bash
cp .env.example .env
node ace generate:key
node ace migration:run
```

### Frontend (`frontend/`)

```bash
npm run dev    # Dev server → http://localhost:5173
npm run lint   # oxlint
npm run build  # tsc -b && vite build
```

## Backend architecture

Requests flow through: **Route → Controller → Validator → Model → Transformer**

- `start/routes.ts` — URL-to-controller mapping
- `app/controllers/` — orchestration: validate input, call model, serialize response
- `app/validators/` — VineJS schemas; define exactly what fields the API accepts (including `passwordConfirmation` on signup)
- `app/models/` — Lucid ORM models (one row = one instance)
- `app/transformers/` — shape of the API response (filters sensitive fields like password hash)
- `database/migrations/` — versioned schema changes; never edit the DB directly

Auth uses **access tokens** (`oat_` prefix). The default guard is `api` (token-based), not `web` (session-based).

## API contract (backend)

All routes are prefixed `/api/v1`.

| Method | Path | Auth | Body |
|--------|------|------|------|
| POST | `/auth/signup` | — | `fullName` (nullable), `email`, `password`, `passwordConfirmation` |
| POST | `/auth/login` | — | `email`, `password` |
| GET | `/account/profile` | Bearer token | — |
| POST | `/account/logout` | Bearer token | — |

Signup and login both return `{ user, token }`. The token is a string starting with `oat_` — store it and send it as `Authorization: Bearer <token>` on authenticated requests.

The validator for signup checks that `email` is unique, `password` is 8–32 chars, and `passwordConfirmation` matches `password`. The ticket description may not mention all these constraints; read `app/validators/user.ts` when the spec is ambiguous.

## Frontend

The frontend is a blank React 19 + Vite scaffold. `shadcn/ui` components are not yet installed — add them by copying components into `src/components/ui/` (shadcn copies source, not a dependency). The backend runs on port 3333; configure the API base URL or a Vite proxy as needed.
