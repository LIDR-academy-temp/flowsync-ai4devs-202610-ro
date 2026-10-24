# FlowSync — Alcance del MVP

## 1. Problema

En un equipo remoto nadie ve en qué está trabajando el resto sin interrumpir a alguien. Hoy eso se paga de dos formas:

- **La ronda de "¿en qué estás?"** de la daily, que se come la mitad de sus 15 minutos, y el goteo de esa misma pregunta por Slack/chat durante el día.
- **Trabajo duplicado.** Episodio real del caso de estudio: dos personas tocaron el mismo módulo la misma semana porque una empezó sin que la otra lo supiera. Dos días perdidos.

Lo que el MVP **no** resuelve: la parte de bloqueos de la daily sigue existiendo. La daily no desaparece; desaparece la ronda de estado.

## 2. Usuarios

- Equipos remotos pequeños, de 3 a 10 personas, con roles planos.
- Quien cobra el valor son **los pares**, no un lead: el dev que descubre tarde que iba a lo mismo que otro y el que tiene que interrumpir para preguntar. No hay reporte hacia arriba.
- **Caso de estudio** (no es un cliente real): equipo de 6 personas de producto SaaS, repartido en 3 husos horarios, que hoy usa un gestor de tareas pesado y una daily de 15 minutos por videollamada.

## 3. Propuesta

Una lista de tareas compartida que es **a la vez el sitio donde cada persona elige su siguiente tarea y el estado del equipo**, y que se mantiene al día sola.

- **Es donde se hace el trabajo, no donde se cuenta.** Sustituye al gestor de tareas actual; no convive con él. Convivir exigiría doble actualización, y así muere esta categoría de producto.
- **Por qué se sostiene:** actualizar cuesta uno o dos clics sobre una lista que ya está abierta, sin campos obligatorios salvo el título. Y quien actualiza cobra en el momento: de esa lista elige qué coger y, además, deja de recibir interrupciones.
- **"Menos rollo que Jira":** crear una tarea y cambiarle el estado en segundos, sin configuración de flujos.
- **"Tiempo real" significa frescura, no presencia.** Se ven los cambios de las tareas sin refrescar ni preguntar. El estado es de la **tarea**, no de la persona.
- **La señal es un resumen que espera, no un aviso que interrumpe:** "llego por la mañana o vuelvo de una reunión y veo qué se ha movido".

### Decisión que habilita

1. No empezar algo que otra persona ya está haciendo.
2. Elegir lo siguiente sabiendo qué está libre.

Si la única respuesta fuera "sentirse informado", el tiempo real no valdría lo que cuesta.

## 4. Éxito

- **Para el usuario:** dejar de hacer la ronda de "¿en qué estás?" porque el estado del equipo se ve de un vistazo.
- **Criterio a una semana de uso real:** el equipo cancela esa ronda y nadie pide que vuelva. Si la siguen haciendo igual, el MVP no ha funcionado.

## 5. Riesgos

1. **Que el estado de las tareas se quede viejo.** Si pasa, el producto pierde el sentido. Es el riesgo #1 a validar, no un detalle. La mitigación es que actualizar cueste uno o dos clics; no se obliga a nadie a hacerlo.
2. **El registro es abierto y el espacio es único.**
   - `POST /auth/signup` es público, así que cualquiera que llegue a la URL puede registrarse y ver, editar o borrar cualquier tarea.
   - Con el borrado físico sin papelera, es el principal hueco de seguridad del MVP.
   - Para el caso de estudio es aceptable si la instalación no es pública. Ver la pregunta abierta 1 de la sección 14.

## 6. Alcance

Es una vertical fina y usable de punta a punta. Se prefiere una capability terminada a tres a medias.

