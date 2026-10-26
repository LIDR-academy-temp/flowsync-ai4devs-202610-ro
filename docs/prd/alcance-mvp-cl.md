# Alcance del MVP de FlowSync

> «Quiero que FlowSync sea una herramienta para que los equipos remotos sepan en qué está trabajando cada uno sin tener que hacer reuniones de sincronización. Algo tipo tareas compartidas pero más en tiempo real y menos rollo que Jira.»

## 1. El terreno que ya existe

Hoy FlowSync solo tiene cuentas de usuario: registro, login, perfil y cierre de sesión, en el backend y en el frontend. Una persona se identifica por email y nombre opcional, y la sesión dura mientras dure su token. No existe todavía nada de tareas, estados, responsables ni espacio compartido. El MVP se construye encima de esas cuentas sin volver a especificarlas: quien tiene cuenta es miembro del espacio.

## 2. El interrogatorio

Cinco preguntas en una sola ronda, sin bajar a datos, endpoints ni arquitectura:

1. ¿Qué duele hoy, en concreto, y quién paga ese dolor: los pares o un lead?
2. ¿Qué parte de la reunión desaparece de verdad, y qué decisión toma alguien de otra manera gracias a FlowSync?
3. ¿Qué significa «más en tiempo real» para el usuario: refresco, avisos, presencia, chat…?
4. ¿Sustituye al gestor de tareas actual o convive con él? ¿Quién escribe el estado y qué gana al escribirlo?
5. ¿Para qué equipo concreto es, qué queda fuera explícitamente y cómo se sabe a la semana si funcionó?

Las respuestas son la ficha de hechos de la lección, pegada entera y sin retoques. Lo que la ficha no cubre aparece en **Supuestos**, al final.

## 3. El alcance

### Problema

En un equipo remoto, nadie ve el estado del equipo sin interrumpir a alguien. El síntoma es el «¿en qué estás?» constante por chat y la ronda de la daily, que se come la mitad de sus 15 minutos. El coste real es el trabajo duplicado: dos personas tocaron el mismo módulo la misma semana porque una empezó sin que la otra lo supiera, y se perdieron dos días.

### Usuarios

Equipos remotos pequeños, de 3 a 10 personas, con roles planos: todos ven y editan lo mismo. El caso de estudio es un equipo de producto SaaS de 6 personas repartido en 3 husos horarios, con un gestor de tareas pesado y una daily por videollamada. El valor lo cobran los pares, no un manager. Les llega por dos lados: quien descubre tarde que iba a lo mismo que otro, y quien interrumpe o es interrumpido para preguntar cómo va algo.

### Propuesta de valor

Una lista de tareas compartida que es a la vez tu cola de trabajo y el estado del equipo. Actualizarla cuesta dos clics, y los cambios de los demás se ven sin preguntar ni refrescar. Quien la mantiene cobra en el momento: la usa para decidir qué coge y deja de recibir interrupciones. Así nadie empieza algo que otro ya está tocando, y la ronda de «¿en qué estás?» deja de hacer falta.

### Alcance

Es una sola vertical de punta a punta: **crear → coger → mover → ver lo que se ha movido**.

- 
- **Crear una tarea en segundos**, sin campos obligatorios aparte del título, que es la tarea misma. Responsable y fecha de vencimiento se pueden poner al crearla o más tarde.
- **Cambiar el estado en dos clics desde la propia lista.** Hay tres estados fijos, sin configuración: *Pendiente*, *En curso* y *Hecha*.
- **Asignar o cambiar el responsable**, con un «me la quedo» directo. Así se ve qué está libre y qué tiene dueño.
- **Editar el título y la fecha de vencimiento** de una tarea que ya existe.
- **Filtrar la lista por estado**, para centrarse en lo pendiente o en lo que está en curso.
- **Señalar las tareas vencidas**, para ver de un vistazo qué se ha pasado de plazo.
- **Ver los cambios de los demás sin refrescar** mientras la lista está abierta.
- **Marcar lo que ha cambiado desde tu última visita.** Es el «resumen que espera»: llego por la mañana o vuelvo de una reunión y veo qué se ha movido. Sin esto, el tiempo real solo sirve a quien tiene la pestaña abierta, y el caso de los 3 husos horarios se queda sin cubrir.

### NO-alcance



Cada exclusión lleva la hipótesis que **no** ayuda a validar. La hipótesis central es esta: *si ver y actualizar el estado cuesta dos clics, el equipo deja de hacer la ronda de «¿en qué estás?» y deja de pisarse.*

- **Un espacio único y compartido.** Todo el que tiene cuenta ve la misma lista de tareas. No hay equipos ni invitaciones. excluido porque cada cuenta deberia ver su listado de tareas

