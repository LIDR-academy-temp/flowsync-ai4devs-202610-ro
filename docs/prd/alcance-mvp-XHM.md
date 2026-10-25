### -----------------------------------------
### 🅰️ Parte A: el alcance
### -----------------------------------------

**1. El terreno que ya existe (3-5 líneas).** 
1. Funcionalidades: solo hay autenticación. El backend ofrece signup, login, perfil y logout con tokens de acceso. El frontend tiene las pantallas de login, registro y perfil, con rutas protegidas y la sesión guardada en localStorage.
2. Modelo de datos: 2 tablas, users (id, full_name, email único, password, timestamps) y auth_access_tokens (con FK a users y borrado en cascada). El único modelo es User.
3. Pendiente: no hay nada de tareas (ni modelo, ni API, ni UI) y no hay tests, ni en backend ni en frontend.
4. Incompleto: los tokens no caducan, no se puede editar el perfil ni recuperar la contraseña, y la autenticación por sesión (web) está configurada pero sin uso.

**2. El interrogatorio, con las respuestas ya decididas.**
>> PREGUNTAS PROPUESTAS POR CLAUDE <<
Pregunta 1 de 5: el problema
¿Qué problema concreto tiene hoy el equipo que debería resolver FlowSync? ¿Tienes un caso real reciente en que ese problema les costara tiempo o trabajo?

Pregunta 2 de 5: los usuarios
¿Quién lo va a usar? Me interesa el tamaño del equipo, si trabajan en remoto o en distintos husos horarios, si hay roles distintos (por ejemplo, alguien que asigna y alguien que ejecuta) y cuál sería el primer equipo concreto que lo usaría.

Pregunta 3 de 5: la situación actual
¿Qué usan hoy para coordinarse (otra herramienta, una daily, mensajes por chat…)? Y FlowSync, ¿tiene que sustituir eso o convivir con ello?

Pregunta 4 de 5: los límites del alcance
¿Qué queda explícitamente fuera de esta primera versión? Por ejemplo: varios equipos, permisos, notificaciones, integraciones con otras herramientas, comentarios o informes. Y si se habla de "tiempo real", ¿qué significa exactamente para ti?

Pregunta 5 de 5: el éxito
¿Cómo sabremos que ha funcionado? ¿Qué debería cambiar en el día a día del equipo tras una o dos semanas de uso, y qué señal te diría que no ha servido?


**3. El alcance en cinco bloques.**
Propuesta de alcance del MVP: FlowSync

Hipótesis principal: si el equipo ve en una sola lista quién está con qué tarea, y actualizar su estado cuesta dos clics, dejará de hacer la ronda de "¿en qué estás?" de la daily.
Riesgo n.º 1: que la lista se quede desactualizada. Todo lo que no ayude a validar o mitigar este riesgo queda fuera.

1. Problema

En equipos remotos nadie sabe en qué está trabajando cada persona sin preguntarle. Eso cuesta en dos sitios:
- Tiempo: la ronda de "¿en qué estás?" ocupa la mitad de la daily de 15 minutos, y además hay preguntas constantes por chat.
- Trabajo duplicado: dos personas tocaron el mismo módulo la misma semana sin saberlo y se perdieron dos días.

2. Usuarios

- Equipos remotos pequeños, de 3 a 10 personas, en varios husos horarios y sin jerarquía: todos ven y editan lo mismo.
- Ganan los compañeros entre sí, no un responsable: quien va a empezar algo y quien hoy tiene que interrumpir para preguntar.
- Caso de estudio: un equipo SaaS de 6 personas en 3 husos horarios, que hoy usa un gestor pesado y una daily de 15 minutos.

3. Propuesta de valor

- Para el equipo: al llegar o al volver de una reunión, ver de un vistazo qué está cogido y qué está libre. Así nadie empieza algo que ya está tocando otra persona y se elige lo siguiente con información.
- Para quien actualiza: la lista es su propia cola de trabajo y la consulta igualmente. Actualizarla cuesta dos clics y le ahorra que le pregunten cómo va.
- Cómo se medirá: tras una semana de uso real, el equipo cancela la ronda de "¿en qué estás?" y nadie pide recuperarla.

