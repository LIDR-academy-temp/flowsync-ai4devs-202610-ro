# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Qué es este repo

FlowSync es el proyecto de ejercicio del curso LIDR AI4Devs (cohorte 202610-ro). Hay dos apps independientes, cada una con su propio `package.json` (no hay workspace raíz):

- `backend/`: API REST de autenticación en **AdonisJS 7** + TypeScript, con SQLite. **Ya está hecha y no se modifica en el ejercicio**: solo se lee para saber qué contrato hay que consumir.
- `frontend/`: **React 19 + Vite**. Ahora mismo es la plantilla de Vite. Aquí es donde se trabaja; el objetivo es implementar login/registro con shadcn/ui, que todavía no está instalado.

El `README.md` raíz es la lección del ejercicio y se genera automáticamente: no se edita a mano. `prompts.md` es la plantilla donde el alumno registra sus prompts.

Requiere **Node.js 24 o superior**. Con Node 20 falla con `Unknown file extension ".ts"`.

## Comandos

Backend (desde `backend/`):

```bash
npm install
cp .env.example .env && node ace generate:key   # solo la primera vez
node ace migration:run      # crea tmp/db.sqlite3 y regenera database/schema.ts
npm run dev                 # node ace serve --hmr → http://localhost:3333
npm test                    # node ace test (Japa)
node ace test unit          # una suite (unit | functional)
node ace test --files=tests/functional/foo.spec.ts   # un archivo
node ace test --tests="nombre del test"              # un test concreto
npm run lint                # eslint
npm run typecheck           # tsc --noEmit
npm run format              # prettier
```

Frontend (desde `frontend/`, en otra terminal):

```bash
npm install
npm run dev       # Vite → http://localhost:5173
npm run build     # tsc -b && vite build
npm run lint      # oxlint
npm run format    # prettier
```

El frontend no tiene tests. Usa Prettier con comillas simples y sin punto y coma (`frontend/.prettierrc.json`); el backend usa `@adonisjs/prettier-config`.

## Configuración de Claude Code (`.claude/`)

- **Hook de formateo**: `.claude/settings.json` registra un hook `PostToolUse` (`Edit|Write|MultiEdit`) que ejecuta `.claude/hooks/format.mjs`. El script formatea el archivo editado con el Prettier y la config de la app a la que pertenece (`backend/` o `frontend/`) e ignora lo que queda fuera de ellas. No hace falta formatear a mano después de editar.
- **Skill `/priority_ticket`** (`.claude/skills/priority_ticket/`): trae de Jira el ticket de mayor prioridad asignado en «Por hacer», resume sus criterios de aceptación, propone un plan en plan mode y, al aprobarlo, mueve el ticket a «En curso». Depende del MCP `atlassian` definido en `.mcp.json`.

## Arquitectura del backend

**Flujo de una petición**: `start/routes.ts` → middleware (`start/kernel.ts`) → controlador (`app/controllers/`) → validador VineJS (`app/validators/`) → modelo Lucid (`app/models/`) → transformer (`app/transformers/`) → `serialize()`.

**Contrato de la API** (todo bajo `/api/v1`):

| Método y ruta | Auth | Body | Respuesta |
|---|---|---|---|
| `POST /auth/signup` | no | `email`, `password`, `passwordConfirmation`, `fullName?` | `{ data: { user, token } }` |
| `POST /auth/login` | no | `email`, `password` | `{ data: { user, token } }` |
| `GET /account/profile` | Bearer | — | `{ data: user }` |
| `POST /account/logout` | Bearer | — | `{ message }` (sin envoltorio `data`) |

Cosas que no se ven si solo lees las rutas:

- **Respuestas envueltas en `data`**: `providers/api_provider.ts` registra un serializer propio que mete en `data` todo lo que pasa por `serialize()`. `logout` devuelve un objeto plano, sin envolver.
- **Reglas de validación del signup** (`app/validators/user.ts`): el email tiene que ser único y de 254 caracteres como máximo. El password va de 8 a 32 caracteres. **`passwordConfirmation` es obligatorio** y tiene que coincidir con el password. `fullName` es nullable. En el login, el password se acepta como cualquier string.
- **Errores**: `force_json_response_middleware` hace que todas las respuestas sean JSON. Si falla la validación sale un 422 con un array `errors`. Si las credenciales no valen, `verifyCredentials` lanza un error y sale un 400.
- **Auth**: el guard por defecto es `api`, con tokens opacos (prefijo `oat_`) guardados en `auth_access_tokens`. Se mandan en `Authorization: Bearer <token>`. Hay un guard `web` de sesión configurado, pero ninguna ruta lo usa. `silent_auth_middleware` corre en todas las peticiones; `middleware.auth()` protege el grupo `/account`.
- **Forma del usuario**: `UserTransformer` expone `id`, `fullName`, `email`, `createdAt`, `updatedAt` y `initials` (un getter calculado en el modelo). El hash del password nunca sale.
- **CORS**: en desarrollo acepta cualquier origen con credentials; en producción la allowlist está vacía.

**Código generado, no se edita a mano**:
- `database/schema.ts`: se regenera a partir de las migrations con `migration:run`. Los modelos extienden de estas clases (`User extends compose(UserSchema, withAuthFinder(hash))`).
- `.adonisjs/`: registro de controladores (`#generated/controllers`, que es lo que usa `routes.ts`) y registro de rutas de Tuyau para clientes tipados. Se regenera desde los hooks de `adonisrc.ts` al arrancar el servidor.

Los imports usan alias de subpath (`#models/*`, `#validators/*`, etc., definidos en `package.json` → `imports`). Las suites de test están definidas en `adonisrc.ts` (`tests/unit/**`, `tests/functional/**`), pero todavía no hay ningún test. Los cambios de esquema se hacen siempre con una migration nueva, nunca editando la tabla directamente.
