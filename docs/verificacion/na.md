# Verificación: «Lo que cada tarea muestra de su responsable»

**Scenarios del requisito: 3 · Cubiertos por la suite de partida: 0**

| Scenario | Prueba que lo cubre | Estado | Si «No lo sé», qué faltó |
|---|---|---|---|
| Con un responsable «Ada Lovelace», la tarea trae su nombre y sus iniciales | `Tasks \| responsable / el responsable se identifica por su nombre y sus iniciales` (añadida, verde) | Cubierto | — |
| Ninguna tarea, suelta o en la lista, trae el email ni otros datos de la cuenta del responsable | `Tasks \| responsable / la tarea no filtra el email ni otros datos de la cuenta del responsable` (añadida, **roja**: lista, creación y cambio de estado traen `email`, `createdAt` y `updatedAt`) | No lo sé | Si el `id` de la cuenta es un dato prohibido: el requisito dice «ningún otro dato» y el scenario solo «datos de acceso». El test lo deja pasar |
| Con un responsable sin nombre, llegan nombre nulo e iniciales, sin recurrir al email | `Tasks \| responsable / un responsable sin nombre llega con nombre nulo, con iniciales y sin su email` (añadida, **roja**: lista y cambio de estado traen el email) | Cubierto | — |

Las pruebas están en `backend/tests/functional/tasks/assignee.spec.ts` y miran todas las respuestas que traen una tarea: lista, tarea suelta, creación, cambio de estado y cambio de fecha. Suite al terminar: 23 tests, 21 en verde y 2 en rojo. Los rojos son del código y no se han tocado.

## Las tres líneas

1. **Antes de mirar: no escribí número antes del primer prompt. Cubiertos: 0 de 3.**
2. **«La tarea no filtra datos de cuenta»:** no sé si el email en la lista es un hueco de test o de spec, porque otro requisito obliga a que la lista devuelva «exactamente los mismos datos por tarea que antes de existir el vencimiento», y antes ya traía el email.
3. **Decidí que «sus iniciales siguen llegando» es una o dos mayúsculas, sin fijar cuáles:** sin nombre, el sistema las saca del email («RE» para `responsable@example.com`), y el scenario no dice si eso ya es «recurrir a su email».
