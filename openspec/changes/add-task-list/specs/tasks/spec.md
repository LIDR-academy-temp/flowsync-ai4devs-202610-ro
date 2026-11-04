# Spec Delta

## Purpose

Da al equipo una única lista compartida de tareas, con su título, responsable y estado a la vista, para saber quién está en qué sin preguntar. Cubre la API HTTP y la pantalla de la aplicación web.

## ADDED Requirements

### Requirement: Superficie de la API de tareas

El sistema SHALL ofrecer exactamente tres operaciones de tareas: `GET /api/v1/tasks` para listar, `POST /api/v1/tasks` para crear y `PATCH /api/v1/tasks/:id` para actualizar. No SHALL existir lectura individual, borrado ni endpoints de equipo.

#### Scenario: Lectura individual inexistente

- **WHEN** una persona con sesión pide `GET /api/v1/tasks/:id` de una tarea que existe
- **THEN** la respuesta es 404 y no incluye datos de la tarea

#### Scenario: Borrado inexistente

- **WHEN** una persona con sesión pide `DELETE /api/v1/tasks/:id` de una tarea que existe
- **THEN** la respuesta es 404 y la tarea sigue en la lista

### Requirement: Acceso autenticado a las tareas

El sistema SHALL exigir un token vigente en las tres operaciones de tareas y responder 401 sin revelar ni modificar ninguna tarea cuando falte o no sea válido.

#### Scenario: Listar sin sesión

- **WHEN** se pide `GET /api/v1/tasks` sin token
- **THEN** la respuesta es 401 y no contiene ninguna tarea

#### Scenario: Crear con un token revocado

- **WHEN** se envía `POST /api/v1/tasks` con un título válido y un token ya revocado
- **THEN** la respuesta es 401 y no se crea ninguna tarea

#### Scenario: Actualizar sin sesión

- **WHEN** se envía `PATCH /api/v1/tasks/:id` con un estado válido y sin token
- **THEN** la respuesta es 401 y la tarea no cambia

### Requirement: Representación de una tarea

El sistema SHALL representar cada tarea con exactamente los campos `id`, `title`, `status` y `assignee`, donde `assignee` contiene solo `id` y `fullName`. Las respuestas SHALL ir envueltas en `{ "data": ... }`.

#### Scenario: Datos mínimos del responsable

- **WHEN** una respuesta de tareas incluye una tarea
- **THEN** su `assignee` trae `id` y `fullName`, sin correo, contraseña, iniciales ni fechas de la cuenta

#### Scenario: Sin fechas en la tarea

- **WHEN** una respuesta de tareas incluye una tarea
- **THEN** la tarea no trae fecha de vencimiento ni ninguna otra fecha

### Requirement: Lista única compartida por API

El sistema SHALL devolver en `GET /api/v1/tasks` todas las tareas existentes, sin filtrar por la persona que pregunta ni por su relación con la tarea, sin paginar y sin aplicar ningún criterio explícito de ordenación.

#### Scenario: Dos personas ven el mismo conjunto

- **WHEN** dos personas con sesión distintas piden la lista sin que nada cambie entre medias
- **THEN** ambas reciben el mismo conjunto de tareas

#### Scenario: La tarea de otra persona está en la lista

- **WHEN** otra persona crea una tarea y yo pido la lista
- **THEN** esa tarea aparece en mi respuesta

#### Scenario: No hay forma de crear una tarea privada

- **WHEN** se envía una creación con un campo adicional como `private` con valor `true`
- **THEN** el campo se ignora y la tarea creada aparece en la lista de cualquier persona

#### Scenario: Ningún rol ve más ni menos

- **WHEN** cualquier persona registrada pide la lista
- **THEN** recibe la lista entera, sin contenido reservado ni omitido por rol

#### Scenario: Sin tareas

- **WHEN** se pide la lista y no existe ninguna tarea
- **THEN** la respuesta es 200 con `data` como lista vacía

#### Scenario: Listar no modifica nada

- **WHEN** se pide la lista repetidas veces
- **THEN** ninguna tarea cambia de estado ni de responsable

### Requirement: Creación de tarea por API

El sistema SHALL crear una tarea cuando `POST /api/v1/tasks` recibe un `title` válido, y responder 200 con la tarea creada en `data`. El `title` SHALL ser lo único que la operación tiene en cuenta.

