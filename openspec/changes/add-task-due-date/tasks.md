# Tasks

## 1. Datos y regla

- [x] 1.1 Crear con `node ace make:migration` la columna `due_date` (`date`, nula) en `tasks`; verificar con `node ace migration:run` sobre una base con tareas que siguen válidas, que `database/schema.ts` se regenera con `dueDate` y que `migration:rollback` seguido de `migration:run` funciona
- [x] 1.2 Añadir `isOverdueOn(today)` al modelo `Task`; verificar con `npm run typecheck` y, en `node ace repl` o con los recorridos de la tarea 2.6, los bordes de día anterior, mismo día, día posterior, sin fecha y `done`

## 2. API

- [x] 2.1 Añadir a `app/validators/task.ts` la regla de fecha, `dueDate` en creación y actualización, y `viewerDayValidator`, ajustando la condición de campo requerido y confirmando la firma de `validateUsing` con `data`; verificar con `npm run typecheck`
- [x] 2.2 Pasar a `TaskTransformer` el día de referencia y exponer `dueDate` (`YYYY-MM-DD` o `null`) e `isOverdue`, llamando a la regla del modelo; verificar con `npm run typecheck`
- [x] 2.3 Añadir `show` a `TasksController`, resolver `today` antes de cualquier escritura en las cuatro operaciones y aplicar `dueDate` en `store` y `update` sin tocarla si la clave no llega; verificar con `npm run typecheck`
- [x] 2.4 Añadir a `start/routes.ts` `GET /tasks/:id` con `:id` numérico dentro del grupo autenticado; verificar con `node ace list:routes` que hay exactamente cuatro rutas de tareas, y que `.adonisjs/` queda regenerado para commitearlo con el resto
- [x] 2.5 Confirmar la conversión de fecha con el servidor arrancado con `TZ=America/New_York`: `dueDate` "2026-11-04" se devuelve igual y el veredicto con `today` no cambia respecto a `TZ=UTC`
- [x] 2.6 Recorrer con `curl`, sin añadir tests, los escenarios de API de la spec: 401 y 404 en la lectura individual, 404 en `DELETE`, poner, cambiar y quitar con `null` y con `""`, fecha pasada al crear y al actualizar, `2026-02-30` y fecha con hora con 422, los bordes de `isOverdue` con `today`, `done` y vuelta atrás, `today` no válido sin dejar cambios, sin `today` con UTC, e `isOverdue` enviado e ignorado
- [x] 2.7 Ejecutar `npm run lint` y `npm run typecheck` en `backend/` y confirmar que terminan sin errores

## 3. Cliente de API en el frontend

- [x] 3.1 Añadir `dueDate` e `isOverdue` a `Task` y `dueDate` a `UpdateTaskPayload` en `lib/types.ts`, y en `lib/api.ts` `getTask` y `today` con el día local en todas las peticiones de tareas; verificar con `npm run build` y en la pestaña de red que el día enviado es el local con un huso distinto de UTC
- [x] 3.2 Añadir a `lib/api.ts` la etiqueta de `dueDate` y la regla `date` en `translate`; verificar con `npm run build`

## 4. Diálogo de tarea

- [x] 4.1 Generar `components/ui/dialog.tsx` con `npx shadcn@latest add dialog`, sin editarlo; verificar con `git diff` que `package.json` y `package-lock.json` no cambian
- [x] 4.2 Crear `components/task-dialog.tsx` con la lectura individual, los estados de carga y error, y hacer del título de cada fila un botón que lo abra, sin tocar lo que la lista muestra; verificar en el navegador que abre con ratón y teclado, que Escape cierra, que no cambia la URL y que un fallo al abrir no muestra el campo
- [x] 4.3 Añadir el campo de fecha con guardado automático en orden, distinguiendo `badInput` de campo vacío, con espera tras cada cambio y guardado al perder el foco o cerrar; verificar en el navegador que al teclear no se guardan fechas intermedias, que al cerrar enseguida queda guardada y que una fecha incompleta muestra el error y conserva la anterior
- [x] 4.4 Añadir «Quitar fecha» sin confirmación y la gestión de fallos de guardado; verificar en el navegador que quita de inmediato y que, con el backend parado, el diálogo sigue abierto con el error y al recargar la fecha no ha cambiado
- [x] 4.5 Añadir la señal «Vencida» a partir de `isOverdue`; verificar en el navegador que aparece con fecha pasada al guardarla, que no aparece con fecha de hoy, futura, sin fecha ni en una tarea en «Hecho», y que no se calcula nada en el cliente
- [x] 4.6 Ejecutar `npm run lint` y `npm run build` en `frontend/` y confirmar que terminan sin errores

## 5. Comprobación de conjunto

- [x] 5.1 Recorrer el flujo con dos cuentas en el navegador: una pone la fecha en una tarea de la otra, reasignar no la cambia, pasar a «Hecho» quita la señal y volver atrás la devuelve, y con dos husos simulados se ven lecturas distintas
- [x] 5.2 Confirmar en el navegador que la lista y el formulario de creación no muestran ni sugieren ninguna fecha ni marca, antes y después de usar el diálogo
- [x] 5.3 Confirmar con `git diff` que `package.json` y `package-lock.json` no cambian, que no se añade ningún fichero de test y que no hay columna, job ni proceso para `isOverdue`
- [x] 5.4 Ejecutar `openspec validate add-task-due-date --strict` y confirmar que pasa

## Workflow follow-up

- Hacer el commit con `/commit`, abrir el PR con `gh pr create` y pasar el subagente `adversarial-reviewer`, según `CLAUDE.md`.
- Actualizar el PRD (RF-13 sobre la fecha al crear) y la historia FS-118 (criterios `[PROPUESTO]` validados).
- Archivar el change con `/opsx:archive` cuando se haya revisado.
