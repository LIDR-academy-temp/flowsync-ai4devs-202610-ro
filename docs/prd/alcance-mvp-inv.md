# FlowSync — Alcance del MVP

> Alcance consensuado, base para el PRD. Nivel producto: no fija modelo de datos,
> endpoints ni detalles técnicos, que se deciden más adelante.
>
> **El usuario de referencia es un caso de estudio, no un cliente real.** No hay
> usuarios con los que validar: todo lo que sigue son hipótesis.

## Tramo 1: el terreno que ya existe

> Pasado al archivo tras el reloj, a partir de la respuesta del prompt 2.

Hoy FlowSync solo tiene cuentas de usuario: registro, login, ver el propio perfil y
cerrar sesión, con sus tres pantallas en el frontend. El modelo de datos solo guarda
usuarios y sus sesiones. No existen tareas, equipos, proyectos ni asignaciones, no se
puede editar el perfil, no hay roles ni permisos y no hay tests. Todo lo de este alcance
es nuevo y se apoya en las cuentas que ya existen, sin tocarlas.

## Tramo 2: el interrogatorio

> Pasado al archivo tras el reloj, a partir de los prompts 3 y 4.

Una sola ronda, a nivel de producto. Las cinco preguntas que hizo la IA:

1. ¿Qué parte de la reunión de sincronización se quiere eliminar, y qué se perdería al
   quitarla?
2. ¿Quién sufre el problema y quién quiere la visibilidad: los compañeros o un manager?
3. ¿De dónde sale el "en qué estoy": lo escribe cada persona o se deduce de otras
   herramientas?
4. ¿Qué decisión cambia por enterarse antes, es decir, qué significa "tiempo real"?
5. ¿Cómo sabremos en unas semanas que funciona, y qué es lo mínimo para probarlo?

Las respuestas fueron la ficha de hechos del ejercicio, pegada entera de una vez, junto
con la lista de lo ya decidido fuera del MVP. Los supuestos que la IA declaró al
terminar están en "Riesgos y supuestos", al final del alcance.

## Tramo 3: el alcance en cinco bloques

## 1. Problema

En equipos remotos pequeños, saber en qué está cada uno exige interrumpir a alguien:
la ronda de "¿en qué estás?" de la daily y las preguntas por chat. Cuando esa
información no llega a tiempo, dos personas acaban trabajando en lo mismo. En el caso
de estudio, dos personas tocaron el mismo módulo la misma semana sin saberlo y se
perdieron dos días.

**Qué resolvemos:** que cualquiera vea qué se está tocando y qué está libre sin
preguntar, y que nadie pueda reclamar algo que otro ya ha reclamado.

**Qué no resolvemos:** la daily entera. Desaparece la ronda de estado (la mitad de los
15 minutos); la parte de bloqueos sigue y este MVP no la aborda.

## 2. Usuarios

- **Usuario objetivo:** miembros de equipos remotos de 3 a 10 personas, todos con los
  mismos permisos, que se coordinan entre ellos.
- **Quién se beneficia:** los compañeros. Quien iba a empezar algo ya en marcha y quien
  iba a interrumpir a otro para preguntar.
- **Quién no es usuario:** managers que buscan informes y equipos que necesitan
  sprints, estimaciones o backlog priorizado.
- **Caso de referencia (caso de estudio):** equipo de 6 personas de producto SaaS,
  repartido en 3 husos horarios, que hoy usa un gestor de tareas pesado y una daily de
  15 minutos por videollamada.

## 3. Propuesta de valor

> La lista de tareas del equipo, donde coger o soltar una tarea cuesta un clic, nadie
> puede pisar lo que otro tiene, y los cambios de los demás aparecen solos.

- **Para quien trabaja:** la lista es su cola de trabajo; lo que tiene asignado es suyo
  y nadie se lo cambia. Además deja de recibir el "¿cómo vas?".
- **Para los demás:** ven qué está ocupado y qué está libre, y solo pueden coger lo
  libre.
- **Frente a un gestor pesado:** sin campos obligatorios aparte del título, sin flujos
  que configurar, sin ceremonias.
- **Principio:** el estado es de la tarea, no de la persona. No se muestra quién está
  conectado.

## 4. Alcance (IN)

Una única capacidad, terminada de punta a punta: **la lista de tareas compartida, con
reclamación de tareas**. Se apoya en el registro y el login que ya existen.

