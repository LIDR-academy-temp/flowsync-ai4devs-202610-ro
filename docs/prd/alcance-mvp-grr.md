# Alcance MVP FlowSync (grr)

## 1. El terreno que ya existe

- Hoy FlowSync solo resuelve la **identidad**: una persona puede registrarse (nombre opcional, email único y contraseña), iniciar sesión, ver su perfil y cerrar sesión.
- La sesión es un token que el frontend guarda en el navegador y recupera al arrancar. Sin sesión, solo se ven las pantallas de login y registro; con sesión, todo redirige al perfil.
- El modelo de datos tiene una única entidad de negocio, el **usuario**, más los tokens de acceso que cuelgan de él. No existen todavía tareas, estados, equipos ni espacios.
- Consecuencia para el MVP: la "persona" (y por tanto el futuro responsable de una tarea) ya está hecha y no se especifica de nuevo. Todo el valor del producto (las tareas compartidas y su estado) está por construir.

## 2. El interrogatorio

Una sola ronda de 5 preguntas. Las respuestas salen de la ficha de hechos del producto. Lo que la ficha no cubre lo decidió la IA y queda marcado como **supuesto**.

1. **¿Qué significa que una tarea está "libre" y que alguien "la está tocando"?**
   - **Ficha:** la decisión que cambia es *no empezar algo que otra persona ya está tocando y elegir lo siguiente sabiendo qué está libre*.
   - **Supuesto:** tres estados: *Por hacer*, *En curso* y *Hecha*. "Libre" es *Por hacer* y sin responsable. "La está tocando" es *En curso*.
2. **¿El responsable y la fecha son obligatorios?**
   - **Ficha:** una tarea lleva *título, responsable, estado y fecha*, pero se crea *sin campos obligatorios*. Las dos frases se contradicen.
   - **Supuesto:** solo el título es obligatorio. Sin responsable, la tarea está libre. Sin fecha, no puede pasarse de plazo.
3. **¿"Ver qué se ha movido" exige saber qué cambió desde mi última visita, o basta con la lista actualizada?**
   - **Ficha:** *resumen que espera, no aviso que interrumpe*, y ver los cambios *sin refrescar ni preguntar*.
   - **Supuesto:** basta con la lista viva y con ver cuándo se actualizó cada tarea por última vez. El "desde tu última visita" no está decidido.
4. **¿Habría bastado la lista para evitar el episodio de los dos días perdidos?**
   - **Ficha:** el choque fue sobre el mismo módulo, la misma semana. Dos días perdidos.
   - **Supuesto:** el MVP solo lo evita si quien empieza mira la lista antes y escribe un título reconocible. Es una hipótesis que hay que validar, no algo garantizado.
5. **¿Cómo entra alguien al espacio único, y quién no debe verlo?**
   - **Ficha:** un único espacio compartido, sin entidad "equipo" y con roles planos.
   - **Supuesto:** quien se registra entra al espacio y ve todo. En uso real, cualquiera con la URL vería las tareas. Se anota como riesgo y supuesto, no se construye.

### Ficha de hechos (respuestas del producto, ya decididas)

