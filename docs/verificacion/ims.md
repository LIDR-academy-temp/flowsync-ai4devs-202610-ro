# Verificación — matriz de trazabilidad

**Capability:** `tasks` (`openspec/specs/tasks/spec.md`)
**Requisito:** Lo que cada tarea muestra de su responsable

> El sistema SHALL acompañar cada tarea del nombre y las iniciales de su responsable, lo justo para identificarlo en la lista, y NO SHALL exponer junto a la tarea ningún otro dato de esa cuenta, en particular su email.

**Leyenda del estado:** ✅ Cubierto · ❌ No Cubierto · 🟡 No lo sé

Tests en `backend/tests/functional/tasks/assignee.spec.ts` (grupo «Tasks | responsable»). Cada test revisa el `assignee` en los 5 endpoints que devuelven tareas: `GET /tasks`, `GET /tasks/:id`, `POST /tasks`, `PATCH /tasks/:id/status` y `PUT /tasks/:id/due-date`. Ejecutados con `node ace test --files=tasks/assignee`: 1 pasa y 2 fallan.

**Scenarios en el requisito:** 3 - **Cubiertos:** 1

| Scenario | Test que lo cubre | Estado | Qué te faltó |
|---|---|---|---|
| Responsable identificable | `el responsable llega con su nombre y sus iniciales` | ✅ Cubierto | Nada. El test pasa: los 5 endpoints devuelven `fullName: 'Ada Lovelace'`, `initials: 'AL'` y el `id` de la cuenta. |
| La tarea no filtra datos de cuenta | `la tarea no filtra el email ni otros datos de la cuenta` | ❌ No Cubierto | El test existe pero **falla**: `GET /tasks` devuelve `email`, `createdAt` y `updatedAt` en el `assignee`. La causa es que `TaskTransformer` (`backend/app/transformers/task_transformer.ts`) usa `UserTransformer` en vez de `TaskAssigneeTransformer`. También afecta a `POST /tasks` y a `PATCH /tasks/:id/status`. Falta corregir el transformer. |
| Responsable sin nombre | `un responsable sin nombre llega con nombre nulo y con iniciales` | ❌ No Cubierto | El test existe pero **falla**: `fullName: null` e `initials: 'AE'` llegan bien, pero `GET /tasks` incluye el email, por el mismo fallo del escenario anterior. La misma corrección lo resuelve. |

## Resumen

- Escenarios: 3 · ✅ Cubiertos: 1 · ❌ No cubiertos: 2 · 🟡 No lo sé: 0
- Los 3 escenarios tienen test. Los 2 no cubiertos no son por falta de test: el código incumple el requisito porque la lista, la creación y el cambio de estado exponen el email del responsable.

## Reflexión

1. **Scenarios que creía cubiertos antes de mirar, y los que lo estaban.** 0 de 3, no había ningún test sobre `tasks`. El path `backend/tests/functional/` solo tenía `auth/`. Lo que no esperaba es que, además de faltar tests, el código incumpliera el requisito: la lista devolvía el email del responsable. Tras escribir los tests, el recuento es 1 de 3.

2. **El scenario en el que no supe si faltaba un test o faltaba la regla en la spec.** «Responsable sin nombre». Pide que la interfaz pueda representar al responsable «sin recurrir a su email», pero las iniciales de una cuenta sin nombre se sacan precisamente del email (`ada@example.com` → `AE`), y eso deja ver una letra del dominio. El requisito de `tasks` no dice cómo se calculan las iniciales; lo dice el de `auth`, y tampoco cubre casos como espacios sobrantes o un nombre de una sola letra. No sé si lo que falta es un test que pruebe esos casos o una regla en la spec que diga qué iniciales son válidas y si pueden derivarse del email. Al escribir el test no lo vi; apareció en el análisis adversarial.

3. **Algo que el scenario no determinaba y tuve que decidir al escribir el test.** Qué campos puede llevar el `assignee`. El scenario solo prohíbe el email y «ningún otro dato de acceso», y el requisito solo nombra el nombre y las iniciales. Decidí fijar una lista blanca exacta, `id`, `fullName` e `initials`, tomada de `TaskAssigneeTransformer` y del diseño archivado del change, no de la spec. El `id` es un dato de la cuenta que el requisito, leído al pie de la letra, no permite. El `id` nos permite asegurar que es el usuario correcto. Con los requisitos actuales podemos encontrarnos usuarios con las mismas iniciales cuando no tienen nombre. También decidí qué cuenta como «obtener una tarea»: probé los 5 endpoints que devuelven tareas, no solo la lista y la consulta suelta.
