# Alcance del MVP de FlowSync

## 1. El terreno que ya existe

- Capabilities construidas: registro, login con token de acceso, ver el propio perfil y logout. Pantallas: login, registro y perfil.
- Modelo de datos: solo usuarios (email, nombre opcional, contraseña) y sus tokens de acceso.
- No existen todavía tareas, equipos ni nada en tiempo real. El MVP parte de "usuarios que pueden entrar".

## 2. El interrogatorio

Una sola ronda de cinco preguntas (dolor y quién lo sufre, qué significa "tiempo real", de dónde sale el estado, convivir o sustituir, usuarios y criterio de éxito), respondidas con la ficha de hechos del producto.

Supuestos que declara la IA donde la ficha no llegaba:

- Registro abierto: con espacio único, cualquier usuario registrado ve y edita todas las tareas. Vale para el caso de estudio, no para producción.
- La fecha de vencimiento es un día, sin hora; "vencida" se evalúa en la zona horaria de quien mira.
- Cualquiera puede borrar una tarea, igual que editarla (roles planos).
- Al pasar a "Hecha", la tarea conserva su responsable (quién la hizo).
- Si una tarea vuelve de "En curso" a "Pendiente", pierde el responsable y vuelve a estar libre.
- Aceptado: no se puede reservar trabajo. Una tarea que alguien piensa coger mañana se ve libre hasta que la pasa a "En curso".
- Aceptado: no se puede traspasar una tarea en curso. Para que la siga otra persona, se devuelve a "Pendiente" y la otra persona la coge.
- Ver el estado actual basta para no preguntar: el MVP no señala qué cambió desde la última vez que miraste.

## 3. El alcance

### Problema

En un equipo remoto pequeño nadie ve en qué está cada uno sin interrumpir a alguien. El resultado es la ronda de "¿en qué estás?", que se come la mitad de la daily y continúa por chat durante el día, y trabajo duplicado que se descubre tarde: dos personas tocaron el mismo módulo la misma semana y se perdieron dos días. La parte de bloqueos de la daily sigue existiendo y este MVP no la resuelve.

### Usuarios

Equipos remotos de 3 a 10 personas, en varios husos horarios, con roles planos: todos ven y editan lo mismo. El valor lo cobran los pares, no un lead. Caso de estudio: equipo SaaS de 6 personas en 3 husos horarios, con un gestor de tareas pesado y una daily de 15 minutos por videollamada.

### Propuesta de valor

Una lista única de tareas compartidas que es a la vez la cola de trabajo de cada uno y la foto del equipo. Actualizar cuesta dos clics, y los cambios aparecen solos para los demás. Quien la escribe cobra en el momento: decide con ella qué coge y deja de recibir el "¿cómo vas?". Sustituye al gestor de tareas, no convive con él.

Hipótesis que el MVP tiene que validar:

- **H1**: el estado se mantiene fresco porque actualizarlo cuesta dos clics y la lista le sirve a quien la escribe. Es el riesgo #1.
- **H2**: con el estado del equipo visible de un vistazo, la ronda de "¿en qué estás?" deja de hacer falta.
- **H3**: ver quién está en qué evita empezar algo que ya tiene otra persona.

Criterio a una semana de uso real: el equipo cancela la ronda de "¿en qué estás?" y nadie pide que vuelva.

### Alcance

1. **Crear una tarea en segundos.** Solo el título es obligatorio; la fecha de vencimiento es opcional. Nace en "Pendiente", sin responsable. Valida H1.
2. **Cambiar el estado en uno o dos clics** desde la propia lista. Estados fijos, sin configuración: Pendiente, En curso, Hecha. Valida H1 y H2.
3. **Lista única compartida**, con título, responsable, estado y vencimiento a la vista, y las tareas vencidas sin terminar destacadas. Valida H2.
4. **Filtro por estado**, para centrarse en lo pendiente. Valida H1: es lo que convierte la lista en cola personal.
5. **Cambios visibles sin refrescar**: lo que mueve otra persona aparece en tu lista abierta. Valida H2 y H3.
6. **El responsable lo fija el estado.** Una tarea "Pendiente" no tiene responsable: así se sabe que nadie está con ella. Al pasar a "En curso" queda asignada automáticamente a quien la ha movido, sin pasos extra. Valida H2 y H3.

### NO-alcance

