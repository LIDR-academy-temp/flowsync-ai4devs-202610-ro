# Parte A: la matriz y los tests que faltan, con reloj. 

Requisito de `openspec/specs/tasks/spec.md` contrastado con la suite de `backend/tests`.

## Resultado de mi análisis sin el uso de IA
Escenarios en el requisito: 3 * Cubiertos: 0

| Escenario | Test que lo cubre | Estado | Qué te faltó | 
|---|---|---|---|
| Responsable identificable | | No cubierto | | 
| La tarea no filtra datos de cuenta | | No cubierto | | 
| Responsable sin nombre | | No cubierto | |

## Resultado de Claude

Escenarios en el requisito: 3 * Cubiertos: 0

| Scenario | Test que lo cubre | Resultado | Detalle |
|---|---|---|---|
| Responsable identificable |  | No cubierto |  |
| La tarea no filtra datos de cuenta |  | No cubierto |  |
| Responsable sin nombre |  | No cubierto |  |


-----------
-----------

# Parte B: las tres líneas. 

1. **Cuántos scenarios creías cubiertos antes de mirar, y cuántos lo estaban.** Antes de ver el código, pensé que los 3 escenarios estarían cubiertos, una vez abierto el código verifiqué que ninguno lo estaba. No se si fue error de algo de este branch o de las instrucciones del ejercicio pero solo estaban los tests de "flowsync-ai4devs-202610-ro/backend/tests/functional/auth". Después de correr el prompt pensé que los 4 escenarios quedarían cubiertos pero aunque Claude escribió los test, ninguno pasó.


2. **El scenario en el que no supiste si faltaba un test o faltaba la regla en la spec.** Como he explicado arriba, antes de ver el código creí que todos los escenarios estaría cubiertos puesto que no se veían complejos pero una vez que vi el código supe que ningún esceanrio estaba cubierto puesto que solo existían tests para la sección de "auth".

3. **Algo que el scenario no determinaba y tuviste que decidir al escribir el test.**. Lo siento, en este punto creo que he perdido. No entendí la pregunta o lo que se tiene que hacer aquí. ¿Deberíamos haber analizado los escenarios y tratar de encontrar algún "edge case"? ¿No se supone que los tests lo iba hacer el agente?