- Qué duele hoy: la daily de sincronización y el "¿en qué estás?" constante por Slack/chat. Nadie ve el estado del equipo sin interrumpir a alguien.
- Quién cobra el valor: los pares, no un lead. No hay reporte hacia arriba y a un manager le daría igual. Duele a los dos devs que descubren tarde que iban a lo mismo, y al que interrumpe a otro para preguntar.
- Episodio concreto: dos personas del equipo tocaron el mismo módulo la misma semana porque una empezó sin que la otra lo supiera. Dos días perdidos.
- Qué reunión desaparece (respuesta honesta, no la vendas de más): la daily NO desaparece entera. Desaparece la ronda de "¿en qué estás?", que hoy se come la mitad de los 15 minutos. La parte de bloqueos sigue, y este MVP no la resuelve.
- Usuarios / equipo: equipos remotos pequeños, 3–10 personas. Roles planos: en el MVP todos ven y editan lo mismo, sin jerarquía de permisos.
- Primer usuario concreto: equipo de 6 personas de producto SaaS, en 3 husos horarios, que hoy usa un gestor de tareas pesado y una daily de 15 minutos por videollamada. Es un CASO DE ESTUDIO, no un cliente real.
- Fronteras: un espacio único compartido, sin entidad "equipo". Varios equipos separados, o gente en más de uno, queda FUERA del MVP: se anota como supuesto en el PRD, no se construye.
- "Tiempo real" = ver los cambios de estado de las tareas sin refrescar ni preguntar. NO es chat, NO es videollamada, NO es colaboración simultánea sobre el mismo documento.
- Es frescura, no presencia: el estado es de la TAREA, no de la persona. Nada de "quién está conectado ahora" ni indicadores de actividad; eso es vigilancia y lo rechazamos a propósito.
- Forma de la señal: resumen que espera, no aviso que interrumpe. El caso es "llego por la mañana o vuelvo de una reunión y veo qué se ha movido". Sin notificaciones push.
- Qué decisión cambia: no empezar algo que otra persona ya está tocando, y elegir lo siguiente sabiendo qué está libre. Si la única respuesta fuera "sentirse informado", el tiempo real no valdría lo que cuesta.
- De dónde sale el estado: lo teclea la persona que hace la tarea, en segundos. Derivarlo de señales externas (Git/PRs, CI, calendario) está FUERA del MVP: es otro producto, con integraciones y OAuth de terceros.
- Por qué se sostiene: no porque sea más agradable, sino porque son dos clics sobre una lista ya abierta, sin campos obligatorios, sin decidir sprint ni estimación. Y quien lo escribe cobra en el momento: esa misma lista es su cola de trabajo, la mira para decidir qué coge, y de paso deja de recibir interrupciones preguntándole cómo va. Si el beneficio fuera solo para los demás, no lo escribiría.
- Si la información se queda vieja: el producto pierde el sentido, y lo asumo. Es el riesgo #1 a validar, no un detalle. La mitigación es que actualizar cueste dos clics, no obligar a nadie.
- Es donde se hace el trabajo, no donde se cuenta: sustituye al gestor de tareas, no convive con él. FlowSync crea las tareas, no lee las de otro sitio. Convivir exigiría doble actualización, que es como muere esta categoría.
- Renuncia explícita a sprints, estimaciones, épicas, backlog priorizado e informes. Un equipo que necesite eso no es nuestro usuario.
- "Menos rollo que Jira" = crear una tarea y cambiarle el estado en segundos, sin flujos de configuración ni campos obligatorios. Lo mínimo para saber quién está en qué.
- Qué necesita una tarea en el MVP: título, responsable, estado y fecha de vencimiento. La fecha, para ver de un vistazo qué se ha pasado de plazo.
- Cómo se consume la lista: filtrando por estado, para centrarse en lo pendiente.
- Éxito para el usuario: dejar de hacer la ronda de "¿en qué estás?" de la daily porque el estado del equipo se ve de un vistazo.
- Criterio a una semana de uso real: que el equipo cancele esa ronda y nadie pida que vuelva. Si la siguen haciendo igual, no funcionó.
- Cuánto construir: una vertical fina y usable de punta a punta, no el andamiaje amplio de un producto. Prefiero una capability terminada a tres a medias.

- Fuera del MVP: notificaciones push, integración con Slack, roles/permisos avanzados, analítica/reporting, comentarios en tareas.

## 3. El alcance

**Hipótesis que el MVP debe validar.** Todas las exclusiones se justifican contra ellas.

- **H1. Ver sustituye a preguntar:** si el estado del equipo se ve de un vistazo, la ronda de "¿en qué estás?" de la daily desaparece.
- **H2. El estado se mantiene fresco:** la gente actualiza el estado si le cuesta dos clics y la lista es su propia cola de trabajo. Es el riesgo #1.
- **H3. Ver lo tomado evita choques:** saber qué está en curso y qué está libre evita que dos personas empiecen lo mismo.

### Problema

En un equipo remoto pequeño nadie ve el estado del trabajo de los demás sin interrumpir a alguien. Eso tiene dos costes:

- la mitad de la daily se va en la ronda de "¿en qué estás?";
- el trabajo se solapa: dos personas tocaron el mismo módulo la misma semana y se perdieron dos días.

El gestor de tareas actual no lo resuelve, porque actualizarlo cuesta tanto que nadie lo mantiene al día.

### Usuarios

- **Quiénes:** los miembros de equipos remotos de 3 a 10 personas, todos al mismo nivel. El valor lo reciben los pares, no un lead ni un manager.
- **Caso de estudio:** un equipo de 6 personas de producto SaaS, repartido en 3 husos horarios, con un gestor de tareas pesado y una daily de 15 minutos.
- **Un único rol:** la misma persona escribe el estado de sus tareas y consulta la lista para decidir qué coger.

### Propuesta de valor

Una lista compartida de tareas donde crear una tarea y cambiarle el estado cuesta segundos. Quien vuelve por la mañana o de una reunión ve qué se ha movido y qué está libre, sin preguntar ni refrescar.

No es un sitio donde se informa del trabajo: es donde se hace. Sustituye al gestor de tareas, no convive con él.

### Alcance

1. **Crear una tarea con solo el título.** El responsable y la fecha son opcionales. *(Valida H2.)*
2. **Ver una lista única con todas las tareas del espacio**, con su título, responsable, estado y fecha. *(Valida H1.)*
3. **Cambiar el estado de una tarea en dos clics** entre *Por hacer*, *En curso* y *Hecha*. *(Valida H2.)*
4. **Coger una tarea libre**, es decir, asignármela, y poder reasignarla. *(Valida H3.)*
5. **Ver los cambios de los demás sin refrescar la página.** *(Valida H1 y H3.)*
6. **Filtrar la lista por estado.** *(Valida H1.)*
7. **Ver cuándo se actualizó cada tarea por última vez**, para detectar el estado viejo. *(Mide H2.)*

