# Instrucciones para agentes — FlowSync

## Alcance y arquitectura

- El proyecto contiene dos aplicaciones npm independientes, `backend/` y `frontend/`, con sus propios `package.json` y `package-lock.json`. No hay workspace ni paquete npm raíz.
- Backend: TypeScript, ESM, AdonisJS 7, Lucid ORM, SQLite con `better-sqlite3`, VineJS y autenticación mediante access tokens. Tuyau y los hooks de Adonis generan registros y tipos.
- En backend, `start/` define rutas y middleware; `app/controllers/`, `app/validators/`, `app/models/` y `app/transformers/` separan las responsabilidades; `config/` contiene configuración y `database/migrations/` el esquema versionado.
- Frontend: TypeScript, ESM, React 19, Vite 8, CSS y Oxlint. `src/main.tsx` monta la aplicación con StrictMode y `src/App.tsx` contiene la plantilla inicial.
- No asumas que existen autenticación frontend, router, cliente HTTP, gestión de tokens, Tailwind o componentes shadcn/ui: no están implementados en el estado inicial.
- El backend tiene Japa configurado, pero no se encontraron casos de prueba. El frontend no tiene script ni infraestructura de pruebas.

## Restricción absoluta del backend

- No crees, edites, elimines, formatees ni regeneres ningún archivo dentro de `backend/`, incluidos configuración, dependencias, lockfile, archivos ignorados y artefactos generados.
- Consulta el backend únicamente para leer el contrato existente. Adapta el frontend a ese contrato.
- No ejecutes migraciones, seeds, comandos de generación, formateo, instalación ni comandos de arranque, build o pruebas del backend. Sus hooks pueden escribir archivos generados y su conexión SQLite no está aislada para pruebas.
- Si una tarea requiere modificar el backend, informa el impedimento y deja esa parte pendiente. No cambies el backend para facilitar el trabajo del frontend.

## Contrato de autenticación

Fuentes de referencia: `backend/start/routes.ts`, `backend/app/validators/user.ts`, los controladores, `backend/app/transformers/user_transformer.ts` y `backend/providers/api_provider.ts`.

| Método y ruta | Entrada y autenticación | Respuesta exitosa |
| --- | --- | --- |
| `POST /api/v1/auth/signup` | `fullName`, `email`, `password`, `passwordConfirmation` | `{ data: { user, token } }` |
| `POST /api/v1/auth/login` | `email`, `password` | `{ data: { user, token } }` |
| `GET /api/v1/account/profile` | Token mediante `Authorization: Bearer <token>` | `{ data: user }` |
| `POST /api/v1/account/logout` | Token mediante `Authorization: Bearer <token>` | `{ message: 'Logged out successfully' }` |

- En registro, `fullName` es una cadena o `null`; no está marcado como opcional, así que envía la propiedad incluso si no hay nombre.
- El email debe ser válido y tener como máximo 254 caracteres. En registro debe ser único.
- En registro, `password` y `passwordConfirmation` tienen entre 8 y 32 caracteres; la confirmación debe coincidir con el password.
- En login, el password se valida como cadena; no traslades automáticamente las restricciones de registro al login.
- Tanto signup como login devuelven un token. Léelo de `data.token`, no de la raíz de la respuesta.
- El usuario público contiene `id`, `fullName`, `email`, `createdAt`, `updatedAt` e `initials`. No expongas ni esperes un password en esa representación.
- Logout elimina el token actual y devuelve un mensaje sin envoltura `data`. No asumas que todas las respuestas usan la misma estructura.
- No inventes el formato de los errores ni asumas que tienen la envoltura de las respuestas exitosas. Revisa la implementación disponible y maneja explícitamente los errores de validación y autenticación.
- Vite no tiene proxy de API configurado. El README indica backend en `http://localhost:3333` y frontend en `http://localhost:5173`. CORS permite orígenes en desarrollo y usa una lista vacía en producción; la variable comentada `CORS_ORIGIN` no está conectada a esa configuración.

## Convenciones de TypeScript y React

