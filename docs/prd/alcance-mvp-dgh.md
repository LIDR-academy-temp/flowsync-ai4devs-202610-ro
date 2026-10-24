# Parte A

## El terreno que ya existe 

Realiza la revision del proyecto e indica, que el backent esta hecho con AdonisJS y hay 4 capacidades(endpoints) e informa un poco sobre ellas. Muestra que hay un gard que no se usa y que ademas identifico que en la generacion de token se hacen sin fecha de expiracion y que no existen pruebas unitarias. Que el frontend esta hecho con React 19 + Vite + shadcn y muestra informacion de pantallas, session y el manejo de errors al interactuar con el backend. Del modelo de datos, indique no solo hay 2 tablas con una relacion 1:N y que haria falta modelar todo el dominio del producto

## El interrogatorio

Usuario:
Quiero que FlowSync sea una herramienta para que los equipos remotos sepan en qué está trabajando cada uno sin tener que hacer reuniones de sincronización. Algo tipo tareas compartidas pero más en tiempo real y menos rollo que Jira.

antes de proponer: dame las cinco preguntas que más reducirían la incertidumbre sobre el problema, los usuarios y el alcance. 

Asistente:
Estas son las cinco preguntas que más cambiarían lo que te propondría:

1. ¿Qué decisión o acción concreta toma alguien después de mirar FlowSync? Por ejemplo, "veo que Ana está bloqueada y la ayudo", "veo que nadie está con X y lo cojo" o "mi jefe sabe cómo va la semana sin preguntar". La respuesta dice si el núcleo son las tareas, el estado de cada persona (en qué estoy, bloqueado, disponible) o la visibilidad hacia arriba. Son tres productos distintos.
2. ¿Quién es el usuario principal y cuántos son? Por ejemplo, un equipo de 4–8 desarrolladores, una agencia con varios clientes o un manager con varios equipos. ¿Hay un solo equipo por cuenta o una persona puede estar en varios? Esto decide el modelo de datos de partida: si basta con team y membership o si hacen falta organizaciones, roles y permisos desde el principio.
3. ¿De dónde sale la información y cuánto esfuerzo le cuesta a cada persona mantenerla al día? ¿Cada uno actualiza a mano lo que hace? ¿Se infiere de otras herramientas como GitHub, commits, PRs o el calendario? ¿Se pregunta con un check-in diario asíncrono? "Menos rollo que Jira" se gana o se pierde aquí: si actualizar cuesta, nadie lo hace y la herramienta muere.
4. ¿Qué significa exactamente "en tiempo real" para ti? Puede ser que la pantalla se refresque sola cuando alguien cambia algo (WebSockets o SSE), que te llegue una notificación o simplemente que esté al día en lugar de ir una semana por detrás. Además, como son equipos remotos, ¿importan las zonas horarias, del estilo "Juan acaba de terminar su día y dejó esto"? La respuesta cambia mucho la arquitectura: AdonisJS necesita Transmit para el push, y el frontend tendría que gestionar estado en vivo.
5. ¿Qué queda fuera explícitamente en esta primera versión, y cómo sabremos que funciona? Por ejemplo: sin sprints, sin estimaciones, sin subtareas, sin come una señal de éxito concreta, como "el equipocancela la daily" o "cada persona actuali al día". Sin esto, el alcance tenderá aparecerse a Jira, que es justo lo que qui

Con tus respuestas te propongo el alcance deas rutas.

Usuario:

Las respuestas a las actuales y futuras preguntas son las siguientes:
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

Asistente:
Con tus respuestas, esta es la propuesta: una sola vertical, la lista de tareas compartida que se mantiene al día sola, terminada de punta a punta.

Problema y apuesta

