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
**Herramienta:** Claude Code

```
Borra el archivo README.md y lo restaruramos al terminar, o no lo leas para la ejecución dle ejercicio. La idea es que no tenga la información que sale ahí a la hora de construir respuestas, o tendrá pistas de cómo debe solucionarse.
```

**Qué salió:** No borró el README.md: eligió no leerlo (borrarlo ensuciaría el diff del PR), lo dejó como regla en la memoria del proyecto y se ofreció a excluirlo también en subagentes.

## Prompt 2

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```
Antes de nada, léete el repo y devuélveme el estado real del proyecto: qué capabilities ya existen (auth…) y un diagrama rápido del modelo de datos actual (entidades y relaciones, en Mermaid). No propongas  cambios todavía; solo quiero el mapa de lo que hay.
```

**Qué salió:** Funcionó a la primera. Mapa sacado del código (sin abrir el README): solo hay registro, login, perfil y logout (backend + 3 pantallas); nada de tareas, equipos ni roles, y sin tests. Diagrama Mermaid con 2 tablas (users, auth_access_tokens). Pedí capabilities y bajó también a endpoints y columnas.

## Prompt 3

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```
Actúa como product partner escéptico. Aquí tienes una idea difusa para FlowSync: «Quiero que FlowSync sea una herramienta para que los equipos remotos sepan en qué está trabajando cada uno sin tener que hacer reuniones de sincronización. Algo tipo tareas compartidas pero más en tiempo real y menos rollo que Jira.» Antes de proponer nada, hazme las 5 preguntas que más reducirían la incertidumbre sobre el problema, los usuarios y el alcance. No asumas nada; pregunta si no lo tienes claro. Ten en cuenta el estado del repo que acabas de mapear (auth; las tareas aún no existen). Una sola ronda: con mis respuestas, continúa sin abrir otra tanda de preguntas. Quédate a nivel de producto: nada de modelo de datos, esquema, estados internos, endpoints ni latencias, eso se decide más adelante.
```

**Qué salió:** Respetó la ronda única y el nivel de producto: 5 preguntas (qué parte de la reunión sobra, quién sufre/quién quiere la visibilidad, de dónde sale el estado, qué decisión cambia el «tiempo real», cómo se mide el éxito y qué queda fuera). Avisó de que lo no resuelto lo marcaría como supuesto.

## Prompt 4

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```
- Qué duele hoy: la daily de sincronización y el "¿en qué estás?" constante por
Slack/chat. Nadie ve el estado del equipo sin interrumpir a alguien.
- Quién cobra el valor: los pares, no un lead. No hay reporte hacia arriba y a un
manager le daría igual. Duele a los dos devs que descubren tarde que iban a lo mismo, y
al que interrumpe a otro para preguntar.
- Episodio concreto: dos personas del equipo tocaron el mismo módulo la misma semana
porque una empezó sin que la otra lo supiera. Dos días perdidos.
- Qué reunión desaparece (respuesta honesta, no la vendas de más): la daily NO
desaparece entera. Desaparece la ronda de "¿en qué estás?", que hoy se come la mitad de
los 15 minutos. La parte de bloqueos sigue, y este MVP no la resuelve.
- Usuarios / equipo: equipos remotos pequeños, 3–10 personas. Roles planos: en el MVP
todos ven y editan lo mismo, sin jerarquía de permisos.
- Primer usuario concreto: equipo de 6 personas de producto SaaS, en 3 husos horarios,
que hoy usa un gestor de tareas pesado y una daily de 15 minutos por videollamada. Es un CASO DE ESTUDIO, no un cliente real: dilo en voz alta en vez de fingir lo contrario.
- Fronteras: un espacio único compartido, sin entidad "equipo". Varios equipos
separados, o gente en más de uno, queda FUERA del MVP: se anota como supuesto en el PRD, no se construye.
- "Tiempo real" = ver los cambios de estado de las tareas sin refrescar ni preguntar. NO es chat, NO es videollamada, NO es colaboración simultánea sobre el mismo documento.
- Es frescura, no presencia: el estado es de la TAREA, no de la persona. Nada de "quién
está conectado ahora" ni indicadores de actividad; eso es vigilancia y lo rechazamos a
propósito.
- Forma de la señal: resumen que espera, no aviso que interrumpe. El caso es "llego por
la mañana o vuelvo de una reunión y veo qué se ha movido". Sin notificaciones push.
- Qué decisión cambia: no empezar algo que otra persona ya está tocando, y elegir lo
siguiente sabiendo qué está libre. Si la única respuesta fuera "sentirse informado", el
tiempo real no valdría lo que cuesta.
- De dónde sale el estado: lo teclea la persona que hace la tarea, en segundos.
Derivarlo de señales externas (Git/PRs, CI, calendario) está FUERA del MVP: es otro
producto, con integraciones y OAuth de terceros.
- Por qué se sostiene: no porque sea más agradable, sino porque son dos clics sobre una
lista ya abierta, sin campos obligatorios, sin decidir sprint ni estimación. Y quien lo
escribe cobra en el momento: esa misma lista es su cola de trabajo, la mira para decidir qué coge, y de paso deja de recibir interrupciones preguntándole cómo va. Si el
beneficio fuera solo para los demás, no lo escribiría.
- Si la información se queda vieja: el producto pierde el sentido, y lo asumo. Es el
riesgo #1 a validar, no un detalle. La mitigación es que actualizar cueste dos clics, no obligar a nadie.
- Es donde se hace el trabajo, no donde se cuenta: sustituye al gestor de tareas, no
convive con él. FlowSync crea las tareas, no lee las de otro sitio. Convivir exigiría
doble actualización, que es como muere esta categoría.
- Renuncia explícita a sprints, estimaciones, épicas, backlog priorizado e informes. Un
equipo que necesite eso no es nuestro usuario.
- "Menos rollo que Jira" = crear una tarea y cambiarle el estado en segundos, sin flujos de configuración ni campos obligatorios. Lo mínimo para saber quién está en qué.
- Qué necesita una tarea en el MVP: título, responsable, estado y fecha de vencimiento.
La fecha, para ver de un vistazo qué se ha pasado de plazo.
- Cómo se consume la lista: filtrando por estado, para centrarse en lo pendiente.
- Éxito para el usuario: dejar de hacer la ronda de "¿en qué estás?" de la daily porque
el estado del equipo se ve de un vistazo.
- Criterio a una semana de uso real: que el equipo cancele esa ronda y nadie pida que
vuelva. Si la siguen haciendo igual, no funcionó.
- Cuánto construir: una vertical fina y usable de punta a punta, no el andamiaje amplio
de un producto. Prefiero una capability terminada a tres a medias.

- Fuera del MVP: notificaciones push, integración con Slack, roles/permisos avanzados, analítica/reporting, comentarios en tareas.
```