4. Alcance del MVP (actualizado)

Es una sola funcionalidad completa de principio a fin: la lista compartida de tareas.

1. Acceso: registro, inicio y cierre de sesión. Ya está construido y se reutiliza tal cual.
2. Una sola lista compartida por todos los usuarios, sin equipos ni espacios.
3. Crear una tarea escribiendo solo el título. Ningún otro campo es obligatorio. (Sigue pendiente de que me confirmes si lo mantienes.)
4. Coger una tarea: con un clic, quien la coge pasa a ser su responsable. Una tarea sin responsable está libre.
5. Estado fijo de tres valores: Por hacer, En curso y Hecho. Se cambia en un clic desde la propia lista.
6. Filtrar la lista por estado, para centrarse en lo pendiente.
7. Actualización en directo: si alguien crea una tarea, la coge o le cambia el estado, el resto lo ve en su lista sin refrescar. Solo se actualiza la lista, sin avisos ni notificaciones y sin mostrar quién está conectado.

5. Fuera del MVP

Recortes que propongo yo (contradicen o recortan algo que diste por bueno; decides tú):

Excluido: Actualización en directo (ver los cambios sin refrescar)
Por qué: El uso real es "llego y miro qué se ha movido": una lista que muestra el estado
actual al abrirla ya cubre ese uso. Lo que se valida es si la gente mantiene el estado
al día, no cuánto tarda en llegar el cambio. Es el recorte más discutible: si en la
prueba aparecen choques de minutos, vuelve a entrar.
────────────────────────────────────────
Excluido: Fecha de vencimiento
Por qué: Responde a "¿qué va con retraso?", no a "¿quién está en qué?", que es lo que se
valida. Añade un campo y la tentación de convertirlo en obligatorio.
────────────────────────────────────────
Excluido: Asignar tareas a otras personas
Por qué: El equipo no tiene jerarquía y los hechos no lo piden: cada persona declara lo
que coge. Asignar a otros es el primer paso hacia el reparto de trabajo por parte de un
responsable, que no es este producto.
────────────────────────────────────────
Excluido: Editar el título y borrar tareas
Por qué: Las tareas terminadas desaparecen al filtrar por Hecho. Una errata o una tarea
huérfana no invalida una semana de prueba.
────────────────────────────────────────
Excluido: Marcar "qué ha cambiado desde tu última visita"
Por qué: Con 3 a 10 personas, la lista entera se lee de un vistazo.
────────────────────────────────────────
Excluido: Estados configurables o adicionales (bloqueado, en revisión…)
Por qué: La configuración es justo el "rollo" que se evita, y los bloqueos quedan
expresamente fuera de lo que este MVP resuelve.
────────────────────────────────────────
Excluido: Editar el perfil, recuperar la contraseña y borrar la cuenta
Por qué: No afectan a la hipótesis. En el caso de estudio basta con lo que ya existe.

Exclusiones que ya habías decidido tú:

