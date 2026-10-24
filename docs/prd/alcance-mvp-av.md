# Alcance del MVP de FlowSync

## 1. El terreno que ya existe

El proyecto solo tiene identidad: registro, login, perfil y logout, con sesión que se recupera al recargar. El modelo de datos son dos entidades, usuario y token de acceso. No existe nada de dominio: ni tareas, ni estados, ni responsables, ni espacio compartido, ni actualización en vivo, ni tests. Lo que se defina aquí reutiliza la cuenta de usuario y parte de cero en todo lo demás.

## 2. Lo decidido antes de proponer

- **Qué duele:** la ronda de "¿en qué estás?" de la daily y las interrupciones para preguntarlo. Episodio: dos personas tocaron el mismo módulo la misma semana sin saberlo, y se perdieron dos días.
- **Quién cobra el valor:** los pares, no un lead. No hay reporte hacia arriba.
- **Primer usuario (caso de estudio, no cliente real):** equipo de 6 personas de producto SaaS en 3 husos horarios, con un gestor de tareas pesado y una daily de 15 minutos.
- **Qué desaparece:** solo la ronda de "¿en qué estás?". La parte de bloqueos de la daily sigue y este MVP no la resuelve.
- **Qué decisión cambia:** no empezar algo que otra persona ya está tocando, y elegir lo siguiente sabiendo qué está libre.
- **Éxito a una semana de uso real:** el equipo cancela esa ronda y nadie pide que vuelva.

## 3. Alcance en cinco bloques

### Problema

Las personas de un equipo remoto no pueden saber qué hace cada compañero sin preguntárselo o esperar a una reunión. El coste es doble: interrumpen a otros solo para enterarse, y a veces descubren tarde que dos personas llevaban días en lo mismo. Las herramientas que hoy usan para llevar el trabajo son tan pesadas que lo que se registra se queda desactualizado, y entonces nadie se fía de ello.

### Usuarios

Equipos remotos pequeños de 3 a 10 personas, con roles planos: todos ven y editan lo mismo. El primer caso es el equipo de 6 personas descrito arriba.

### Propuesta de valor

Un único sitio donde cualquiera ve de un vistazo qué hace cada persona y qué está libre, y donde actualizar tu parte cuesta segundos. Sustituye al gestor de tareas, no convive con él. Quien actualiza cobra en el momento: esa misma lista es su cola de trabajo, y deja de recibir interrupciones preguntándole cómo va.

### Alcance (lo que entra)

1. **Un espacio compartido único.** Quien tiene cuenta lo ve entero, reutilizando el registro y el login que ya existen.
2. **Crear una tarea con lo mínimo.** Título obligatorio y responsable opcional. Nada más es obligatorio.
3. **Cambiar el estado de una tarea en un gesto.** Cuatro estados: Por hacer, En curso, Hecha y Cancelada. Cualquier estado puede pasar a cualquier otro, y cualquiera del equipo puede hacerlo. Una tarea En curso siempre tiene responsable: si pasa a En curso sin él, queda a nombre de quien la movió. Cancelada no necesita responsable y se puede reabrir.
4. **Una vista con todas las tareas del equipo**, con estado y responsable visibles. Una tarea sin responsable se lee como libre, sin que "libre" sea un estado.

**Podría estar (el MVP sobrevive sin ello, sin criterio de éxito atado):**

- **Ver los cambios de los demás sin refrescar.** Con 3 husos horarios, el caso principal es llegar por la mañana y ver qué se ha movido, y eso funciona recargando la página.
- **Ordenar la lista por estado:** primero En curso, después Por hacer (con o sin responsable), luego Hecha y por último Cancelada.

### NO-alcance (cada exclusión con su porqué)

