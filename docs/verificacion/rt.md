# Matriz de trazabilidad — «Lo que cada tarea muestra de su responsable»

Requisito: `openspec/specs/tasks/spec.md`

- Scenarios del requisito: **3**
- Scenarios cubiertos: **0**

| Scenario | Test que lo cubre | Estado | Qué faltó para decidirlo |
|---|---|---|---|
| Al obtener una tarea de responsable "Ada Lovelace", su `assignee` trae nombre e iniciales | | No lo sé | Existe `un nombre de dos palabras da la inicial de cada una` (Auth | iniciales), pero comprueba las iniciales en la respuesta de login, no en el `assignee` de una tarea; en `backend/tests` no hay ningún test de tareas |
| Al obtener cualquier tarea (suelta o en la lista), su `assignee` no incluye email ni datos de acceso | | No cubierto | |
| Si el responsable se registró sin nombre, el nombre llega nulo y las iniciales siguen llegando | | No lo sé | Existen `una cuenta puede quedarse sin nombre` y `sin nombre, las iniciales salen del email`, pero miran signup/login, no el `assignee` de una tarea |

---
1. **Cuantos escearios estaban cubiertos**: 0. No había evidencia de test para el requisito a analizar.
2. **Escenario que no supe si faltaba un test**: Responsable identificable. Está redactado similar a un escenario de autenticación.
3. **Algo que el scenario no determinaba y tuviste que decidir al escribir el test**: Lo más relevante fue el valor exacto de las iniciales de la cuenta sin nombre. El scenario solo dice que "sus iniciales siguen llegando", sin decir cuáles. Para poder afirmar algo concreto tuve que fijar 'AE'. Salió de initials.spec.ts, donde el email ada@example.com sin nombre da AE.
---