- Qué duele: nadie ve en qué está el equipo sin interrumpir a alguien. Eso cuesta la mitad de la daily y provoca trabajo duplicado, como los 2 días perdidos de tu episodio.
- La apuesta: una lista que es a la vez la cola de trabajo de cada persona y el estado del equipo. Cambiar algo cuesta dos clics y los demás lo ven sin refrescar.
- Éxito: en una semana de uso real, el equipo cancela la ronda de "¿en qué estás?" y nadie pide que vuelva.
- Riesgo #1: que el estado se quede viejo. La mitigación es que actualizar sea barato, no obligatorio.

Alcance del MVP

┌─────┬──────────────────┬────────────────────────────────────────────────────────────────────────────────────────┐
│  #  │    Capability    │                                        Detalle                                         │
├─────┼──────────────────┼────────────────────────────────────────────────────────────────────────────────────────┤
│ 1   │ Espacio único    │ Todo usuario registrado ve y edita todas las tareas. No hay entidad "equipo" ni roles. │
├─────┼──────────────────┼────────────────────────────────────────────────────────────────────────────────────────┤
│ 2   │ Crear tarea      │ Solo el título es obligatorio. Se crea en línea desde la propia lista, sin formulario  │
│     │                  │ aparte.                                                                                │
├─────┼──────────────────┼────────────────────────────────────────────────────────────────────────────────────────┤
│ 3   │ Cambiar estado   │ Tres estados: Por hacer → En curso → Hecha, en dos clics desde la fila.                │
├─────┼──────────────────┼────────────────────────────────────────────────────────────────────────────────────────┤
│ 4   │ Responsable      │ Opcional. Una tarea sin responsable aparece como libre: así se ve "qué puedo coger".   │
│     │                  │ Habrá un atajo "me la quedo".                                                          │
├─────┼──────────────────┼────────────────────────────────────────────────────────────────────────────────────────┤
│ 5   │ Fecha de         │ Opcional. Pasado el plazo se marca como vencida. "Vencida" se calcula; no es un estado │
│     │ vencimiento      │  más.                                                                                  │
├─────┼──────────────────┼────────────────────────────────────────────────────────────────────────────────────────┤
│ 6   │ Filtro por       │ Sobre la misma lista, con "Por hacer" y "En curso" seleccionados por defecto.          │
│     │ estado           │                                                                                        │
├─────┼──────────────────┼────────────────────────────────────────────────────────────────────────────────────────┤
│ 7   │ Frescura         │ La lista se actualiza sola. Además se resaltan las tareas que se han movido desde tu   │
│     │                  │ última visita: es el "resumen que espera".                                             │
├─────┼──────────────────┼────────────────────────────────────────────────────────────────────────────────────────┤
│ 8   │ Borrar tarea     │ Para errores al teclear. Borrado directo, sin papelera.                                │
└─────┴──────────────────┴────────────────────────────────────────────────────────────────────────────────────────┘

Fuera del MVP (va como supuestos en el PRD):
- Varios equipos o personas en más de uno.
- Notificaciones push, Slack y otras integraciones (Git, CI, calendario).
- Comentarios, roles y permisos.
- Analítica, sprints, estimaciones, épicas, backlog priorizado.
- Cualquier indicador de presencia o actividad de personas.

Modelo de datos

Añade una tabla, tasks. users no se toca.

tasks
─────────────────────────────────────────────
id             PK increments
title          string(200) NOT NULL
status         string NOT NULL default 'todo'   -- todo | in_progress | done
assignee_id    FK → users.id NULL  ON DELETE SET NULL   -- NULL = libre
due_date       date NULL
created_by_id  FK → users.id NOT NULL
created_at     timestamp NOT NULL
updated_at     timestamp NOT NULL   -- de aquí sale "qué se ha movido"

- Las relaciones son Task belongsTo assignee y Task belongsTo createdBy.
- No hay tabla de historial: para saber qué ha cambiado basta con updated_at.

API nueva (con auth)

