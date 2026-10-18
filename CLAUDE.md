# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Qué es este repo

FlowSync: monorepo TypeScript de punta a punta con dos apps independientes (cada una con su `package.json` y su `node_modules`, sin workspace raíz):

- `backend/` — API en AdonisJS 7 (Lucid + SQLite, VineJS, auth por access tokens). **En el ejercicio actual el backend no se modifica**, solo se lee como referencia.
- `frontend/` — React 19 + Vite. Hoy es la plantilla de Vite sin tocar (sin router, sin cliente HTTP, sin Tailwind ni shadcn/ui aún). Aquí es donde se trabaja.

El `README.md` es el enunciado del ejercicio del bootcamp (generado, no se edita a mano). `prompts.md` es un entregable: registro literal de los prompts lanzados.

Requiere **Node.js ≥ 24** (con versiones anteriores falla con `Unknown file extension ".ts"`).

## Comandos

Backend (`cd backend`), sirve en `http://localhost:3333`:

```bash
npm install && cp .env.example .env && node ace generate:key   # primera vez
node ace migration:run      # crea tmp/db.sqlite3 y regenera database/schema.ts
npm run dev                 # node ace serve --hmr
npm run lint                # eslint
npm run typecheck           # tsc --noEmit
npm run format              # prettier (@adonisjs/prettier-config)
npm test                    # node ace test (suites: unit, functional)
node ace test functional    # una suite
node ace test --files tests/functional/auth.spec.ts   # un archivo
node ace test --tests "nombre del test"               # un test concreto
```

Todavía no hay tests: solo `tests/bootstrap.ts`. Los specs van en `tests/unit/**/*.spec.ts` y `tests/functional/**/*.spec.ts` (la suite functional arranca el servidor HTTP; usa `.env.test` con `SESSION_DRIVER=memory`).

Frontend (`cd frontend`), sirve en `http://localhost:5173`:

```bash
npm run dev       # vite
npm run build     # tsc -b && vite build (el build es también el typecheck)
npm run lint      # oxlint (.oxlintrc.json)
```

El frontend no tiene formateador ni tests configurados.

## Arquitectura del backend

Flujo de una petición: `start/routes.ts` → controlador (`app/controllers`) → `request.validateUsing(<validador VineJS>)` → modelo Lucid → `ctx.serialize(Transformer.transform(...))`.

- **Imports por alias** `#controllers/*`, `#models/*`, `#validators/*`, etc. (definidos en `imports` de `backend/package.json`). En las rutas los controladores se referencian vía `controllers.X` de `#generated/controllers`.
- **Código generado, no editar a mano**: `backend/.adonisjs/**` (registro de rutas/controladores, se regenera en los hooks de `adonisrc.ts`) y `backend/database/schema.ts` (lo regenera `migration:run`). Los modelos extienden esas clases de esquema (`User extends compose(UserSchema, withAuthFinder(hash))`), así que un cambio de columnas se hace con una **migration nueva**, nunca tocando `schema.ts` ni la tabla.
- **Forma de las respuestas**: `providers/api_provider.ts` añade `ctx.serialize`, que envuelve todo en `{ data: ... }`. Lo que se expone de un usuario lo decide `app/transformers/user_transformer.ts` (`id, fullName, email, createdAt, updatedAt, initials`; nunca el password).
- `force_json_response_middleware` fuerza `Accept: application/json` en todas las peticiones, así que los errores siempre llegan como JSON.
- CORS abierto a cualquier origen en desarrollo (`config/cors.ts`); el frontend puede llamar directamente a `localhost:3333`.

### Contrato de la API de auth (lo que el frontend debe respetar)

Rutas bajo `/api/v1`:

| Método y ruta | Auth | Body | Respuesta OK |
|---|---|---|---|
| `POST /auth/signup` | no | `{ fullName?, email, password, passwordConfirmation }` | `{ data: { user, token } }` |
| `POST /auth/login` | no | `{ email, password }` | `{ data: { user, token } }` |
| `GET /account/profile` | sí | — | `{ data: user }` |
| `POST /account/logout` | sí | — | `{ message }` |

- Reglas de `app/validators/user.ts`: email válido ≤ 254; password **8–32 caracteres**; **`passwordConfirmation` obligatorio** e igual a `password`; `fullName` nullable; email único en `users`. El signup devuelve ya un token (deja al usuario logueado).
- Auth por defecto con el guard `api` (access tokens opacos con prefijo `oat_`): se envía `Authorization: Bearer <token>`.
- Errores: validación → **422** `{ errors: [{ message, field, rule }] }`; credenciales inválidas en login → **400** `{ errors: [{ message }] }`; sin token o token inválido → **401**.

## Reglas de proceso

Obligatorias en cualquier tarea que cambie código:

1. **Rama nueva antes de tocar código.** Nunca trabajes sobre `main` ni sobre la rama en la que estés al empezar: crea una desde ella (`git switch -c <tipo>/<descripcion-corta>`, p. ej. `feat/frontend-login`; si hay ticket, inclúyelo: `feat/FLOW-1-login`).
2. **Al cerrar**, prepara los cambios y haz el commit con la skill `/commit`. Luego sube la rama y abre el pull request con `gh pr create` (título en el mismo formato convencional; en el cuerpo, qué cambia, cómo se ha verificado y el ticket si lo hay).
3. **Después**, lanza el subagente `adversarial-reviewer` sobre ese pull request. No corrijas lo que encuentre ni lo vuelvas a lanzar: su informe queda para que lo revise el usuario.
4. **En el chat, solo la URL del pull request** como mensaje final: sin resumen de cambios ni del informe del revisor.
