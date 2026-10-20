# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Qué es este repo

FlowSync: proyecto de ejercicio del curso AI4Devs (LIDR). Monorepo TypeScript de punta a punta con dos apps independientes, cada una con su propio `package.json` (no hay workspace en la raíz):

- `backend/`: API en AdonisJS 7 (Lucid + SQLite, VineJS, auth por access tokens). **Ya está hecho y no se modifica en el ejercicio**: se lee para entender el contrato de la API.
- `frontend/`: React 19 + Vite 8, aún con la plantilla por defecto de Vite. Aquí es donde se trabaja.

`README.md` es el enunciado del ejercicio y se genera desde la lección del curso; no se edita a mano. `prompts.md` es la plantilla donde se registran los prompts lanzados.

Requiere **Node.js 24+** (con Node 20 el backend falla con `Unknown file extension ".ts"`).

## Comandos

Backend (`cd backend`, sirve en `http://localhost:3333`):

```bash
npm install && cp .env.example .env && node ace generate:key   # primera vez
node ace migration:run      # crea backend/tmp/db.sqlite3
npm run dev                 # node ace serve --hmr
npm test                    # node ace test (Japa); suites: unit, functional
node ace test functional --files=tests/functional/x.spec.ts   # un solo archivo
npm run lint | npm run typecheck | npm run format
```

Aún no hay tests: solo existe `tests/bootstrap.ts`. Las suites esperan `tests/unit/**/*.spec.ts` y `tests/functional/**/*.spec.ts` (estos últimos arrancan el servidor HTTP).

Frontend (`cd frontend`, sirve en `http://localhost:5173`):

```bash
npm run dev
npm run build      # tsc -b && vite build (es el chequeo de tipos)
npm run lint       # oxlint
```

El frontend no tiene formateador, router, Tailwind ni shadcn/ui instalados todavía.

## Contrato de la API (lo que consume el frontend)

Rutas en `backend/start/routes.ts`, todas bajo `/api/v1`:

| Método | Ruta | Auth | Controlador |
|---|---|---|---|
| POST | `/auth/signup` | no | `NewAccountController.store` |
| POST | `/auth/login` | no | `AccessTokensController.store` |
| GET | `/account/profile` | sí | `ProfileController.show` |
| POST | `/account/logout` | sí | `AccessTokensController.destroy` |

Detalles que no se deducen de los nombres de las rutas:

- **Signup exige `passwordConfirmation`** además de `email` y `password` (`backend/app/validators/user.ts`): password de 8 a 32 caracteres, `passwordConfirmation` debe ser igual, `email` único en `users`, `fullName` opcional (nullable).
- **Las respuestas van envueltas en `data`** por el serializer de `backend/providers/api_provider.ts` (`ctx.serialize(...)`). Signup y login devuelven `{ data: { user, token } }`; profile devuelve `{ data: user }`. Logout devuelve `{ message }` sin envolver.
- `user` sale de `UserTransformer`: `id, fullName, email, createdAt, updatedAt, initials`.
- Auth: guard por defecto `api` (access tokens, prefijo `oat_`). Se envía como `Authorization: Bearer <token>`.
- `ForceJsonResponseMiddleware` fuerza `Accept: application/json`, así que los errores de validación de VineJS y los de credenciales inválidas llegan como JSON con un array `errors`.
- CORS acepta cualquier origen en desarrollo (`backend/config/cors.ts`).

## Arquitectura del backend

Capas de AdonisJS: ruta → controlador → validador (VineJS) → modelo (Lucid) → transformer (lo que se expone al cliente). Imports con alias `#controllers/*`, `#models/*`, `#validators/*`, etc. (definidos en `imports` de `backend/package.json`).

Hay código generado que no se edita a mano:
- `backend/.adonisjs/`: índice de controladores (`#generated/controllers`, que es lo que usa `routes.ts`) y el registro de rutas tipado de Tuyau; lo regeneran los hooks de `adonisrc.ts` al arrancar.
- `backend/database/schema.ts`: esquema generado desde las migraciones; `User` extiende `UserSchema` de ahí. Los cambios de esquema van en una migración nueva, nunca editando tablas a mano.

## Proceso de trabajo

- Antes de tocar código para un ticket, crear una rama nueva.
- Al terminar los cambios, usar `/commit`.
- Crear el pull request usando `gh pr create`.
- Después de crear el pull request, ejecutar el subagente `adversarial-reviewer` sobre ese PR.
- La respuesta final en el chat debe contener únicamente la URL del pull request.