┌───────────────────────────────┬────────────────────────────────────────────────────┐
│           Excluido            │                      Por qué                       │
├───────────────────────────────┼────────────────────────────────────────────────────┤
│ Varios equipos o personas en  │ El MVP es un único espacio compartido. Se anota    │
│ más de uno                    │ como supuesto en el PRD.                           │
├───────────────────────────────┼────────────────────────────────────────────────────┤
│ Roles y permisos              │ El equipo no tiene jerarquía: todos ven y editan   │
│                               │ lo mismo.                                          │
├───────────────────────────────┼────────────────────────────────────────────────────┤
│ Notificaciones push e         │ La señal es un resumen que espera a que lo mires,  │
│ integración con Slack         │ no un aviso que interrumpe. Interrumpir es justo   │
│                               │ lo que se quiere eliminar.                         │
├───────────────────────────────┼────────────────────────────────────────────────────┤
│ Indicadores de presencia o de │ El estado es de la tarea, no de la persona.        │
│  actividad                    │ Mostrar quién está conectado es vigilancia y se    │
│                               │ rechaza a propósito.                               │
├───────────────────────────────┼────────────────────────────────────────────────────┤
│ Estado deducido de Git, PRs,  │ Es otro producto, con integraciones y              │
│ CI o el calendario            │ autorizaciones de terceros. El estado lo escribe   │
│                               │ quien hace la tarea.                               │
├───────────────────────────────┼────────────────────────────────────────────────────┤
│ Importar tareas o convivir    │ FlowSync sustituye al gestor actual. Convivir con  │
│ con otro gestor               │ él obliga a actualizar dos sitios, y así muere     │
│                               │ esta categoría de producto.                        │
├───────────────────────────────┼────────────────────────────────────────────────────┤
│ Sprints, estimaciones,        │ Renuncia explícita: un equipo que necesite eso no  │
│ épicas, backlog priorizado e  │ es nuestro usuario.                                │
│ informes                      │                                                    │
├───────────────────────────────┼────────────────────────────────────────────────────┤
│ Comentarios, chat,            │ "Tiempo real" se refiere al estado de las tareas,  │
│ videollamada y edición        │ no a comunicarse.                                  │
│ simultánea                    │                                                    │
├───────────────────────────────┼────────────────────────────────────────────────────┤
│ Resolver los bloqueos de la   │ Esa parte de la reunión sigue existiendo y este    │
│ daily                         │ MVP no la ataca.                                   │
└───────────────────────────────┴────────────────────────────────────────────────────┘

### -----------------------------------------
### 🅱️ Parte B: las tres líneas
### -----------------------------------------
1. **Los dos números.** 6 -> 7

2. **Tres cosas que dejaste fuera, y por qué cada una.** 
En mi caso no quité ningún ajuste propuesta que planteó Claude, tal vez al decirle que fuese especialmente agresiva con los recortes hizo que sacase del scope alguna propusta que si debería estar. 
- Claude en su propuesta inicial decidió excluir el punto de la información en "tiempo real" ya que con una lista filtrada por estado "pendiente" ya esta suficiente. 
Yo pedí explícitamente añadir este punto a la propuesta, ya que se está solicitando y considero que es un objetivo básico tener una lista actualizada en tiempo real. No tener esta lista actualizada en tiempo real puede incurrir en el riesgo que 2 programadores se asignen la misma tarea.
- Editar el título y borrar Tareas: 
Cómo son introducidas las tareas es un punto que no queda muy claro en los hechos. Entiendo que la tarea debería ser entrada por un supervisor, aunque en los hechos se especifica claramente que no hay jerarquías, pero hay que entender que alguien las tiene que entrar y formular. Por ello, una en tarea no debería der poder modificar el título, para evitar posibles ambiguedades o incluso tener tareas repetidas con el mismo título, lo mosmo con la opción de borrar tareas, borrar una tarea implica que se pierde toda trazabilidad, y no queda nada informado, por ejemplo el motivo de por qué se borró o anuló.
- Asignar Tareas a otras personas:
Al no haber jerarquias, no tiene sentido que alguien pueda asignar tareas a otras personas, tal como se especifica, entro en la lista de tareas pendientes, las reviso y me asigno una a mi, no a otros.

3. **La exclusión de la que menos seguro estás**
Fecha de vencimiento: 
El objetivo de la propuesta inicial es tener una lista actualizada de las tareas que estan sin asignar, para poder asignarme una y garantizar que esa tarea no la esté realizando otra persona. Justo el punto del problema comentado en las especificaciones. Por lo tanto, añadir la fecha de vencimiento en este punto, no aporta valor y no es el objetivo. El objetivo es garantizar que la herramienta se usa, se está evitando preguntar a los compañeros "En qué estas", para así evitar trabajo duplicado.
Este dato AHORA no aporta valor, una vez la herramienta haya superado esta primera fase, si que tendrá sentido y mucho, pero ahora no es necesario para el POC.