┌────────┬───────────────────────────────────────────────────┬─────────────────────────────────────────────────────┐
│ Método │                       Ruta                        │                      Para qué                       │
├────────┼───────────────────────────────────────────────────┼─────────────────────────────────────────────────────┤
│ GET    │ /api/v1/tasks?status=todo,in_progress&since=<iso> │ Listar y filtrar. since sirve para las consultas    │
│        │                                                   │ periódicas.                                         │
├────────┼───────────────────────────────────────────────────┼─────────────────────────────────────────────────────┤
│ POST   │ /api/v1/tasks                                     │ Crear                                               │
├────────┼───────────────────────────────────────────────────┼─────────────────────────────────────────────────────┤
│ PATCH  │ /api/v1/tasks/:id                                 │ Cambiar estado, responsable, fecha o título         │
├────────┼───────────────────────────────────────────────────┼─────────────────────────────────────────────────────┤
│ DELETE │ /api/v1/tasks/:id                                 │ Borrar                                              │
├────────┼───────────────────────────────────────────────────┼─────────────────────────────────────────────────────┤
│ GET    │ /api/v1/users                                     │ Rellenar el selector de responsable                 │
└────────┴───────────────────────────────────────────────────┴─────────────────────────────────────────────────────┘

Tres decisiones que te recomiendo

1. Tiempo real con polling cada ~10 s, no WebSockets ni SSE.
   - Lo que pides es "ver los cambios sin refrescar", no colaboración simultánea, y unos segundos de retraso no cambian la decisión de qué coger.
   - No añade infraestructura sobre SQLite. Si se queda corto, @adonisjs/transmit (SSE) es el siguiente paso.
2. Conflicto explícito al coger una tarea.
   - Si intentas pasar a "En curso" una tarea que otra persona ya tiene en curso, el backend responde 409 y la UI muestra "Ana ya está en esto".
   - Es lo que ataca directamente tu episodio de los dos días perdidos, y cuesta poco.
   - Límite honesto: solo funciona si los dos trabajan sobre la misma tarea. Dos tareas con títulos distintos sobre el mismo módulo no se detectan.
3. La "última visita" se guarda en el navegador (localStorage), no en el servidor.
   - No hace falta tocar el backend ni registrar nada sobre las personas, lo que encaja con tu rechazo a la vigilancia.
   - A cambio, va por dispositivo.

Orden de construcción

1. Backend: migración, modelo, validators, transformer y controlador, con tests funcionales. Hoy no hay ninguno, y hay que aislar la BD de los tests.
2. Frontend: la lista pasa a ser la página de inicio en lugar de /profile, con creación en línea, cambio de estado, "me la quedo", fecha con marca de vencida y filtro.
3. Frescura: polling, el resaltado de "movido desde tu última visita" y el aviso de conflicto 409.

Al final de cada paso hay algo usable. El 1 y el 2 juntos ya sustituyen al gestor de tareas; el 3 es lo que permite cancelar la ronda de la daily.

Usuario:
Quiero recortar la 4, con el filtro por estados se pueden consultar aquellas tareas Por hacer y adicionalmente modificaria la 3 para que cuando este por hacer, se asigne el responsable y cambie a En curso, por esta opcion solo el responsable puede cambiarla al siguiente estado hecha. Cualquier otro cambio se realizaria por la capacidad 2 que debe permitir crear o actualizar la tarea.

Asistente:
Hecho, quito la 4. Así queda el alcance:

┌─────┬──────────────────┬────────────────────────────────────────────────────────────────────────────────────────┐
│  #  │    Capability    │                                        Detalle                                         │
├─────┼──────────────────┼────────────────────────────────────────────────────────────────────────────────────────┤
│ 1   │ Espacio único    │ Sin cambios.                                                                           │
├─────┼──────────────────┼────────────────────────────────────────────────────────────────────────────────────────┤
│ 2   │ Crear / editar   │ Solo el título es obligatorio; la fecha de vencimiento es opcional. Es la vía para     │
│     │ tarea            │ cualquier otro cambio.                                                                 │
├─────┼──────────────────┼────────────────────────────────────────────────────────────────────────────────────────┤
│ 3   │ Empezar y        │ Una tarea en Por hacer se empieza: te asigna como responsable y pasa a En curso en un  │
│     │ terminar         │ solo paso. Solo su responsable puede pasarla a Hecha.                                  │
├─────┼──────────────────┼────────────────────────────────────────────────────────────────────────────────────────┤
│ 4   │ Vencimiento      │ Pasado el plazo se marca como vencida (es un dato calculado).                          │
├─────┼──────────────────┼────────────────────────────────────────────────────────────────────────────────────────┤
│ 5   │ Filtro por       │ Por hacer es la lista de lo que está libre.                                            │
│     │ estado           │                                                                                        │
├─────┼──────────────────┼───────────────────────────────────────────────────────────┤
│ 6   │ Frescura         │ Polling y resaltado de "movido desde tu última visita".                                │
├─────┼──────────────────┼───────────────────────────────────────────────────────────┤
│ 7   │ Borrar           │ Sin cambios.                                                                           │
└─────┴──────────────────┴───────────────────────────────────────────────────────────┘

Tu cambio tiene varias ventajas:
- Regla de datos: ahora "en Por hacer no hay responsable, y en cualquier otro estado sí lo hay". El responsable solo  se asigna al empezar la tarea, así que la validar con esa regla.
- Conflictos: el 409 ya no es algo añadido. Si dos personas pulsan "Empezar" a la vez, la segunda recibe "Ana ya está en esto", y eso ataca directamente tu epis.
- Menos superficie: desaparecen el selector de responsable y GET /users.

Quedan tres huecos que dependen de ti. El primero es el más importante, porque si la edición puede cambiar el estado o el responsable, deja sin efecto la regla de na la tarea.

Usuario:
 ● ¿Qué puede cambiar la edición de la capacidad 2?
   → Todo, incluido estado
 │ ● Si alguien empieza una tarea por error o la abandona, ¿cómo vuelve a estar libre?
   → No se puede
 ● ¿Una tarea Hecha se puede reabrir?
   → No en el MVP (Recommended)

Asistente:
Hay una contradicción entre tus tres respuestas. Si la edición puede cambiar el estado libremente, sirve para todo lo que acabas de descartar:

- Soltar una tarea: basta editarla de En curso a Por hacer.
- Reabrirla: basta editarla de Hecha a otro estado.
- Terminar una tarea ajena: cualquiera puede ponerla en Hecha, o cambiarse como responsable y luego cerrarla.

La única forma de mantener las tres respuestas a la vez es esta:

▎ La edición muestra todos los campos, incluido el estado, pero el backend aplica las mismas reglas venga el cambio de donde venga:
▎ - Por hacer → En curso: te asigna a ti como responsable.
▎ - En curso → Hecha: solo puede hacerlo el responsable.
▎ - No hay vuelta atrás.
▎ - El responsable no se edita a mano.

Así la edición es otro sitio desde el que hacer lo mismo, pero no puede saltarse las reglas.

Esta lectura tiene una consecuencia que convlícita: una tarea empezada por error, oabandonada, se queda en En curso para siempre. El único escape sería borrarla y crearla de nuevo, porque borrar sigue estando permitido a cualquiera.
                                                                                                                    Si esta lectura te vale, vuelco el alcance yrd/alcance-mvp-dgh.md y abro el PR. Si con"Todo, incluido estado" querías decir edición libre de verdad, la regla de que solo el responsable termina la tarea desaparece, y te pregunto si prefieres queda
Usuario:
Si hay contradicion, y por ello el estado no se debe poder cambiar al editarla, el responsable si y de esa manera
  otro la puede tomar de manera conciente al editarla y terminarla y pasarla a hecha con doble clic
  
Asistente:
Hace ajustes en archivo alcance-mvp-**.md
y sube los cambios a git 

Usuario:
como queda la propuesta?

Asistente:
La propuesta es una lista de tareas compartida que hace a la vez de cola de trabajo de cada persona y de estado del equipo, y que se actualiza sola. El objetivo es eliminar la ronda de "¿en qué estás?" de la daily y evitar que dos personas trabajen en lo mismo sin saberlo.