#### Scenario: Creación solo con título

- **WHEN** se envía una creación con `title` "Revisar el contrato"
- **THEN** la respuesta es 200 y `data` contiene esa tarea, que aparece después en la lista

#### Scenario: Espacios alrededor del título

- **WHEN** se envía una creación con `title` "  Revisar el contrato  "
- **THEN** la tarea se guarda con el título "Revisar el contrato"

### Requirement: Valores iniciales de una tarea

El sistema SHALL crear toda tarea en estado `pending` y con la persona autenticada como responsable, e ignorar cualquier estado o responsable enviado en la creación.

#### Scenario: Nace a nombre de quien la crea

- **WHEN** una persona con sesión crea una tarea indicando solo el título
- **THEN** el `assignee` de la tarea es esa persona

#### Scenario: Nace pendiente

- **WHEN** una persona con sesión crea una tarea indicando solo el título
- **THEN** el `status` de la tarea es `pending`

#### Scenario: Estado y responsable enviados se ignoran

- **WHEN** se envía una creación con un título válido, `status` "done" y el `assigneeId` de otra persona
- **THEN** la tarea queda en `pending` y su `assignee` es quien la crea

### Requirement: Validación del título

El sistema SHALL rechazar con 422 y un error sobre el campo `title` cualquier creación cuyo título falte, quede en blanco tras quitar los espacios exteriores, no sea texto o supere los 255 caracteres, sin crear ninguna tarea y sin recortar el título.

#### Scenario: Sin título

- **WHEN** se envía una creación sin `title`
- **THEN** la respuesta es 422 con un error sobre `title` y no se crea ninguna tarea

#### Scenario: Título vacío

- **WHEN** se envía una creación con `title` vacío o nulo
- **THEN** la respuesta es 422 con un error sobre `title` y no se crea ninguna tarea

#### Scenario: Título solo con espacios

- **WHEN** se envía una creación con `title` "     "
- **THEN** la respuesta es 422 con un error sobre `title` y la lista no gana ninguna fila sin texto

#### Scenario: Título que no es texto

- **WHEN** se envía una creación con `title` numérico
- **THEN** la respuesta es 422 con un error sobre `title` y no se crea ninguna tarea

#### Scenario: Título en el límite

- **WHEN** se envía una creación con un `title` de 255 caracteres
- **THEN** la respuesta es 200 y la tarea conserva el título completo

#### Scenario: Título que se pasa de largo

- **WHEN** se envía una creación con un `title` de 256 caracteres
- **THEN** la respuesta es 422 con un error de regla `maxLength` sobre `title` y no se guarda ninguna versión recortada

### Requirement: Actualización de tarea por API

El sistema SHALL actualizar el estado, el responsable o ambos cuando `PATCH /api/v1/tasks/:id` recibe `status` o `assigneeId`, y responder 200 con la tarea actualizada en `data`. Cualquier persona con sesión SHALL poder actualizar cualquier tarea, sin que importe quién la creó ni quién la lleva.

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

- **WHEN** se envía una actualización sin `status` ni `assigneeId`
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

### Requirement: Conjunto cerrado de estados

El sistema SHALL admitir como valores de estado únicamente `pending`, `in_progress` y `done`, rechazar cualquier otro con 422 y no ofrecer ninguna forma de añadir, renombrar o eliminar estados.

#### Scenario: Valor desconocido

- **WHEN** se envía `status` "blocked"
- **THEN** la respuesta es 422 con un error sobre `status` y la tarea no cambia

#### Scenario: Valor en castellano

- **WHEN** se envía `status` "Pendiente" o "pendiente"
- **THEN** la respuesta es 422 con un error sobre `status` y la tarea no cambia

#### Scenario: Toda tarea está en un estado válido

- **WHEN** se pide la lista después de cualquier creación o actualización
- **THEN** cada tarea tiene exactamente uno de los tres valores

### Requirement: Acceso a la pantalla de tareas

La aplicación web SHALL ofrecer la lista en `/tasks` solo con sesión iniciada y enlazarla en ambos sentidos con el perfil. `/tasks` SHALL ser la pantalla a la que se llega tras iniciar sesión.

#### Scenario: Destino al iniciar sesión

