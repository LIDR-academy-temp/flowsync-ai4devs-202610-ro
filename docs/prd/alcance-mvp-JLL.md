# FlowSync · PRD del MVP

> Documento de producto, nivel conceptual. Qué se construye y para quién; el cómo vive en el código.

## 1. Problema

La mitad de la daily de 15 minutos se va en la ronda de "¿en qué estás?", y entre reuniones la misma pregunta llega por Slack e interrumpe a alguien. Nadie ve el estado del equipo sin preguntarle a una persona.

Esa falta de visibilidad tiene un coste real. En el caso de estudio, dos personas tocaron el mismo módulo la misma semana porque una empezó sin que la otra lo supiera, y se perdieron dos días.

La parte de bloqueos de la daily no es el problema que resuelve este MVP. Esa parte sigue.

## 2. Usuarios

- **Quién:** los pares de un equipo remoto pequeño, de 3 a 10 personas, con roles planos. Todos ven y editan lo mismo.
- **Quién se beneficia:**
  - La persona que estaba a punto de empezar algo que otro ya tocaba.
  - La persona que interrumpe a otra para preguntar.
  - La persona que deja de recibir esas preguntas.

  No hay un lead ni un manager que consuma reportes.
- **Caso de estudio:** un equipo de producto SaaS de 6 personas en 3 husos horarios. Hoy usa un gestor de tareas pesado y una daily de 15 minutos por videollamada. No es un cliente real.
- **Quién no es nuestro usuario:** un equipo que necesite sprints, estimaciones, épicas, backlog priorizado o informes.

## 3. Propuesta de valor

**Una lista de tareas compartida, siempre fresca, que es a la vez tu cola de trabajo y el estado del equipo.**

- **Qué decisión mejora:** no empezar lo que otro ya está haciendo, y elegir la siguiente tarea sabiendo qué está libre.
- **Por qué se mantiene al día:** actualizar son dos clics sobre una lista que ya tienes abierta, sin campos obligatorios salvo el título. Quien la actualiza también gana en el momento: es su propia cola de trabajo y deja de recibir interrupciones.
- **Qué significa "tiempo real":** el estado es de la tarea, no de la persona. Los cambios aparecen sin recargar la página. No mostramos quién está conectado.
- **Qué sustituye:** al gestor de tareas actual. No convive con él, porque mantener dos herramientas a la vez exige actualizar todo dos veces.

## 4. Alcance

Una sola capability, terminada de punta a punta: **la lista compartida que se actualiza sola.**

1. **Ver la lista del equipo.** Es la primera pantalla tras iniciar sesión. Muestra todas las tareas con título, responsable ("Libre" si no tiene), estado y fecha de vencimiento.
2. **Crear una tarea solo con el título.** Responsable y fecha son opcionales. La tarea nace en *Pendiente*.
3. **Tomar o actualizar una tarea en dos clics.** Desde la lista se puede asignar o reasignar el responsable (incluido "me la quedo"), cambiar el estado, corregir el título y poner o quitar la fecha. Cualquiera puede editar cualquier tarea.
4. **Tres estados fijos: *Pendiente*, *En curso* y *Hecha*.** Se puede pasar de cualquiera a cualquiera.
5. **Filtrar por estado** para centrarse en lo pendiente y ver qué está libre.
6. **Marca de "Vencida".** Es la fecha en rojo en las tareas *Pendiente* o *En curso* cuya fecha ya pasó. No es un estado, y las tareas en *Hecha* no la muestran.
7. **Ver los cambios sin recargar.** Lo que crean o cambian los compañeros aparece en pocos segundos.

### Supuestos

- Hay un único espacio compartido, sin la idea de "equipo". Todo usuario registrado pertenece a él. Varios equipos separados, o gente en más de uno, quedan fuera y no se construyen.
- La fecha de vencimiento es un día sin hora. "Vencida" se calcula según el día de quien mira, porque el equipo está en 3 husos horarios.
- Se reutilizan el registro y el login que ya existen.

## 5. Métricas de éxito

- **Criterio a una semana de uso real:** el equipo cancela la ronda de "¿en qué estás?" de la daily y nadie pide que vuelva. Si la siguen haciendo igual, no funcionó.
- **Señal secundaria:** dejan de llegar por chat preguntas del tipo "¿cómo va X?" o "¿alguien está con Y?".
- **Sin cuadros de mando:** el éxito se mide observando qué hace el equipo, no con métricas de uso.

## 6. Riesgos

- **Riesgo #1, que la información se quede vieja.** Si pasa, el producto pierde el sentido; se asume y es lo primero que hay que validar. La mitigación es que actualizar cueste dos clics, sin obligar a nadie.
- **Que el equipo no deje el gestor anterior.** Si conviven las dos herramientas, se actualiza dos veces y FlowSync se abandona. El MVP solo tiene sentido como sustituto.

## 7. NO-alcance

Cada exclusión responde a una pregunta: ¿hace falta para no pisarse el trabajo y elegir qué está libre, o para comprobar el criterio de una semana? Si no hace falta, queda fuera.

### Recortes dentro de la propia capability

