Parte A: el alcance
## Prompt 1
da un resume de qué capabilities hay ya construidas y cómo es el modelo de datos actual
```
El proyecto ya tiene la autenticación completa de punta a punta: el backend en AdonisJS expone signup, login, perfil y logout con tokens opacos, y el frontend en React tiene las pantallas de registro, login y perfil con rutas protegidas, sesión persistida en localStorage y errores de validación traducidos por campo. El modelo de datos se limita a users (id, fullName opcional, email único, password, timestamps) y auth_access_tokens. No existe todavía ninguna entidad del dominio (tareas, proyectos, equipos) ni ningún test. Lo que se especifique debe apoyarse en este usuario y este mecanismo de auth, no rehacerlos.
```

## Prompt 2
 Genera las cinco preguntas que más reducirían la incertidumbre sobre el problema, los usuarios y el alcance, no bajes al modelo de datos o los enpoints

 ```
Estas son las cinco preguntas, en una sola ronda y sin entrar en datos ni endpoints. Doy por conocido el terreno del Prompt 1 (auth y usuario ya hechos).

El dolor. ¿Qué hace hoy el equipo para saber en qué está cada uno, y qué parte de eso duele de verdad? ¿Tienes un episodio reciente en el que costara algo medible? ¿Qué reunión o ritual debería desaparecer, y cuál seguiría existiendo?

Los usuarios. ¿Qué tamaño tiene el equipo, en cuántos husos horarios trabaja y qué roles tiene? ¿Quién se beneficia: los propios compañeros, o un lead o manager que quiere visibilidad? ¿Quién actualiza la información y qué gana esa persona en el momento de escribirla?

"Más en tiempo real". ¿Qué hay que ver sin preguntar ni refrescar, y cuándo se consulta? ¿Hablamos del estado de las tareas o de la presencia de las personas? ¿Debe avisar en el momento o dejar un resumen que espera a que lo mires? ¿Qué decisión concreta cambia el usuario por tener esa información fresca?

"Menos rollo que Jira". ¿FlowSync sustituye al gestor de tareas actual o convive con él? ¿Qué es lo mínimo que necesita una tarea? ¿A qué se renuncia explícitamente (sprints, estimaciones, épicas, informes)? ¿El estado lo escribe la persona o se deriva de Git, CI o el calendario?

Fronteras y éxito. ¿Hay un único espacio compartido o varios equipos separados? ¿Qué funcionalidades ya están descartadas? ¿Quieres una vertical fina que funcione de punta a punta o algo más amplio? ¿Qué tendría que pasar tras una semana de uso real para decir que ha funcionado?

Ahora toca pegarme la ficha de hechos del README entera y de una vez, junto con la línea "Fuera del MVP". Lo que la ficha no cubra lo decidiré yo y lo marcaré como supuesto. 

```
Parte B
```
1. Los dos números
La IA ha propuesto 9 cosas dentro del alcance.
Quedaron 2 Cosas despues del recorte

2. Que deje fuera
 Fecha de vencimiento opcional, con una marca visual cuando la tarea está vencida. Porque no considero que esta inferfiera con el resultado de lo que se plantea.

 "Qué se ha movido desde tu última visita": se resaltan las tareas que cambiaron desde la última vez que la abriste. Es el resumen que espera, en lugar de una notificación. Este lo considero algo redundante y mas por el hecho que en un punto anterior ya sugiere una actualizacion de la lista de tareas al crear o modificar una tarea

 Editar el título y borrar tareas.Este punto considero que los cambios de estatus puden ser una forma de suplir el borro a vista del usuario y el cambio de titulo buen puede ser agregado como una mejora a futuro.
```
3. La exclusión de la que menos seguro estás,
```
Editar el título y borrar tareas. Esto lo considero la mas simple y de menor tiempo requerido, ademas lo veo como un posible requisito de un usuario final.
```
La fecha contradice la ficha. La ficha dice textualmente que una tarea necesita "título, responsable, estado y fecha de vencimiento", y que la fecha sirve para "ver de un vistazo qué se ha pasado de plazo". Al quitarla, el documento se aparta de una respuesta del producto que ya estaba decidida. Puedes sostenerlo, pero tienes que justificarlo como una decisión tuya contra la ficha, no como algo que ella permite.
```