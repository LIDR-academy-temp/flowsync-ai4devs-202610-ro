# Verificación · «Lo que cada tarea muestra de su responsable»

Requisito: `openspec/specs/tasks/spec.md:97`

- **Scenarios del requisito:** 3
- **Scenarios cubiertos (antes de escribir tests):** 0

> El sistema SHALL acompañar cada tarea del nombre y las iniciales de su responsable, lo justo para identificarlo en la lista, y NO SHALL exponer junto a la tarea ningún otro dato de esa cuenta, en particular su email.

## Matriz de trazabilidad

Estado de la suite existente antes de añadir tests: solo había tests de `auth` (`backend/tests/functional/auth/{signup,login,session,initials}.spec.ts`). Ninguno llama a una ruta de `/api/v1/tasks` ni lee el campo `assignee`.

| Scenario | Test | Estado | Evidencia / qué faltó |
|---|---|---|---|
| **Responsable identificable**: al obtener una tarea, su `assignee` trae nombre e iniciales y con eso basta para saber quién la lleva | — | No cubierto | Ningún test pide una tarea. Hay tests parecidos que comprueban el **usuario**, no el responsable de una tarea: `registrarse devuelve la cuenta y un token que ya sirve` (`fullName` e `initials` del registro) y `un nombre de dos palabras da la inicial de cada una` (`initials` del login). |
| **La tarea no filtra datos de cuenta**: al obtener cualquier tarea, sola o en la lista, su `assignee` no incluye el email ni datos de acceso | — | No cubierto | Ningún test comprueba que falte el email en una tarea. `la contraseña nunca sale en la respuesta` solo mira la contraseña del `user` del registro. `el perfil devuelve la cuenta del token presentado` exige que el perfil **sí** incluya `email`: otro recurso. |
| **Responsable sin nombre**: si el responsable se registró sin nombre, el nombre llega nulo pero las iniciales siguen llegando | — | No cubierto | Ningún test crea una tarea con un responsable sin nombre. Se parecen `una cuenta puede quedarse sin nombre` (`fullName` nulo tras el registro) y `sin nombre, las iniciales salen del email` (`initials === 'AE'` en el login), pero los dos miran la cuenta, no la tarea. |

## Tests añadidos

Fichero: `backend/tests/functional/tasks/assignee.spec.ts` (grupo `Tasks | responsable`). Ejecución: `node ace test functional --files=tasks/assignee` → **4 pasan, 2 fallan (6)**. No se ha modificado código de producción.

| Scenario | Test | Resultado |
|---|---|---|
| Responsable identificable | `una tarea suelta identifica a su responsable por nombre e iniciales` | ✔ pasa |
| Responsable identificable | `cada tarea de la lista identifica a su responsable por nombre e iniciales` | ✔ pasa |
| La tarea no filtra datos de cuenta | `una tarea suelta no expone el email ni datos de acceso del responsable` | ✔ pasa |
| La tarea no filtra datos de cuenta | `las tareas de la lista no exponen el email ni datos de acceso del responsable` | ✖ falla |
| La tarea no filtra datos de cuenta | `la tarea recién creada no expone el email ni datos de acceso del responsable` | ✖ falla |
| Responsable sin nombre | `un responsable sin nombre llega con nombre nulo y con iniciales` (tarea suelta y lista) | ✔ pasa |

Fallo de los dos tests en rojo:

```
AssertionError: expected { id: 5, …(5) } to not have nested property 'email'
```

## Hallazgos

1. **La lista y la creación de tareas exponen el email del responsable** (incumple el scenario «La tarea no filtra datos de cuenta»).
   - `GET /api/v1/tasks` y `POST /api/v1/tasks` serializan con `app/transformers/task_transformer.ts`, que monta el `assignee` con `UserTransformer`. Ese transformer devuelve `id`, `fullName`, `email`, `createdAt`, `updatedAt` e `initials`.
   - `GET /api/v1/tasks/:id` usa `TaskDetailTransformer` → `TaskAssigneeTransformer`, que devuelve solo `id`, `fullName` e `initials`. Por eso la tarea suelta pasa y la lista no.
   - El propio comentario de `TaskAssigneeTransformer` dice que deliberadamente no se reutiliza `UserTransformer` porque incluye el email. `TaskTransformer` no sigue esa decisión.
2. **Los tipos generados reflejan la fuga.** El registro Tuyau declara para la lista un `assignee` con `email: string`, `createdAt` y `updatedAt`. Este error lo mostró `tsc` al hacer el typecheck de los tests.
3. **El requisito es más estricto que su scenario.** El requisito prohíbe «ningún otro dato de esa cuenta». El scenario solo nombra «el email … ni ningún otro dato de acceso». En la lista también salen `createdAt` y `updatedAt` de la cuenta, y la tarea suelta incluye `id`. Los tests añadidos solo comprueban `email` y `password`, así que no detectarían esos otros campos.

## Las tres líneas

1. Sospechaba que había 0 escenarios cubiertos con evidencia directa, y la matriz confirmó que ninguno de los 3 escenarios tenía cobertura antes de añadir los nuevos tests.
2. Escenario Conflictivo: «La tarea no filtra datos de cuenta», porque existían tests de autenticación relacionados con información de usuario que podían sugerir cobertura, pero ninguno verificaba realmente los datos expuestos por el assignee de una tarea.
3. Decisión tomada: concretar «dato de acceso» como `email` y `password`; interpretar que obtener una tarea incluye la consulta de una tarea individual, su aparición en listados y la respuesta de creación de tareas; y verificar que un responsable sin nombre tenga iniciales sin exigir un valor concreto.
