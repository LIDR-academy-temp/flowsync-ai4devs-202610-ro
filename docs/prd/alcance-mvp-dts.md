# Parte A
## 1. Terreno existente
### Prompt 
Necesito examinar todo el codigo fuente y documentación de este proyecto para saber que capabilities funcionales ya
  existen y el modelo de datos actual a nivel conceptual, con el objetivo de saber que hay para poder plantear
  funcionalidades futuras. No propongas todavía cambios, nuevas funcionalidades, endpoints ni arquitectura.

### Resultado :
FlowSync: lo que existe hoy

FlowSync es un monorepo con una API en backend/ (AdonisJS 7, Lucid y SQLite) y una SPA en frontend/ (React 19 y Vite). Hoy cubre solo la identidad de usuario. A pesar de la descripción del proyecto ("gestión de tareas en equipo"), no hay nada de tareas, equipos ni proyectos. Solo hay texto de marketing en la pantalla de registro: "organizar el trabajo del equipo".

Capacidades funcionales existentes

┌─────┬─────────────────┬──────────────────────────────────┬─────────────────────────────────────────────────────────────────────────────────────────┐
│  #  │    Capacidad    │            Dónde vive            │                                     Comportamiento                                      │
├─────┼─────────────────┼──────────────────────────────────┼─────────────────────────────────────────────────────────────────────────────────────────┤
│     │                 │ POST /api/v1/auth/signup y       │ Pide nombre completo (opcional), email, contraseña y confirmación. El email debe ser    │
│ 1   │ Registro        │ /register en el frontend         │ único y válido (máx. 254 caracteres). La contraseña tiene entre 8 y 32 caracteres. Al   │
│     │                 │                                  │ registrarse se crea el usuario y se inicia sesión en el acto.                           │
├─────┼─────────────────┼──────────────────────────────────┼─────────────────────────────────────────────────────────────────────────────────────────┤
│ 2   │ Login           │ POST /api/v1/auth/login y /login │ Valida email y contraseña y devuelve usuario y token. Si las credenciales son erróneas, │
│     │                 │                                  │  responde 400 y el frontend muestra un mensaje genérico.                                │
├─────┼─────────────────┼──────────────────────────────────┼─────────────────────────────────────────────────────────────────────────────────────────┤
│ 3   │ Logout          │ POST /api/v1/account/logout      │ Borra en el servidor solo el token actual. En el cliente la sesión se cierra siempre,   │
│     │                 │                                  │ aunque la llamada falle.                                                                │
├─────┼─────────────────┼──────────────────────────────────┼─────────────────────────────────────────────────────────────────────────────────────────┤
│ 4   │ Consulta de     │ GET /api/v1/account/profile y    │ Devuelve el usuario autenticado. La pantalla muestra iniciales, nombre (o "Sin          │
│     │ perfil          │ /profile                         │ nombre"), email y "Miembro desde".                                                      │
├─────┼─────────────────┼──────────────────────────────────┼─────────────────────────────────────────────────────────────────────────────────────────┤
│     │ Sesión          │                                  │ Guarda el token en localStorage (flowsync.token) y lo valida contra /account/profile al │
│ 5   │ persistente     │ auth-provider.tsx                │  arrancar. Con un 401 borra la sesión. Con otro fallo, como un corte de red, conserva   │
│     │                 │                                  │ el token pero deja al usuario como anónimo.                                             │
├─────┼─────────────────┼──────────────────────────────────┼─────────────────────────────────────────────────────────────────────────────────────────┤
│ 6   │ Control de      │ protected-route.tsx y            │ Las rutas privadas redirigen a /login. Las de login y registro redirigen al perfil si   │
│     │ acceso por ruta │ public-only-route.tsx            │ ya hay sesión. Cualquier ruta desconocida lleva a /profile.                             │
├─────┼─────────────────┼──────────────────────────────────┼─────────────────────────────────────────────────────────────────────────────────────────┤
│ 7   │ Gestión de      │ lib/api.ts y use-auth-form.ts    │ Traduce los errores de VineJS al castellano y los coloca bajo cada campo. También cubre │
│     │ errores         │                                  │  401 (sesión caducada), fallo de red y 500.                                             │
└─────┴─────────────────┴──────────────────────────────────┴─────────────────────────────────────────────────────────────────────────────────────────┘

Otros datos de comportamiento:
- Hay una ruta raíz GET / que devuelve {hello: "world"}.
- Todas las respuestas van envueltas en { data: ... }.
- La interfaz está en castellano.

Modelo de datos conceptual

Hay dos entidades y una sola relación.

User (1) ────────< (N) AuthAccessToken

User (tabla users)
- id
- fullName: opcional
- email: único
- password: se almacena como hash y nunca se serializa
- createdAt y updatedAt
- Atributo derivado initials: dos letras sacadas del nombre o, si no hay, del email

AuthAccessToken (tabla auth_access_tokens) es una entidad técnica de sesión, no de negocio.
- tokenableId: FK a users con borrado en cascada
- type, name, hash, abilities
- createdAt, updatedAt, lastUsedAt, expiresAt

Cada login o registro crea un token opaco nuevo, así que un usuario puede tener varias sesiones simultáneas.

Lo que no existe en el modelo:
- Roles ni permisos: abilities existe en la tabla de tokens, pero no se usa.
- Entidades de dominio: tareas, equipos, proyectos, organizaciones.
- Relaciones de pertenencia entre usuarios.
- Recuperación o cambio de contraseña, verificación de email, edición de perfil, borrado de cuenta.

Infraestructura y convenciones

- Auth: access tokens opacos con guard api por defecto. El guard web (sesión) está configurado pero no se usa.
- Respuestas: siempre pasan por serialize() y un Transformer.
- Validación: VineJS en app/validators/user.ts.
- Esquema: database/schema.ts se autogenera desde las migraciones, así que los modelos no declaran columnas.
- Frontend: Tailwind v4, shadcn/ui (Alert, Button, Card, Input, Label) y react-router. Todas las llamadas a la API están centralizadas en lib/api.ts.
- Pruebas: hay dos suites configuradas (unit y functional), pero no existen tests. Solo está tests/bootstrap.ts. El frontend no tiene runner de tests.
- Tipos compartidos: los tipos del frontend (lib/types.ts) son un espejo manual del transformer. Existe un registro Tuyau generado en el backend, pero el frontend no lo consume.
- Documentación: el único contenido útil es CLAUDE.md (AGENTS.md apunta a él). prompts.md es una plantilla del ejercicio y frontend/README.md es el de la plantilla de Vite. No hay un README raíz ni documentación de producto.

Observaciones sobre el estado actual

- El git status inicial muestra cambios sin commitear en .adonisjs/, .env.example y schema.ts. No los he examinado en detalle.
- La rama actual es s2/start.
- No he modificado nada en el repo.
- El comando cat en Bash falló con código 57 en este entorno, así que leí los ficheros con las herramientas de lectura. No tengo constancia de que haya quedado nada sin leer del código propio, aunque no abrí los componentes de UI de shadcn ni login-page.tsx.

## 2. Interrogatorio y hechos de producto
### Prompt 1
Tenemos esta idea inicial de producto:
Quiero que FlowSync sea una herramienta para que los equipos remotos sepan en qué está trabajando cada uno sin tener que hacer reuniones de sincronización. Algo tipo tareas compartidas pero más en tiempo real y menos rollo que Jira.

Antes de proponer ninguna solución, hazme exactamente las 5 preguntas que más reduzcan la incertidumbre sobre el problema, los usuarios, el valor y el alcance de un MVP.

Haz una sola ronda de preguntas.
No preguntes todavía por modelo de datos, endpoints, arquitectura ni detalles técnicos de implementación.
### Resultado
Estas son las 5 preguntas, en orden de cuánta incertidumbre resuelven.

1. ¿Qué pasa hoy, en concreto, cuando un equipo remoto no sabe en qué trabaja cada uno?
   Cuéntame una situación real reciente, por ejemplo una reunión que sobró, un trabajo duplicado o un bloqueo que se descubrió tarde. ¿Qué herramientas o rituales usan hoy (Slack, standups, Jira, Notion) y qué es lo que falla en ellos? Necesito saber si el dolor es la falta de visibilidad, el coste de actualizar la información o la interrupción de las reuniones.
2. ¿Quién es el usuario principal y cómo es su equipo?
   ¿Es un equipo de desarrollo, de diseño o mixto? ¿De cuántas personas y en qué husos horarios? ¿Quién decide adoptar la herramienta (un líder técnico, un manager, cada persona por su cuenta) y quién la sufriría si se vuelve una carga?
3. ¿Qué significa "tiempo real" para ti?
   ¿Es ver al instante quién está haciendo qué ahora mismo, como un estado de presencia? ¿O basta con un resumen actualizado a lo largo del día? ¿Y quién mantiene esa información al día: las personas a mano, o debería deducirse de forma automática de lo que hacen?
4. ¿Qué es lo que NO quieres heredar de Jira?
   ¿Son los campos obligatorios, los flujos de estados, la configuración, las sprints, la sobrecarga de tickets? Y a la inversa, ¿qué de las "tareas compartidas" sí te parece imprescindible mantener?
5. ¿Cómo sabrás que el MVP funciona, y qué es lo mínimo que lo demostraría?
   Piensa en un equipo piloto concreto: ¿qué tendría que hacer durante dos semanas y qué resultado (menos reuniones, menos mensajes de "¿en qué estás?", uso diario espontáneo) te haría decir "esto resuelve el problema"? Y qué dejarías fuera de la primera versión aunque te cueste.

### Prompt 2
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

### Resultado Prompt 3
Síntesis de lo que has definido

Problema y valor

- Dolor: la ronda de "¿en qué estás?", tanto en la daily como por Slack. Nadie ve el estado del equipo sin interrumpir a alguien.
- Caso que lo prueba: dos personas tocaron el mismo módulo la misma semana sin saberlo, y perdieron dos días.
- Quién cobra el valor: los pares, no un lead. No hay reporte hacia arriba.
- Decisión que cambia: no empezar algo que otra persona ya está tocando, y elegir lo siguiente sabiendo qué está libre.
- Qué no resuelve: los bloqueos, que siguen en la daily.

Usuario y alcance

- Usuario: equipos remotos de 3 a 10 personas, con roles planos. El caso de estudio es un equipo SaaS de 6 personas en 3 husos horarios.
- Un solo espacio compartido: no hay entidad "equipo". Varios equipos, o gente en más de uno, queda fuera y se anota como supuesto.
- Sustituye al gestor de tareas, no convive con él. FlowSync crea sus propias tareas y no lee las de otro sitio.

Qué entra en el MVP

- Tarea: título, responsable, estado y fecha de vencimiento.
- Estado tecleado a mano, en dos clics y sin campos obligatorios.
- Lista filtrable por estado, que es a la vez la cola de trabajo de quien la usa.
- "Tiempo real": los cambios de estado de las tareas aparecen sin refrescar. No es presencia, ni chat, ni edición simultánea. El estado pertenece a la tarea, no a la persona.
- Resumen que espera: la persona llega por la mañana y ve qué se ha movido. No hay notificaciones push.
- Forma de entrega: una vertical fina y terminada de punta a punta.

Qué queda fuera

Push, Slack, permisos avanzados, analítica, comentarios, derivar el estado desde Git, CI o calendario, sprints, estimaciones, épicas, backlog priorizado e informes.

Cómo se valida

- Éxito: a una semana de uso real, el equipo cancela la ronda de "¿en qué estás?" y nadie pide que vuelva.
- Riesgo n.º 1: que la información se quede vieja. La mitigación es que actualizar cueste dos clics, no obligar a nadie.

Puntos que no quedan cerrados

No son cambios sobre lo que has dicho. Son huecos que habrá que decidir antes de especificar:

1. "Qué se ha movido" desde mi última visita. Pides ver eso al volver de una reunión, pero una tarea con título, responsable, estado y fecha solo muestra su estado actual. Hay que decidir si el MVP necesita recordar cuándo cambió cada estado. No lo propongo, solo señalo que el requisito no se cumple con los cuatro campos.
2. Tareas sin responsable. Para saber "qué está libre" hace falta que una tarea pueda no tener dueño. Eso choca con "responsable" como campo de la tarea, si lo entiendes como obligatorio.
3. Qué estados existen. Falta el conjunto mínimo (por ejemplo, pendiente, en curso, hecha) y si cada equipo lo puede cambiar. Esto afecta a tu promesa de "sin configuración".
4. Fecha de vencimiento opcional. Dices que no hay campos obligatorios, pero también quieres ver lo vencido de un vistazo. Habrá que decidir si la fecha es opcional.
5. Pertenencia al espacio único. Con un solo espacio y sin equipo, ¿quién puede registrarse? Con el registro abierto actual cualquiera entra y ve todo. Puede ser aceptable para el caso de estudio, pero conviene anotarlo como supuesto.
6. Quién edita qué. "Todos ven y editan lo mismo" implica que cualquiera puede cambiar el estado de la tarea de otro. Eso encaja con roles planos, pero contradice un poco que "lo teclea quien hace la tarea".

Dime si quieres que cierre esos puntos contigo en una segunda ronda corta o que redacte el PRD con ellos marcados como supuestos abiertos.

## 3. Alcance del MVP
### Prompt
Con todo el contexto anterior, propón un MVP para FlowSync.

Sé agresivo recortando alcance: queremos una vertical fina y usable de punta a punta, no construir el esqueleto de un producto grande.

Organiza la propuesta únicamente en estos cinco bloques:

Problema
Usuarios
Propuesta de valor
Alcance del MVP
NO-alcance

Para cada elemento del NO-alcance, explica qué hipótesis del producto NO necesitamos validar construyéndolo ahora.

No incluyas tablas, modelo de datos, endpoints, arquitectura, diagramas ni detalles técnicos de implementación.

Al final, indica claramente cuántas capacidades o funcionalidades has propuesto incluir dentro del alcance.

### Resultado
Propuesta de MVP de FlowSync

Problema

Los equipos remotos pequeños no pueden saber en qué está cada persona sin interrumpirla. El síntoma es la ronda de "¿en qué estás?", que se come la mitad de la daily y se repite por chat durante el día. El coste real es trabajo duplicado, como los dos días perdidos cuando dos personas tocaron el mismo módulo sin saberlo, y elegir la siguiente tarea a ciegas.

Usuarios

- Usuario: pares dentro de un equipo remoto de 3 a 10 personas, con roles planos.
- Caso de estudio: un equipo de 6 personas de producto SaaS reNo es un cliente real.
- Quien cobra el valor: quien trabaja, no quien gestiona. Nadie recibe reportes hacia arriba.
- Supuesto de partida: hay un único espacio compartido, sin entidad "equipo". Cualquier miembro puede ver y editar cualquier tarea.

Propuesta de valor

Una sola lista compartida donde el estado de cada tarea se ve a nadie. Se mantiene al día en dos clics porque la misma listaes la cola de trabajo de quien la actualiza. Quien la mantiene recibe menos interrupciones, y por eso la mantiene.

Evita que alguien empiece lo que otra persona ya tiene y deja ver qué está libre. No pretende eliminar la daily entera. Solo la ronda de "¿en qué estás?". Los bloqueos siguen tratándose en la daily.

Alcance del MVP

Se parte de las cuentas que ya existen (registro, login y logonco capacidades:

1. Crear y editar tareas. Una tarea tiene título, responsable to opcional. Una tarea sin responsable significa "libre". Losúnicos campos obligatorios son el título y, de forma implícita, el estado inicial.
2. Cambiar el estado en dos clics. Hay tres estados fijos: pendiente, en curso y hecha. No se configuran.
3. Una lista única y compartida, filtrable por estado. Muestra de un vistazo quién tiene qué y destaca las tareas con la fecha vencida.
4. Actualización en vivo. Los cambios de otros aparecen en la lista sin refrescar ni preguntar. Se refiere al estado de las tareas, nunca a quién está
   conectado.
5. Marca de "ha cambiado desde tu última visita". Es el resumen que espera: al volver de una reunión o por la mañana, la persona ve qué se ha movido sin que nadie la avise. Sin esta capacidad la promesa de valor no se cumple, así que es lo único que añado a lo que describiste.

Decisiones que tomo para cerrar los huecos que quedaron abiertos:
- El registro sigue abierto. Se acepta como supuesto del piloto y no se resuelve ahora.
- Cualquier miembro puede editar cualquier tarea.

NO-alcance

Para cada punto, la hipótesis que no necesitamos validar construyéndolo ahora:

- Notificaciones push e integración con Slack. No validamos que avisar mejore algo. La hipótesis es justo la contraria: que un resumen que espera basta para dejar de preguntar.
- Derivar el estado desde Git, PRs, CI o calendario. No validamos que automatizar sea necesario. Primero hay que comprobar si teclear el estado en dos clics se sostiene, que es el riesgo n.º 1. Automatizar presupone que no se sostiene.
- Varios equipos, o personas en más de un equipo. No validamos que el producto sirva fuera de un único equipo pequeño. Es un supuesto anotado, no un
  problema a resolver.
- Roles y permisos. No validamos que un equipo de 3 a 10 personas necesite control sobre quién puede tocar qué. La hipótesis a probar es que la confianza entre pares basta.
- Comentarios en tareas y chat. No validamos que la coordinaciro de la herramienta. La hipótesis es que ver el estado reducelas preguntas, no que haya que mover la conversación aquí.
- Presencia y actividad de las personas. No hay hipótesis que validar: es una decisión de producto. El estado es de la tarea, no de la persona, y        rechazamos la vigilancia a propósito.
- Analítica, informes y vistas para managers. No validamos que exista valor hacia arriba. Nadie del equipo piloto lo pide, y un manager no es el usuario.
- Sprints, estimaciones, épicas, backlog priorizado y prioridades. No validamos que el equipo objetivo necesite planificar con esas herramientas. Si lo  necesita, no es nuestro usuario.
- Estados o campos configurables. No validamos que cada equipo necesite su propio flujo. La hipótesis es que tres estados fijos bastan y que configurar es justo el rollo que queremos evitar.                                                                                                                    Historial completo de cambios y auditoría. No validamos que cisiones. Solo necesitamos saber qué ha cambiado desde laúltima visita, no reconstruir quién hizo qué y cuándo.
- Importar tareas desde otros gestores. No validamos que la adopción dependa de migrar el histórico. FlowSync sustituye al gestor, no convive con él. El piloto empieza con la lista vacía.
- Gestión de bloqueos. No validamos que la herramienta pueda sustituir esa parte de la daily. Queda explícitamente en la reunión.
- Invitaciones y gestión de miembros. No validamos cómo entra la gente a un espacio. El piloto es un solo equipo con registro abierto.
- Borrar o archivar tareas, búsqueda y ordenación avanzada. Noeña se vuelva inmanejable en una semana de uso. El filtro porestado cubre lo que hace falta para centrarse en lo pendiente.

Resumen

He propuesto 5 capacidades dentro del alcance, sobre las cuentas de usuario que ya existen y que no cuento como nuevas.

Criterio de éxito: a una semana de uso real, el equipo cancela la ronda de "¿en qué estás?" y nadie pide que vuelva.


#Parte B

La IA ha propuesto en total de 18 historias de usuario y decidió recortar 13.

De las 5 que ha dejado la IA yo voy  a dejar 3.
1. Crear y editar tareas.   --> Mantengo. Me parece básico  poder introducir y modificar tareas en el sistema
2. Cambiar el estado en dos clics.  --> Mantengo. Me parece básico que los usuarios puedan modificar el estado de las tareas para poder asignarsela y ponerla en curso o concluida.
3. Una lista única y compartida, filtrable por estado. Me parece básico que los usuarios tenga una lista común donde puedan ver el estado de las tareas y quien las tiene asignada. 
4. Actualización en vivo. --> Rechazo. Creo que no es indispensable que los usuario tenga que ver en tiempo real la asignación de tareas. Pueden refrescar la pantalla justo cuando tengan que tomar una tarea.
5. Marca de "ha cambiado desde tu última visita".  --> Rechazo. No es indispensable que el usuario pueda ver los cambios desde la ultima conexion. 


Tengo dudas sobre la exclusion de la tarea 5 porque  no se si es util que los usuarios tengan información de los cambios recientes o si en verdad eso le vendría bien a un gestor.