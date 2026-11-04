# Spec Delta

## ADDED Requirements

### Requirement: Fecha de vencimiento de una tarea

El sistema SHALL guardar en cada tarea una fecha de vencimiento opcional, de calendario y sin hora, en formato `YYYY-MM-DD`. La fecha SHALL poderse poner, cambiar y quitar en `PATCH /api/v1/tasks/:id`, y quitarla SHALL hacerse enviándola explícitamente vacía. Cualquier persona con sesión SHALL poder hacerlo en cualquier tarea.

#### Scenario: Poner una fecha

- **WHEN** se envía `dueDate` "2026-12-01" sobre una tarea sin fecha
- **THEN** la respuesta es 200 y la tarea queda con esa fecha

#### Scenario: Cambiar la fecha

- **WHEN** se envía otra `dueDate` válida sobre una tarea con fecha
- **THEN** la respuesta es 200 y la tarea queda con la fecha nueva

#### Scenario: Quitar la fecha con un valor nulo

- **WHEN** se envía `dueDate` nulo sobre una tarea con fecha
- **THEN** la respuesta es 200 y la tarea queda con `dueDate` nulo

#### Scenario: Quitar la fecha con un valor vacío

- **WHEN** se envía `dueDate` como cadena vacía sobre una tarea con fecha
- **THEN** la respuesta es 200 y la tarea queda con `dueDate` nulo

#### Scenario: No enviar la fecha no la cambia

- **WHEN** se envía una actualización de `status` sin la clave `dueDate`
- **THEN** la fecha de la tarea no cambia

#### Scenario: Una fecha ya pasada se acepta

- **WHEN** se envía `dueDate` anterior a hoy
- **THEN** la respuesta es 200 y la tarea queda con esa fecha

#### Scenario: Fecha no válida

- **WHEN** se envía `dueDate` como una fecha inexistente, con hora, como texto libre o como número
- **THEN** la respuesta es 422 con un error sobre `dueDate` y la tarea conserva la fecha que tuviera

#### Scenario: La fecha de una tarea ajena

- **WHEN** una persona con sesión cambia la fecha de una tarea cuyo responsable es otra persona
- **THEN** la respuesta es 200 y el cambio se aplica

#### Scenario: Reasignar no toca la fecha

- **WHEN** se cambia el responsable de una tarea con fecha
- **THEN** la fecha y su veredicto no cambian

### Requirement: Regla de vencimiento

El sistema SHALL devolver `isOverdue` verdadero si y solo si la tarea tiene fecha, esa fecha es anterior al día de referencia y su estado no es `done`.

#### Scenario: Fecha de ayer sin terminar

- **WHEN** una tarea en `pending` o `in_progress` tiene fecha anterior al día de referencia
- **THEN** `isOverdue` es verdadero

#### Scenario: Vence hoy

- **WHEN** una tarea sin terminar tiene como fecha el día de referencia
- **THEN** `isOverdue` es falso

#### Scenario: Fecha futura

- **WHEN** una tarea tiene fecha posterior al día de referencia
- **THEN** `isOverdue` es falso

#### Scenario: Sin fecha

- **WHEN** una tarea sin terminar no tiene fecha, por antigua que sea
- **THEN** `isOverdue` es falso

#### Scenario: Hecha con la fecha pasada

- **WHEN** una tarea en `done` tiene fecha anterior al día de referencia
- **THEN** `isOverdue` es falso

#### Scenario: Pasar a hecha

- **WHEN** una tarea vencida pasa a `done`
- **THEN** `isOverdue` es falso y `dueDate` no cambia

#### Scenario: Volver atrás desde hecha

- **WHEN** una tarea en `done` con la fecha pasada vuelve a `pending`
- **THEN** `isOverdue` es verdadero

#### Scenario: Aplazar la fecha

- **WHEN** una tarea vencida recibe una fecha posterior al día de referencia
- **THEN** `isOverdue` es falso

#### Scenario: Quitar la fecha de una tarea vencida

- **WHEN** se quita la fecha de una tarea vencida
- **THEN** `isOverdue` es falso

### Requirement: Día de referencia del vencimiento

El sistema SHALL calcular `isOverdue` con el parámetro de consulta opcional `today`, en formato `YYYY-MM-DD`, en las cuatro operaciones de tareas. Sin `today`, SHALL usar el día UTC del servidor. Un `today` no válido SHALL rechazarse con 422 sobre `today`, sin aplicar ningún cambio.

#### Scenario: Dos personas en husos distintos

- **WHEN** se pide una tarea sin terminar con fecha "2026-11-04", una vez con `today` "2026-11-05" y otra con `today` "2026-11-04"
- **THEN** la primera respuesta trae `isOverdue` verdadero y la segunda falso, y la tarea es la misma

