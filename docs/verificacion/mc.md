# Trazabilidad: Lo que cada tarea muestra de su responsable

Scenarios del requisito: **3**
Scenarios cubiertos: **0** 
por la suite original; **2** después de mis tests (1 verde, 1 rojo)

| Scenario | Test que lo cubre | Estado | Nota |
|---|---|---|---|
| El `assignee` de una tarea con responsable nombrado ("Ada Lovelace") incluye su nombre completo y sus iniciales | `Tasks \| datos del responsable / el assignee trae el nombre y las iniciales del responsable` | Cubierto | |
| El `assignee` de cualquier tarea (suelta o en lista) no expone el email ni ningún otro dato de acceso de la cuenta | `Tasks \| datos del responsable / el assignee no expone el email de la cuenta` | Cubierto | Test en rojo: la app falla — `TaskTransformer` usa `UserTransformer` que sí incluye `email` |
| El `assignee` de una tarea cuyo responsable no tiene nombre llega con nombre nulo e iniciales presentes | — | No lo sé | el test de iniciales comprueba el cálculo al iniciar sesión, no en el responsable de una tarea |


---

## Parte B

1. **Antes de mirar creía cubiertos:** 75%. **Lo estaban:** 0 de 3.

2. **Hueco de test o hueco de spec:** el scenario «no expone el email ni ningún otro dato de acceso de la cuenta». El email está escrito y es un hueco de test, pero «ningún otro dato de acceso» no dice cuáles son: la tarea también devuelve las fechas de alta y de modificación de la cuenta, y no sé si eso viola la regla o si lo estaría decidiendo yo.

3. **Lo que tuve que decidir al escribir el test:** el scenario dice «suelta o en lista», pero el test solo comprueba la lista de tareas. Según el agente, la tarea suelta usa otro camino y pasaría. Elegir la lista decidió que el test saliera en rojo.