- **Marca de "ha cambiado desde tu última visita".** El vistazo que necesita H2 ya lo da la lista (punto 3). Ninguna hipótesis exige señalar qué cambió desde que miraste.
- **Notificaciones push, por email o vía Slack.** La señal es un resumen que espera, no un aviso que interrumpe. Además mezclarían hipótesis: si la ronda desaparece, no sabríamos si fue por la lista o por los avisos.
- **Asignar o reasignar a mano.** El responsable lo fija el paso a "En curso" (punto 6), así que no hace falta un gesto aparte. Asignar de antemano tareas pendientes rompería la señal de H3: "Pendiente" dejaría de significar "libre".
- **Presencia ("conectado ahora", última actividad).** Mide a la persona, no a la tarea, y no aporta a H1, H2 ni H3. Es vigilancia y se rechaza a propósito.
- **Comentarios y conversación en tareas.** La hipótesis es que el estado basta sin conversar. Si hiciera falta comentar para entenderse, H2 habría fallado, y queremos verlo.
- **Estado "Bloqueada" o gestión de bloqueos.** La parte de bloqueos de la daily se queda a propósito. Meterla mide otra reunión y otro problema.
- **Estados y flujos configurables.** Configurar es el "rollo" del que se huye, y tres estados fijos bastan para saber quién está en qué.
- **Campos extra (descripción, prioridad, etiquetas, subtareas, adjuntos).** Cada campo encarece crear y actualizar, y ataca H1. Ninguno cambia la decisión de qué está libre o quién lo tiene.
- **Sprints, estimaciones, épicas y backlog priorizado.** Es la renuncia explícita del producto: un equipo que los necesite no es nuestro usuario.
- **Informes, analítica y vistas para managers.** El valor es entre pares y no hay reporte hacia arriba: optimizarían para un usuario que no tenemos.
- **Roles y permisos.** Roles planos por decisión de producto; los permisos no afectan a ninguna hipótesis.
- **Varios equipos, o personas en más de un equipo.** El problema se valida con un equipo en un espacio único. Multi-equipo es escalar, no validar.
- **Integraciones (Git/PRs, CI, calendario) para derivar el estado.** Es otro producto, con OAuth de terceros. Además anularía H1, que es justo que el estado tecleado a mano se sostiene.
- **Importar o sincronizar con Jira u otro gestor.** FlowSync sustituye, no convive. La doble actualización mata la categoría y contaminaría la medida de H1.
- **Historial por tarea o feed de actividad.** Es auditoría, no frescura. No lo necesita ninguna hipótesis.
- **Edición simultánea, chat y videollamada.** No son lo que significa "tiempo real" aquí.
- **App móvil, búsqueda, ordenación manual y arrastrar y soltar.** Con 3 a 10 personas, una lista filtrada por estado basta para el vistazo.
- **Invitaciones y onboarding de equipo.** Con espacio único, quien se registra entra en él (ver supuestos).
- **Cambio de responsable en tareas en curso**: No se puede traspasar una tarea en curso. Si quien la lleva se va de vacaciones, la única salida es devolverla a "Pendiente" y que otra persona la vuelva a coger.

##  La IA me discutió una decisión tuya y tenía razón

- Cuando le he indicado que se asignaba automáticamente el responsable cuando la tarea se ponía en curso. No se puede traspasar una tarea en curso. Si quien la lleva se va de vacaciones, la única salida es devolverla a "Pendiente" y que otra persona la vuelva a coger.

## Parte B: las tres líneas

1. **Los dos números.** La IA propuso 7 cosas dentro del alcance; tras mi recorte quedaron 6 (quité dos y añadí una).
2. **Tres cosas que dejé fuera, y por qué cada una.**
    - Punto 7.Marca de "ha cambiado desde tu última visita" para el caso de llegar por la mañana o volver de una reunión. Valida H2. Es la primera candidata a recortar. -> Lo he quitado porque el mensaje de Negocio lo he entendido como que 
    quería ver el tablero actualizado. En todo caso, convendría confirmar, de manera explícita, con Negocio.
3. **La exclusión de la que menos seguro estoy, y qué tendría que pasar para que entrara.**
    - Cambio de responsable en tareas en curso: si se permite asignar el usuario de forma manual, y no suponer que sea caro, al pasar la tarea a "En Curso" o cuando ya está en ese estado, se podría quitar de NO-Alcance y añadir un alcance nuevo
