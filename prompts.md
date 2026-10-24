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

Borra el ejemplo de abajo cuando escribas el primero.

---

## Prompt 1

**Modelo:** Opus 5.5
**Herramienta:** Claude Code - CLI

```
Revisa el proyecto, quiero que indentifiques las capabilities ya hay construidas y cómo es el modelo de datos
  actual, y me entregues un resumen
```

**Qué salió:** funcionó a la primera / Da un resumen del proyecto e indica caracteristicas a tener en cuenta

## Prompt 2

**Modelo:** Opus 5.5
**Herramienta:** Claude Code - CLI

```
Quiero que FlowSync sea una herramienta para que los equipos remotos sepan en qué está trabajando cada uno sin tener que hacer reuniones de sincronización. Algo tipo tareas compartidas pero más en tiempo real y menos rollo que Jira.

antes de proponer: dame las cinco preguntas que más reducirían la incertidumbre sobre el problema, los usuarios y el alcance. 
```

**Qué salió:** funcionó a la primera / Da 5 preguntas 

## Prompt 3

**Modelo:** Opus 5.5
**Herramienta:** Claude Code - CLI

```
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
```

**Qué salió:** funcionó a la primera / Da una propuesta, pero el README.md interfiere en la respuesta 

## Prompt 4

**Modelo:** Opus 5.5
**Herramienta:** Claude Code - CLI

```
Quiero recortar la 4, con el filtro por estados se pueden consultar aquellas tareas Por hacer y adicionalmente modificaria la 3 para que cuando este por hacer, se asigne el responsable y cambie a En curso, por esta opcion solo el responsable puede cambiarla al siguiente estado hecha. Cualquier otro cambio se realizaria por la capacidad 2 que debe permitir crear o actualizar la tarea.
```
**Qué salió:** toco insistir / lanza 3 preguntas

## Prompt 5

**Modelo:** Opus 5.5
**Herramienta:** Claude Code - CLI

```
 ● ¿Qué puede cambiar la edición de la capacidad 2?
   → Todo, incluido estado
 │ ● Si alguien empieza una tarea por error o la abandona, ¿cómo vuelve a estar libre?
   → No se puede
 ● ¿Una tarea Hecha se puede reabrir?
   → No en el MVP (Recommended)
```
**Qué salió:** toca insistir / indica contradiccion

## Prompt 6

**Modelo:** Opus 5.5
**Herramienta:** Claude Code - CLI

```
Si hay contradicion, y por ello el estado no se debe poder cambiar al editarla, el responsable si y de esa manera
  otro la puede tomar de manera conciente al editarla y terminarla y pasarla a hecha con doble clic
```
**Qué salió:** mal / hizo cambios en el archivo de archivo alcance-mvp-**.md

## Prompt 6
como queda la propuesta?

**Modelo:** Opus 5.5
**Herramienta:** Claude Code - CLI

```
```
**Qué salió:** salio bien, retorna la propuesta actualizada