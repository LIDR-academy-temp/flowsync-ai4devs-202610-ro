# Alcance del MVP de FlowSync

«Quiero que FlowSync sea una herramienta para que los equipos remotos sepan en qué está trabajando cada uno sin tener que hacer reuniones de sincronización. Algo tipo tareas compartidas pero más en tiempo real y menos rollo que Jira.»

## 1. El terreno que ya existe 

Por ahora FlowSync solo tiene autenticación y cuenta de usuario. Todavía no hay nada del dominio: ni tareas, ni equipos, ni proyectos, ni asignaciones.

## 2. Interrogatorio

1. ¿Qué te hace hoy convocar una reunión de sincronización?
2. ¿Quién es el usuario principal y cómo es su equipo?
3. ¿Qué significa para ti "en tiempo real" y "menos rollo que Jira"?
4. ¿Cómo y cuándo cuenta cada persona lo que está haciendo?
5. ¿Qué queda dentro del MVP y qué fuera, y cómo sabrás que ha funcionado?

## 3. Alcance


## Problema
En un equipo remoto pequeño nadie ve en qué está cada uno sin interrumpir a alguien. Eso tiene dos costes:
- **Colisión:** dos personas empiezan lo mismo sin saberlo. En el caso de estudio, dos personas tocaron el mismo módulo la misma semana y se perdieron dos días.
- **Interrupción:** el "¿en qué estás?" constante por chat, y la ronda de estado de la daily, que se come la mitad de los 15 minutos.

Qué no es el problema:
- No es la falta de reporting hacia arriba.
- No son los bloqueos. La parte de bloqueos de la daily sigue existiendo y este MVP no la resuelve.

## Usuarios
- **Usuario:** quien hace el trabajo, dentro de un equipo remoto de 3 a 10 personas con roles planos. Todos ven y editan lo mismo.
- **Quién se beneficia:** los compañeros, no un lead. No hay comprador ni manager en la ecuación.
- **Caso de estudio:** equipo de producto SaaS de 6 personas en 3 husos horarios. Hoy usan un gestor de tareas pesado y una daily de 15 minutos por videollamada. Es un caso de estudio, no un cliente.
- **Supuesto:** hay un único espacio compartido. Quien se registra entra en él.

## Propuesta de valor
**Ver de un vistazo quién está con qué y qué está libre, sin preguntar a nadie.**

- **Decisión que habilita:** no empezar algo que otra persona ya está tocando, y elegir lo siguiente sabiendo qué está libre.
- **Por qué se mantiene actualizado:** la lista es la propia cola de trabajo de cada persona. Actualizarla cuesta dos clics, sin campos obligatorios, y quien la actualiza deja de recibir interrupciones.
- **Sustituye al gestor de tareas, no convive con él:** tener que actualizar dos herramientas es lo que mata esta categoría de producto.
- **Criterio de éxito:** tras una semana de uso real, el equipo cancela la ronda de "¿en qué estás?" de la daily y nadie pide que vuelva. Si la siguen haciendo igual, no ha funcionado.
- **Riesgo #1 a validar:** que el estado se quede viejo. Se mitiga abaratando la actualización, no obligando a nadie.

## Alcance (una sola vertical, terminada de punta a punta)
1. **Acceso:** registro, login y logout. Ya está construido.
2. **Crear una tarea en segundos.** Solo el título es obligatorio. Responsable y fecha de vencimiento son opcionales. Una tarea sin responsable significa que está libre.
3. **Tres estados fijos:** Por hacer, En curso y Hecho. No se pueden configurar.
4. **Cambiar el estado o "cogerla yo" en uno o dos clics, desde la propia lista.** "Cogerla yo" asigna la tarea a quien pulsa y la pone En curso.
5. **Una única lista compartida.** Cada tarea muestra título, responsable, estado y fecha.
   - Filtro por estado. Por defecto se ve lo que no está Hecho.
   - Las tareas vencidas se marcan visualmente.
