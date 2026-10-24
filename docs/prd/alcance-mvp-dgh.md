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

Una lista de tareas compartida que es **a la vez la cola de trabajo de cada persona y el estado del equipo**, y que se mantiene al día sola.

- **Es donde se hace el trabajo, no donde se cuenta.** Sustituye al gestor de tareas actual; no convive con él. Convivir exigiría doble actualización, y así muere esta categoría de producto.
- **Por qué se sostiene:** actualizar son dos clics sobre una lista que ya está abierta, sin campos obligatorios salvo el título. Y quien actualiza cobra en el momento: esa lista es su cola y, además, deja de recibir interrupciones.
- **"Menos rollo que Jira":** crear una tarea y cambiarle el estado en segundos, sin configuración de flujos.
- **"Tiempo real" significa frescura, no presencia.** Se ven los cambios de estado de las tareas sin refrescar ni preguntar. El estado es de la **tarea**, no de la persona.
- **La señal es un resumen que espera, no un aviso que interrumpe:** "llego por la mañana o vuelvo de una reunión y veo qué se ha movido".

### Decisión que habilita

1. No empezar algo que otra persona ya está haciendo.
2. Elegir lo siguiente sabiendo qué está libre.

Si la única respuesta fuera "sentirse informado", el tiempo real no valdría lo que cuesta.

## 4. Éxito

- **Para el usuario:** dejar de hacer la ronda de "¿en qué estás?" porque el estado del equipo se ve de un vistazo.
- **Criterio a una semana de uso real:** el equipo cancela esa ronda y nadie pide que vuelva. Si la siguen haciendo igual, el MVP no ha funcionado.

## 5. Riesgo principal

**Que el estado de las tareas se quede viejo.** Si pasa, el producto pierde el sentido. Es el riesgo #1 a validar, no un detalle.

La mitigación es que actualizar cueste dos clics; no se obliga a nadie a hacerlo.

## 6. Alcance

Es una vertical fina y usable de punta a punta. Se prefiere una capability terminada a tres a medias.

| # | Capability | Detalle |
|---|---|---|
| 1 | **Espacio único** | Todo usuario registrado ve todas las tareas y puede actuar sobre ellas según las reglas de la sección 7. No existe la entidad "equipo". |
| 2 | **Crear / editar tarea** | Al crear, solo el título es obligatorio y la fecha de vencimiento es opcional. Al editar se pueden cambiar el título, la fecha de vencimiento y el **responsable**. El **estado no se edita**: solo cambia con las transiciones de la capability 3. |
| 3 | **Empezar y terminar** | Una tarea en `Por hacer` se **empieza** con un clic: quien la empieza queda como responsable y la tarea pasa a `En curso`, todo en un paso. Solo su responsable puede pasarla a `Hecha`, con doble clic. |
| 4 | **Vencimiento** | Una tarea no `Hecha` cuya fecha de vencimiento ya ha pasado se marca como **vencida**. Es un dato calculado, no un estado. |
| 5 | **Filtro por estado** | Filtra la lista por uno o varios estados. Por defecto muestra `Por hacer` y `En curso`. `Por hacer` es la lista de "lo que está libre". |
| 6 | **Frescura** | La lista se actualiza sola, sin refrescar. Las tareas que han cambiado desde tu última visita aparecen resaltadas. |
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
  - La UI pide confirmación cuando el cambio te quita la tarea a otra persona.
  - Si la tarea está en `Por hacer`, se asigna empezándola. Si está en `Hecha`, el responsable queda como registro de quién la hizo y no se cambia.
- **Conflicto al empezar.** Si dos personas pulsan "Empezar" sobre la misma tarea, la segunda recibe un `409` y la UI le muestra quién la ha cogido ("Ana ya está en esto"). Es la protección directa contra el episodio de los dos días perdidos.
  - Límite: solo protege si los dos trabajan sobre la **misma** tarea. Dos tareas con títulos distintos sobre el mismo módulo no se detectan.
- **Consecuencia asumida:** una tarea empezada por error se queda en `En curso`. Las salidas posibles son terminarla, reasignarla o borrarla.

## 8. Fuera del MVP

- Varios equipos separados, o personas en más de un equipo.
- Notificaciones push e integración con Slack.
- Derivar el estado de señales externas (Git/PRs, CI, calendario). Sería otro producto, con integraciones y OAuth de terceros.
- Importar tareas de otro gestor o sincronizarse con él.
- Roles y permisos avanzados. La única regla de permisos es la de la sección 7: quién puede terminar una tarea.
- Comentarios en tareas.
- Analítica, reporting e informes.
- Sprints, estimaciones, épicas y backlog priorizado. Un equipo que necesite eso no es nuestro usuario.
- Cualquier indicador de presencia o de actividad de personas, como "quién está conectado" o "última vez visto". Se rechaza a propósito porque es vigilancia.
- Chat, videollamada y edición simultánea de un mismo documento.

