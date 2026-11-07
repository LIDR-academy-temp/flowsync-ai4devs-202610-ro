# Matriz de trazabilidad: Lo que cada tarea muestra de su responsable

Requisito de `openspec/specs/tasks/spec.md`: el sistema acompaña cada tarea del nombre y las iniciales de su responsable, y no expone ningún otro dato de esa cuenta, en particular su email.

Scenarios en el requisito: 3. Cubiertos: 0.

| Scenario | Test que lo cubre | Estado | Qué faltó para decidir |
|---|---|---|---|
| Al obtener una tarea cuyo responsable es "Ada Lovelace", su `assignee` trae ese nombre y sus iniciales. | los primeros dos tests de auth/iniciales | Cubierto parcialmente | |
| Al obtener cualquier tarea, suelta o en la lista, su `assignee` no incluye el email ni otro dato de acceso. | "la contraseña nunca sale en la respuesta" | cubierto parcialmente | |
| Si el responsable se registró sin nombre, su nombre llega nulo y sus iniciales siguen llegando. | "una cuenta puede quedarse sin nombre" ,"sin nombre, las iniciales salen del email" | | |

Creí que al menos los primeros dos escenarios estarían cubiertos.
El primero por simple, solo se trata de averiguar si devuelve el nombre.
El segundo por seguridad básica: no filtrar ni email NI PASSWORD debería estar testeado.
El tercero es un requerimiento peculiar, pero el escenario está especificado, y por tanto esperaba que estuviera testeado, es trivial.

Las reglas en el spec parecen completas y correctas. Pero claramente faltaban tests que las validen.

Los tests no han sido difíciles de hacer conceptualmente, excepto por la interpretación de qué carácteres del email forman las iniciales en el caso de un user sin nombre.