Cómo sabremos si funciona: a la semana de uso real, el equipo cancela esa ronda y nadie pide que vuelva.

Riesgos principales:
- Que el estado de las tareas se quede viejo.
- Que el registro es abierto en un espacio único: cualquiera que se registre puede ver, editar y borrar todo.

Las 7 capabilities

┌─────┬────────────────┬──────────────────────────────────────────────────────────────────────────────────────────┐
│  #  │   Capability   │                                          Regla                                           │
├─────┼────────────────┼──────────────────────────────────────────────────────────────────────────────────────────┤
│ 1   │ Espacio único  │ Todos ven todas las tareas. No existe la entidad "equipo" ni hay roles.                  │
├─────┼────────────────┼──────────────────────────────────────────────────────────────────────────────────────────┤
│     │                │ Al crear solo es obligatorio el título; la fecha es opcional. Al editar se cambian       │
│ 2   │ Crear y editar │ título, fecha y responsable (este último solo si la tarea está En curso). El estado      │
│     │                │ nunca se edita.                                                                          │
├─────┼────────────────┼──────────────────────────────────────────────────────────────────────────────────────────┤
│ 3   │ Empezar y      │ "Empezar" te asigna como responsable y pasa la tarea a En curso en un clic. Solo el      │
│     │ terminar       │ responsable la pasa a Hecha, con el botón "Terminar" y una confirmación.                 │
├─────┼────────────────┼──────────────────────────────────────────────────────────────────────────────────────────┤
│ 4   │ Vencimiento    │ Se marca como vencida cuando pasa la fecha y la tarea no está Hecha. Lo calcula el       │
│     │                │ frontend.                                                                                │
├─────┼────────────────┼──────────────────────────────────────────────────────────────────────────────────────────┤
│ 5   │ Filtro por     │ Por defecto muestra Por hacer y En curso. Por hacer es la lista de lo que está libre.    │
│     │ estado         │                                                                                          │
├─────┼────────────────┼──────────────────────────────────────────────────────────────────────────────────────────┤
│ 6   │ Frescura       │ La lista se refresca sola cada ~10 s. Se resaltan los cambios que han hecho otros desde  │
│     │                │ tu última visita, y un aviso cuenta las tareas terminadas aunque el filtro las oculte.   │
├─────┼────────────────┼──────────────────────────────────────────────────────────────────────────────────────────┤
│ 7   │ Borrar         │ Cualquiera puede borrar, previa confirmación y sin papelera.                             │
└─────┴────────────────┴──────────────────────────────────────────────────────────────────────────────────────────┘

Reglas de estado

Por hacer ──Empezar (cualquiera)──▶ En curso ──Terminar (solo responsable)──▶ Hecha

- Una tarea en Por hacer nunca tiene responsable; en los otros dos estados siempre tiene.
- No hay vuelta atrás: una tarea empezada no se suelta y una terminada no se reabre.
- Si alguien abandona una tarea En curso, otra persona puede editarla, ponerse como responsable y terminarla.
- Si dos personas pulsan "Empezar" a la vez, la segunda recibe un error 409 con el mensaje "Ana ya está en esto". Esto ataca directamente tu episodio de los dos días perdidos.

Datos y API

- Se añade una única tabla nueva, tasks, con estos campos: title, status (todo / in_progress / done), assignee_id, due_date, updated_by_id y las fechas de creación y modificación. La tabla users no cambia.
- Endpoints:

| Método | Ruta                | Para qué                     |
|--------|---------------------|------------------------------|
| GET    | /tasks              | Listar                       |
| POST   | /tasks              | Crear                        |
| PATCH  | /tasks/:id          | Editar (no acepta el estado) |
| POST   | /tasks/:id/start    | Empezar                      |
| POST   | /tasks/:id/complete | Terminar                     |
| DELETE | /tasks/:id          | Borrar                       |
| GET    | /users              | Elegir responsable al editar |

