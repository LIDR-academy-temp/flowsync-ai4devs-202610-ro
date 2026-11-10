# Matriz de trazabilidad · «Lo que cada tarea muestra de su responsable»

Scenarios en el requisito: 3 · Cubiertos: 0

| Scenario | Test que lo cubre | Estado | Qué te faltó |
|---|---|---|---|
| La tarea trae nombre e iniciales del responsable | — | No cubierto | — |
| El responsable de una tarea no incluye su email, ni suelta ni en la lista | — | No cubierto | — |
| Responsable sin nombre: nombre nulo e iniciales presentes | — | No cubierto | — |

| Scenario | Test | Resultado |
|---|---|---|
| Nombre e iniciales del responsable | una tarea trae el nombre y las iniciales de su responsable | ✔ verde |
| No filtra el email, ni suelta ni en la lista | el responsable de una tarea no expone el email ni datos de acceso, ni suelta ni en la lista | ✖ ROJO: la lista (GET /api/v1/tasks) devuelve el email del responsable; la tarea suelta sí cumple |
| Responsable sin nombre | el responsable registrado sin nombre llega con nombre nulo y con iniciales | ✔ verde |
| No filtra el email en la respuesta de crear tarea (POST) | — | No lo sé: usa el mismo serializador que la lista, pero ningún test lo comprueba |

Suite completa: 22 en verde, 1 en rojo. No se ha tocado el código de la aplicación.


**Notas de mi lectura de los asserts:**
- Los tests 1 y 3 solo comprueban la tarea suelta (GET /tasks/:id); el responsable dentro de la lista no se verifica en esos escenarios.
- El test 2 sigue al scenario (email y datos de acceso), pero el requisito es más estricto: «ningún otro dato de esa cuenta». La lista también expone createdAt/updatedAt de la cuenta y ningún test lo detecta.
- La respuesta de POST /api/v1/tasks no se comprueba en ningún test; probablemente tenga la misma fuga que la lista (mismo serializador), sin verificar.
- El test 3 exige iniciales exactas «SE», más de lo que pide el scenario («siguen llegando»): queda acoplado a la regla de cálculo de iniciales.




## Parte B · Las tres líneas

1. **Cubiertos antes de mirar / cubiertos de verdad:** no anoté mi estimación antes del primer prompt, no lo recordé· cubiertos de verdad: 0 de 3, porque no existía ningún test de tareas.

2. **Falta de test o falta de regla:** en «La tarea no filtra datos de cuenta» el requisito dice que el responsable no expone «ningún otro dato de esa cuenta», pero el scenario solo menciona email y datos de acceso. Al ver que la lista devuelve también `createdAt`/`updatedAt` de la cuenta, y la tarea suelta el `id`, no supe si faltaba un test o si la regla no está escrita: qué cuenta como «dato de la cuenta» lo estaba decidiendo yo.

3. **Lo que el scenario no determinaba y decidí al escribir el test:** en «Responsable sin nombre» el scenario solo dice que las iniciales «siguen llegando», pero el test exige exactamente «SE», derivadas del email que elegí; también decidí comprobarlo solo en la tarea suelta, con `today=2026-11-10` fijo, y no en la lista ni en la respuesta de crear.