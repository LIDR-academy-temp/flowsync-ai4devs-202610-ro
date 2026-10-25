# Alcance del MVP de FlowSync

## 1. El terreno que ya existe

FlowSync hoy solo tiene cuentas: alta con email y contraseña, inicio y cierre de sesión, y una pantalla de perfil. El único concepto del producto es el **usuario** (nombre, email y credenciales). No existen tareas, ni estados, ni ninguna noción de equipo o de espacio de trabajo. El MVP no vuelve a especificar las cuentas: las usa tal cual para saber quién es el responsable de cada tarea.

## 2. El interrogatorio (respuestas ya decididas)

Una sola ronda de cinco preguntas, sin bajar a modelo de datos ni a endpoints. Las respuestas salen de la ficha de hechos del producto:

1. **¿Qué duele y a quién?** La ronda de "¿en qué estás?" de la daily y las interrupciones por chat. Duele a los pares (sobre todo a los dos que acaban haciendo lo mismo), no a un manager.
2. **¿Qué significa "tiempo real"?** Ver los cambios de estado de las tareas sin refrescar ni preguntar. No es chat, ni presencia, ni edición simultánea.
3. **¿De dónde sale el estado?** Lo escribe a mano quien hace la tarea, en dos clics. Nada derivado de Git, CI ni calendario.
4. **¿Convive con otro gestor o lo sustituye?** Lo sustituye. FlowSync crea las tareas; no las lee de ningún otro sitio.
5. **¿Qué es el éxito a una semana?** Que el equipo cancele la ronda de "¿en qué estás?" y nadie pida recuperarla.

**Supuestos, en los huecos que la ficha no cubre:**
- Todas las cuentas registradas forman parte de un único espacio compartido; quien se registra entra directamente en él.
- Una tarea tiene un solo responsable, o ninguno (tarea libre).
- Los estados son tres y fijos: *Por hacer*, *En curso* y *Hecha*. No se pueden configurar.
- Las tareas hechas siguen visibles; no hay archivo ni borrado masivo en el MVP.

## 3. El alcance

**Problema.** En un equipo remoto pequeño nadie ve en qué está cada uno sin interrumpir a alguien. Eso cuesta media daily y hace que dos personas empiecen la misma cosa sin saberlo (episodio real: dos días perdidos tocando el mismo módulo).

**Usuarios.** Equipos remotos de 3 a 10 personas con roles planos. Caso de estudio: un equipo de 6 personas de producto SaaS, repartido en 3 husos horarios.

**Propuesta de valor.** Una lista de tareas compartida que es a la vez la cola de trabajo de cada persona y el estado del equipo: actualizarla cuesta dos clics y nunca se queda desfasada en pantalla. Quien la actualiza saca algo al momento: decide qué coge a continuación y deja de recibir preguntas.

**Alcance (lo que entra):**
1. **Crear una tarea en segundos**: título obligatorio; responsable y fecha de vencimiento opcionales.
2. **Cambiar el estado** de una tarea (*Por hacer → En curso → Hecha*) con un clic desde la lista.
3. **Asignarse o reasignar** una tarea: ver de quién es o si está libre.
4. **Una lista compartida** con todas las tareas del espacio, que muestra quién lleva cada una, su estado y su fecha de vencimiento, y marca las vencidas.
5. **Filtrar la lista por estado.**
6. **La lista se actualiza sola** cuando otra persona cambia algo, sin refrescar.

## 4. El NO-alcance (lo que queda fuera, y por qué)