- **Notificaciones push, por email o en el navegador.** Son señales que interrumpen, y la hipótesis es justo la contraria: que un resumen que espera basta. Meterlas impediría saber si la lista funciona sola.
- **Integración con Slack.** Llevaría el estado al canal de las interrupciones y diluiría la prueba de que la lista sustituye a la pregunta. Además añade OAuth y la dependencia de un tercero.
- **Presencia: quién está conectado o indicadores de actividad.** El estado es de la tarea, no de la persona. Es vigilancia, y se rechaza a propósito. Además, saber que alguien está conectado no evita que dos personas cojan lo mismo.
- **Comentarios en las tareas, chat y videollamada.** Son conversación, no estado. Abrirían un segundo canal que compite con el chat y no responde a «¿quién está en qué?».
- **Edición simultánea de la misma tarea por varias personas.** El tiempo real que se pide es ver cambios de estado, no colaborar a la vez sobre un contenido. Resolver conflictos de edición no ayuda a que nadie se pise de trabajo.
- **Gestión de bloqueos** (estado «Bloqueada», dependencias, motivos). La ficha lo dice: la parte de bloqueos de la daily sigue y este MVP no la resuelve. Un cuarto estado haría pensar que sí.
- **Estados o flujos configurables.** Configurar es justo el «rollo de Jira» del que se huye. Con tres estados fijos basta para saber quién está en qué.
- **Campos extra: descripción, prioridad, etiquetas, adjuntos, subtareas, varios responsables.** Ninguno ayuda a saber quién está en qué, y cada campo más resta a los «dos clics», que son la mitigación del riesgo número 1, que la información se quede vieja.
- **Vista de tablero, arrastrar y soltar, orden manual.** Es otra forma de pintar lo mismo. La lista filtrada ya responde a la pregunta, y una segunda vista no valida nada nuevo.
- **Sprints, estimaciones, épicas, backlog priorizado.** Es una renuncia explícita: un equipo que los necesita no es nuestro usuario.
- **Informes, analítica, métricas del equipo.** Nadie reporta hacia arriba. Medir al equipo empuja hacia la vigilancia y no cambia ninguna decisión de los pares.
- **Roles y permisos.** Los roles son planos por decisión de producto. Con 3 a 10 personas, la jerarquía es fricción sin beneficio.
- **Varios equipos o espacios, invitaciones, gente en varios equipos.** Queda fuera por la ficha. Con un solo espacio ya se valida la hipótesis, y separar equipos es otro problema, el de los límites organizativos.
- **Estado derivado de Git, PRs, CI o calendario.** Es otro producto, con integraciones de terceros. Además, se trata de probar si la gente lo teclea, no si se puede inferir.
- **Importar desde Jira u otro gestor.** FlowSync sustituye, no convive. La prueba es el uso diario a partir de cero, no la migración de datos.
- **Historial completo de cambios por tarea.** Basta con «qué ha cambiado desde tu última visita». Un registro de quién cambió qué y cuándo acerca a la auditoría y no cambia ninguna decisión.
- **Borrar y archivar tareas.** Marcar como *Hecha* y filtrar ya la saca de la vista. Borrar obliga a decidir papelera, deshacer y qué pasa con lo que otros estaban mirando.
- **Recordatorios o avisos de «esta tarea lleva días sin moverse».** Atacan el riesgo número 1 obligando, y la ficha elige mitigarlo abaratando la actualización. Si se metieran, no se sabría cuál de las dos cosas funcionó.
- **Búsqueda de texto.** Con 3 a 10 personas y el filtro por estado, la lista cabe en una pantalla.
- **App móvil y modo sin conexión.** El caso es «llego por la mañana o vuelvo de una reunión», delante del ordenador donde se trabaja.

### Supuestos (no cubiertos por la ficha)

- **El registro es abierto y quien se registra entra en el espacio.** Para un caso de estudio vale. Con un equipo real expondría las tareas a cualquiera que se registre, así que es un hueco conocido, no una decisión de producto.
- **Un único espacio, sin entidad «equipo».** No se contemplan varios equipos separados ni personas que estén en más de uno. Si el caso de estudio o un equipo real lo necesita, el modelo de «todos ven todo» deja de valer.
- **Los estados son tres y fijos.** La ficha pide «estado» pero no cuántos.
- **«Desde tu última visita»** se mide por persona, no por dispositivo, y se resetea al abrir la lista.
- **Una tarea sin responsable** es una tarea libre, y así se ve en la lista.
- **El criterio de éxito es el de la ficha**: a la semana de uso real, el equipo cancela la ronda de «¿en qué estás?» y nadie pide que vuelva.


## Parte B: las tres líneas

1. **Los dos números:** la IA propuso 9 cosas dentro del alcance; tras mi recorte quedan 8.

2. **Tres cosas que dejé fuera, y por qué:**
   - **Editar título y fecha de una tarea existente.** No ayuda a validar que el equipo mantenga el estado al día: lo que dice quién está en qué es el estado y el responsable, y esos ya se cambian en dos clics. Si una tarea nace mal, se marca como *Hecha* y se crea otra.
   - **Notificaciones push.** La hipótesis es que un resumen que espera basta para dejar de preguntar «¿en qué estás?». Con avisos que interrumpen no sabría si la lista funciona por sí sola o si funciona porque empuja a la gente.
   - **Gestión de bloqueos.** La hipótesis es que desaparece la ronda de «¿en qué estás?», no la de bloqueos. Un estado «Bloqueada» mezclaría las dos y, si la daily se acorta, no sabría qué parte ha sustituido FlowSync de verdad.

3. **La exclusión de la que menos seguro estoy:** los recordatorios de «esta tarea lleva días sin moverse». Chocan dos cosas: el riesgo #1 del producto (si la información se queda vieja, FlowSync no sirve) contra la decisión de mitigarlo sin obligar a nadie, solo abaratando la actualización. Entraría si en la primera semana de uso real la lista se queda desactualizada aunque actualizar cueste dos clics: eso diría que abaratar no basta y que hace falta empujar.

> 📌 **La IA me corrigió una decisión, y tenía razón.** Moví «espacio único compartido» al NO-alcance porque pensé que cada cuenta debería ver solo sus tareas. Me señaló que eso contradice el problema: si cada uno ve solo lo suyo, nadie ve en qué está el otro y vuelve el episodio de los dos días perdidos. Lo devolví al alcance.