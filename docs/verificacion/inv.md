ESCENARIOS EN EL REQUISITO:
Al empezar: 3
Cubiertos: 0

# Matriz de trazabilidad — «Lo que cada tarea muestra de su responsable»

Fuente: `openspec/specs/tasks/spec.md`, requisito «Lo que cada tarea muestra de su responsable» (3 scenarios).
Suite revisada: `backend/tests/functional/auth/{signup,login,session,initials}.spec.ts` (18 tests). No hay `tests/unit/`, no hay ningún test de `tasks` y el frontend no tiene runner de tests.

| # | Scenario (qué se espera y cuándo) | Test que lo cubre | Estado | Si "No lo sé", qué faltó |
|---|---|---|---|---|
| 1 | Al obtener una tarea de "Ada Lovelace", su `assignee` trae ese nombre y sus iniciales. | | No cubierto | |
| 2a | Al obtener una tarea suelta, su `assignee` no incluye el email ni datos de acceso. | | No cubierto | |
| 2b | Al obtener una tarea dentro de la lista, su `assignee` no incluye el email ni datos de acceso. | | No cubierto | |
| 3a | Si el responsable se registró sin nombre, el nombre del `assignee` llega nulo. | | No cubierto | |
| 3b | Si el responsable se registró sin nombre, las iniciales del `assignee` siguen llegando. | | No cubierto | |

El scenario 2 («suelta o dentro de la lista») y el 3 (nombre nulo + iniciales presentes) se han partido en dos filas porque cada uno junta dos comprobaciones.

## Por qué "No cubierto" y no "No lo sé"

Ningún test de la suite llama a una ruta de tareas ni lee un campo `assignee`, así que no hay nada que dudar: no se comprueba. Hay tests que se parecen, pero comprueban otra cosa y no se han contado:

- `un nombre de dos palabras da la inicial de cada una`, `sin nombre, las iniciales salen del email` (`initials.spec.ts`): verifican `data.user.initials` en la respuesta de **login**, no en el `assignee` de una tarea.
- `una cuenta puede quedarse sin nombre` (`signup.spec.ts`): verifica `fullName` nulo en el **registro**, no en una tarea.
- `la contraseña nunca sale en la respuesta` (`signup.spec.ts`): comprueba que no sale la contraseña del **usuario registrado**; no dice nada del email ni del `assignee`. Además, el perfil (`el perfil devuelve la cuenta del token presentado`) sí devuelve el email, a propósito: lo contrario de lo que pide el scenario 2.

---

# Matriz de trazabilidad tras añadir los tests — «Lo que cada tarea muestra de su responsable»

Escenarios: 5 filas (3 scenarios del spec, dos de ellos partidos en dos). Cubiertos: 5.
Tests nuevos: `backend/tests/functional/tasks/assignee.spec.ts`, grupo `Tasks | responsable`. Ejecución: 4 pasan, 1 falla.

| # | Scenario (qué se espera y cuándo) | Test que lo cubre | Estado | Si "No lo sé", qué faltó |
|---|---|---|---|---|
| 1 | Al obtener una tarea de "Ada Lovelace", su `assignee` trae ese nombre y sus iniciales. | `la tarea trae el nombre y las iniciales de su responsable` | Cubierto | |
| 2a | Al obtener una tarea suelta, su `assignee` no incluye el email ni datos de acceso. | `una tarea suelta no expone el email de su responsable` | Cubierto | |
| 2b | Al obtener una tarea dentro de la lista, su `assignee` no incluye el email ni datos de acceso. | `una tarea dentro de la lista no expone el email de su responsable` | Cubierto | |
| 3a | Si el responsable se registró sin nombre, el nombre del `assignee` llega nulo. | `un responsable sin nombre llega con el nombre nulo` | Cubierto | |
| 3b | Si el responsable se registró sin nombre, las iniciales del `assignee` siguen llegando. | `un responsable sin nombre sigue llegando con sus iniciales` | Cubierto | |

"Cubierto" significa que hay un test que comprueba el scenario, no que el sistema lo cumpla.

## Resultado de la ejecución

- **2b falla:** el test detecta que el sistema incumple el scenario. `GET /api/v1/tasks` serializa con `TaskTransformer`, que construye el `assignee` con `UserTransformer` (`id`, `fullName`, `email`, `createdAt`, `updatedAt`, `initials`), así que el email del responsable sale en cada tarea de la lista. La tarea suelta usa `TaskAssigneeTransformer` (`id`, `fullName`, `initials`) y por eso 2a pasa.
- **Fuera del alcance de estos tests:** `POST /tasks` y `PATCH /tasks/:id/status` también serializan con `TaskTransformer`, así que lo más probable es que expongan el email igual. No se ha comprobado porque el scenario solo habla de la tarea suelta y de la lista.
- **Límites de lo que se prueba:**
  - 1, 3a y 3b se comprueban solo sobre la tarea suelta (`GET /tasks/:id`), no sobre la lista.
  - En 2a y 2b, "ningún otro dato de acceso" se comprueba como ausencia de `email` y `password`, más la ausencia del valor del email en cualquier campo. `createdAt` y `updatedAt` no se han considerado datos de acceso.
  - 3b fija las iniciales esperadas en `AE`, según la regla «Iniciales de la cuenta» de `auth`.

---

# Revisión adversarial de la matriz

Revisión de solo lectura hecha por el subagente `adversarial-reviewer` sobre la segunda matriz, los tests de `assignee.spec.ts` y el código. Objetivo: refutar las filas marcadas como Cubierto y encontrar escenarios que el requisito no plantea. No se ha modificado ni código ni tests.