- **Fecha de vencimiento.** La ficha de partida la incluía en la tarea, para ver qué se ha pasado de plazo. Se deja fuera porque ayuda a gestionar plazos, no a saber quién está en qué, así que no valida ni refuta la hipótesis.
- **Notificaciones push y avisos.** Validan que el aviso informa más de lo que interrumpe, que es otra hipótesis. El MVP prueba que mirar una lista basta para dejar de preguntar.
- **Presencia ("quién está conectado").** El estado es de la tarea, no de la persona. La presencia no ayuda a evitar duplicar trabajo y se acerca a la vigilancia, que se rechaza a propósito.
- **Los bloqueos de la daily.** Se decidió que el MVP no los resuelve. Meterlos diluiría la prueba, que es si desaparece solo la ronda de "¿en qué estás?".
- **Comentarios en tareas.** Validan la comunicación, no la visibilidad. Es chat con otro nombre y alimenta justo las interrupciones que se quieren quitar.
- **Varios equipos o espacios, y personas en más de uno.** Con un caso de estudio de 6 personas no se aprende nada sobre multiequipo. Queda anotado como supuesto, no se construye.
- **Roles y permisos.** Todos ven y editan lo mismo. La jerarquía no aporta nada a la hipótesis de visibilidad entre pares.
- **Integración con Slack, importar o sincronizar con el gestor actual, y derivar el estado de Git, CI o calendario.** Convivir con el gestor pesado obliga a actualizar dos sitios, que es como muere esta categoría. Derivar el estado es otro producto, con integraciones y OAuth de terceros. El MVP se prueba como sustituto.
- **Sprints, estimaciones, épicas, backlog priorizado, analítica e informes.** Un equipo que los necesite no es el usuario de esta hipótesis, y cada uno devuelve el "rollo" que se quiere evitar.
- **Subtareas, etiquetas y adjuntos.** Aumentan el coste de crear una tarea sin ayudar a ver quién está en qué.
- **Edición simultánea sobre una misma tarea, chat y videollamada.** "Tiempo real" aquí significa, como mucho, ver cambios de estado sin refrescar, y es opcional.
- **Resumen de lo que cambió desde la última visita.** Es la exclusión más incómoda (ver Parte B). No se construye para no meter una segunda forma de consumir la lista antes de comprobar si la primera basta.
- **Borrar tareas.** Cancelada ya da salida a lo creado por error o que ya no vale, y borrar añade riesgo de perder información sin aportar a la validación.
- **Filtrar la lista por estado.** No valida la hipótesis central: la pregunta es si ver quién está en qué reduce la ronda de "¿en qué estás?", y eso se prueba con una lista que muestre estado y responsable. Con 6 personas el volumen no justifica todavía el coste.
- **Estados extra: Bloqueada, En revisión y estados configurables.** Bloqueada abriría la puerta a los bloqueos de la daily. En revisión es un paso de proceso, no una señal de quién está en qué. Configurar estados es exactamente la configuración que provoca el "rollo" que se quiere evitar.

### Supuestos declarados

- **Quién mantiene el estado al día.** Se asume que lo actualiza quien hace la tarea porque esa lista es su propia cola de trabajo. No estaba respondido y es el riesgo número uno a validar: si la información se queda vieja, el producto pierde el sentido.
- **Todos los miembros comparten el mismo espacio desde el principio.** Cualquiera con cuenta entra.
- **Una tarea sin responsable significa "libre".** No existe un estado aparte para "sin asignar".

---

## Parte B: las tres líneas

1. **Los dos números.** La IA propuso 5 cosas dentro del alcance. Tras el recorte quedan 4 dentro, más 2 en "podría estar".
2. **Tres cosas que dejé fuera, y por qué.**
   - **Notificaciones:** no ayudan a validar que mirar una lista basta para dejar de preguntar, que es la hipótesis del MVP.
   - **Presencia:** no ayuda a evitar duplicar trabajo, porque el estado es de la tarea y no de la persona.
   - **Filtro por estado:** no ayuda a validar que ver quién está en qué reduce la ronda de la daily, y con 6 personas la lista cabe a ojo.
3. **La exclusión de la que menos seguro estoy: el resumen de lo que cambió desde la última visita** (y, junto a ella, ver cambios sin refrescar, que quedó como "podría estar"). Lo barato (una sola vista) choca con lo que valida: con 3 husos horarios casi nunca coinciden en línea las 6 personas, así que la frescura al llegar por la mañana vale más que la inmediatez. Si la lista sola no basta para dejar de preguntar, esta es la primera pieza que entraría.
