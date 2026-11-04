# Tasks

## 1. Datos del backend

- [x] 1.1 Crear la migración de `tasks` con `title` (255), `status` (enum `pending`, `in_progress`, `done`, por defecto `pending`), `assignee_id` (no nulo, con clave foránea a `users.id`) y timestamps, sin columnas de vencimiento ni de creador; verificar con `node ace migration:run` que `database/schema.ts` se regenera con `TaskSchema`
- [x] 1.2 Crear `app/models/task.ts` extendiendo `TaskSchema`, con la relación `assignee` hacia `User`, y `npm run typecheck` sin errores

## 2. API de tareas

- [x] 2.1 Crear `app/validators/task.ts` con la constante de estados y los validadores de creación y actualización, confirmando antes en los `.d.ts` las firmas de `exists`, `vine.enum` y `vine.number`; verificar con `npm run typecheck`
- [x] 2.2 Crear `app/transformers/task_transformer.ts` y su transformer de responsable, que expongan solo `id`, `title`, `status` y `assignee: { id, fullName }`; verificar con `npm run typecheck`
- [x] 2.3 Crear `TasksController` con `index` sin `orderBy`, `store` con el responsable tomado de la sesión y `update` con `findOrFail`, cargando `assignee` antes de serializar; verificar con `npm run typecheck`
- [x] 2.4 Añadir a `start/routes.ts` las tres rutas bajo `/api/v1/tasks` con `middleware.auth()` y `:id` numérico; verificar con `node ace list:routes` que hay exactamente `GET` y `POST /tasks` y `PATCH /tasks/:id`, y commitear con el resto del change el diff regenerado de `.adonisjs/`
- [x] 2.5 Recorrer con `curl` contra el dev server, sin añadir tests, los escenarios de API de la spec: 401 sin token, 404 en `GET` y `DELETE /tasks/:id` y en un id inexistente, 422 por título vacío, en blanco o de 256 caracteres, 200 con 255, 422 por `status` "blocked" o "Pendiente", por `assigneeId` inexistente o nulo y por cuerpo vacío, y `status` y `assigneeId` ignorados al crear
- [x] 2.6 Ejecutar `npm run lint` en `backend/` y confirmar que termina sin errores

## 3. Cliente de API en el frontend

- [x] 3.1 Añadir `Task`, `TaskStatus` y los payloads a `lib/types.ts`, y `PATCH`, `listTasks`, `createTask` y `updateTask` a `lib/api.ts`; verificar con `npm run build`
- [x] 3.2 Ampliar en `lib/api.ts` las etiquetas de campo y `translate` para `database.exists` y `minLength` con mínimo 1, de modo que un título vacío o en blanco muestre «Falta rellenar el título.»; verificar con `npm run build`

## 4. Pantalla de tareas

- [x] 4.1 Crear `pages/task-list-page.tsx` con la carga inicial, los estados de carga y de error, y la explicación de lista vacía, y añadir `/tasks` dentro de `ProtectedRoute`; verificar en el navegador que sin sesión redirige a `/login` y que un fallo al cargar no se presenta como lista vacía
- [x] 4.2 Pintar las filas con título, responsable (`fullName ?? 'Sin nombre'`) y estado, sin fechas, correo ni id y sin ordenar en cliente; verificar en el navegador con una cuenta con nombre y otra sin él
- [x] 4.3 Añadir el formulario de un solo campo con `useAuthForm(['title'])`, que vuelva a pedir la lista y vacíe el campo al crear; verificar en el navegador la tarea nueva sin recargar y los errores junto al campo con el campo vacío, solo espacios y más de 255 caracteres
- [x] 4.4 Añadir a cada fila los tres botones de estado, con cambio optimista, sustitución en su sitio y restauración con alerta si falla; verificar en el navegador con una tarea ajena y con el backend parado
- [x] 4.5 Añadir a cada fila el `<select>` nativo de responsable con los responsables distintos de la lista cargada, con la misma gestión de fallo; verificar en el navegador que una persona sin tareas no aparece y que un sin nombre se ofrece como «Sin nombre»
- [x] 4.6 Añadir el enlace a `/tasks` en `pages/profile-page.tsx` y el enlace a `/profile` en la lista; verificar en el navegador que funcionan en los dos sentidos
- [x] 4.7 Implementar en `AuthProvider`, `PublicOnlyRoute` y `RegisterPage` el destino de login y el registro sin sesión, según `design.md`; verificar en el navegador que el login llega a `/tasks`, que el registro llega a `/login` sin sesión ni token guardado y con el aviso de cuenta creada, que el aviso cede ante un error de credenciales y desaparece al recargar, y que abrir `/login`, `/register`, `/` o una dirección desconocida con sesión sigue llevando a `/profile`
- [x] 4.8 Ejecutar `npm run lint` y `npm run build` en `frontend/` y confirmar que terminan sin errores

## 5. Comprobación de conjunto

- [ ] 5.1 Recorrer el flujo completo con dos cuentas en el navegador, una con nombre y otra sin él: las dos ven la misma lista, cada una cambia estado y responsable de tareas de la otra, y tras recargar los cambios persisten
- [ ] 5.2 Confirmar con `git diff` que `package.json` y `package-lock.json` no cambian, que no se añade ningún fichero de test, que `components/ui/` queda intacto y que no aparece vencimiento en código ni en respuestas
- [ ] 5.3 Ejecutar `openspec validate add-task-list --strict` y confirmar que pasa

## Workflow follow-up

- Hacer el commit con `/commit`, abrir el PR con `gh pr create` y pasar el subagente `adversarial-reviewer`, según `CLAUDE.md`.
- Archivar el change con `/opsx:archive` cuando se haya revisado.
