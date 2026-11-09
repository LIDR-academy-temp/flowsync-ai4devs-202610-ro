# A.1 · La matriz de trazabilidad
# Verificación — «Lo que cada tarea muestra de su responsable»

Requisito de `openspec/specs/tasks/spec.md`.

**Scenarios en el requisito: 3 — Cubiertos: 3**

| Scenario | Test que lo cubre (nombre en la suite) | Estado | Si «No lo sé», qué faltó |
|---|---|---|---|
| Al obtener una tarea cuyo responsable es "Ada Lovelace", su `assignee` trae ese nombre y sus iniciales | — (ninguno) | No cubierto | |
| Al obtener cualquier tarea, suelta o en la lista, su `assignee` no incluye el email ni otro dato de acceso | — (ninguno) | No cubierto | |
| Si el responsable se registró sin nombre, el `assignee` de la tarea trae nombre nulo y sigue trayendo iniciales | — (ninguno) | No cubierto | |

# A.2 · Los tests que faltan
## Notas


| Scenario | Test | Resultado |
|---|---|---|
| Responsable identificable | `el responsable llega con su nombre y sus iniciales` | ✔ Pasa |
| La tarea no filtra datos de cuenta | `el responsable de una tarea no expone su email ni datos de acceso` | ✖ **Falla** |
| Responsable sin nombre | `un responsable sin nombre llega con nombre nulo y con iniciales` | ✔ Pasa |

**Resultado: 2 pasan, 1 falla.** Se entrega en rojo y no se tocó el código.


# Parte B: las tres líneas

# Cuántos scenarios creías cubiertos antes de mirar, y cuántos lo estaban
0 y 0

# El scenario en el que no supiste si faltaba un test o faltaba la regla en la spec.
"La tarea no filtra datos de cuenta": el requisito prohíbe cualquier dato de la cuenta salvo nombre e iniciales, pero el assignee trae también el id; no sé si falta un test o si la spec debería permitirlo.

# Algo que el scenario no determinaba y tuviste que decidir al escribir el test
Qué cuenta como «obtener una tarea». Comprobé la tarea suelta y la lista, pero no la respuesta de crear una tarea (POST /tasks), que también devuelve el assignee y también filtra el email.