# Alcance del MVP de FlowSync

## Resumen a alto nivel

Quiero que FlowSync sea una herramienta para que los equipos remotos sepan en qué está trabajando cada uno sin tener que hacer reuniones de sincronización.
Algo tipo tareas compartidas pero más en tiempo real y menos rollo que Jira.

## 1. Lo que ya hay hecho

Lo único construido es autenticación y perfil de usuario: registro, login, ver perfil y logout. El dominio de FlowSync (tareas, proyectos, equipos) todavía no existe.
El modelo de datos solo tiene usuarios y sus tokens de acceso.
Ya están montados un formato de error en JSON, la validación con VineJS, el envoltorio `{ data }` en todas las respuestas y un transformer de usuario. No hay tests.
Lo que se defina aquí reutiliza la cuenta de usuario existente y no vuelve a especificar el acceso.

## 2. El interrogatorio

Preguntas que hizo la IA antes de proponer, en una sola ronda:

1. ¿Qué duele hoy, en concreto, y a quién? ¿Hay un episodio real?
2. ¿Qué decisión cambia alguien gracias a FlowSync?
3. ¿Qué significa "tiempo real" y qué queda fuera? ¿La señal interrumpe o espera?
4. ¿Quién la usa y con qué fronteras: tamaño, roles, uno o varios equipos?
5. ¿Sustituye al gestor actual o convive, qué mínimo necesita una tarea, a qué se renuncia y qué demostraría que funciona?

Respuestas, ya decididas:

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

### Hipótesis que el MVP tiene que validar

- **H1 (riesgo principal):** la gente actualiza el estado de sus tareas sin que nadie la obligue, si hacerlo cuesta dos clics.
- **H2:** ver qué está cogido y qué está libre evita el trabajo duplicado y ayuda a elegir la siguiente tarea.
- **H3:** con eso a la vista, el equipo cancela la ronda de "¿en qué estás?" de la daily.

### Problema

En un equipo remoto nadie sabe en qué está cada uno sin interrumpir a alguien. El coste aparece de tres formas:

- **Media daily:** la ronda de "¿en qué estás?" ocupa la mitad de los 15 minutos.
- **Interrupciones:** goteo constante de preguntas por chat.
- **Trabajo duplicado:** dos personas tocaron el mismo módulo la misma semana sin saberlo y se perdieron dos días.

El gestor de tareas actual no lo evita, porque mantenerlo al día cuesta más que preguntar.

### Usuarios

- **Quiénes:** los propios miembros de equipos remotos de 3 a 10 personas, todos al mismo nivel y sin jerarquía.
- **Quién no:** no hay un lead ni un manager que consuma informes.
- **Caso de estudio:** un equipo de producto SaaS de 6 personas, repartido en 3 husos horarios. Hoy usa un gestor pesado y hace una daily de 15 minutos por videollamada.

### Propuesta de valor

Tu cola de trabajo es también el tablero del equipo:

- Creas una tarea o le cambias el estado en segundos, sin campos obligatorios ni configuración.
- La misma lista que usas para decidir qué coges les dice a los demás en qué estás.
- Así no empiezas algo que otro ya está tocando, eliges sabiendo qué está libre y dejan de preguntarte cómo vas.

Lo que **no** promete: no elimina la daily. Elimina la ronda de estado. Los bloqueos se siguen hablando ahí.

### Alcance

1. **Un único espacio compartido.** Cualquier usuario con cuenta ve y edita todas las tareas. Se reutiliza el registro y el login que ya existen.
2. **Crear una tarea escribiendo solo el título.** Lo demás es opcional.
3. **Responsable.** Puedes cogerte una tarea, asignársela a otra persona o soltarla. Una tarea sin responsable se ve como libre.
4. **Estado con tres valores fijos:** por hacer, en curso y hecha. Se cambia desde la lista en dos clics como máximo.
5. **Fecha de vencimiento opcional.** Las tareas vencidas se distinguen de un vistazo.
6. **Filtro por estado,** para quedarse con lo pendiente.
7. **Cada tarea muestra cuándo cambió por última vez.** Cubre dos cosas a la vez:
   - El resumen que espera: al llegar por la mañana ves qué se ha movido.
   - La señal de estado viejo: una tarea "en curso" sin tocar desde hace cinco días se delata sola, y eso mide H1.
8. **Editar el título y borrar una tarea.** Sin esto, un error al crearla ensucia la lista para siempre.

### No alcance (excluido)

Decidido de antemano en las respuestas:

- **Notificaciones push.** La señal es un resumen que espera, no un aviso. Además, interrumpir es justo el dolor que se quiere quitar, así que no ayuda a validar ninguna hipótesis.
- **Integración con Slack.** Vuelve a llevar el estado al canal de las interrupciones. Si se usa Slack para enterarse, no se valida que la lista baste (H3).
- **Roles y permisos avanzados.** Los roles son planos por decisión. Sin jerarquía no hay nada que permitir ni denegar.
- **Analítica e informes.** Quien obtiene el valor son los pares, no un manager. Ninguna hipótesis depende de medir al equipo.
- **Comentarios en tareas.** Abren conversación, y eso ya es la parte de bloqueos, que este MVP no resuelve. Además, convierten la tarea en un hilo y el estado deja de leerse de un vistazo.