6. **Frescura sin refrescar:** los cambios de los demás aparecen en la lista abierta sin recargar la página.
7. **Editar los campos de una tarea:** título, responsable y fecha.

## NO-alcance (y por qué)
| Fuera | Por qué |
|---|---|
| Notificaciones push / email | La señal es un resumen que espera. Interrumpir es justo el dolor que queremos quitar. |
| Recordatorios para actualizar | Obligar a actualizar es justo lo que hace pesado a Jira. La apuesta es que actualizar sea barato. Si falla, el riesgo #1 lo detectará. |
| Integración con Slack | Nos devuelve al canal de las interrupciones y obliga a mantener dos sitios. |
| Derivar el estado de Git, PRs, CI o calendario | Es otro producto, con integraciones y OAuth de terceros. El estado lo teclea quien hace la tarea. |
| Importar o sincronizar con otro gestor de tareas | FlowSync sustituye al gestor, no convive con él. Sincronizar implica doble fuente de verdad. |
| Roles y permisos | Los roles son planos y el equipo es pequeño. Una jerarquía añade configuración sin cambiar la decisión de nadie. |
| Varios equipos, gente en más de un equipo, invitaciones | Con un espacio único basta para validar con un equipo. Queda anotado como supuesto. |
| Presencia ("quién está conectado"), indicadores de actividad | El estado es de la tarea, no de la persona. Lo otro es vigilancia, y lo rechazamos a propósito. |
| Comentarios en tareas, chat | No ayudan a decidir qué coger. Convierten la herramienta en otro canal de conversación. |
| Estado "Bloqueado" y gestión de bloqueos | Hemos dicho que la parte de bloqueos de la daily sigue. Prometerlo a medias diluye la vertical. |
| Estados o flujos personalizables | Configurar es el "rollo" de Jira. Tres estados bastan para saber quién está en qué. |
| Sprints, estimaciones, épicas, backlog priorizado | Renuncia explícita. Un equipo que lo necesite no es nuestro usuario. |
| Analítica, informes, historial navegable | No hay nadie que mire hacia arriba. El "qué se ha movido" cubre la necesidad real. |
| Descripción, etiquetas, prioridad, subtareas, adjuntos | Cada campo encarece la creación. Con el título basta para saber quién está en qué. |
| Borrar o archivar tareas | El filtro por estado ya oculta lo Hecho. No añade valor a la decisión central. |
| Búsqueda, ordenación avanzada, vistas Kanban o calendario | Con 3 a 10 personas, una lista filtrada por estado cabe en una pantalla. |
| Detección automática de duplicados | La lista con responsable y estado visibles ya evita la colisión. Detectar similitud es otra apuesta. |
| App móvil | El trabajo se hace en el escritorio y la lista vive en el navegador. |




## Parte B: las tres líneas
# Los dos números
La IA propuso 8 cambios, tras mi recorte quedaron 7
# Tres cosas que dejaste fuera, y por qué cada una
| Borrar o archivar tareas | El filtro por estado ya oculta lo Hecho. No añade valor a la decisión central. | -- La dejo fuera porque se pueden equivocar con la tarea o desecharla, que se realiza para "borrar o archivar" marcarla como hecha
| Notificaciones push / email | La señal es un resumen que espera. Interrumpir es justo el dolor que queremos quitar. | -- La dejo fuera porque se tiene que promover que actualicen el estado de sus tareas, la interrupción no les quitaria mucho tiempo
|Qué se ha movido desde tu última visita| al entrar, se resaltan las tareas que han cambiado. Es un resumen que espera, no un aviso que interrumpe. -- Dejada fuera no veo el valor agregado en un MVP para agregar esta funcionalidad, solo "resaltar tareas" cuando ya tenemos el refresh de las tareas

# La exclusión de la que menos seguro estás

| Notificaciones push / email | La señal es un resumen que espera. Interrumpir es justo el dolor que queremos quitar. |
Aqui se contradice el tiempo al interrumpir que es justo lo que adolecen, en cambio yo veo que no es algo que quite mucho tiempo