# Trazabilidad: «Lo que cada tarea muestra de su responsable»

- **Spec:** `openspec/specs/tasks/spec.md` (requisito «Lo que cada tarea muestra de su responsable»)
- **Suite:** `backend/tests/functional/tasks/assignee.spec.ts`, grupo `Tasks | responsable`

**Escenarios del requisito:** 3
**Escenarios cubiertos:** 3
 
| Scenario | Test que lo cubre | Estado | Qué faltó para decidir |
|---|---|---|---|
| Al obtener una tarea de "Ada Lovelace", su `assignee` trae ese nombre y sus iniciales | `en la lista, el responsable trae su nombre y sus iniciales` · `en la tarea suelta, el responsable trae su nombre y sus iniciales` | Cubierto | |
| Al obtener cualquier tarea, suelta o en la lista, su `assignee` no trae el email ni otro dato de la cuenta | `la tarea suelta no expone el email del responsable` · `la lista no expone el email del responsable` · `la tarea recién creada no expone el email del responsable` · `la tarea que cambia de estado no expone el email del responsable` | Cubierto | |
| Si el responsable se registró sin nombre, su nombre llega nulo, las iniciales llegan y el email no viaja | `un responsable sin nombre llega con nombre nulo e iniciales` · `un responsable sin nombre no se representa con su email` | Cubierto | |

## Cubierto no es lo mismo que cumplido

«Cubierto» significa que hay un test que comprueba el escenario, no que el sistema lo cumpla. Hoy (`node ace test --files=tasks/assignee`: 4 pasan, 4 fallan) el resultado es este:

- **Escenario 1:** se cumple. Sus dos tests pasan.
- **Escenario 2:** **no se cumple.** Solo pasa `la tarea suelta no expone el email del responsable`. Fallan los tests de la lista, la tarea recién creada y la que cambia de estado: esas tres respuestas usan `TaskTransformer` → `UserTransformer`, que incluye `email`, `createdAt` y `updatedAt`.
- **Escenario 3:** se cumple a medias. `un responsable sin nombre llega con nombre nulo e iniciales` pasa. `un responsable sin nombre no se representa con su email` falla por la misma fuga en la lista.

## Alcance de la cobertura

- Estos tests comprueban la respuesta de la API, no la interfaz. Que la pantalla muestre "Sin nombre" es otro escenario, del requisito «Pantalla de la lista del equipo», y no está cubierto: el frontend no tiene runner de tests.
- La frase del escenario 1 «esos datos bastan para saber quién la lleva» no se puede comprobar con un test. Lo que sí se comprueba es que llegan el nombre y las iniciales.



# Parte B: Las tres líneas

¿Cuántos scenarios creías cubiertos antes de mirar y cuántos lo estaban?
0 y 0

El scenario en el que no supiste si faltaba un test o faltaba la regla en la spec
Los 3 escenarios no tenian tests que una vez creados ya aparecieron los escenarios como cubiertos.

Algo que el scenario no determinaba y tuviste que decidir al escribir el test
Le dije al claude que me creara los tests a partir de los criterios. No acabo de ver donde se debe corregir, si en las specs o en los tests. Además de que no he revisado el código.
