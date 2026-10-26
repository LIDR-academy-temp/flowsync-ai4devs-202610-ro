# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Qué es este repo

FlowSync: monorepo TypeScript de punta a punta con dos proyectos independientes (cada uno con su propio `package.json`, sin workspace raíz):

- `backend/`: API en **AdonisJS 7** (Lucid ORM + SQLite vía `better-sqlite3`, VineJS, `@adonisjs/auth` con access tokens). Ya existe y en este ejercicio **no se modifica**: solo se lee como referencia del contrato de la API.
- `frontend/`: **React 19 + Vite 8**, todavía la plantilla por defecto de Vite. Aquí es donde se trabaja. El curso usa **shadcn/ui** (componentes copiados al repo, no una dependencia), aunque aún no está inicializado.

El `README.md` raíz es una lección generada (no se edita a mano) y `prompts.md` es una plantilla del ejercicio del curso.

Requiere **Node.js 24+** (con versiones anteriores el backend falla con `Unknown file extension ".ts"`).

## Comandos

Backend (`cd backend`):

```bash
npm install
cp .env.example .env && node ace generate:key   # primera vez
node ace migration:run                          # crea tmp/db.sqlite3 y regenera database/schema.ts
npm run dev                                     # http://localhost:3333 con HMR
npm test                                        # node ace test (Japa)
node ace test --files=tests/functional/foo.spec.ts   # un solo archivo
node ace test functional                        # una sola suite (unit | functional)
npm run lint && npm run typecheck && npm run format
```

Frontend (`cd frontend`, en otra terminal):

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # tsc -b && vite build
npm run lint     # oxlint
```

El frontend no tiene formateador ni tests configurados.

## Arquitectura del backend

- **Rutas** en `start/routes.ts`, todas bajo `/api/v1`:
  - `POST /auth/signup` → `NewAccountController.store`
  - `POST /auth/login` → `AccessTokensController.store`
  - `GET /account/profile` y `POST /account/logout` → protegidas con `middleware.auth()`
  - Los controladores se referencian vía `controllers` de `#generated/controllers` (código generado en `.adonisjs/`, no editar).
- **Auth**: guard por defecto `api` (token guard, tabla `auth_access_tokens`). Los tokens llevan prefijo `oat_` y se envían como `Authorization: Bearer <token>`. Signup y login devuelven ambos `{ user, token }`.
- **Forma de las respuestas**: `providers/api_provider.ts` añade `ctx.serialize()`, que envuelve todo en `{ data: ... }`. Así, login/signup responden `{ data: { user, token } }` y profile `{ data: user }`. El usuario se expone vía `UserTransformer`: `id, fullName, email, createdAt, updatedAt, initials` (nunca el password).
- **Validación** (`app/validators/user.ts`): es la fuente de verdad de lo que exige la API, más estricta que cualquier ticket de producto:
  - signup: `email` (válido, ≤254, único), `password` (8–32), **`passwordConfirmation` obligatorio** (igual a `password`), `fullName` opcional/nullable.
  - login: `email`, `password`.
  - Los errores de validación devuelven 422 con `{ errors: [{ message, field, rule }] }`; credenciales inválidas devuelven 400 (`E_INVALID_CREDENTIALS`). `force_json_response_middleware` fuerza respuestas JSON siempre.
- **Modelos**: `app/models/user.ts` extiende `UserSchema` de `database/schema.ts`, que **se autogenera** a partir de las migraciones al ejecutar `migration:run` (no editar a mano). Los cambios de esquema van siempre en una migration nueva.
- **CORS**: en desarrollo acepta cualquier origen (`config/cors.ts`), así que el frontend en :5173 puede llamar directamente a :3333.
- **Imports**: alias de subpath de Node (`#controllers/*`, `#models/*`, `#validators/*`, etc.) definidos en `backend/package.json`.
- **Tests**: Japa con suites `unit` (`tests/unit/**`) y `functional` (`tests/functional/**`, levanta el servidor HTTP); de momento no hay ningún test escrito. `.env.test` usa `SESSION_DRIVER=memory`.

## Frontend

- Entrada en `src/main.tsx` → `src/App.tsx` (aún la demo de Vite). No hay router, cliente HTTP ni gestión de estado instalados.
- TypeScript estricto con `noUnusedLocals`/`noUnusedParameters` y `verbatimModuleSyntax` (usar `import type` para tipos); `npm run build` falla si no se cumplen.
- Oxlint con reglas de React hooks y `only-export-components`.

## Reglas de proceso para esta tarea

1. Antes de tocar código, verificar que se está trabajando en una rama nueva (no `main`) y confirmar su nombre con el usuario.
2. Mantener `backend/` en modo solo lectura: los cambios de implementación se hacen únicamente en `frontend/`.
3. Al cerrar la implementación, revisar el diff y usar `/commit` para crear un commit convencional, solo después de la confirmación explícita del usuario.
4. Después del commit, abrir el pull request desde la rama actual con `gh pr create`. El PR debe apuntar al repositorio del curso (`LIDR-academy-temp/flowsync-ai4devs-202610-ro`, remoto `upstream`) y describir los cambios y las verificaciones realizadas.
5. Después de crear el pull request, ejecutar el subagente `adversarial-reviewer` sobre ese PR.
6. Si el revisor encuentra problemas, informarlos y no corregirlos automáticamente sin confirmación del usuario.
7. Al finalizar el flujo, responder en el chat únicamente con la URL del pull request.
8. Registrar en `prompts.md` todos los prompts usados, incluidos los que fallen.