| # | Capacidad | Por qué entra |
|---|---|---|
| A1 | **Crear una tarea** con solo el título obligatorio. Quien la crea puede dejarla libre o quedársela. | Si crear cuesta, el trabajo no aparece en la lista. Asignarla a otra persona rompería la regla de A6. |
| A2 | **Responsable:** cero o una persona. Sin responsable significa **libre**. | Responde a "¿quién está en esto?" y "¿qué puedo coger?". |
| A3 | **Estado** de un conjunto pequeño y fijo, que nadie configura. | Es la señal de "esto se está tocando". |
| A4 | **Fecha de vencimiento** opcional; lo vencido se distingue a simple vista. | Ver de un vistazo qué se ha pasado de plazo. Solo se muestra, sin avisos. |
| A5 | **Una única lista** con todas las tareas, que ve cualquier usuario registrado. | Es la foto del equipo que sustituye a la ronda de estado. |
| A6 | **Coger, soltar y cambiar el estado, con reglas:** una tarea libre se la puede quedar cualquiera, solo para sí mismo; una tarea asignada solo la puede soltar su responsable; el estado solo lo cambia el responsable; si dos personas cogen la misma tarea a la vez, se la queda la primera y la segunda ve que ya está cogida. | Evita que alguien cambie lo que no está tocando y que dos personas reclamen el mismo trabajo, que es el fallo del caso de estudio. |
| A7 | **Al soltar una tarea no terminada, vuelve al estado inicial.** Una tarea terminada no se puede soltar. | Evita tareas "en curso" sin responsable, que parecerían ocupadas estando libres y que nadie podría cambiar. |
| A8 | **Editar título y fecha:** cualquiera si la tarea está libre; solo el responsable si está asignada. | Es la regla de A6 aplicada al resto de campos: no se edita lo que otro tiene entre manos. |
| A9 | **Filtrar por estado.** | Centrarse en lo pendiente. |
| A10 | **Ver los cambios de los demás sin refrescar.** | Si no ves al momento que alguien ha cogido una tarea, intentarás cogerla tú. Sin esto, A6 protege pero no informa. |

### Criterio de terminado

Dos usuarios, A y B, en dos navegadores:

1. A crea una tarea libre. B la ve aparecer sin refrescar.
2. B la coge y la marca en curso. A ve ambos cambios sin refrescar.
3. A no puede cogerla, ni cambiarle el estado, ni editarla.
4. B la suelta: vuelve a estar libre y en el estado inicial, y A ya puede cogerla.

### Criterio de éxito de producto

Tras una semana de uso real, el equipo cancela la ronda de "¿en qué estás?" y nadie
pide que vuelva. No es verificable con un caso de estudio; queda como criterio de
referencia.

## 5. Fuera de alcance (OUT)

### Consecuencias de las reglas de reclamación (A6)

| Fuera | Por qué |
|---|---|
| Asignar una tarea a otra persona, al crearla o después | Sería reclamar algo en nombre de otro sin que lo sepa. Si quieres que alguien la coja, se lo dices y la tarea queda libre. |
| Quitarle una tarea a otro o forzar que la suelte | Sin roles, cualquiera podría hacerlo y volvería el conflicto que la regla evita. |
| Traspasar una tarea directamente entre personas | Se hace en dos pasos: una la suelta y la otra la coge. |

### Exclusiones de producto

| Fuera | Por qué |
|---|---|
| Notificaciones push | El valor es un resumen que espera a que lo mires; un push reintroduce la interrupción que eliminamos. |
| Integración con Slack | Obliga a mantener el mismo estado en dos sitios, y por esa doble actualización muere esta categoría. Además exige OAuth de terceros. |
| Roles y permisos avanzados | Con 3 a 10 personas al mismo nivel no aportan. La única protección necesaria es la de A6, basada en quién es el responsable. |
| Analítica e informes | No hay nadie arriba que los lea; harían que el producto hablara a un manager en vez de al equipo. |
| Comentarios en tareas | Son conversación, y la conversación vive en el chat. El MVP no promete resolver bloqueos. |
| Sprints, estimaciones, épicas, backlog priorizado | Es la ceremonia de la que se huye. Quien la necesite no es nuestro usuario. |
| Estado derivado de Git, PRs, CI o calendario | Es otro producto, con integraciones y autenticación de terceros. El estado lo teclea la persona. |
| Varios equipos o espacios, personas en más de uno | Exige modelar equipo, invitaciones y pertenencia. Con un único espacio se valida igual la hipótesis. |

### Recortes para mantener la vertical fina

| Fuera | Por qué |
|---|---|
| Resumen "qué ha cambiado desde tu última visita" | Es el siguiente corte más valioso, pero exige saber qué ha visto cada persona: es una capacidad entera. Riesgo aceptado: al volver no se distingue qué es nuevo. |
| Borrar tareas | Lo terminado se marca como hecho y el filtro lo esconde. Borrar abre preguntas (confirmación, deshacer, quién puede) que no ayudan a validar. Riesgo aceptado: las tareas creadas por error se quedan. |
| Descripción o detalle de la tarea | Para decidir "¿la cojo?" bastan el título y el responsable. Una descripción alarga la creación. |
| Estados configurables | Configurar flujos es justo lo que el usuario rechaza de Jira. |
| Ordenar, buscar, otros filtros | Con 3 a 10 personas la lista cabe en pantalla. El filtro por estado es el único pedido. |
| Varios responsables por tarea | Diluye "¿quién está en esto?" y complica A6. Si son dos, se crean dos tareas. |
| Historial de cambios | No influye en "¿la cojo?" y es la mitad del trabajo del resumen aplazado. |
| Editar el perfil | No tiene relación con la hipótesis. |
| Importar desde otro gestor | El MVP valida el uso, no la migración. |

### Exclusiones de principio (no se reconsideran)