## Veredicto sobre las filas cubiertas

Ninguna fila queda refutada; dos quedan en duda.

| # | Veredicto | Motivo |
|---|---|---|
| 1 | Se sostiene, con un hueco | Distingue de verdad `AL` (vía nombre) de `AE` (vía email). Solo se prueba en la tarea suelta, no en la lista; "esos datos bastan para saber quién la lleva" no se comprueba. |
| 2a | Dudosa | "Ningún otro dato de acceso" se reduce a `email`, `password` y el valor literal del email. Un email en mayúsculas o codificado, o el hash bajo otra clave, pasaría. Hoy lo impide el `pick` de `TaskAssigneeTransformer`, no el test. |
| 2b | Se sostiene | Falla por un incumplimiento real del sistema, que es lo que debe detectar. `assert.exists` evita el falso verde si la tarea no saliera en la lista. |
| 3a | Se sostiene, con un hueco | `isNull` + `property` detectan un fallback a email, `''` o `undefined`. Solo se prueba en la tarea suelta, y la lista usa otro transformer. |
| 3b | Dudosa | Comprueba `AE` con un único email; un valor fijo a mano también pasaría. "Sin recurrir a su email" no se prueba. Solo en la tarea suelta. |

Aislamiento: `withGlobalTransaction` es correcto, y el test no depende de la fecha (`today` fijo, `dueDate` nulo). Riesgo residual: la suite usa `tmp/db.sqlite3`, el mismo fichero que el servidor de desarrollo; si ahí ya existen `mira@example.com` o `ada@example.com`, `User.create` falla por clave única y el fallo sería de datos locales, no de código.

## Escenarios nuevos con fallo real en el código

| Escenario propuesto (WHEN → THEN) | Evidencia |
|---|---|
| Al crear una tarea con `POST /tasks`, su `assignee` no incluye el email. | `tasks_controller.ts` (`store`) serializa con `TaskTransformer` → `UserTransformer`, que incluye `email`. |
| Al cambiar el estado con `PATCH /tasks/:id/status`, su `assignee` no incluye el email. | `task_statuses_controller.ts` serializa con `TaskTransformer`. Solo la tarea suelta y `PUT :id/due-date` usan `TaskAssigneeTransformer`. |
| Si el nombre empieza con espacios (`"  Ada"`), las iniciales siguen llegando. | `user.ts:12`: `split(' ')` da `first = ''` y devuelve iniciales vacías. Verificado leyendo el código. |
| Si el nombre tiene espacios dobles (`"Ada  Lovelace"`), las iniciales son `AL`. | `user.ts:12`: `last = ''`, cae en la rama de una palabra y devuelve `AD`. Verificado leyendo el código. |
| En la lista, un responsable sin nombre llega con nombre nulo y con iniciales. | Hoy funciona, pero por el camino que filtra el email (`UserTransformer`); no hay test sobre la lista. |
| Desde cualquier endpoint, el `assignee` tiene exactamente `id`, `fullName`, `initials`. | La lista rompe el tipo `TaskAssignee` de `frontend/src/lib/types.ts`, que dice "No trae el email a propósito". |

Con esto, el email del responsable sale en 3 de los 4 endpoints que devuelven tareas: lista, `POST /tasks` y `PATCH /tasks/:id/status`. Lo que la matriz anterior daba como "lo más probable" queda confirmado por el código, aunque no se ha ejecutado.

## Huecos de especificación (hoy no fallan)

| Escenario sin definir | Comportamiento actual |
|---|---|
| Nombre de tres o más palabras (`"Ada María Lovelace"`). | Da `AM` (primera + segunda); el spec no dice si debería ser primera + última. |
| `fullName` es `''` en lugar de `null`. | Las iniciales salen del email, pero el nombre llegaría como `''` y no nulo. Falta ver si el validador admite `''`. |
| Nombre con acentos o emojis. | Con acentos funciona; con un emoji de par sustituto, `charAt(0)` lo partiría (riesgo menor). |
| `createdAt`, `updatedAt` e `id` de la cuenta en el `assignee`. | El spec no los trata como datos de acceso. Salen en la lista, `POST` y `PATCH`; no en la tarea suelta. |
| Responsable borrado o `assignee` no cargado. | No es riesgo hoy: `assignee_id` es `NOT NULL` con `ON DELETE CASCADE`, y los cuatro controladores cargan el responsable. Si se quitara un `load`, `whenLoaded` dejaría el `assignee` ausente sin error. |

# Parte B: las tres líneas

1. Escenarios que creía cubiertos: 3, efectivamente cubiertos: 0.
Antes de comenzar el ejercicio, hice una revisión por encima del código y la spec. Los escenarios que mostraba el requisito parecían suficientemente simples, con lo que consideraba que el código los tendría, si bien esperaba que estuviesen mezclados en tests de auth, dado que sí que me di cuenta de que no había una carpeta específica para tests de tasks. Ese dato me llevaba por otro lado a pensar que en realidad 0 estarían cubiertas, pero mi decisión fue poner 3, que es lo que puse y no cambio a posteriori.

2. Scenario 2 (el `assignee` no expone email ni datos de acceso): el email también sale en `POST /tasks` y `PATCH /tasks/:id/status`, y no sé si falta el test o la regla, porque la spec solo nombra la tarea suelta y la lista.

3. Qué es un «dato de acceso» en el scenario 2: el test lo redujo a `email` y `password` y dejó fuera `createdAt`, `updatedAt` e `id`; lo decidió el agente al escribir el test y yo lo acepté sin revisarlo.
