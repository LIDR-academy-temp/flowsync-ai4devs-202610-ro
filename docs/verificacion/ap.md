# Matriz de trazabilidad · «Lo que cada tarea muestra de su responsable»

Requisito de `openspec/specs/tasks/spec.md` (línea 97).

- **Scenarios del requisito:** 3
- **Cubiertos por la suite:** 0

| # | Scenario (en una línea) | Prueba que lo cubre | Estado | Qué faltó para decidir |
|---|---|---|---|---|
| 1 | Si se obtiene una tarea cuyo responsable es "Ada Lovelace", su `assignee` trae el nombre "Ada Lovelace" y sus iniciales | — | No cubierto | — |
| 2 | Si se obtiene cualquier tarea (suelta o en la lista), su `assignee` no trae el email ni ningún dato de acceso | — | No cubierto | — |
| 3 | Si el responsable se registró sin nombre, su `assignee` trae el nombre nulo y las iniciales igualmente | — | No cubierto | — |

Notas de la revisión:

- `backend/tests/functional/tasks/` está vacía. Ningún test de la suite pide `/api/v1/tasks`.
- Hay tests parecidos que no comprueban lo mismo. `Auth | iniciales › sin nombre, las iniciales salen del email` y `Auth | registro › una cuenta puede quedarse sin nombre` comprueban `initials` y `fullName: null` en la respuesta de login o de registro, no en el `assignee` de una tarea. No cuentan como cobertura del scenario 3.
- `Auth | registro › la contraseña nunca sale en la respuesta` comprueba que el usuario del registro no trae la contraseña. No dice nada del `assignee` de una tarea ni del email, así que no cubre el scenario 2.

### Tests añadidos (A.2)

En `backend/tests/functional/tasks/assignee.spec.ts`, grupo `Tasks | responsable`:

| # | Test | Resultado |
|---|---|---|
| 1 | `el responsable llega con su nombre y sus iniciales` | Verde |
| 2 | `ni la tarea suelta ni la lista exponen el email del responsable` | **Rojo**: en la lista (`GET /api/v1/tasks`) el `assignee` trae `email` |
| 3 | `un responsable sin nombre llega con nombre nulo y con iniciales` | Verde |

El rojo se queda rojo: no se tocó código fuera de `backend/tests/`.

---

## Las tres líneas

1. **Creía cubiertos antes de mirar / cubiertos de verdad:** 0 / 0
2. **Hueco de test o hueco de spec:** el escenario 3 pide sin recurrir a su email, pero en la spec de auth si no cuenta con nombre tomas las iniciales las del email, no se si falta un test para verificarlo o es falta de definicion en la spect.
3. **Lo que el scenario no decidía y decidí yo:** el scenario 3 pasa solo con que las iniciales no esten vacías, nunca se comprueba el valor. Al verlo decidí fijar el valor en `'AE'` (de `ada@example.com`), siguiendo la regla de la spec de auth de sacar las iniciales del email, aunque no la comparto: el scenario no dice qué iniciales deben salir, ese valor lo puse yo.