- **WHEN** una persona inicia sesión con éxito
- **THEN** llega a `/tasks`

#### Scenario: Sin sesión

- **WHEN** una persona sin sesión abre `/tasks`
- **THEN** es redirigida a `/login` y no ve ninguna tarea

#### Scenario: Con sesión

- **WHEN** una persona con sesión abre `/tasks` o recarga la página
- **THEN** ve la lista sin volver a identificarse

#### Scenario: Del perfil a la lista

- **WHEN** una persona pulsa el enlace a las tareas en su perfil
- **THEN** llega a `/tasks`

#### Scenario: De la lista al perfil

- **WHEN** una persona pulsa el enlace al perfil en la lista
- **THEN** llega a `/profile`

### Requirement: Una sola vista de tareas

La aplicación web SHALL ofrecer una única vista de tareas, igual para todas las personas, sin vista «mis tareas», sin tareas privadas y sin contenido reservado a ningún rol.

#### Scenario: Dos personas abren la lista

- **WHEN** dos personas con sesión miran la lista sin tocar nada y sin que nada haya cambiado entre medias
- **THEN** ven exactamente las mismas tareas

#### Scenario: Buscar otra vista

- **WHEN** una persona recorre la aplicación buscando otras vistas de tareas
- **THEN** no encuentra ninguna vista personal separada de la lista del equipo

### Requirement: Contenido de cada fila

La aplicación web SHALL mostrar en cada fila, sin abrir nada, el título, el responsable y el estado de la tarea, de modo que se pueda enumerar el trabajo de cada persona recorriendo la lista. La lista no SHALL mostrar fechas, marcas de vencida ni señales de presencia.

#### Scenario: Las tres cosas a la vista

- **WHEN** una persona mira la lista con tareas
- **THEN** cada fila muestra título, responsable y estado sin ningún clic

#### Scenario: Enumerar el trabajo de cada persona

- **WHEN** una persona recorre la lista con la vista
- **THEN** puede decir qué tareas lleva cada miembro sin abrir ninguna

#### Scenario: Estado con su nombre visible

- **WHEN** se muestra el estado de una tarea
- **THEN** se lee "Pendiente", "En curso" o "Hecho", nunca `pending`, `in_progress` ni `done`

#### Scenario: Sin fechas

- **WHEN** una persona mira la lista
- **THEN** no ve ninguna fecha ni ninguna marca de vencida

#### Scenario: Sin presencia

- **WHEN** otras personas usan la aplicación a la vez
- **THEN** la lista no indica quién está en línea ni la actividad de cada persona

#### Scenario: Mirar no cambia nada

- **WHEN** una persona abre la lista y la recorre sin pulsar ningún control
- **THEN** ninguna tarea cambia de estado ni de responsable

### Requirement: El responsable se identifica por su nombre

La aplicación web SHALL identificar al responsable por su nombre y, si no lo tiene, pintar "Sin nombre". No SHALL mostrar nunca su correo ni su id.

#### Scenario: Responsable con nombre

- **WHEN** el responsable de una tarea se llama "Ada Lovelace"
- **THEN** la fila muestra "Ada Lovelace"

#### Scenario: Responsable sin nombre

- **WHEN** el responsable de una tarea no tiene nombre puesto
- **THEN** la fila muestra "Sin nombre" y no su correo ni su id

### Requirement: Lista vacía

La aplicación web SHALL explicar qué es la lista y ofrecer crear la primera tarea cuando no exista ninguna, en lugar de mostrar una lista vacía sin más.

#### Scenario: Primera visita sin tareas

- **WHEN** una persona abre `/tasks` y no hay ninguna tarea
- **THEN** ve una explicación de para qué sirve la lista y una invitación a crear la primera tarea junto al campo de título

#### Scenario: Se crea la primera tarea

- **WHEN** una persona crea una tarea desde esa pantalla
- **THEN** la explicación desaparece y se ve la tarea en la lista

### Requirement: Carga de la lista

La aplicación web SHALL indicar en lenguaje corriente cuándo la lista se está cargando y cuándo no se ha podido obtener. Si falla, no SHALL presentarla como una lista vacía.

#### Scenario: Fallo al cargar

