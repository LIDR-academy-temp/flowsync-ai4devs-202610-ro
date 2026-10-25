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
Inspecciona el respositori actual.
Necesito conocer:
1) Funcionalidades que estan implementadas actualmente
2) Modelo de datos actual
3) Paretes que puedan estar pendientes o incompletas
Limitate a analizar lo que hay ahora. No quiero que plantees cambios, ni analizes como mejorarlo ni modifiques nada.
```

**Qué salió:** funcionó a la primera: solo hay auth (signup/login/perfil/logout), tablas `users` y `auth_access_tokens`, y no existe nada de tareas ni tests.

---

## Prompt 2

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```
Haz un resumen de maximo 5 lineas
```

**Qué salió:** funcionó a la primera: resumen en 5 líneas (funcionalidades, modelo de datos, pendiente, incompleto, estado del repo).

---

## Prompt 3

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```
A partir del contexto actual formula las 5 preguntas que mas reducirian tus dudas sobre el problema actual, usuarios y alcanze del proyecto.
Quiero que preguntes antes de proponer alguna solucion:
Quiero que tengas en cuenta las siguientes restricciones:
1) Formula exactamente 5 preguntas en esta ronda
2) Pregunta antes de proponer alguna solucion.
3) No hagas preguntas sobre el modelo de datos, arquitectura y endpoints.
4) No redactes funcionalidades ni redactes el alcanze o propongas cambios. Limitate a hacer preguntas que crees que resolveran tus dudas.
5) Espera mis respuestas antes de continuar y para cada pregunta, indicame por que pregunta vamos de las 5. Soy un poco despistado.
```

**Qué salió:** no fue lo que quería: el agente interpretó la restricción 5 como "una pregunta cada vez" y solo hizo la pregunta 1 de 5 (el problema).

---

## Prompt 4

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```
He redactado mal la propuesta. Haz primero las 5 preguntas.
```

**Qué salió:** funcionó: las 5 preguntas numeradas (problema, usuarios, situación actual, límites del alcance y "tiempo real", criterio de éxito).

---

## Prompt 5

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

````
Esta es la lista de hechos que te servira para responder a tus preguntas.


```
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
```


```
- Fuera del MVP: notificaciones push, integración con Slack, roles/permisos avanzados, analítica/reporting, comentarios en tareas.
```

En este punto, solo quiero que tengas en cuenta estos hechos y si alguna de tus preguntas ha quedado sin respuesta, ahora es el momento de que me la hagas.
````

**Qué salió:** funcionó: las 5 preguntas quedaron cubiertas; el agente señaló como dudas abiertas los estados exactos, las tareas sin responsable y quién puede asignar.

---

## Prompt 6

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```
Teniendo en cuenta el analisis realizado del entorno, tus preguntas que han sido respondidas mas todos los hechos que he informado, quiero que redactes una propuesta inicial de alcance del MVP con estos 5 bloques:
1) Problema: qué problema queremos resolver.
2) Usuarios: quién utilizará el producto.
3) Propuesta de valor: qué beneficio aportará.
4) Alcance del MVP: qué funcionalidades se incluirán en la primera versión.
5) Fuera del MVP (NO-scope): qué funcionalidades se excluirán y por qué.

Instrucciones:
- Prioriza una propuesta lo mas pequeña posible que garantize la hipotesis principal del producto
- Quiero que seas agresiva recortando.
- Quiero que justifiques cada exclusion
- No incluyas detalles tecnicos. Esto lo haremos mas adelante.
- No modifiques archivos ni escribas codigo

Esto sera unaprimera propuesta que luego revisare para decidir que funcionalidas mantengo o elimino.
```

**Qué salió:** propuesta en 5 bloques; recortó de más: sacó la fecha de vencimiento y la actualización en directo aunque los hechos las pedían, e incluyó "asignar a otros", que no se pedía.

---

## Prompt 7

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```
El punto 4 considero que hay que quitarlo de la propuesta. En ningun momento se habla de asignar tareas a otras personas
```

**Qué salió:** el agente discrepó en parte: quitar el responsable rompe "quién está en qué"; propuso dejarlo solo en "coger una tarea uno mismo".

---

## Prompt 8

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```
Déjalo así, con coger la tarea uno mismo
```

**Qué salió:** funcionó: punto 4 = coger la tarea uno mismo; "asignar a otras personas" pasa al NO-scope.

---

## Prompt 9

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```
El punto 2 creo que deberia quedar excluido. No se comenta en ningun momento que los programadores puedan crear tareas.
```

**Qué salió:** el agente señaló que era el punto 3 y discrepó citando los hechos ("FlowSync crea las tareas"); sin crear tareas la lista queda vacía. Pidió confirmación.

---

## Prompt 10

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```
Puedes volver a reescribir el alcanze en los 5 bloques?
```

**Qué salió:** propuesta completa reescrita, manteniendo "crear tarea" marcado como pendiente de confirmar.

---

## Prompt 11

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```
Quiero que añadas al alcanze el punto de "Actualizacion en directo", es un punto que se solicita explicitamente.
```

**Qué salió:** funcionó: la actualización en directo pasa del NO-scope al alcance (punto 7), sin avisos ni presencia.

---

## Prompt 12

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```
Lee las instrucciones del fichero prompts.md. Quiero que vuelques todas las preguntas y respuestas que hemos realizado desde el principio en este fichero, manteniendo el formato solicitado en las instrucciones
```

**Qué salió:** este fichero.

---

## Prompt 13

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```
Sí, crea la rama alcance-XHM y vuelca "alcance-mvp-XHM.md" y el fichero "prompts.md"
```

**Qué salió:** rama `alcance-XHM` creada con el alcance y `prompts.md` commiteados.