- Los errores de negocio (403, 404 y 409) tienen formato fijo y un mensaje concreto para la interfaz.

Fuera del MVP

- Varios equipos.
- Notificaciones push, Slack e integraciones con Git, CI o calendario.
- Comentarios.
- Roles y analítica.
- Sprints, estimaciones y épicas.
- Indicadores de presencia de personas.
- Borrar usuarios.

Orden de construcción

1. Backend: tabla, API y tests de las reglas de estado.
2. Frontend: la lista pasa a ser la pantalla principal.
3. Frescura: actualización automática, resaltado de cambios y aviso de conflictos.

Con los pasos 1 y 2 FlowSync ya sustituye al gestor de tareas; el 3 es el que permite cancelar la ronda de la daily.

Decisión que tomé sin preguntarte

Interpreté tu "doble clic" para terminar como botón "Terminar" más una confirmación, porque el doble clic del ratón no funciona con teclado ni en pantallas táctiles. Si querías otra cosa, lo cambio.

Preguntas abiertas

Necesito tu respuesta a estas tres preguntas, que están en la sección 14 del documento:

1. Registro abierto: ¿basta con no publicar la instalación, o desactivamos el registro con una variable de entorno una vez dado de alta el equipo?
2. Reasignar: ¿se puede asignar una tarea a cualquier persona, o solo "me la quedo"? Con "me la quedo" sobran GET /users y el selector de responsable.
3. "Mis tareas": ¿hace falta un filtro por responsable, o basta con ver el responsable en cada fila?

El documento completo está en docs/prd/alcance-mvp-dgh.md, en el PR #3: https://github.com/dagho1988/flowsync-ai4devs-202610-ro/pull/3

## El alcance en cinco bloques

### 1. Problema

En un equipo remoto nadie ve en qué está trabajando el resto sin interrumpir a alguien. Hoy eso se paga de dos formas:

- **La ronda de "¿en qué estás?"** de la daily, que se come la mitad de sus 15 minutos, y el goteo de esa misma pregunta por Slack/chat durante el día.
- **Trabajo duplicado.** Episodio real del caso de estudio: dos personas tocaron el mismo módulo la misma semana porque una empezó sin que la otra lo supiera. Dos días perdidos.

Lo que el MVP **no** resuelve: la parte de bloqueos de la daily sigue existiendo. La daily no desaparece; desaparece la ronda de estado.

### 2. Usuarios

- Equipos remotos pequeños, de 3 a 10 personas, con roles planos.
- Quien cobra el valor son **los pares**, no un lead: el dev que descubre tarde que iba a lo mismo que otro y el que tiene que interrumpir para preguntar. No hay reporte hacia arriba.
- **Caso de estudio** (no es un cliente real): equipo de 6 personas de producto SaaS, repartido en 3 husos horarios, que hoy usa un gestor de tareas pesado y una daily de 15 minutos por videollamada.

### 3. Propuesta

Una lista de tareas compartida que es **a la vez el sitio donde cada persona elige su siguiente tarea y el estado del equipo**, y que se mantiene al día sola.

- **Es donde se hace el trabajo, no donde se cuenta.** Sustituye al gestor de tareas actual; no convive con él. Convivir exigiría doble actualización, y así muere esta categoría de producto.
- **Por qué se sostiene:** actualizar cuesta uno o dos clics sobre una lista que ya está abierta, sin campos obligatorios salvo el título. Y quien actualiza cobra en el momento: de esa lista elige qué coger y, además, deja de recibir interrupciones.
- **"Menos rollo que Jira":** crear una tarea y cambiarle el estado en segundos, sin configuración de flujos.
- **"Tiempo real" significa frescura, no presencia.** Se ven los cambios de las tareas sin refrescar ni preguntar. El estado es de la **tarea**, no de la persona.
- **La señal es un resumen que espera, no un aviso que interrumpe:** "llego por la mañana o vuelvo de una reunión y veo qué se ha movido".

### 4. Alcance

Es una vertical fina y usable de punta a punta. Se prefiere una capability terminada a tres a medias.