1. **Descripción, etiquetas, prioridad, subtareas y adjuntos.** Cada campo extra hace más lenta la actualización, y una actualización lenta hace que la información se quede vieja (riesgo #1). Para saber quién está en qué basta con el título.
2. **Varios responsables por tarea.** Si una tarea es "de dos", nadie sabe quién la está tocando, que es justo el error que queremos evitar. Si hay que repartirla, se crean dos tareas.
3. **"Qué se ha movido desde mi última visita".** Es la forma ideal de la señal, pero no es imprescindible para validar: la lista filtrada y fresca ya muestra el estado actual a quien llega por la mañana. Exige recordar qué ha visto cada persona, y eso es una segunda capability a medias. Es la primera candidata para después del MVP.
4. **Eliminar tareas.** Una tarea creada por error se renombra o se marca como *Hecha*. Borrar no ayuda a validar el criterio de éxito.
5. **Búsqueda, ordenación configurable y vistas guardadas.** Con 3 a 10 personas y un filtro por estado, la lista se abarca de un vistazo.
6. **Estados configurables y vista de tablero kanban.** Configurar flujos es el "rollo" de Jira que rechazamos, y con tres estados fijos "En curso" significa lo mismo para todos.
7. **Estado "Bloqueada" y dependencias entre tareas.** Los bloqueos son la parte de la daily que este MVP no resuelve, dicho con honestidad. Meterlos a medias impediría saber si la ronda de "¿en qué estás?" desaparece gracias a la visibilidad o por otra cosa.
8. **Historial de cambios, deshacer y archivo.** No ayudan a decidir qué hacer ahora. Un cambio por error se corrige en dos clics.

### Avisos y comunicación

9. **Notificaciones push, emails y recordatorios de vencimiento.** La señal tiene que ser un resumen que espera a que lo mires, no un aviso que interrumpe. Lo vencido ya se ve en rojo al abrir la lista.
10. **Comentarios en tareas y chat.** Convierten la lista en otro canal de conversación que también habría que leer. "Tiempo real" no significa chat.
11. **Integración con Slack.** Es una integración con un tercero y devuelve la información al canal donde hoy se producen las interrupciones.

### Señales externas e integraciones

12. **Estado derivado de Git/PRs, CI o calendario.** Es otro producto, con integraciones y permisos de acceso a herramientas de terceros. El estado lo escribe quien hace la tarea.
13. **Importar tareas de otra herramienta o sincronizarse con ella.** FlowSync sustituye al gestor actual. Sincronizar obliga a actualizar dos veces, y así mueren las herramientas de esta categoría.

### Personas y organización

14. **Presencia, "quién está conectado" e indicadores de actividad.** Lo rechazamos a propósito porque es vigilancia. El estado es de la tarea, no de la persona.
15. **Roles y permisos avanzados.** El equipo es plano. Los permisos añaden fricción a cada cambio y solo protegen frente a una desconfianza que en un equipo de pares no existe.
16. **Varios equipos, espacios o proyectos.** Hay un único espacio compartido; la separación entre equipos queda como supuesto.
17. **Invitaciones, gestión de miembros, avatares y perfiles enriquecidos.** Quien se registra entra en el único espacio.

### Gestión y medición

18. **Sprints, estimaciones, épicas y backlog priorizado.** Renunciamos a ellos de forma explícita. Un equipo que los necesita no es nuestro usuario.
19. **Analítica, reporting e informes.** Nadie los pide hacia arriba. El éxito se mide con una observación, no con un panel.

### Plataforma

20. **App móvil nativa y modo sin conexión.** La lista es para quien está trabajando delante del ordenador. Funcionar sin conexión choca con mostrar siempre el estado actual.

---

## Las tres líneas

<!-- Parte B: la escribes tú. No la rellena la IA. -->

1. **Los dos números:** 7 → 7
2. **Tres cosas que dejé fuera, y por qué cada una:**
   - **Saber qué ha cambiado desde la última vez que entraste:** En mis primeros prompts le respondía a las 5 preguntas y pedí que creara las historias de usuarios. Después de la ficha de hechos, cuando la IA rehízo esas historias apareció. Al pedirle un tijeretazo agresivo, la IA la descartó y yo lo acepté, porque basta con abrir la lista filtrada por la mañana para ver el resumen.
   - **Estado "Bloqueada" y dependencias** Yo mismo los había metido en el alcance anterior, antes de la ficha, y los saqué al reajustar. Si entraran y la daily se acortara, no sabríamos si ha sido por la visibilidad del estado o por los bloqueos: meterlos ensucia la prueba.
   - **Notificaciones por email, avisos al móvil y recordatorios** La idea es que mires la lista cuando tú quieras, no que te lleguen avisos molestos como los que ya sufrimos en Slack o por correo. La hipótesis es que la gente consulta la lista por iniciativa propia; con avisos no sabríamos si esa consulta funciona por sí sola.
3. **La exclusión de la que menos seguro estoy, y qué tendría que pasar para que entrara:** La exclusión de la que menos seguro estoy es la de poder borrar tareas. Se contradicen lo barato (no construir el borrado y apañarse renombrando o marcando como *Hecha*) con el riesgo #1: una lista llena de "basura" deja de reflejar la realidad, y una lista que no refleja la realidad deja de mirarse. Tendría que pasar que, durante la prueba real, los usuarios nos digan que la lista está llena de "basura" por errores tontos y que eso les molesta para trabajar. Si esa molestia es real y les hace perder tiempo, tendría que entrar el botón de borrar.

> 📌 **Incoherencia que me señaló la IA, y tenía razón.** Al añadir el supuesto de "Vencida" lo redacté hablando de "tarjetas de las columnas Pendiente, En curso o Bloqueada". La IA me hizo notar que eso contradecía lo ya decidido: la ficha deja los bloqueos fuera del MVP (no existe el estado "Bloqueada") y describe una lista filtrable por estado, no un tablero con columnas. Estaba arrastrando el modelo mental del primer alcance (kanban con bloqueos) que yo mismo había descartado al lanzar la ficha de hechos.