- **WHEN** la petición de la lista falla al abrir `/tasks`
- **THEN** la persona ve un mensaje de error en castellano y no la explicación de lista vacía

### Requirement: Formulario de creación

La aplicación web SHALL ofrecer en la propia lista un formulario cuyo único dato sea el título, sin pedir ni sugerir responsable, estado, fecha ni ningún otro. Al crear, la tarea SHALL verse en la lista sin recargar ni navegar, y el campo SHALL quedar vacío.

#### Scenario: Crear escribiendo solo el título

- **WHEN** una persona escribe un título y crea la tarea
- **THEN** la tarea aparece en la lista a su nombre y en "Pendiente", sin haber rellenado nada más

#### Scenario: El flujo no ofrece más campos

- **WHEN** una persona recorre el flujo de creación entero
- **THEN** el título es el único dato que se le pide y no se le ofrece indicar ningún otro

#### Scenario: Se ve sin recargar

- **WHEN** termina la creación de una tarea
- **THEN** la tarea se ve en la lista sin recargar la página ni cambiar de pantalla

### Requirement: Errores de título en pantalla

La aplicación web SHALL explicar en castellano, junto al campo de título, por qué se rechaza un título, y SHALL conservar lo escrito para que se pueda corregir.

#### Scenario: Crear sin título

- **WHEN** una persona intenta crear una tarea con el campo vacío
- **THEN** ve junto al campo un mensaje que indica que falta el título y no aparece ninguna fila nueva

#### Scenario: Crear con solo espacios

- **WHEN** una persona escribe solo espacios e intenta crear la tarea
- **THEN** ve el mismo mensaje que con el campo vacío y no aparece ninguna fila sin texto

#### Scenario: Título demasiado largo

- **WHEN** una persona intenta crear una tarea con un título de más de 255 caracteres
- **THEN** ve junto al campo un aviso de que se pasa de 255 caracteres, conserva su texto y no se crea ninguna tarea

### Requirement: Cambio de estado desde la lista

La aplicación web SHALL permitir cambiar el estado de cualquier tarea desde su fila, ofreciendo como únicos destinos Pendiente, En curso y Hecho, sin abrir la tarea, sin diálogo de confirmación, sin rellenar campos y sin advertencias por ser de otra persona.

#### Scenario: Cambio inmediato

- **WHEN** una persona elige otro estado en una fila
- **THEN** la fila refleja el nuevo estado de inmediato, sin confirmación ni pantalla intermedia

#### Scenario: Tarea de otra persona

- **WHEN** una persona cambia el estado de una tarea cuyo responsable es otra
- **THEN** el cambio se aplica igual que en una tarea propia, sin permiso especial ni advertencia

#### Scenario: Solo tres destinos

- **WHEN** una persona mira a qué estados puede cambiar una tarea
- **THEN** los únicos destinos ofrecidos son Pendiente, En curso y Hecho

#### Scenario: La fila no se mueve

- **WHEN** una persona cambia el estado de una tarea
- **THEN** la tarea sigue en la misma posición de la lista

#### Scenario: Fallo al guardar

- **WHEN** el servidor rechaza el cambio o no se puede contactar con él
- **THEN** la fila vuelve al estado anterior y la persona ve un mensaje de error en castellano

### Requirement: Cambio de responsable desde la lista

La aplicación web SHALL permitir cambiar el responsable de cualquier tarea desde su fila, ofreciendo como destinos únicamente las personas que aparecen como responsables en la lista cargada en ese momento, identificadas por su nombre o por "Sin nombre".

#### Scenario: Elegir a otra persona de la lista

- **WHEN** una persona elige en una fila a otra persona que ya lleva alguna tarea de la lista
- **THEN** la fila refleja el nuevo responsable de inmediato, sin confirmación

#### Scenario: Persona sin tareas

- **WHEN** una persona registrada no es responsable de ninguna tarea de la lista
- **THEN** no aparece como destino en el selector

#### Scenario: Destino sin nombre

- **WHEN** un destino del selector no tiene nombre puesto
- **THEN** se ofrece como "Sin nombre", sin su correo ni su id

#### Scenario: Fallo al reasignar

- **WHEN** el servidor rechaza el cambio o no se puede contactar con él
- **THEN** la fila vuelve al responsable anterior y la persona ve un mensaje de error en castellano
