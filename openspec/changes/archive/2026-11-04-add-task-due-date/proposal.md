# Proposal

## Why

La lista dice quién está en qué, pero no si algo se ha pasado de plazo. Esta historia (FS-118, RF-13 a RF-15) añade una fecha de vencimiento opcional y una señal de vencida al abrir la tarea, sin convertir la lista en un tablero de plazos: comprometerse con una fecha solo cuando de verdad existe.

## What Changes

- **Fecha de vencimiento en la API:** fecha de calendario, sin hora y opcional, que se puede poner, cambiar y quitar. Quitarla es enviarla explícitamente vacía. Se admite al crear y al actualizar, también si ya ha pasado: nace vencida y no se rechaza.
- **Veredicto del backend:** toda representación de una tarea incluye el booleano `isOverdue`. Está vencida si tiene fecha, esa fecha es anterior a hoy y su estado no es `done`. Una fecha de hoy todavía no está vencida.
- **Día de quien mira:** el cliente puede enviar `today` en cualquier operación de tareas. Sin él, el servidor usa el día UTC, de modo que la API siempre da un veredicto.
- **Calculado en cada lectura:** `isOverdue` no se guarda en ninguna columna, no hay procesos programados y, si el cliente lo envía, se ignora.
- **Lectura individual, BREAKING respecto a la spec actual:** nace `GET /api/v1/tasks/:id`, que la spec `tasks` prohibía expresamente y es la superficie mínima que necesita «abrir la tarea».
- **Representación ampliada, BREAKING respecto a la spec actual:** la tarea gana `dueDate` e `isOverdue`, y la creación deja de tener en cuenta solo el título.
- **Diálogo de tarea en la web:** al pulsar el título de una fila se abre un diálogo modal con la fecha editable, «Quitar fecha» y la señal de vencida. El cambio se guarda solo y sin confirmación.
- **La lista no cambia lo que muestra:** sigue con título, responsable y estado, sin fecha ni marca, y el formulario de creación sigue pidiendo solo el título.

### Fuera de alcance

- Tests de cualquier tipo.
- Notificaciones, recordatorios y recurrencia.
- Ordenar o filtrar por fecha.
- La pantalla de detalle completa: el diálogo solo muestra el título, la fecha y la señal. Editar el título (RF-11) y borrar siguen fuera.

### Decisiones tomadas para este change

- **Diálogo modal para «abrir»:** ni entra en la lista ni crea una pantalla o una URL nuevas. A cambio, añade un componente generado de `ui/`.
- **`today` opcional, con UTC por defecto:** un cliente que no lo envíe recibe un veredicto en UTC sin saberlo. Solo altera su propia respuesta, porque nada se guarda.
- **Criterios `[PROPUESTO]` de FS-118 aceptados:** CA-4, CA-13, CA-14, CA-15, CA-16, CA-17, CA-18 y CA-20 pasan a ser requisitos. Conviene marcarlos como validados en la historia.
- **Fecha al crear solo por API:** RF-13 y CA-1 piden que el flujo de creación no ofrezca fecha, y así sigue en la pantalla. La API la admite, según lo decidido para este change; esto se aparta de la frase de RF-13 «se establece únicamente al abrir la tarea», que queda pendiente de actualizar en el PRD.
- **Vuelta atrás desde `done`:** la tarea vuelve a estar vencida si su fecha ya pasó. Se deriva de la regla y resuelve para este caso lo que FS-118 dejaba pendiente de PA-7.

### Puntos abiertos

- **Detalle completo de la tarea (PA-6):** cuando se aborde, hay que decidir si sustituye al diálogo o lo amplía.
- **Dos personas cambiando la fecha a la vez (PA-8):** sin decidir. Mientras tanto, gana la última escritura.

## Capabilities

### New Capabilities

Ninguna. La fecha y el vencimiento pertenecen a la tarea.

### Modified Capabilities

- `tasks`: la superficie de la API pasa a cuatro operaciones, la tarea gana `dueDate` e `isOverdue`, la creación y la actualización admiten la fecha, y la web gana el diálogo de tarea.

## Impact

- **Backend:** una migración con regeneración de `database/schema.ts`, y cambios en el modelo `Task`, los validadores, `TaskTransformer`, `TasksController`, las rutas y el código generado de `.adonisjs/`.
- **Frontend:** `lib/api.ts` y `lib/types.ts`, `pages/task-list-page.tsx`, un `components/task-dialog.tsx` nuevo y `components/ui/dialog.tsx`, generado con shadcn.
- **API:** una operación nueva, dos campos nuevos en toda tarea y el parámetro opcional `today`. Es aditivo para los clientes existentes.
- **Dependencias:** ninguna prevista; `radix-ui` ya está instalado.
- **Datos:** una columna nueva y nula en `tasks`; las tareas existentes quedan sin fecha.