Añadido en la propuesta:

- **Varios equipos o espacios, personas en más de uno.** Las tres hipótesis se validan con un solo equipo. Varios espacios solo añaden fronteras que gestionar.
- **Presencia: quién está conectado, indicadores de actividad.** El estado pertenece a la tarea, no a la persona. Lo otro es vigilancia, rechazada a propósito.
- **Estado derivado de Git, PRs, CI o calendario.** Esquiva H1 en vez de validarla: si el estado se rellena solo, no sabes si la gente lo habría actualizado. Además es otro producto, con integraciones y OAuth.
- **Sprints, estimaciones, épicas y backlog priorizado.** Es el "rollo de Jira" del que huye el producto. Un equipo que lo necesite no es el usuario.
- **Estados configurables o flujos personalizados.** Configurar es fricción y va contra los "dos clics" de los que depende H1. Tres estados bastan para saber quién está en qué.
- **Descripción, subtareas, etiquetas, adjuntos, prioridad.** Cada campo más hace la tarea más lenta de crear y la lista más pesada de leer. Ninguno ayuda a saber qué está cogido y qué libre (H2).
- **Feed o historial completo de actividad.** El elemento 8 del alcance ya da "qué se ha movido". Un feed es un informe con otro nombre y no añade validación sobre H1 a H3.
- **Resumen diario por email.** Es un aviso que sale de la herramienta. Lo que hay que validar es que la gente abra la lista, porque esa lista es su cola de trabajo.
- **Recordatorios o avisos de tareas sin actualizar.** Obligar a actualizar enmascara H1. Hay que saber si actualizan por sí mismos, no si responden a un aviso.
- **Invitaciones y gestión de miembros.** Con un único espacio y registro abierto basta para el caso de estudio. Gestionar miembros no valida nada del producto.
- **Gestión de bloqueos.** Esa parte de la daily sigue existiendo y el MVP renuncia a resolverla de forma explícita.
- **Vista kanban con arrastrar y soltar, orden manual.** La lista con filtro ya da el estado de un vistazo. El kanban mejora la forma, no las hipótesis.
- **Edición simultánea del mismo contenido.** El tiempo real se ha definido como estado fresco, no como colaboración.
- **Importar tareas de otro gestor.** El producto sustituye al gestor anterior, no convive con él. Importar invita a la doble actualización.
- **App móvil nativa.** El caso de uso es "abro la lista al empezar el día o al volver de una reunión". La web basta para validarlo.

### Supuestos

1. **SUPUESTO: solo el título es obligatorio.** "Sin campos obligatorios" no puede ser literal, porque una tarea sin título no se identifica.
2. **SUPUESTO: tres estados fijos** (por hacer, en curso, hecha). No hay estado "bloqueada", porque los bloqueos quedan fuera.
3. **SUPUESTO: "libre" significa sin responsable y no hecha.** Una tarea "por hacer" que ya tiene responsable cuenta como cogida.
4. **SUPUESTO: "qué se ha movido" se resuelve con la última fecha de cambio de cada tarea.** No hay un registro aparte de "desde tu última visita".
5. **SUPUESTO: una instalación por equipo, con registro abierto.** Cualquiera que se registre entra en el espacio. Vale para un caso de estudio, pero no para producción.
6. **SUPUESTO: las tareas hechas siguen en la lista.** Se ocultan con el filtro, no se archivan.
7. **SUPUESTO: las fechas se muestran en la hora local de cada persona.** Con tres husos horarios, "vencida" depende de dónde estés. Se acepta esa imprecisión.
8. **SUPUESTO: varios equipos separados, o personas en más de uno, quedan fuera.** Se anota aquí y no se construye.

### Incoherencias detectadas

- **Tiempo real contra resumen que espera.** El uso descrito es llegar por la mañana y ver qué se ha movido, y para eso basta con cargar la página. Además, el episodio de duplicación se fraguó a lo largo de días, no de segundos. Que la lista se actualice sola (elemento 7) aporta poco a H2 y es lo más caro de construir.
- **"Nadie está obligado" contra éxito medido por cancelar la ronda.** Si una sola persona no actualiza, el equipo no cancelará la ronda, y no se sabrá si falló el producto o una persona. Por eso importa el elemento 8: hace visible el estado viejo sin obligar a nadie.

## Parte B: las tres líneas

1. **Los dos números:** la IA propuso 9 elementos dentro del alcance; tras mi recorte quedaron 8.
2. **Tres cosas que dejé fuera, y por qué:**
   - **La lista abierta se actualiza sola.** Porque con un simple refrescar ya se ven los cambios y para un MVP creo que ya está bien.
   - _
   - _
3. **La exclusión de la que menos seguro estoy:** 
   - **Descripción, subtareas, etiquetas, adjuntos, prioridad.** Cada campo más hace la tarea más lenta de crear y la lista más pesada de leer. Ninguno ayuda a saber qué está cogido y qué libre (H2).

