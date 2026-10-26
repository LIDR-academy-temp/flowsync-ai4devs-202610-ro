# Alcance MVP · FlowSync

## 1. El terreno que ya existe
Hoy FlowSync solo resuelve la cuenta del usuario: registro con email y contraseña, inicio y cierre de sesión, y una pantalla de perfil. El frontend protege las pantallas privadas y recuerda la sesión.
El modelo actual tiene solo usuarios y sus sesiones; no existe nada de tareas, equipos ni proyectos.
Consecuencia para el MVP: la identidad de las personas ya está resuelta (sirve para el "responsable" de una tarea), y todo lo de tareas está por construir. Encaja con la decisión de un espacio único sin entidad "equipo".

## 2. Supuestos declarados
Las respuestas de producto vienen de la ficha de hechos. Esto es lo que la ficha no cubría y se ha decidido aquí:
- Solo el título es obligatorio. Responsable y fecha son opcionales y el estado arranca en *pendiente*. Una tarea sin responsable es una tarea **libre**.
- Cada tarea muestra hace cuánto cambió su estado. No hay historial ni «novedades desde tu última visita».
- Hay tres estados fijos, no configurables: *pendiente*, *en curso* y *hecha*.
- Cada tarea tiene como mucho un responsable. Cualquiera puede crear, editar, reasignar o borrar cualquier tarea.
- Quien se registra en la instancia entra en el único espacio, sin invitaciones. Una instalación equivale a un equipo y se despliega en privado.
- Las tareas hechas siguen en la lista y se ocultan con el filtro. No hay archivado.
- La fecha de vencimiento es un día, sin hora. Una tarea está vencida si pasó ese día y no está hecha.
- Es una web de escritorio en castellano. Los cambios llegan en unos segundos; no hace falta latencia de edición simultánea.
- Varios equipos, o gente en más de uno, queda fuera, como fija la ficha.

## 3. Alcance

### Problema
En un equipo remoto nadie ve en qué está cada uno sin interrumpir a alguien. El coste se paga dos veces: en la ronda de «¿en qué estás?», que se come media daily, y en trabajo duplicado. En el caso de estudio, dos personas tocaron el mismo módulo la misma semana y se perdieron dos días.

### Usuarios
Los miembros de un equipo remoto pequeño (3–10 personas) con roles planos. No hay un lead que reporte hacia arriba. El primer usuario es un caso de estudio: un equipo SaaS de 6 personas en 3 husos horarios, con un gestor de tareas pesado y una daily de 15 minutos.

### Propuesta de valor
Una lista de tareas compartida que es a la vez tu cola de trabajo y el estado del equipo. Actualizarla cuesta dos clics y lo que cambian los demás aparece sin refrescar, así que antes de coger algo sabes si ya lo está tocando otro. No elimina la daily: elimina su ronda de «¿en qué estás?».

El MVP existe para validar tres hipótesis:
- **H1 · Frescura:** si actualizar cuesta dos clics, el estado se mantiene al día sin obligar a nadie. Es el riesgo #1.
- **H2 · Decisión:** ver quién está en qué y qué está libre evita empezar lo que otro ya toca.
- **H3 · Sustitución:** a la semana, el equipo cancela la ronda de «¿en qué estás?» y nadie pide que vuelva.

### Alcance (9 ítems propuestos por la IA)
1. Una lista única de tareas que ve todo el espacio.
2. Crear una tarea escribiendo solo el título, en segundos.
3. Cambiar el estado de una tarea en dos clics desde la propia lista.
4. Coger una tarea libre o asignarla a un compañero, y ver de un vistazo cuáles están libres.
5. Poner una fecha de vencimiento opcional y ver marcadas las tareas vencidas.
6. Filtrar la lista por estado.
7. Ver los cambios de los demás sin refrescar.
8. Corregir el título de una tarea o borrarla.