| # | Capability | Detalle |
|---|---|---|
| 1 | **Espacio único** | Todo usuario registrado ve todas las tareas y puede actuar sobre ellas según las reglas de la sección 7. No existe la entidad "equipo". |
| 2 | **Crear / editar tarea** | Al crear, solo el título es obligatorio y la fecha de vencimiento es opcional. Al editar se pueden cambiar el título y la fecha de vencimiento en cualquier estado, y el **responsable** solo en `En curso`. El **estado no se edita**: solo cambia con las transiciones de la capability 3. |
| 3 | **Empezar y terminar** | Una tarea en `Por hacer` se **empieza** con un clic: quien la empieza queda como responsable y la tarea pasa a `En curso`, todo en un paso. Solo su responsable puede **terminarla** y pasarla a `Hecha`, con dos clics: el botón "Terminar" y la confirmación. |
| 4 | **Vencimiento** | Una tarea no `Hecha` cuya fecha de vencimiento ya ha pasado se marca como **vencida**. Se calcula en el frontend; no se guarda ni viaja en la API. |
| 5 | **Filtro por estado** | Filtra la lista por uno o varios estados, en el cliente. Por defecto muestra `Por hacer` y `En curso`. `Por hacer` es la lista de "lo que está libre". |
| 6 | **Frescura** | La lista se actualiza sola, sin refrescar. Las tareas que otra persona ha cambiado desde tu última visita aparecen resaltadas, y un aviso cuenta las que se han terminado aunque el filtro las oculte. Detalle en la sección 12. |
| 7 | **Borrar tarea** | Cualquiera puede borrar una tarea, en cualquier estado, tras confirmar. Es un borrado físico, sin papelera. |

## 7. Reglas de estado y responsable

```
             Empezar (cualquiera)            Terminar (solo el responsable)
 Por hacer ──────────────────────▶ En curso ─────────────────────────────▶ Hecha
 (sin responsable)                (con responsable)                   (con responsable)
```

- **Regla de datos:** en `Por hacer` la tarea no tiene responsable; en `En curso` y en `Hecha` siempre lo tiene.
- **No hay vuelta atrás.** Una tarea no se suelta (`En curso → Por hacer`) ni se reabre (`Hecha → …`). Si hace falta más trabajo sobre algo terminado, se crea otra tarea.
- **El responsable solo se edita en `En curso`,** y siempre hay que elegir a alguien; no se puede dejar vacío.
  - Es la vía para que otra persona **tome una tarea de forma consciente**, por ejemplo si su responsable la ha abandonado. Después de cambiarlo, el nuevo responsable puede terminarla.
  - La UI pide confirmación cuando el cambio le quita la tarea a otra persona. Es una protección de experiencia de uso, no de seguridad: el servidor no la exige.
  - Si la tarea está en `Por hacer`, se asigna empezándola. Si está en `Hecha`, el responsable queda como registro de quién la hizo y no se cambia.
- **Las transiciones son atómicas.** El backend las ejecuta como un `UPDATE … WHERE id = ? AND status = ?` condicional. Si no se actualiza ninguna fila, devuelve el error que corresponda (sección 11). No se admite comprobar el estado y después escribir en dos pasos.
- **Conflicto al empezar.** Si dos personas pulsan "Empezar" sobre la misma tarea, la segunda recibe un `409` con el estado actual de la tarea y la UI le muestra quién la ha cogido ("Ana ya está en esto"). Es la protección directa contra el episodio de los dos días perdidos.
  - Límite: solo protege si los dos trabajan sobre la **misma** tarea. Dos tareas con títulos distintos sobre el mismo módulo no se detectan.
- **Ediciones simultáneas** de título o fecha: gana la última escritura. Se asume a este volumen de equipo.
- **Consecuencia asumida:** una tarea empezada por error se queda en `En curso`. Las salidas posibles son terminarla, reasignarla o borrarla.

## 8. Fuera del MVP

Todo lo que queda fuera se descarta por al menos uno de estos tres criterios:

- **(A) No ayuda a la decisión que el MVP habilita.** Esa decisión es no empezar algo que otra persona ya está haciendo y elegir lo siguiente sabiendo qué está libre (sección 3).
- **(B) Va en contra de la apuesta.** La apuesta es que actualizar cueste uno o dos clics y que la herramienta no vigile a nadie.
- **(C) Es caro para lo que valida.** Lo primero que hay que validar es si el estado se mantiene al día (riesgo #1); todo lo demás se apoya en esa hipótesis.

| Fuera del MVP | Criterio | Por qué |
|---|---|---|
| **Varios equipos, o personas en más de uno** | C | Obliga a crear entidades de equipo y de miembros, invitaciones, permisos por equipo y un selector de contexto, que es la mayor parte del coste de un producto multi-tenant. El caso de estudio es un solo equipo de 6 personas: un espacio único lo cubre entero y valida lo mismo. |
| **Notificaciones push** | B | La señal es "un resumen que espera, no un aviso que interrumpe". El push recrearía la interrupción que se quiere quitar, solo que viniendo de FlowSync en vez de Slack. |
| **Integración con Slack** | B, C | Llevaría el estado a otro sitio, y FlowSync tiene que ser donde se mira, no donde se copia. Además exige OAuth y una app de Slack, mucho coste para algo que no valida el riesgo #1. |
| **Derivar el estado de Git/PRs, CI o calendario** | C | Sería otro producto: integraciones, OAuth de terceros y heurísticas para traducir un PR en un estado de tarea. Y esconde el riesgo #1 en vez de validarlo: si el estado se mantiene fresco solo porque se calcula solo, no se sabrá si el equipo lo mantendría a mano. |
| **Importar tareas de otro gestor o sincronizarse con él** | B | FlowSync sustituye al gestor actual, no convive con él. Sincronizar obliga a actualizar en dos sitios, que es como muere esta categoría de producto. Importar sería un paso de migración, no parte del producto, y con 6 personas se puede hacer a mano. |
| **Roles y permisos avanzados** | A, B | Los roles son planos y no hay un lead que gestione. La única regla con valor real es que solo el responsable termina su tarea, porque protege la señal de "quién está en qué" (sección 7). Cualquier otra jerarquía añade fricción sin cambiar ninguna decisión. |
| **Comentarios en tareas** | A, B | Convierten la lista en un canal de conversación, que es justo el "rollo" que se quiere evitar. Tampoco hacen falta para saber quién está en qué. La conversación sigue en el chat que el equipo ya usa. |
| **Analítica, reporting e informes** | A | No hay reporte hacia arriba y a un manager le da igual. Quien cobra el valor son los pares, y a un par no le sirve un informe. El criterio de éxito (sección 4) es cualitativo y no necesita instrumentación. |
| **Sprints, estimaciones, épicas y backlog priorizado** | B | Es la renuncia explícita a ser Jira. Cada uno es un campo o una ceremonia más que rompe lo de "uno o dos clics". Un equipo que los necesite no es nuestro usuario. |
| **Indicadores de presencia o de actividad de personas** ("quién está conectado", "última vez visto") | A, B | Es vigilancia, y se rechaza a propósito. El estado es de la tarea, no de la persona. Ver quién está conectado no ayuda a elegir tarea y erosiona la confianza que el producto necesita para que la gente actualice. |
| **Chat, videollamada y edición simultánea de un mismo documento** | A, C | "Tiempo real" significa ver el estado fresco, no colaborar a la vez. Ya hay herramientas para eso, y construirlas requeriría infraestructura de tiempo real que el polling no necesita. |
| **Borrar usuarios** | C | Abre preguntas sin contestar, como qué pasa con sus tareas `En curso`. Con 6 personas y un caso de estudio no se da. |
| **Paginar o archivar las tareas `Hecha`** | C | Con decenas o pocos cientos de tareas, la lista completa cabe en cada consulta del polling (sección 9). Paginar añade complejidad al refresco y al resaltado sin una necesidad real todavía. |

### Lo que el alcance tampoco resuelve (no es un recorte)

- **Los bloqueos de la daily.** La ronda de estado desaparece, pero la de bloqueos sigue. El MVP no lo intenta, y venderlo como "adiós a la daily" falsearía el criterio de éxito.
- **El duplicado entre tareas distintas.** El `409` evita que dos personas empiecen la misma tarea. No detecta dos tareas con títulos diferentes sobre el mismo módulo; eso depende de que el equipo mire la lista.

## 9. Supuestos

- **Una instalación es un único espacio compartido.** Cualquiera que se registre ve todas las tareas (riesgo 2 de la sección 5).
- **El estado lo teclea la persona que hace la tarea.** No se deriva de ninguna otra fuente.
- **El volumen es pequeño:** decenas o pocos cientos de tareas en total y 10 usuarios como máximo. Esto justifica pedir la lista completa en cada polling, sin paginación, sobre SQLite.
- **La fecha de vencimiento es un día, sin hora.** Viaja como `YYYY-MM-DD`. Con 3 husos horarios, "vencida" se calcula con la fecha local de quien mira la lista, así que durante unas horas dos personas pueden ver distinto si una tarea está vencida.
- **Las tareas borradas desaparecen sin más.** El resaltado no avisa de los borrados.

## 10. Modelo de datos

Se añade una tabla nueva, `tasks`. La tabla `users` no cambia.

```
tasks
─────────────────────────────────────────────────────────────────────
id             PK increments
title          string(200)  NOT NULL
status         enum         NOT NULL  default 'todo'   -- todo | in_progress | done (CHECK en BD)
assignee_id    FK → users.id NULL                       -- NULL ⇔ status = 'todo'
due_date       date         NULL
updated_by_id  FK → users.id NOT NULL                   -- quién hizo el último cambio (crear, editar o transición)
created_at     timestamp    NOT NULL
updated_at     timestamp    NOT NULL                   -- base de la "última visita" (sección 12)
```

- **Relaciones:** `Task belongsTo assignee (User)` y `Task belongsTo updatedBy (User)`.
- **`updated_by_id`** sirve para no resaltarte tus propios cambios. No es una señal de actividad de personas: no se muestra como "visto por última vez", solo identifica al autor del último cambio de la tarea.
- **Dónde se aplica la regla `assignee_id NULL ⇔ status = 'todo'`:** con un `CHECK` en la migración si el builder de la versión instalada lo permite; si no, solo en el backend. En ambos casos, las transiciones y la edición son los únicos puntos que tocan esas columnas.
- **Claves foráneas:** usan la política por defecto (`RESTRICT`), porque no se borran usuarios en el MVP.
- **Sin tabla de historial:** para saber qué ha cambiado basta con `updated_at`.

## 11. API (todas con auth, bajo `/api/v1`)

**Formato de error de negocio:** `{ errors: [{ message, code, meta: { task } }] }`, donde `task` es el estado actual de la tarea, con su responsable. Así la UI puede explicar el conflicto y refrescar la fila sin esperar al siguiente polling.

| Método | Ruta | Uso | Errores |
|---|---|---|---|
| GET | `/tasks` | Lista completa, con responsable, ordenada por `created_at` descendente (orden estable para el polling). El filtro por estado se aplica en el cliente. | — |
| POST | `/tasks` | Crear: `title`, `dueDate?`. Nace en `todo`. | `422` |
| PATCH | `/tasks/:id` | Editar: `title?`, `dueDate?` (`null` la quita), `assigneeId?`. **No acepta `status`.** Un campo omitido no cambia. Enviar el mismo responsable que ya tiene no hace nada. | `422` si `assigneeId` es `null` o no existe el usuario. `409` si se cambia el responsable fuera de `in_progress`. `404` |
| POST | `/tasks/:id/start` | `todo → in_progress`, con responsable = quien la empieza | `409` si ya no está en `todo`. `404` |
| POST | `/tasks/:id/complete` | `in_progress → done` | `403` si no eres el responsable (por ejemplo, porque te la han reasignado). `409` si no está en `in_progress`. `404` |
| DELETE | `/tasks/:id` | Borrar. Responde `204` sin cuerpo. | `404` |
| GET | `/users` | Selector de responsable en la edición: `id`, `fullName`, `email` | — |

- Las transiciones de estado son endpoints propios y no un campo del `PATCH`. Así la regla de la sección 7 no se puede saltar desde la edición.
- **Mensajes en la UI por caso:**

  | Caso | Mensaje |
  |---|---|
  | `409` al empezar, si la tarea está en curso | "Ana ya está en esto" |
  | `409` al empezar, si la tarea está hecha | "Ana ya la terminó" |
  | `403` al terminar | "Ya no eres el responsable: ahora la tiene Ana" |
  | `404` | "Esta tarea se ha borrado" |

- Cuando una persona no tiene `fullName`, la UI muestra su email.

## 12. Decisiones técnicas

### Frescura por polling, no por WebSockets ni SSE

- El frontend pide `GET /tasks` cada ~10 s mientras la pestaña está visible, y una vez más al volver a ella.
- Lo que se pide es ver los cambios sin refrescar, no colaboración simultánea, y unos segundos de retraso no cambian la decisión de qué coger.
- Pedir la lista entera, en vez de solo los cambios desde un instante, detecta también las tareas borradas y no añade infraestructura sobre SQLite.
- Si se queda corto, el siguiente paso es `@adonisjs/transmit` (SSE).
- **Si el polling recibe un `401`, se detiene** y se cierra la sesión, con el flujo actual de `auth-provider`.
- **El polling no pisa una fila que se está editando.** Esa fila se actualiza al guardar o al cancelar.

### "Última visita" en el navegador (`localStorage`), no en el servidor

- **Marca:** es el `max(updated_at)` recibido del servidor, no la hora del reloj del cliente, para que un desfase de reloj no invente ni pierda resaltados.
- **Al abrir la lista:**
  - Se lee la marca guardada y se usa como referencia durante toda la sesión de la pestaña.
  - Se resaltan las tareas con `updated_at` posterior y `updated_by_id` distinto del tuyo. Cuentan los cambios de estado, las reasignaciones y las ediciones.
  - Los cambios que llegan por polling con la lista abierta se resaltan respecto a esa misma referencia.
- **Aviso de terminadas:** "N tareas terminadas desde tu última visita", con acceso directo al filtro `Hecha`. Así no se pierden aunque el filtro por defecto las oculte.
- **Cuándo se guarda la marca nueva:** cuando la pestaña pasa a oculta o se cierra, o cuando el usuario pulsa "Marcar como visto". Recargar la página no borra el resaltado de la visita en curso.
- **Primera visita, sin marca guardada:** no se resalta nada.
- El servidor no registra nada sobre las visitas, lo que es coherente con la sección 8.
- **Coste asumido:** la marca va por dispositivo.

## 13. Orden de construcción

Se sigue el flujo de CLAUDE.md: migración y `node ace migration:run`, que regenera `database/schema.ts` (el modelo extiende el esquema generado y solo añade relaciones); controladores registrados vía `#generated/controllers`; respuestas con transformer y `serialize()`; y se commitea el diff de `.adonisjs/`.

1. **Backend:**
   - Migración, modelo, validators, `TaskTransformer`, controlador de tareas con transiciones atómicas, `GET /users` con su transformer, y el formato de error de negocio de la sección 11.
   - Tests functional de las reglas de la sección 7, incluidos el conflicto al empezar, el `403` tras reasignar y el `PATCH` sin `status`.
   - Los tests necesitan una base de datos aislada. Hoy comparten fichero SQLite con el entorno de desarrollo. La solución es una variable de entorno (`node ace env:add`) que apunte a un fichero propio con `NODE_ENV=test`, más `testUtils.db().truncate()` entre tests.
2. **Frontend: la lista como pantalla principal**, en lugar de `/profile`.
   - **Rutas:** se actualizan las redirecciones de `public-only-route.tsx` y del comodín de `app-routes.tsx`. La lista tiene una cabecera con el acceso al perfil y el botón de cerrar sesión.
   - **Cliente de la API:** `lib/api.ts` añade `PATCH` y `DELETE`, la respuesta `204` sin cuerpo, la traducción de `403`, `404` y `409` con los mensajes de la sección 11, y las etiquetas de los campos `title` y `dueDate`.
   - **Funcionalidad:**
     - Creación en línea, "Empezar" y "Terminar".
     - Edición de título, fecha y responsable.
     - Marca de vencida, filtro por estado y borrado.
3. **Frescura:** polling, resaltado de "movido desde tu última visita", aviso de terminadas y gestión del conflicto `409`.

Los pasos 1 y 2 ya sustituyen al gestor de tareas. El paso 3 es el que permite cancelar la ronda de la daily.

## 14. Preguntas abiertas

1. **Registro abierto (riesgo 2).** ¿Basta con no publicar la instalación, o el MVP necesita una mitigación mínima, como desactivar `signup` por variable de entorno una vez dado de alta el equipo?
2. **¿Se reasigna a cualquiera o solo "me la quedo"?** Hoy la edición permite asignar la tarea a cualquier persona, que pasa a ser la única que puede terminarla sin haberlo pedido. Limitarlo a "me la quedo" quitaría `GET /users` y el selector.
3. **"Mis tareas".** La propuesta (sección 3) dice que cada persona elige su trabajo en la lista, pero el filtro es solo por estado. ¿Hace falta un filtro por responsable, o basta con el filtro por estado más ver el responsable en cada fila?