- **Notificaciones push / avisos.** La señal es un resumen que espera, no un aviso que interrumpe. Un aviso valida otra hipótesis ("la gente quiere enterarse al momento") y va contra el principio de "llego y miro".
- **Integración con Slack.** El producto pretende sustituir el "¿en qué estás?" por chat. Llevar el estado a Slack vuelve a colocar el chat en el centro y no ayuda a validar si el equipo mantiene la lista al día.
- **Presencia ("quién está conectado", indicadores de actividad).** El estado es de la tarea, no de la persona. La presencia es vigilancia y no cambia ninguna decisión sobre qué empezar.
- **Derivar el estado de Git, PRs, CI o calendario.** Es otro producto, con integraciones y OAuth de terceros. La hipótesis a validar es si la gente actualiza a mano cuando cuesta dos clics; automatizarlo la esquiva en lugar de probarla.
- **Importar o sincronizar con otro gestor de tareas (Jira, Linear…).** FlowSync sustituye, no convive. La doble actualización es como muere esta categoría, y sincronizar enmascararía el riesgo número uno: que la información se quede vieja.
- **Comentarios en tareas.** Se convierten en un chat por tarea. La hipótesis es "ver el estado sin preguntar", no "conversar sobre la tarea".
- **Descripción, etiquetas, prioridad u otros campos extra.** Cada campo es una fricción más al crear la tarea. "Menos rollo que Jira" es justo esto: título, responsable, estado y fecha.
- **Sprints, estimaciones, épicas, backlog priorizado.** Renuncia explícita: un equipo que necesite eso no es nuestro usuario, y ninguna de esas cosas ayuda a responder "¿quién está en qué?".
- **Analítica, informes y vistas para managers.** El valor lo cobran los pares; no hay reporte hacia arriba. Medir el éxito se hace observando la daily, no con un panel.
- **Varios equipos o espacios, gente en más de uno.** Un único espacio compartido. Separar equipos no ayuda a validar si un equipo deja de hacer la ronda; queda anotado como supuesto.
- **Roles y permisos.** Roles planos: todos ven y editan lo mismo. Los permisos protegen contra un problema (desconfianza dentro del equipo) que el caso de estudio no tiene.
- **"Qué ha cambiado desde mi última visita" (resumen de novedades).** Es la forma natural de la señal ("vuelvo de una reunión y veo qué se ha movido"), pero la lista con estados y responsables al día ya responde la pregunta que importa: qué está libre y qué está cogido. Ver la nota de la línea 3.
- **Vistas tablero/kanban, calendario o "mis tareas".** Una sola lista con filtro por estado basta para decidir qué coger. Más vistas son más superficie sin validar nada nuevo.
- **Avisos de conflicto ("alguien ya está en esto").** Es la decisión que el producto quiere cambiar, pero si la lista compartida no basta para evitarlo, un aviso tampoco lo arreglaría: sería ocultar que la hipótesis principal falla.
- **Cubrir la parte de bloqueos de la daily.** La daily no desaparece entera; este MVP solo quita la ronda de "¿en qué estás?". Prometer más sería venderlo de más.

---

## Las tres líneas

1. **Los dos números:** la IA propuso **11** cosas dentro del alcance; tras mi recorte quedaron **6**.
   - Propuesta de la IA: crear tarea, cambiar estado, asignar, lista compartida, filtro por estado, actualización sin refrescar, resumen de cambios desde la última visita, aviso de conflicto, vista "mis tareas", tablero kanban y descripción de tarea.
   - Quedan dentro las seis primeras.

2. **Tres cosas que dejé fuera, y por qué:**
   - *Comentarios en tareas:* no ayudan a validar que el estado se vea sin preguntar; abren una conversación, que es justo lo que se quiere quitar.
   - *Derivar el estado de Git/PRs:* esquiva la hipótesis que hay que probar (que la gente actualiza a mano si cuesta dos clics) en vez de validarla.
   - *Aviso de conflicto "alguien ya está en esto":* si la lista compartida no evita que dos personas vayan a lo mismo, un aviso solo taparía que la idea principal no funciona; no aporta nada para validarla.

3. **La exclusión de la que menos seguro estoy:** el **resumen de "qué ha cambiado desde mi última visita"**. La ficha dice que la señal es un resumen que espera ("llego por la mañana y veo qué se ha movido"), pero también pide una vertical fina terminada antes que tres capabilities a medias. Con la lista al día veo el *estado actual*, no *qué se ha movido*; para alguien que trabaja en otro huso horario eso puede no bastar. Entraría si en la primera semana el equipo sigue preguntando "¿qué ha pasado mientras no estaba?" aunque la lista esté al día.
