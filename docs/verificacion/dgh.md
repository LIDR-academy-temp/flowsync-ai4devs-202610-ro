# Parte A: Matriz de trazabilidad

- Scenarios en el requisito: 3 · Cubiertos: 0 

| Scenario | Test que lo cubre | Estado | Qué faltó | 
|----------------------------------|-------|-----------|------------------------------------------------------------------------------------|
|Responsable identificable         |Ninguno|NO cubierto|Pedir una tarea, suelta y en lista, y comprobar assignee.name === 'Ada Lovelace' y assignee.initials === 'AL'| 
|La tarea no filtra datos de cuenta|Ninguno|NO cubierto|Comprobar que assignee no tiene email, en la tarea suelta y en cada elemento de la lista| 
|Responsable sin nombre            |Ninguno|NO cubierto|Con una cuenta sin nombre como responsable de una tarea, comprobar assignee.name = null, assignee.initials = 'AE'|

# Parte B: las tres líneas
- 0, 1 
- Responsable sin nombre: El test validó que en la respuesta no llegará el email, pero realmente la spec no solicitaba validar eso. 
- Responsable sin nombre: Se adiciona el email para crear el usuario que se asigna a assignee, y eso no esta especificado en el escenario, y se adicionó debido que al ser el fullName null las iniciales salen del email.