| # | Capability | Detalle |
|---|---|---|
| 1 | **Espacio único** | Todo usuario registrado ve todas las tareas y puede actuar sobre ellas según las reglas de la sección 7. No existe la entidad "equipo". |
| 2 | **Crear / editar tarea** | Al crear, solo el título es obligatorio y la fecha de vencimiento es opcional. Al editar se pueden cambiar el título y la fecha de vencimiento en cualquier estado, y el **responsable** solo en `En curso`. El **estado no se edita**: solo cambia con las transiciones de la capability 3. |
| 3 | **Empezar y terminar** | Una tarea en `Por hacer` se **empieza** con un clic: quien la empieza queda como responsable y la tarea pasa a `En curso`, todo en un paso. Solo su responsable puede **terminarla** y pasarla a `Hecha`, con dos clics: el botón "Terminar" y la confirmación. |
| 4 | **Vencimiento** | Una tarea no `Hecha` cuya fecha de vencimiento ya ha pasado se marca como **vencida**. Se calcula en el frontend; no se guarda ni viaja en la API. |
| 5 | **Filtro por estado** | Filtra la lista por uno o varios estados, en el cliente. Por defecto muestra `Por hacer` y `En curso`. `Por hacer` es la lista de "lo que está libre". |
| 6 | **Frescura** | La lista se actualiza sola, sin refrescar. Las tareas que otra persona ha cambiado desde tu última visita aparecen resaltadas, y un aviso cuenta las que se han terminado aunque el filtro las oculte. Detalle en la sección 12. |
| 7 | **Borrar tarea** | Cualquiera puede borrar una tarea, en cualquier estado, tras confirmar. Es un borrado físico, sin papelera. |

### 5. Fuera del MVP

| Fuera del MVP | Criterio | Por qué |
|---|---|---|
| **Varios equipos, o personas en más de uno** | C | Obliga a crear entidades de equipo y de miembros, invitaciones, permisos por equipo y un selector de contexto, que es la mayor parte del coste de un producto multi-tenant. El caso de estudio es un solo equipo de 6 personas: un espacio único lo cubre entero y valida lo mismo. |
| **Notificaciones push** | B | La señal es "un resumen que espera, no un aviso que interrumpe". El push recrearía la interrupción que se quiere quitar, solo que viniendo de FlowSync en vez de Slack. |
| **Integración con Slack** | B, C | Llevaría el estado a otro sitio, y FlowSync tiene que ser donde se mira, no donde se copia. Además exige OAuth y una app de Slack, mucho coste para algo que no valida el riesgo #1. |
| **Derivar el estado de Git/PRs, CI o calendario** | C | Sería otro producto: integraciones, OAuth de terceros y heurísticas para traducir un PR en un estado de tarea. Y esconde el riesgo #1 en vez de validarlo: si el estado se mantiene fresco solo porque se calcula solo, no se sabrá si el equipo lo mantendría a mano. |
| **Importar tareas de otro gestor o sincronizarse con él** | B | FlowSync sustituye al gestor actual, no convive con él. Sincronizar obliga a actualizar en dos sitios, que es como muere esta categoría de producto. Importar sería un paso de migración, no parte del producto, y con 6 personas se puede hacer a mano. |
| **Roles y permisos avanzados** | A, B | Los roles son planos y no hay un lead que gestione. La única regla con valor real es que solo el responsable termina su tarea, porque protege la señal de "quién está en qué" (sección 7). Cualquier otra jerarquía añade fricción sin cambiar ninguna decisión. |
| **Comentarios en tareas** | A, B | Convierten la lista en un canal de conversación, que es justo el "rollo" que se quiere evitar. Tampoco hacen falta para saber quién está en qué. La conversación sigue en el chat que el equipo ya usa. |
| **Analítica, reporting e informes** | A | No hay reporte hacia arriba y a un manager le da igual. Quien cobra el valor son los pares, y a un par no le sirve un informe. El criterio de éxito (sección 4) es cualitativo y no necesita instrumentación. |
| **Sprints, estimaciones, épicas y backlog priorizado** | B | Es la renuncia explícita a ser Jira. Cada uno es un campo o una ceremonia más que rompe lo de "uno o dos clics". Un equipo que los necesite no es nuestro usuario. |
| **Indicadores de presencia o de actividad de personas** ("quién está conectado", "última vez visto") | A, B | Es vigilancia, y se rechaza a propósito. El estado es de la tarea, no de la persona. Ver quién está conectado no ayuda a elegir tarea y erosiona la confianza que el producto necesita para que la gente actualice. |
| **Chat, videollamada y edición simultánea de un mismo documento** | A, C | "Tiempo real" significa ver el estado fresco, no colaborar a la vez. Ya hay herramientas para eso, y construirlas requeriría infraestructura de tiempo real que el polling no necesita. |
| **Borrar usuarios** | C | Abre preguntas sin contestar, como qué pasa con sus tareas `En curso`. Con 6 personas y un caso de estudio no se da. |
| **Paginar o archivar las tareas `Hecha`** | C | Con decenas o pocos cientos de tareas, la lista completa cabe en cada consulta del polling (sección 9). Paginar añade complejidad al refresco y al resaltado sin una necesidad real todavía. |

