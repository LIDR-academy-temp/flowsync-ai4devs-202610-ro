Parte A:

Scenarios del requisito: 3. Cubiertos: 0.

┌──────────────────────────────────────────────────────────────────────┬─────────────┬───────────┬──────────┐
│                              Escenario                               │ Test que lo │  Estado   │ Qué me   │
│                                                                      │    cubre    │           │  faltó   │
├──────────────────────────────────────────────────────────────────────┼─────────────┼───────────┼──────────┤
│ Responsable identificable: una tarea cuyo responsable es "Ada        │ Ninguno     │ No        │ —        │
│ Lovelace" trae en assignee ese nombre y sus iniciales                │             │ cubierto  │          │
├──────────────────────────────────────────────────────────────────────┼─────────────┼───────────┼──────────┤
│ La tarea no filtra datos de cuenta: assignee no incluye el email ni  │ Ninguno     │ No        │ —        │
│ otro dato de acceso, ni en la tarea suelta ni en la lista            │             │ cubierto  │          │
├──────────────────────────────────────────────────────────────────────┼─────────────┼───────────┼──────────┤
│ Responsable sin nombre: el nombre llega nulo y las iniciales siguen  │ Ninguno     │ No        │ —        │
│ llegando                                                             │             │ cubierto  │          │
└──────────────────────────────────────────────────────────────────────┴─────────────┴───────────┴──────────┘


Resultado tras  crear los test.
┌────────────────────────────────────┬──────────────────────────────────────────────────────────────────────────────────────────────────┬───────────┐
│              Scenario              │                                               Test                                               │ Resultado │
├────────────────────────────────────┼──────────────────────────────────────────────────────────────────────────────────────────────────┼───────────┤
│ Responsable identificable          │ "el responsable de una tarea llega con su nombre y sus iniciales"                                │ Pasa      │
├────────────────────────────────────┼──────────────────────────────────────────────────────────────────────────────────────────────────┼───────────┤
│ La tarea no filtra datos de cuenta │ "el responsable de una tarea no trae el email ni otros datos de la cuenta, suelta o en la lista" │ Falla     │
├────────────────────────────────────┼──────────────────────────────────────────────────────────────────────────────────────────────────┼───────────┤
│ Responsable sin nombre             │ "un responsable sin nombre llega con el nombre nulo y con iniciales"                             │ Pasa      │
└────────────────────────────────────┴──────────────────────────────────────────────────────────────────────────────────────────────────┴───────────┘


Parte B:

1. Cuántos scenarios creías cubiertos antes de mirar, y cuántos lo estaban.
Pues en un principio esperaba que estuvieran cubiertos todos. ME he sorprendido que revisando el código sobre este requerimiento no habia ningún test.

2. El scenario en el que no supiste si faltaba un test o faltaba la regla en la spec.
 El scenario 2, «La tarea no filtra datos de cuenta». Su regla es clara en el email, pero «ningún otro dato de acceso» no dice qué campos son esos. Eso es un hueco de spec: el conjunto prohibido lo puse yo. Además, la spec habla de «tarea suelta o dentro de la lista» y no dice nada de la respuesta de POST /tasks, que hoy también usa UserTransformer. No sé si esa respuesta debe cumplir la regla.

3. Algo que el scenario no determinaba y tuviste que decidir al escribir el test.
Si en al creción del test se decidio añadir:
- Campos prohibidos: el scenario dice «ningún otro dato de acceso». Interpreté eso como email, password, createdAt y updatedAt, y comprobé también que la cadena ada@example.com no aparezca en ninguna respuesta.
- Día de referencia: la tarea suelta exige ?today=. Usé 2026-11-08.
- Iniciales sin nombre: esperé "AE", porque el email es ada@example.com.
- Estado inicial: las tareas nacen pending con el valor por defecto de la columna, que es lo que hace que salgan en la lista.