**Qué salió:** Con la ficha propuso ya un primer alcance en el chat sin que se lo pidiera: 6 cosas dentro, 7 fuera y 4 supuestos. Señaló una tensión: «tiempo real» frente a «resumen que espera» (al volver no se ve qué ha cambiado desde la última visita), y dudó de que la fecha de vencimiento sirva a la decisión central.

## Prompt 5

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```
Quiero que  me prepares un alcance detallado esturcturándolo en 5 bloques: Problema -  Usuarios - Propuesta de valor - Alcance y NO-Alcance. Debes ser agresiva recortando, pero justifica bien cada excusión
```

**Qué salió:** Alcance en 5 bloques con 10 capacidades dentro (A1–A10) y un NO-alcance en tres grupos: lo ya descartado (8), lo que recortó ella (9, entre ellas el resumen «desde tu última visita», borrar tareas y la descripción) y lo rechazado a propósito (2). Añadió por su cuenta un criterio de terminado y una sección de riesgos.

## Prompt 6

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```
De lo incluido recortaría lo siguiente y por qué:
A10: En A5 hablamos ya de una única lista con todas las tareas, con lo que no necesamos redefinir un único espacio de nuevo en la A10, no aporta nada nuevo.
A6: No la descartaría, sino que la dedefiniría: Cambiar el estado y responsable, pero lo limitaría a que cada usuario sólo pueda añadirse si estásin asignar, y quitarse si está asignado, y uno sólo puede modificar el estado si está asignado. ¿Por qué? Porque sino puede haber conflictos de que otro cambie algo que no está tocando, o que alguien ponga que empieza algo que otro ya ha empezado.
Los demás encajan para cumplir con lo pedido.
Con mis respuestas, propón el alcance de un MVP: problema, usuarios, propuesta de valor,
alcance (in) y NO-alcance (out). Sé agresivo recortando: es un MVP, no el producto
final. Justifica cada exclusión.
```

**Qué salió:** Aceptó quitar A10 (fusionada en A5) y la regla nueva de A6 (coger/soltar solo para uno mismo, estado solo lo cambia el responsable). Señaló que la regla abría 3 huecos y los cerró como [decisión mía]: A1 (al crear solo puedes quedártela tú), A7 (soltar devuelve al estado inicial) y A8 (título y fecha solo los edita el responsable si está asignada). Salieron 3 exclusiones nuevas (asignar a otro, quitarle una tarea a otro, traspasar) y el riesgo de tareas bloqueadas si alguien se ausenta. Siguen 10 dentro.

## Prompt 7

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```
Consolida lo anterior en un alcance final en 5 bloques (problema, usuarios, propuesta de
valor, alcance, NO-alcance), listo para ser la base de un PRD. Guarda ese alcance
consensuado en docs/prd/alcance-mvp.md, para que no dependa de la conversación. Todavía
no escribas el PRD.
```

**Qué salió:** Guardó el alcance consolidado en docs/prd/alcance-mvp.md (sin las iniciales que pide la entrega: alcance-mvp-inv.md) (lo renombro yo a mano) y cerró como definitivas sus 3 [decisión mía] sin que las hubiera validado. Mantuvo el criterio de terminado, el de éxito y los riesgos más allá de los 5 bloques. No escribió el PRD.