# Parte B

## 1. Los dos números. Cuántas cosas propuso la IA meter dentro del alcance, y cuántas quedaron dentro después de tu recorte. Tal cual salieron, sin redondear ni explicar.
La Ia propuso 8 y solo se hizo 1 recorte, quedando en 7

## 2. Tres cosas que dejaste fuera, y por qué cada una. El porqué tiene una forma concreta: qué hipótesis del producto no ayuda a validar. "No da tiempo" no vale, porque no es una decisión de producto: es una excusa de calendario, y mañana deja de ser cierta.
Responsable (opcional). Una tarea sin responsable aparece como libre, para ver "qué puedo coger". Incluía un atajo "me la quedo".

Incluía tres cosas: asignar un responsable a una tarea en cualquier momento, el concepto de tarea "libre" (la que no tiene responsable) y el botón "me la quedo".

Justificación

1. "Libre" ya lo resuelve el filtro por estado. Con tu cambio, una tarea Por hacer nunca tiene responsable, así que filtrar por Por hacer es exactamente la lista de lo que está libre. Mantener los dos conceptos sería duplicar.
2. Empezar una tarea ya es quedársela. "Empezar" asigna como responsable a quien la empieza y la pasa a En curso en un solo paso, así que el atajo "me la quedo" sobraba. Además, separar asignar y empezar permitiría tareas asignadas pero no empezadas, que es justo la ambigüedad que confunde "quién está en qué".
3. Hay una única regla de datos, y es simple. Sin responsable en Por hacer, con responsable en En curso y Hecha. Con la capability original, responsable y estado eran independientes y cabían combinaciones sin sentido, como una tarea Hecha sin nadie que la hiciera.
4. El conflicto pasa a ser parte natural del flujo. Si dos personas pulsan "Empezar" a la vez, la segunda recibe un 409. Con un responsable asignable por libre, dos personas podían asignársela sin que ninguna se diera cuenta, que es tu episodio de los dos días perdidos.

Lo que se recuperó después, ya acotado

El responsable no desapareció del todo: volvió como campo editable en la capability 2, con estas restricciones:

- Solo se puede cambiar cuando la tarea está En curso.
- No se puede dejar vacío.
- Sirve para que otra persona tome de forma consciente una tarea abandonada y luego la termine.

Con eso se volvió a necesitar GET /users par "me la quedo" (pregunta abierta 2 de lasección 14), ese endpoint vuelve a sobrar.

## 3. La exclusión de la que menos seguro estás, y qué tendría que pasar para que entrara. Lo que interesa es qué dos cosas se contradecían: lo que te pedían contra lo que veías, lo barato contra lo que valida, lo que enamora contra lo que se puede sostener.

