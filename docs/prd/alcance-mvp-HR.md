# FlowSync: requisitos del MVP

> Este documento solo describe lo que hay que construir. Ya existen el registro, el inicio y el cierre de sesión y la página de perfil (ver *El terreno que ya existe*), así que no se repiten aquí.
> Lo marcado como **[Supuesto]** es una decisión tomada sin confirmar con usuarios reales: hay que validarla.

## Problema

En un equipo remoto nadie ve en qué está trabajando el resto sin interrumpir a alguien. Para enterarse, el equipo depende de:

- la ronda de "¿en qué estás?" de la daily, que se come la mitad de sus 15 minutos;
- las preguntas sueltas por chat a lo largo del día ("¿en qué estás?", "¿cómo va lo tuyo?"), que cortan la concentración de quien las recibe.

Cuando ni eso basta, el coste es trabajo perdido. En el caso de estudio, dos personas tocaron el mismo módulo la misma semana porque una empezó sin que la otra lo supiera: se perdieron dos días.

Las herramientas de tareas que existen no lo resuelven porque son pesadas de mantener. Tienen campos obligatorios, flujos que configurar, sprints y estimaciones. El estado acaba desactualizado y el equipo vuelve a preguntar.

**Lo que este MVP no resuelve:** la daily no desaparece. Solo desaparece su ronda de "¿en qué estás?". La parte de bloqueos se mantiene y queda fuera de este alcance.

## Usuarios

- **Equipos remotos pequeños, de 3 a 10 personas, con roles planos.** Todos ven y editan lo mismo. No hay jefe, ni permisos distintos, ni reportes hacia arriba.
- **Quién obtiene el valor:** los propios compañeros, no un responsable. En concreto:
  - quien está a punto de empezar algo y necesita saber si otra persona ya lo está tocando;
  - quien busca qué hacer a continuación y necesita ver qué está libre;
  - quien hoy recibe interrupciones preguntándole cómo va lo suyo.
- **Primer usuario de referencia (caso de estudio, no un cliente real):**
  - equipo de 6 personas de un producto SaaS, repartidas en 3 husos horarios;
  - hoy usa un gestor de tareas pesado y hace una daily de 15 minutos por videollamada.
- **Quién no es nuestro usuario:** un equipo que necesite sprints, estimaciones, épicas, backlog priorizado o informes.

## Propuesta de valor

**FlowSync es donde el equipo hace su trabajo, no donde lo cuenta:** una lista compartida de tareas que siempre está al día y que se actualiza en segundos.

- **Evita trabajo duplicado.** Antes de empezar algo, ves si otra persona ya lo está tocando.
- **Ayuda a elegir lo siguiente.** Ves de un vistazo qué está libre.
- **Sustituye a la pregunta.** Al llegar por la mañana o al volver de una reunión, abres la lista y ves en qué está cada uno sin preguntar a nadie y sin que nada te interrumpa.
- **Responde a "¿cómo va lo tuyo?" sin preguntar.** Los comentarios de cada tarea cuentan cómo avanza.
- **Quien actualiza también gana, en el momento.** La lista es su propia cola de trabajo, así que la consulta para decidir qué coge. Además, deja de recibir preguntas sobre cómo va lo suyo.
- **Menos complicaciones que un gestor de tareas al uso.** Crear una tarea o cambiarle el estado se hace en dos clics. No hay campos obligatorios más allá del título, ni configuración, ni sprints, ni estimaciones.

FlowSync **sustituye** al gestor de tareas actual, no convive con él: las tareas se crean aquí. Si hubiera que actualizar dos herramientas a la vez, se dejaría de actualizar una de las dos.

**Cómo sabremos que funciona:** tras una semana de uso real, el equipo ha dejado de hacer la ronda de "¿en qué estás?" de la daily y nadie pide que vuelva. Si la siguen haciendo igual, no ha funcionado.

**Riesgo principal:** que la información se quede vieja, porque entonces el producto pierde el sentido. La mitigación es que actualizar cueste dos clics. Nunca obligar a nadie.

## Alcance

El MVP es una sola funcionalidad completa y usable de principio a fin: **la lista de tareas compartida del equipo**.

### 1. Espacio único del equipo

- Hay un solo espacio compartido. Todas las personas con cuenta ven y editan las mismas tareas, sin permisos distintos.
- **[Supuesto]** Cualquiera que se registra entra directamente en ese espacio, sin invitación. Un despliegue de FlowSync equivale a un equipo.
- **[Supuesto]** No hay concepto de "equipo" en el producto. Funcionar con varios equipos separados, o con personas que pertenecen a más de uno, queda fuera.

### 2. Crear una tarea en segundos

- Una tarea tiene cuatro datos: **título, responsable, estado y fecha de vencimiento**.
- Solo el título es obligatorio. Se puede crear una tarea escribiendo únicamente el título.
- **[Supuesto]** Una tarea nueva empieza en el estado "Por hacer" y sin responsable, salvo que quien la crea indique otra cosa.

### 3. Estados de una tarea

- **[Supuesto]** Hay tres estados fijos, que no se pueden configurar:
  - **Por hacer**
  - **En curso**
  - **Hecho**
- Cambiar el estado cuesta como mucho dos clics, desde la propia lista y sin abrir un formulario.

### 4. Responsable y tareas libres

- **[Supuesto]** El responsable es opcional. Una tarea sin responsable está **libre**.
- Cualquiera puede quedarse una tarea libre con un clic, o cambiar el responsable de cualquier tarea.
- Desde la lista se ve de un vistazo quién lleva cada tarea y cuáles están libres.