| Fuera | Por qué |
|---|---|
| Quién está conectado, indicadores de actividad, "visto por" | Es vigilancia. El estado es de la tarea, no de la persona. |
| Chat, videollamada, edición simultánea | No es lo que significa "tiempo real" aquí: ver lo último sin preguntar. |

## Riesgos y supuestos

1. **El estado se queda viejo** (riesgo n.º 1). La única defensa es que actualizar
   cueste un clic; solo se valida usándolo, no construyéndolo.
2. **Hay que coger la tarea antes de empezar.** A6 impide reclamar dos veces la misma
   tarea, pero no que alguien trabaje en algo sin reclamarlo.
3. **Tareas bloqueadas si su responsable desaparece:** nadie más puede soltarlas. Se
   acepta para equipos de 3 a 10 personas, donde se resuelve hablando.
4. **Un único espacio:** cualquier usuario registrado ve todo. Válido para el MVP; en
   un producto real sería un límite de privacidad.
5. **Sustituye al gestor de tareas, no convive con él.** Si el equipo mantiene los dos,
   fracasa por doble actualización.


---

## Parte B: las tres líneas

1. **Los dos números:** la IA propuso 10 cosas dentro del alcance; tras mi recorte quedaron 9.
2. **Tres cosas que dejé fuera, y por qué:**
   - **A10, «un único espacio compartido», como capacidad propia.** Ya la cubre A5 (una
     única lista que ve todo el equipo). Como entrada aparte no ayuda a validar ninguna
     hipótesis que A5 no valide ya: ni que la ronda de "¿en qué estás?" sobra si el estado
     se ve de un vistazo, ni que se deja de duplicar trabajo. El espacio único sigue dentro;
     lo que quité es la entrada duplicada.
   - **Historial de cambios.** No ayuda a validar que se deja de duplicar trabajo: decidir
     si cojo una tarea depende de quién la tiene y en qué estado está *ahora*, no de cómo
     llegó ahí. Tampoco ayuda a validar que sobra la ronda de estado, que pregunta por el
     presente.
   - **Descripción de la tarea.** No ayuda a validar que se deja de duplicar trabajo: para
     saber si algo está libre bastan el título y el responsable. Además va en contra de la
     hipótesis de que el estado no se queda viejo si actualizar cuesta dos clics: cada
     campo de más alarga crear y mantener la tarea.
3. **La exclusión de la que menos seguro estoy: el resumen "qué ha cambiado desde tu
   última visita".** Chocan dos cosas. La ficha define la señal como "resumen que espera,
   no aviso que interrumpe", con un caso concreto: "llego por la mañana o vuelvo de una
   reunión y veo qué se ha movido". El alcance, en cambio, solo da la lista en vivo, que
   enseña cómo están las cosas *ahora* pero no qué ha cambiado mientras no miraba. Es lo
   barato contra lo que valida: la lista en vivo sirve a quien la tiene abierta, y el
   caso de estudio es un equipo repartido en 3 husos horarios, donde casi siempre llegas
   cuando los demás ya han movido cosas. Lo dejé fuera porque exige saber qué ha visto
   cada persona, que es una capacidad entera, y la ficha pide una vertical fina terminada
   antes que tres a medias. **Tendría que entrar si** en la primera semana de uso la
   gente de otros husos sigue preguntando "¿qué ha cambiado?" o mantiene la ronda de
   estado de la daily: eso significaría que sin el resumen no se valida justo la
   hipótesis principal, que la ronda de "¿en qué estás?" sobra.

### 📌 Donde la IA me discutió una decisión y tenía razón

Mi regla de A6 (solo el responsable cambia el estado, y cada uno solo se coge tareas a
sí mismo) dejaba huecos que no vi: una tarea "en curso" que su responsable suelta se
quedaría en curso sin nadie, parecería ocupada estando libre y nadie podría cambiarla.
La IA lo señaló y propuso A7 (soltar devuelve la tarea al estado inicial), y también A1
y A8 para que la regla fuera coherente con crear y editar. No llegué a validar esas tres
decisiones antes de que las consolidara en el archivo.

Hay además una incoherencia que no señaló la IA y que vi al revisar después del reloj:
la ficha dice "roles planos: en el MVP todos ven y editan lo mismo", y mi regla limita
quién cambia el estado y quién edita una tarea asignada. A la vez, el documento deja
fuera "roles y permisos avanzados", cuando A6 y A8 son en la práctica un pequeño sistema
de permisos por responsable. El texto lo disimula: A5 pasó de "ve y edita" a solo "ve".
O la ficha cambia, o la regla se queda como convención visible y no como bloqueo.

### Reflexión sincera

Esta vez no veía qué dejar fuera: cada cosa que pensaba quitar me parecía que dejaba
coja la aplicación. Mirándolo después, medía contra "¿es una app de tareas completa?" y
no contra "¿me hace falta para validar la hipótesis?". El resultado es que mi recorte fue
casi todo de forma (quité una entrada duplicada) y que, en vez de quitar, añadí reglas
en A6. Los recortes de fondo los propuso la IA y los acepté todos.
