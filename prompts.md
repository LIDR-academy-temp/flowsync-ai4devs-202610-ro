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
Genera un resumen de máximo 5 líneas de los capabilities que ya están construidos y del modelo de datos actual del proyecto, deja este resumen al inicio del archivo docs/prd/alcance-mvp-grr.md
```

**Qué salió:** funcionó a la primera. Leyó rutas, migraciones y pantallas, y dejó un resumen de 4 líneas en el PRD.

---

## Prompt 2

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```
Vamos a crear el alcance de FlowSync, sin embargo antes de proponer requiero que formules exactamente 5 preguntas, las que más reduzcan la incertidumbre sobre el problema (Se encuentra descrito de forma vaga entre """), los usuarios y el alcance. Debe ser una sola ronda de preguntas. Está prohibido bajar a modelo de datos, endpoints o arquitectura. Todavía no propongas alcance. Te dejo entre "" la ficha de hechos con las respuestas del producto, ya decididas. Y entre """" se encuentra lo que está fuera del MVP.

"""
«Quiero que FlowSync sea una herramienta para que los equipos remotos sepan en qué está trabajando cada uno sin tener que hacer reuniones de sincronización. Algo tipo tareas compartidas pero más en tiempo real y menos rollo que Jira.»
"""

""
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
"" 

""""
- Fuera del MVP: notificaciones push, integración con Slack, roles/permisos avanzados, analítica/reporting, comentarios en tareas.
""""
```

**Qué salió:** junté en un solo prompt la petición de preguntas y la ficha con las respuestas. La IA formuló las 5 preguntas ya sabiendo las respuestas, así que apuntó a los huecos que deja la ficha y no a lo que cualquiera preguntaría. Marcó como supuestos lo que la ficha no cubre.

---

## Prompt 3

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```
Deja el interrogatorio en el archivo docs/prd/alcance-mvp-grr.md incluyendo las preguntas que formulaste
```

**Qué salió:** añadió el tramo 2 al PRD: las 5 preguntas, cada una con lo que dice la ficha y el supuesto que tomó la IA donde la ficha no responde.

---

## Prompt 4

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```
Genera el alcance con estos 5 bloques, en este orden: problema, usuarios, propuesta de valor, alcance y NO-alcance. Recorta de forma agresiva. Una justificación por cada exclusión, expresada como qué hipótesis del producto no ayuda a validar (no vale "no da tiempo"). Que los elementos del alcance vayan numerados. Se deben excluir: tablas, endpoints, arquitectura. El alcance debe quedar en docs/prd/alcance-mvp-grr.md.
```

**Qué salió:** la IA declaró 3 hipótesis (H1, H2, H3) y propuso 8 elementos de alcance numerados y 16 exclusiones, cada una justificada contra esas hipótesis. Sin tablas, endpoints ni arquitectura.