#### Scenario: Sin día de referencia

- **WHEN** se pide una operación de tareas sin `today`
- **THEN** la respuesta trae `isOverdue` calculado con el día UTC del servidor

#### Scenario: Día de referencia no válido al leer

- **WHEN** se pide la lista con `today` "ayer"
- **THEN** la respuesta es 422 con un error sobre `today`

#### Scenario: Día de referencia no válido al escribir

- **WHEN** se envía una creación o una actualización por lo demás válida con `today` "2026-02-30"
- **THEN** la respuesta es 422 con un error sobre `today`, no se crea ninguna tarea y la tarea existente no cambia

### Requirement: El vencimiento se calcula al leer

El sistema SHALL calcular `isOverdue` en cada respuesta, sin guardarlo en ninguna columna y sin procesos programados que marquen tareas. SHALL ignorar cualquier `isOverdue` enviado por el cliente.

#### Scenario: Vence sola

- **WHEN** nadie modifica una tarea con fecha "2026-11-04" y se pide con `today` "2026-11-04" y después con `today` "2026-11-05"
- **THEN** `isOverdue` pasa de falso a verdadero

#### Scenario: Enviar el veredicto al crear o actualizar

- **WHEN** se envía una creación o una actualización válida con un `isOverdue` que no corresponde a su fecha
- **THEN** el valor enviado se ignora y la respuesta trae el veredicto calculado

#### Scenario: Enviar solo el veredicto

- **WHEN** se envía una actualización cuyo único campo es `isOverdue`
- **THEN** la respuesta es 422 y la tarea no cambia

### Requirement: Lectura individual de una tarea

El sistema SHALL devolver en `GET /api/v1/tasks/:id` la tarea indicada, con la misma representación que el resto de operaciones, a cualquier persona con sesión.

#### Scenario: Leer una tarea

- **WHEN** una persona con sesión pide una tarea que existe, sea o no su responsable
- **THEN** la respuesta es 200 con la tarea en `data`

#### Scenario: Id no numérico

- **WHEN** se pide `GET /api/v1/tasks/abc`
- **THEN** la respuesta es 404

### Requirement: Apertura de una tarea

La aplicación web SHALL abrir un diálogo modal al activar el título de una fila, con el título, la fecha de vencimiento y la señal de vencida, usando una lectura individual reciente en cada apertura. El diálogo SHALL poder usarse y cerrarse con teclado. La lista SHALL seguir sin mostrar fechas ni marcas de vencida.

#### Scenario: Abrir desde la lista

- **WHEN** una persona activa el título de una fila, con el ratón o con el teclado
- **THEN** se abre el diálogo de esa tarea sobre la lista, sin cambiar de dirección

#### Scenario: Volver a abrir

- **WHEN** una persona cierra el diálogo y lo vuelve a abrir
- **THEN** la tarea se pide de nuevo al servidor

#### Scenario: Cerrar

- **WHEN** una persona pulsa el botón de cerrar o la tecla Escape
- **THEN** el diálogo se cierra y la lista sigue en la misma posición

#### Scenario: La lista no asoma la fecha

- **WHEN** hay tareas con fecha, algunas vencidas, y una persona mira la lista antes o después de abrir el diálogo
- **THEN** la lista no muestra ninguna fecha ni ninguna marca de vencida

#### Scenario: Fallo al abrir

- **WHEN** la lectura de la tarea falla al abrir el diálogo
- **THEN** la persona ve un mensaje de error en castellano y ningún campo de fecha

### Requirement: Edición de la fecha en el diálogo

La aplicación web SHALL permitir en el diálogo poner, cambiar y quitar la fecha de cualquier tarea. El cambio SHALL guardarse sin paso de guardado y sin confirmación, y al cerrar SHALL estar ya guardado. El flujo de creación SHALL seguir sin ofrecer ni sugerir una fecha.

#### Scenario: Poner una fecha

- **WHEN** una persona indica una fecha en una tarea sin ella
- **THEN** la fecha queda guardada y la señal refleja el veredicto sin recargar ni reabrir

#### Scenario: Poner una fecha ya pasada

- **WHEN** una persona indica una fecha anterior a hoy en una tarea sin terminar
- **THEN** la fecha se acepta y la señal de vencida aparece de inmediato

#### Scenario: Quitar la fecha

- **WHEN** una persona pulsa "Quitar fecha"
- **THEN** la tarea queda sin fecha de inmediato, sin diálogo de confirmación, y la señal desaparece si estaba

#### Scenario: Cerrar justo después de cambiarla