## 9. Supuestos

- **Una instalación es un único espacio compartido.** Cualquiera que se registre ve todas las tareas. Para el caso de estudio es aceptable; con varios equipos no lo sería.
- **El estado lo teclea la persona que hace la tarea.** No se deriva de ninguna otra fuente.
- **El volumen es pequeño:** decenas o pocos cientos de tareas activas y 10 usuarios como máximo. Esto justifica el polling sobre SQLite.
- **La fecha de vencimiento es un día, sin hora.** Con 3 husos horarios, "vencida" se calcula con la fecha local de quien mira la lista.

## 10. Modelo de datos

Se añade una tabla nueva, `tasks`. La tabla `users` no cambia.

```
tasks
─────────────────────────────────────────────────────────────
id             PK increments
title          string(200)  NOT NULL
status         string       NOT NULL  default 'todo'   -- todo | in_progress | done
assignee_id    FK → users.id NULL                       -- NULL ⇔ status = 'todo'
due_date       date         NULL
created_by_id  FK → users.id NOT NULL
created_at     timestamp    NOT NULL
updated_at     timestamp    NOT NULL                   -- base del resaltado "movido desde tu última visita"
```

- **Relaciones:** `Task belongsTo assignee (User)` y `Task belongsTo createdBy (User)`.
- **Dónde se aplica la regla `assignee_id NULL ⇔ status = 'todo'`:** en el backend. Las transiciones y la edición son los únicos puntos que tocan esas dos columnas.
- **Borrado de usuarios:** no existe en el MVP. Si se añade, habrá que decidir qué pasa con sus tareas `En curso`.
- **Sin tabla de historial:** para saber qué ha cambiado basta con `updated_at`.

## 11. API (todas con auth, bajo `/api/v1`)

| Método | Ruta | Uso | Errores de negocio |
|---|---|---|---|
| GET | `/tasks?status=todo,in_progress` | Listar y filtrar. Incluye el responsable. | — |
| POST | `/tasks` | Crear: `title`, `dueDate?`. Nace en `todo`. | `422` |
| PATCH | `/tasks/:id` | Editar: `title?`, `dueDate?`, `assigneeId?`. **No acepta `status`.** | `422` si se cambia el responsable fuera de `in_progress` o se deja vacío |
| POST | `/tasks/:id/start` | `todo → in_progress`, con responsable = quien la empieza | `409` si ya no está en `todo` (devuelve quién la tiene) |
| POST | `/tasks/:id/complete` | `in_progress → done` | `403` si no eres el responsable; `409` si no está en `in_progress` |
| DELETE | `/tasks/:id` | Borrar | — |
| GET | `/users` | Selector de responsable en la edición | — |

Las transiciones de estado son endpoints propios y no un campo del `PATCH`. Así la regla de la sección 7 no se puede saltar desde la edición.

## 12. Decisiones técnicas

- **Frescura por polling, no por WebSockets ni SSE.**
  - El frontend pide la lista completa cada ~10 s.
  - Lo que se pide es ver los cambios sin refrescar, no colaboración simultánea, y unos segundos de retraso no cambian la decisión de qué coger.
  - Pedir la lista entera, en vez de solo los cambios desde un instante, detecta también las tareas borradas y no añade infraestructura sobre SQLite.
  - Si se queda corto, el siguiente paso es `@adonisjs/transmit` (SSE).
- **"Última visita" en el navegador (`localStorage`), no en el servidor.**
  - Al abrir la lista se lee la marca anterior, se resaltan las tareas con `updated_at` posterior y se guarda la marca nueva.
  - El servidor no registra nada sobre la actividad de las personas, lo que es coherente con la sección 8.
  - Coste asumido: la marca va por dispositivo.

## 13. Orden de construcción

1. **Backend:**
   - Migración, modelo, validators, transformer, controlador de tareas y `GET /users`.
   - Tests functional de las reglas de la sección 7, aislando la BD de los tests (hoy los tests comparten fichero SQLite con el entorno de desarrollo).
2. **Frontend: la lista como pantalla principal**, en lugar de `/profile`.
   - Creación en línea, "Empezar" y "Terminar".
   - Edición de título, fecha y responsable.
   - Marca de vencida, filtro por estado y borrado.
3. **Frescura:** polling, resaltado de "movido desde tu última visita" y aviso de conflicto `409`.

Los pasos 1 y 2 ya sustituyen al gestor de tareas. El paso 3 es el que permite cancelar la ronda de la daily.
