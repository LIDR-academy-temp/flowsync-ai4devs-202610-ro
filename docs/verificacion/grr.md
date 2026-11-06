# Trazabilidad · «Lo que cada tarea muestra de su responsable»

**Scenarios del requisito:** 3
**Scenarios cubiertos:** 1

| Scenario (una línea) | Prueba que lo cubre (nombre en la suite) | Estado | Si «No lo sé», qué faltó |
|---|---|---|---|
| Responsable identificable: al obtener una tarea de "Ada Lovelace", su `assignee` trae nombre e iniciales | `Tasks \| responsable` › «el assignee de una tarea trae el nombre y las iniciales de su responsable» (`backend/tests/functional/tasks/assignee.spec.ts`) — verde | Cubierto | |
| La tarea no filtra datos de cuenta: el `assignee` de una tarea (suelta o en lista) no trae email ni datos de acceso | `Auth \| registro` › «la contraseña nunca sale en la respuesta» (`backend/tests/functional/auth/signup.spec.ts`) | No lo sé | Solo comprueba que no sale la contraseña en `data.user` del signup; nadie comprueba que falte el email ni mira ningún `assignee` |
| Responsable sin nombre: si la cuenta no tiene nombre, el `assignee` trae `fullName` nulo y sigue trayendo iniciales | `Auth \| iniciales` › «sin nombre, las iniciales salen del email»; `Auth \| registro` › «una cuenta puede quedarse sin nombre» (ambos en `backend/tests/functional/auth/`) | No lo sé | Uno comprueba iniciales "AE" y otro `fullName` nulo, por separado y sobre login/signup; ninguno sobre el `assignee` de una tarea |

## Las tres líneas

1. Antes de mirar creía cubiertos: 3. Lo estaban: 0.
2. «La tarea no filtra datos de cuenta»: no supe si era hueco de test o de spec, porque el email está escrito como prohibido pero «ningún otro dato de acceso» no se define en ninguna parte (¿cuenta el `id`?, ¿el `createdAt` de la cuenta?), así que para comprobarlo tendría que haber decidido yo qué campos son «de acceso».
3. Decisiones: - Leí «se obtiene una tarea» como la tarea suelta, GET /tasks/:id, porque el scenario no menciona la lista. Esa ruta exige el parámetro ?today=, así que le puse 2026-11-05, que aquí da igual. - Las iniciales esperadas de "Ada Lovelace" son AL, la misma regla que usa la spec de auth.