- **WHEN** una persona cambia la fecha y cierra el diálogo enseguida
- **THEN** al volver a abrir la tarea, la fecha es la nueva

#### Scenario: Fecha imposible o incompleta

- **WHEN** una persona deja el campo con una fecha que no existe o está a medias
- **THEN** ve junto al campo un mensaje en castellano, y la tarea conserva la fecha que tuviera

#### Scenario: Fallo al guardar

- **WHEN** el servidor rechaza el cambio o no se puede contactar con él
- **THEN** la persona ve un mensaje de error en castellano en el diálogo, que sigue abierto, y la tarea conserva su fecha anterior

#### Scenario: Tarea de otra persona

- **WHEN** una persona cambia la fecha de una tarea cuyo responsable es otra
- **THEN** el cambio se aplica igual que en una tarea propia, sin permiso especial ni advertencia

### Requirement: Señal de tarea vencida

La aplicación web SHALL indicar en el diálogo que una tarea está vencida con una señal propia, con el texto "Vencida" y sin depender solo del color, a partir del `isOverdue` de la API. No SHALL calcular el veredicto por su cuenta. Una tarea sin fecha no SHALL recibir ningún aviso ni indicación de que le falte algo.

#### Scenario: Tarea vencida

- **WHEN** una persona abre una tarea con `isOverdue` verdadero
- **THEN** ve "Vencida" sin tener que comparar la fecha con el día de hoy

#### Scenario: Vence hoy o más adelante

- **WHEN** una persona abre una tarea sin terminar cuya fecha es hoy o posterior
- **THEN** ve la fecha y no ve la señal

#### Scenario: Tarea hecha con la fecha pasada

- **WHEN** una persona abre una tarea en "Hecho" con la fecha pasada
- **THEN** ve la fecha y no ve la señal

#### Scenario: Tarea sin fecha

- **WHEN** una persona abre una tarea sin fecha
- **THEN** ve el campo vacío, sin señal, aviso ni recordatorio

### Requirement: Día de quien mira en la web

La aplicación web SHALL enviar su día local como `today` en todas las peticiones de tareas, calculado en el momento de cada petición, para que el veredicto corresponda al día de quien mira.

#### Scenario: Lecturas distintas en husos distintos

- **WHEN** dos personas abren a la vez una tarea cuya fecha ya pasó para una y todavía es hoy para la otra
- **THEN** la primera ve la señal y la segunda no

#### Scenario: Pasa la medianoche

- **WHEN** pasa la medianoche local con la aplicación abierta y la persona vuelve a abrir una tarea que vencía ese día
- **THEN** ve la señal de vencida sin que nadie haya modificado nada

## MODIFIED Requirements

### Requirement: Superficie de la API de tareas

El sistema SHALL ofrecer exactamente cuatro operaciones de tareas: `GET /api/v1/tasks` para listar, `GET /api/v1/tasks/:id` para leer una, `POST /api/v1/tasks` para crear y `PATCH /api/v1/tasks/:id` para actualizar. No SHALL existir borrado ni endpoints de equipo.

#### Scenario: Lectura individual inexistente

- **WHEN** una persona con sesión pide `GET /api/v1/tasks/:id` de un id numérico que no corresponde a ninguna tarea
- **THEN** la respuesta es 404

#### Scenario: Borrado inexistente

- **WHEN** una persona con sesión pide `DELETE /api/v1/tasks/:id` de una tarea que existe
- **THEN** la respuesta es 404 y la tarea sigue en la lista

### Requirement: Acceso autenticado a las tareas

El sistema SHALL exigir un token vigente en las cuatro operaciones de tareas y responder 401 sin revelar ni modificar ninguna tarea cuando falte o no sea válido.

#### Scenario: Listar sin sesión

- **WHEN** se pide `GET /api/v1/tasks` sin token
- **THEN** la respuesta es 401 y no contiene ninguna tarea

#### Scenario: Leer una tarea sin sesión

- **WHEN** se pide `GET /api/v1/tasks/:id` de una tarea que existe y sin token
- **THEN** la respuesta es 401 y no contiene datos de la tarea

#### Scenario: Crear con un token revocado

- **WHEN** se envía `POST /api/v1/tasks` con un título válido y un token ya revocado
- **THEN** la respuesta es 401 y no se crea ninguna tarea

#### Scenario: Actualizar sin sesión

- **WHEN** se envía `PATCH /api/v1/tasks/:id` con un estado válido y sin token
- **THEN** la respuesta es 401 y la tarea no cambia

### Requirement: Representación de una tarea

El sistema SHALL representar cada tarea con exactamente los campos `id`, `title`, `status`, `dueDate`, `isOverdue` y `assignee`, donde `assignee` contiene solo `id` y `fullName`. Las respuestas SHALL ir envueltas en `{ "data": ... }`.