### NO-alcance
Junto a cada exclusión va la hipótesis que no ayuda a validar, o la que contradice.
- **Notificaciones push, emails y resumen diario por correo.** Contradicen la señal que espera. H1 mide si la gente mira la lista por su cuenta, y un aviso enmascararía la respuesta.
- **Integración con Slack.** Comprueba si FlowSync convive con otra herramienta, y H3 apuesta por sustituir, no por convivir.
- **Sacar el estado de Git, PRs, CI o calendario.** Esquiva H1 en vez de validarla: lo que hay que saber es si la persona lo teclea. Además es otro producto, con integraciones de terceros.
- **Presencia, «quién está conectado» e indicadores de actividad.** Miden a la persona, no la tarea, y se rechazan a propósito por ser vigilancia. Ninguna hipótesis los necesita.
- **Historial, feed de actividad y «novedades desde tu última visita».** H2 se responde con el estado actual y su antigüedad; el relato de lo que cambió no añade decisión.
- **Comentarios en tareas.** Convierten la lista en conversación. Los bloqueos que se discutirían ahí siguen en la daily y este MVP no los promete.
- **Estado «bloqueada» o gestión de bloqueos.** La ficha dice que esa parte de la daily sigue. Meterla validaría otra cosa distinta de H3.
- **Estados o flujos configurables.** Cada paso de configuración sube el coste de empezar y de actualizar, que es justo lo que H1 quiere mantener bajo.
- **Descripción larga, etiquetas, prioridad, subtareas y adjuntos.** Cada campo de más encarece crear y actualizar (H1) y no cambia la decisión de H2.
- **Varios responsables por tarea.** Difuminan «quién está en qué», que es la respuesta que busca H2.
- **Varios equipos o espacios, invitaciones y roles o permisos.** El caso de estudio es un solo equipo plano, y nada de esto toca H1, H2 ni H3.
- **Sprints, estimaciones, épicas y backlog priorizado.** Son una renuncia explícita: un equipo que los necesite no es nuestro usuario.
- **Analítica e informes.** No hay nadie a quien reportar. Validan el interés de un manager, no el de los pares.
- **Importar tareas de otro gestor.** Prueba la migración, no el uso diario. Para una semana de prueba se empieza con la lista en blanco.
- **Más filtros (por responsable o por fecha) y búsqueda.** Con 3–10 personas la lista se lee de un vistazo, y el filtro por estado basta para centrarse en lo pendiente.
- **App móvil y modo offline.** El caso «llego por la mañana y miro» ocurre en el escritorio de trabajo. No afectan a H1, H2 ni H3.
- **Edición simultánea del mismo contenido.** «Tiempo real» aquí es frescura del estado, no colaboración sobre un documento.
- **Ver en cada tarea hace cuánto cambió su estado.


   ## Notas: incoherencias que señaló la IA
 - Campos obligatorios. La ficha dice «sin campos obligatorios», pero también que una tarea «necesita título,
    responsable, estado y fecha».
    → Supuesto: solo el título es obligatorio. El estado arranca en uno por defecto, y responsable y fecha son
    opcionales. Una tarea sin responsable es una tarea libre, que es justo lo que la ficha quiere poder ver.
  - «Tiempo real» frente a «veo qué se ha movido». Ver el estado actual sin refrescar no te dice qué cambió mientras no
    mirabas.
    → Supuesto: cada tarea muestra hace cuánto cambió su estado. Es frescura de la tarea, no de la persona. No hay
    historial, feed de actividad ni «novedades desde tu última visita». Es el supuesto del que menos seguro estoy.


## Parte B · Las tres líneas
> Nota: el recorte y esta parte se hicieron unos minutos después de sonar el reloj de 45 min.

1. **Números:** la IA propuso 9 ítems dentro del alcance; tras mi recorte quedaron 8.

2. **Tres exclusiones y por qué:**
   - **Notificaciones push:** si el producto avisa, no puedo saber si la gente consulta la lista por iniciativa propia, que es justo lo que necesito validar (H1).
   - **Sacar el estado de Git/PRs/CI:** esquiva la pregunta clave. Lo que quiero comprobar es si la persona actualiza el estado ella misma cuando le cuesta dos clics; si se deriva solo, nunca lo sabré.
   - **Comentarios en tareas:** convierten la lista en conversación. Los bloqueos siguen resolviéndose en la daily, así que no ayudan a probar que desaparezca la ronda de "¿en qué estás?".

3. **La exclusión de la que menos seguro estoy:** mostrar en cada tarea hace cuánto cambió su estado. Se contradecían lo barato (mostrar solo el estado actual) contra el riesgo #1 del producto (que la información se quede vieja sin que nadie lo note). Entraría si en la primera semana alguien empieza algo basándose en un estado que ya no era cierto.

📌 **La IA señaló una incoherencia y tenía razón:** la ficha pedía "sin campos obligatorios" pero también que toda tarea tenga título, responsable, estado y fecha. Lo resolví dejando solo el título como obligatorio; responsable y fecha son opcionales, y una tarea sin responsable se lee como "libre".