### 5. Editar y eliminar

- Cualquiera puede cambiar el título, el responsable y la fecha de vencimiento de cualquier tarea.
- **[Supuesto]** Cualquiera puede eliminar una tarea, por ejemplo una creada por error o duplicada.

### 6. Vencimientos a la vista

- Las tareas que han pasado su fecha de vencimiento sin estar en "Hecho" se distinguen de un vistazo en la lista.

### 7. Filtrar por estado

- La lista se puede filtrar por estado, por ejemplo para ver solo lo pendiente o solo lo que está en curso.

### 8. Comentarios en tareas

- El estado dice en qué está cada uno, pero no cómo va. Para responder a "¿cómo va lo tuyo?" sin interrumpir, cualquiera puede añadir comentarios a una tarea.
- Cada comentario muestra quién lo escribió y cuándo. Los comentarios de una tarea se leen en orden.
- **[Supuesto]** Los comentarios son solo texto. No hay menciones, respuestas en hilo, reacciones ni adjuntos, y escribir un comentario no avisa a nadie.

## NO-alcance

| Fuera del MVP | Por qué |
|---|---|
| **Notificaciones push** (y avisos por email) | La señal tiene que ser un resumen que espera, no un aviso que interrumpe. El problema que queremos quitar es justo la interrupción. |
| **Integración con Slack** | Llevaría el estado al chat, que es el canal de interrupciones que queremos reducir. Además, añade dependencia de otra herramienta sin cambiar ninguna decisión del usuario. |
| **Roles y permisos avanzados** | Los equipos objetivo tienen roles planos y todos editan lo mismo. Una jerarquía de permisos añade complicaciones sin un problema que resolver. |
| **Analítica, reporting e informes** | El valor es para los compañeros, no para un responsable. No hay reporte hacia arriba y a un manager le daría igual. |
| **Menciones, respuestas en hilo, reacciones y avisos por comentario** | Convertirían los comentarios en un chat que interrumpe. El comentario es una nota de avance que espera a quien quiera leerla, no una conversación. |
| **Sprints, estimaciones, épicas, backlog priorizado** | Es precisamente lo que hace pesado a un gestor de tareas y lo que provoca que deje de actualizarse. Un equipo que lo necesite no es nuestro usuario. |
| **Campos adicionales en la tarea** (descripción, prioridad, etiquetas, subtareas, adjuntos) | Con título, responsable, estado y fecha basta para saber quién está en qué. Cada campo más alarga lo que hoy cuesta dos clics. |
| **Estados configurables o flujos de trabajo** | "Menos complicado que Jira" significa no tener que configurar nada. Tres estados fijos responden a qué está libre, qué está en curso y qué está hecho. |
| **Gestión de bloqueos** | Es la parte de la daily que se mantiene. Este MVP no pretende resolverla, y prometerlo sería vender de más. |
| **Estado derivado de otras herramientas** (repositorio de código, integración continua, calendario) | Es otro producto, con integraciones y autorizaciones de terceros. En el MVP, el estado lo escribe la persona que hace la tarea, en segundos. |
| **Importar o sincronizar con otro gestor de tareas** | FlowSync sustituye al gestor actual, no convive con él. Si hubiera que actualizar los dos, se acabaría abandonando uno. |
| **Varios equipos o personas en más de un equipo** | El MVP es un único espacio compartido. Lo dejamos anotado como supuesto, pero no se construye. |
| **Presencia e indicadores de actividad** ("quién está conectado", "visto por última vez") | El estado es de la tarea, no de la persona. Seguir la actividad de las personas es vigilancia y lo rechazamos a propósito. |
| **Ver los cambios sin refrescar** (actualización en tiempo real de la lista) | Es un extra deseable, pero no ayuda a comprobar si FlowSync mantiene al equipo al día: con recargar la página se ven los cambios. Lo que se valida es si la gente actualiza sus tareas, no a qué velocidad llega el cambio. |
| **Destacar qué ha cambiado desde mi última visita** | Es un extra deseable por la misma razón: al abrir o recargar la lista ya se ve el estado actual de cada tarea. Se puede añadir si la validación demuestra que la lista se mantiene al día. |
| **Chat, videollamada o edición simultánea** | La necesidad es saber en qué está cada uno, no conversar ni trabajar a la vez sobre lo mismo. Son otros productos. |
| **Obligar a actualizar** (recordatorios, campos forzados, bloqueos por falta de estado) | La mitigación contra la información vieja es que actualizar sea barato, no obligatorio. Si se obliga, la gente lo rellena mal o deja la herramienta. |

## Parte B: Las tres lineas
### 1. Los dos números
- Cuántas cosas propuso la IA meter dentro del alcance - 9
- Cuántas quedaron dentro después de tu recorte - 8 (quite dos pero agregue una)
### 2. Tres cosas que dejaste fuera, y por qué cada una. 
- Ver los cambios sin refrescar - Esta es funcionalidad nice to have, no ayuda a evaluar si FlowSync mantiene a todos actualizados todo el tiempo; un F5 refresca la pantalla; muevelo a NO-alcance
- Qué ha cambiado desde mi última visita - Esta es funcionalidad nice to have, no ayuda a evaluar si FlowSync mantiene a todos actualizados todo el tiempo; un F5 refresca la pantalla; muevelo a NO-alcance
### 3. La exclusión de la que menos seguro estás, y qué tendría que pasar para que entrara.
- Roles y permisos avanzados - Si el concepto de autorizacion es lo sufucientemente importante para el PO para incluirlo en el MVP, yo pienso que se pero se me acabo el tiempo para invludirlo