#### Scenario: Datos mínimos del responsable

- **WHEN** una respuesta de tareas incluye una tarea
- **THEN** su `assignee` trae `id` y `fullName`, sin correo, contraseña, iniciales ni fechas de la cuenta

#### Scenario: Sin fechas en la tarea

- **WHEN** una respuesta de tareas incluye una tarea sin fecha de vencimiento
- **THEN** su `dueDate` es `null` y la tarea no trae ninguna otra fecha

#### Scenario: La fecha de vencimiento es la única fecha

- **WHEN** una respuesta de tareas incluye una tarea
- **THEN** `dueDate` es una fecha `YYYY-MM-DD` o `null`, sin hora, y la tarea no trae ninguna otra fecha

#### Scenario: Toda tarea trae su veredicto

- **WHEN** cualquier operación de tareas devuelve una tarea, en una lista o sola
- **THEN** la tarea trae `isOverdue` como booleano, nunca nulo ni ausente

### Requirement: Creación de tarea por API

El sistema SHALL crear una tarea cuando `POST /api/v1/tasks` recibe un `title` válido, y responder 200 con la tarea creada en `data`. El `title` y el `dueDate` opcional SHALL ser lo único que la operación tiene en cuenta.

#### Scenario: Creación solo con título

- **WHEN** se envía una creación con `title` "Revisar el contrato"
- **THEN** la respuesta es 200 y `data` contiene esa tarea, que aparece después en la lista

#### Scenario: Espacios alrededor del título

- **WHEN** se envía una creación con `title` "  Revisar el contrato  "
- **THEN** la tarea se guarda con el título "Revisar el contrato"

#### Scenario: Crear sin fecha

- **WHEN** se envía una creación solo con `title`, o con `dueDate` nulo o vacío
- **THEN** la tarea tiene `dueDate` nulo e `isOverdue` falso

#### Scenario: Crear con una fecha ya pasada

- **WHEN** se envía una creación con `dueDate` anterior a hoy
- **THEN** la respuesta es 200 y la tarea nace con esa fecha e `isOverdue` verdadero

#### Scenario: Crear con una fecha imposible

- **WHEN** se envía una creación con `dueDate` "2026-02-30"
- **THEN** la respuesta es 422 con un error sobre `dueDate` y no se crea ninguna tarea

### Requirement: Actualización de tarea por API

El sistema SHALL actualizar el estado, el responsable, la fecha de vencimiento o cualquier combinación cuando `PATCH /api/v1/tasks/:id` recibe `status`, `assigneeId` o `dueDate`, y responder 200 con la tarea actualizada en `data`. Cualquier persona con sesión SHALL poder actualizar cualquier tarea, sin que importe quién la creó ni quién la lleva.

#### Scenario: Cambiar el estado de una tarea ajena

- **WHEN** una persona con sesión envía `status` "in_progress" sobre una tarea cuyo responsable es otra persona
- **THEN** la respuesta es 200, la tarea queda en `in_progress` y su responsable no cambia

#### Scenario: Cambiar el responsable de una tarea ajena

- **WHEN** una persona con sesión envía el `assigneeId` de cualquier persona registrada sobre una tarea que no lleva
- **THEN** la respuesta es 200, `assignee` pasa a ser esa persona y el estado no cambia

#### Scenario: Cambiar ambos a la vez

- **WHEN** se envían un `status` y un `assigneeId` válidos
- **THEN** la respuesta es 200 y la tarea refleja los dos cambios

#### Scenario: Volver atrás desde Hecho

- **WHEN** se envía `status` "pending" sobre una tarea en `done`
- **THEN** la respuesta es 200 y la tarea queda en `pending`

#### Scenario: Ningún campo actualizable

- **WHEN** se envía una actualización sin `status`, `assigneeId` ni `dueDate`
- **THEN** la respuesta es 422 y la tarea no cambia

#### Scenario: El título no se actualiza

- **WHEN** se envía una actualización con un `status` válido y un `title` distinto
- **THEN** el estado cambia y el título se conserva

#### Scenario: Tarea inexistente

- **WHEN** se envía una actualización válida sobre un id que no corresponde a ninguna tarea
- **THEN** la respuesta es 404

#### Scenario: Responsable inexistente

- **WHEN** se envía un `assigneeId` que no corresponde a ninguna persona registrada
- **THEN** la respuesta es 422 con un error sobre `assigneeId` y la tarea no cambia

#### Scenario: Responsable nulo

- **WHEN** se envía `assigneeId` nulo
- **THEN** la respuesta es 422 con un error sobre `assigneeId` y la tarea conserva su responsable