- Mantén TypeScript y ESM; usa `import type` cuando corresponda.
- Sigue el estilo existente: dos espacios, comillas simples y ausencia de punto y coma. Conserva UTF-8 y finales LF.
- Usa componentes funcionales, nombres de componentes en PascalCase y variables, propiedades y funciones en camelCase.
- Respeta las reglas de hooks y la configuración existente de Oxlint. Conserva StrictMode.
- Respeta las comprobaciones TypeScript de variables y parámetros sin uso y evita ocultar problemas con supresiones o tipos `any` sin justificación.
- El frontend no declara `strict: true`; no describas esa opción como una garantía actual ni cambies la configuración para eludir errores.
- Utiliza la estructura y los estilos existentes como punto de partida. No presupongas aliases frontend, router o librerías de UI por aparecer en un ticket o en el README.
- El backend usa aliases `#...` y archivos en snake_case; esas convenciones no implican que los mismos aliases estén configurados en frontend.
- No apliques formateos masivos: el frontend no tiene formateador configurado.

## Preservación del entorno

- Revisa `git status --short` y el diff antes de editar para identificar cambios preexistentes. No los sobrescribas, reviertas, incluyas ni atribuyas a tu trabajo.
- El diagnóstico inicial encontró cambios locales en `backend/package.json`, `.env.example`, `database/schema.ts` y varios archivos de `.adonisjs/`. Verifica el estado actual sin intentar limpiarlo.
- No ejecutes operaciones destructivas de Git ni limpiezas de archivos para conseguir un árbol limpio.
- No expongas secretos, contraseñas, claves o tokens en respuestas, logs, código o commits. No copies valores de `.env` a archivos versionados. Las variables públicas de Vite no deben contener secretos.
- No edites manualmente `backend/.adonisjs/**` ni `backend/database/schema.ts`: son archivos generados y, además, están bajo la restricción absoluta del backend.
- No toques `backend/tmp/db.sqlite3`. La configuración actual apunta al mismo archivo SQLite también en pruebas; no presupongas aislamiento.
- No instales dependencias ni cambies lockfiles salvo autorización expresa para una tarea futura, limitada al frontend. La autorización no permite modificar el backend.
- Evita conversiones masivas LF/CRLF: Git ya ha advertido diferencias de finales de línea.

## Comprobaciones de calidad del frontend

Para tareas futuras que modifiquen código frontend, ejecuta desde `frontend/`, con las dependencias existentes:

```powershell
npm.cmd run lint
npm.cmd run build
```

- En este entorno Windows, `npm.ps1` está bloqueado por la política de ejecución; utiliza `npm.cmd` sin cambiar dicha política.
- Lint ejecuta Oxlint. Build ejecuta `tsc -b` y Vite; comprueba tipos y empaquetado, y escribe artefactos y cachés. No lo ejecutes cuando la tarea prohíba esas escrituras.
- No presentes lint o build como pruebas funcionales ni como cobertura de autenticación. No existe un comando de pruebas frontend configurado.
- Si faltan dependencias o falla una comprobación, informa el problema; no instales paquetes automáticamente ni debilites las reglas para hacerla pasar.
- Para cambios exclusivamente documentales, revisa el contenido y el diff. No es necesario ejecutar lint y build; indica que no se ejecutaron y por qué.

## Revisión y cierre obligatorio

- Antes de finalizar, revisa `git diff --check`, el diff de tu trabajo y `git status --short`. Inspecciona también los archivos nuevos, que no aparecen en el diff normal mientras no estén versionados.
- Confirma que los cambios corresponden al alcance solicitado, que no modificaste el backend y que no introdujiste secretos, dependencias o artefactos generados involuntarios.
- Distingue los cambios propios de los preexistentes y no intentes corregir estos últimos sin autorización.
- Informa qué cambió y qué verificaciones ejecutaste con su resultado. Declara los errores, las limitaciones, las verificaciones no realizadas y sus motivos. No afirmes que algo funciona si no se verificó.
- No implementes funcionalidades adicionales ni hagas commits, pushes o publicaciones salvo instrucción expresa.