### NO-alcance

Cada exclusión indica qué hipótesis no ayuda a validar.

- **Notificaciones push.** Interrumpen, y la tesis es justo la contraria: un resumen que espera. No ayudan a validar H1 y además la contradicen.
- **Integración con Slack.** Mete FlowSync en el canal que el producto quiere vaciar de "¿en qué estás?". Ninguna hipótesis la necesita.
- **Roles y permisos avanzados.** Con roles planos en equipos de 3 a 10 personas, no influyen en H1, H2 ni H3.
- **Analítica e informes.** Nadie los consume: no hay reporte hacia arriba. No validan ninguna hipótesis.
- **Comentarios en tareas.** Convierten la lista en otro canal de conversación. H1 trata de ver el estado, no de hablar de él.
- **Varios equipos o espacios.** El caso de estudio es un solo equipo. Separar espacios no cambia H1, H2 ni H3.
- **Estado derivado de Git, CI o el calendario.** Esa sería otra hipótesis: que el estado no hace falta escribirlo. H2 apuesta justo por lo contrario, que escribirlo cuesta dos clics.
- **Presencia ("quién está conectado") e indicadores de actividad.** El estado es de la tarea, no de la persona. Es vigilancia, y no aporta nada a H3.
- **Resumen de lo que cambió desde tu última visita.** Para validar H1 basta con la lista viva y la fecha de la última actualización. Si eso no alcanza, se sabrá en la primera semana.
- **Sprints, estimaciones, épicas y backlog priorizado.** Son el "rollo" del que se huye, y meterlos rompería H2. El equipo que los necesita no es nuestro usuario.
- **Estados configurables o flujos personalizados.** Para H3 bastan tres estados fijos. Configurar flujos va en contra de "menos rollo que Jira".
- **Descripción larga, etiquetas, prioridad y subtareas.** Cada campo extra encarece crear la tarea y va en contra de H2. Con el título basta para saber quién está en qué.
- **Importar tareas del gestor actual.** El producto sustituye al gestor, no convive con él. Además, la importación no valida H1, H2 ni H3.
- **Historial de cambios de cada tarea.** Para medir H2 basta con saber cuándo se actualizó por última vez. El historial completo es auditoría, y nadie la ha pedido.
- **Invitaciones y control de acceso al espacio.** Quien se registra entra y lo ve todo; queda anotado como supuesto y riesgo. Restringir el acceso no valida ninguna hipótesis del caso de estudio.
- **Marcar las tareas que se han pasado de su fecha de vencimiento** *(recorte propio; estaba en la propuesta de la IA)*. Señalar el retraso habla del plazo, no de quién está en qué, así que no ayuda a validar H1, H2 ni H3. Además empuja hacia el seguimiento de plazos "tipo Jira" del que el producto huye.
- **Resolver bloqueos.** La parte de bloqueos de la daily se mantiene. El MVP no promete eliminarla.

---

## Parte B: las tres líneas

1. **Los dos números.** La IA propuso 8 elementos dentro del alcance. Tras mi recorte quedaron 7.

2. **Tres cosas que dejé fuera, y por qué.**
   - **Marcar las tareas vencidas.** El retraso habla del plazo, no de quién está en qué, así que no valida H1, H2 ni H3. Es seguimiento de plazos, justo lo que el producto deja atrás al renunciar a Jira.
   - **Resumen de lo que cambió desde tu última visita.** H1 se puede validar con la lista viva y la fecha de la última actualización. Si con eso el equipo sigue preguntando "¿en qué estás?", el resumen pasa a ser la siguiente hipótesis. Hoy no lo es.
   - **Invitaciones y control de acceso.** Con un solo equipo, en un caso de estudio y con roles planos, restringir quién entra no cambia si la ronda de la daily desaparece (H1) ni si el estado se mantiene fresco (H2). Queda anotado como riesgo, no se construye.

3. **La exclusión de la que menos seguro estoy: las tareas vencidas.** Se contradicen dos cosas. La ficha pide la fecha *"para ver de un vistazo qué se ha pasado de plazo"*. Pero ninguna de las tres hipótesis necesita esa fecha: se validan con el estado y el responsable. Al sacar la marca de vencida, la fecha se queda en la lista sin un propósito claro. Entraría si en la primera semana el equipo sigue preguntando "¿para cuándo está esto?" en la daily, porque entonces el plazo sí formaría parte de la ronda que queremos eliminar.

**La IA señaló una incoherencia que era mía.** La ficha dice que una tarea *necesita* título, responsable, estado y fecha, y a la vez que se crea *sin campos obligatorios*. El documento pedía algo que él mismo prohibía. Se resolvió dejando solo el título como obligatorio: sin responsable, la tarea está libre.