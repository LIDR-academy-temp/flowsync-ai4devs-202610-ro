# Prompts

Aquí van **todos los prompts que lanzaste** para hacer el ejercicio, en el orden en que los
lanzaste, con el modelo y la herramienta de cada uno.

Esto no es papeleo. Lo que se revisa es **cómo pediste las cosas**, no solo lo que salió: un
resultado flojo con un prompt bueno y un resultado flojo con un prompt vago necesitan feedback
distinto, y sin este archivo no se distinguen.

## Cómo rellenarlo

- Un apartado `## Prompt N` por cada prompt.
- **Pega el prompt tal cual lo lanzaste**, dentro del bloque de código, aunque ocupe diez líneas
  y aunque tenga faltas. No lo reescribas para que quede bien: el que arreglaste mentalmente
  después no es el que lanzaste.
- Incluye también los que **no funcionaron**. Suelen ser los más útiles de leer.
- `Modelo` y `Herramienta` en todos. Si cambiaste de una a otra a mitad, se nota aquí.

---

## Prompt 1

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```
Antes de empezar a definir ningún nuevo alcance, analiza el repositorio actual y hazme un resumen de 3 a 5 líneas indicando qué capabilities hay ya construidas y cómo es el modelo de datos actual de FlowSync. Recuerda respetar lo que ya existe para evitar duplicar trabajo.
```

**Qué salió:** resumen de lo existente: solo auth (signup, login, perfil, logout) y las tablas `users` y `auth_access_tokens`; nada del dominio de tareas.

## Prompt 2

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```
Partimos de este requisito inicial: 'Quiero que FlowSync sea una herramienta para que los equipos remotos sepan en qué está trabajando cada uno sin tener que hacer reuniones de sincronización. Algo tipo tareas compartidas pero más en tiempo real y menos rollo que Jira.'
Actúa como analista de producto y hazme exactamente una sola ronda con las 5 preguntas que más reducirían la incertidumbre sobre el problema, los usuarios y el alcance. Está totalmente prohibido bajar al modelo de datos o a los endpoints técnicos.
```

**Qué salió:** una sola ronda de 5 preguntas, sin bajar a lo técnico.

## Prompt 3

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```
1. El objetivo principal es saber al instante si puede empezar una tarea dependiente y detectar bloqueos sin tener que esperar a la reunión diaria. Para el miembro de un equipo: Saber si su compañero ya terminó lo suyo para poder arrancar su parte. Para el coordinador: Detectar cuellos de botella del día a día de un vistazo, evitando tener que preguntar a cada uno.
```

**Qué salió:** respuesta a la pregunta 1; la IA reencuadró el problema hacia dependencias y bloqueos.

## Prompt 4

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```
3. Tiempo real significa visibilidad de estado actual. Que se sepa al abrir la app en qué está trabajando cada uno hoy y su estado de la tarea.
```

## Prompt 5

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```
El usuario principal es un equipo de producto/desarrollo mixto y ágil (compuesto por desarrolladores, diseñadores y product/project managers), de un tamaño pequeño-mediano (entre 5 y 10 personas). Están en el mismo uso horario pero trabajan en remoto.
```

## Prompt 6

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```
Se quiere conservar de Jira sólo la claridad visual de quien tiene asignada qué tarea y ver el flujo general de trabajo (un simple tablero tipo kanban, pero ultraligero.
```

## Prompt 7

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```
El mínimo funcional (MVP) será un panel único donde cada miembro del equipo define su estado del día en 5 segundos y se visualiza claramente quién depende de quién. Sabremos que funciona si el equipo reduce el tiempo de reunión diaria porque ya traen esa visibilidad de casa. Queda fuera de la v1 integraciones complejas con gitHub, notificaciones automáticas, métricas de rendimiento, gràficas de velocidad y gestión de múltiples proyectos.
```

**Qué salió:** con las 5 respuestas la IA cerró un alcance (panel kanban + foco del día + dependencias) y propuso tres decisiones para confirmar.

## Prompt 8

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```
Confirmo las tres decisiones: me parece perfecto que el bloqueo sea manual, que no haya roles especiales de coordinador para mantenerlo simple, y que el foco sea un único tablero para un solo equipo. Adelante con las historias de usuario.
```

**Qué salió:** 10 historias de usuario con criterios de aceptación. Quedaron descartadas con el prompt siguiente.

## Prompt 9

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```
Olvida mis respuestas anteriores sobre el producto y reajusta el alcance basándote en la ficha de hechos siguiente: 

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

.
```

**Qué salió:** la IA rehízo el alcance: lista compartida en lugar de kanban; fuera dependencias, bloqueos y foco del día; 7 historias.

## Prompt 10

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```
Supuesto añadido: 'Vencida' no es un estado ni una columna independiente, sino una marca o indicador visual (ej. fecha en rojo) que aparece en las tarjetas de las columnas Pendiente, En curso o Bloqueada cuya fecha de vencimiento ya ha pasado. Las tareas en estado Hecha no muestran alerta de vencimiento.
```

**Qué salió:** la IA señaló una incoherencia: el supuesto hablaba de la columna "Bloqueada" y de "tarjetas", cuando la ficha deja los bloqueos fuera y habla de una lista, no de un tablero.

## Prompt 11

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```
Confirmo el supuesto que has redactado. Añado : - Fuera del MVP: notificaciones push, integración con Slack, roles/permisos avanzados, analítica/reporting, comentarios en tareas.
```

## Prompt 12

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```
A partir de toda la información y los hechos decididos anteriormente, genera la estructura de alcance del MVP dividida estrictamente en estos cinco bloques:

Problema

Usuarios

Propuesta de valor

Alcance

NO-alcance

Sé extremadamente agresivo recortando funcionalidades en la sección de NO-alcance y justifica detalladamente cada exclusión.
Recuerda no incluir bajo ningún concepto tablas de base de datos, endpoints ni diagramas de arquitectura; tiene que ser estrictamente un documento de producto de nivel conceptual.
```

**Qué salió:** alcance en cinco bloques: 7 elementos dentro y 20 exclusiones justificadas. La IA sacó del MVP por su cuenta "qué se ha movido desde mi última visita", que seguía sin decidir.

## Prompt 13

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```
Genera ahora el PRD a partir de este alcance
```

**Qué salió:** la IA escribió `docs/prd/alcance-mvp-JLL.md`, añadió supuestos, métricas de éxito y riesgos, y dejó la Parte B vacía para rellenarla a mano.

## Prompt 14

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```
rellena prompts.md con mis prompts tal cual los lancé
```
