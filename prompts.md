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

**Modelo:** Sonnet 5.5 Medium
**Herramienta:** Claude Code

```
Revisa el proyecto y devuelve qué capabilities hay ya construidas y cómo es el modelo de datos actual. En seguida, reformula la siguiente frase como un problema de usuario, sin mencionar ninguna solución técnica. Antes de hacer una propuesta, pregunta que datos necesitas conocer:

"Quiero que FlowSync sea una herramienta para que los equipos remotos sepan en qué está trabajando cada uno sin tener que hacer reuniones de sincronización. Algo tipo tareas compartidas pero más en tiempo real y menos rollo que Jira."
```

**Qué salió:** Funcionó a la primera

## Prompt 2

**Modelo:** Sonnet 5.5 Medium
**Herramienta:** Claude Code

```
1) Episodio concreto: dos personas del equipo tocaron el mismo módulo la misma semana porque una empezó sin que la otra lo supiera. Dos días perdidos.
2) Qué decisión cambia: no empezar algo que otra persona ya está tocando, y elegir lo siguiente sabiendo qué está libre. Si la única respuesta fuera "sentirse informado", el tiempo real no valdría lo que cuesta.
3) Equipo de 6 personas de producto SaaS, en 3 husos horarios, que hoy usa un gestor de tareas pesado y una daily de 15 minutos por videollamada. La daily NO desaparece entera. Desaparece la ronda de "¿en qué estás?", que hoy se come la mitad de los 15 minutos. La parte de bloqueos sigue, y este MVP no la resuelve.
4) Primer usuario concreto: equipo de 6 personas de producto SaaS, en 3 husos horarios, que hoy usa un gestor de tareas pesado y una daily de 15 minutos por videollamada. Es un CASO DE ESTUDIO, no un cliente real.
5) Ganancia del cambio: Éxito para el usuario al dejar de hacer la ronda de "¿en qué estás?" de la daily porque el estado del equipo se ve de un vistazo. Criterio a una semana de uso real: que el equipo cancele esa ronda y nadie pida que vuelva. Si la siguen haciendo igual, no funcionó.

Acotemos y en la propuesta no bajes a modelo de datos o a los endpoints.
```

**Qué salió:** Me hizo preguntas de "temas" que no estaban explicitamente especificadas en la página del curso

## Prompt 3

**Modelo:** Sonnet 5.5 Medium
**Herramienta:** Claude Code

```
Acota: 
Los estados posibles que una tarea puede tener.
Ver los cambios de los demás sin refrescar es un requerimiento agradable si hay tiempo
```

**Qué salió:** funcionó a la primera

## Prompt 4

**Modelo:** Sonnet 5.5 Medium
**Herramienta:** Claude Code

```
Agrega el estado "Cancelado"
```

**Qué salió:** Cuestionó la decisión

## Prompt 5

**Modelo:** Sonnet 5.5 Medium
**Herramienta:** Claude Code

```
El filtro de tareas queda para otro MVP
```

**Qué salió:** Cuestionó la decisión

## Prompt 6

**Modelo:** Sonnet 5.5 Medium
**Herramienta:** Claude Code

```
La ordenación queda como un "podría estar" pero el MVP sobrevive sin ello. La ordenación es por estado, primero lo que esta en progreso, después, lo que esta sin asignar, en seguida lo terminado y por útlimo lo cancelado.
```

**Qué salió:** tuve que insistier

## Prompt 7

**Modelo:** Sonnet 5.5 Medium
**Herramienta:** Claude Code

```
El estado correcto es "Por hacer"
```

**Qué salió:** Funcionó a la primera

## Prompt 8

**Modelo:** Sonnet 5.5 Medium
**Herramienta:** Claude Code

```
guarda el documento en "docs/prd/alcance-mvp-av-md"

No olvides en especificar el lo que ha quedado fuera de alcance junto con su justificación
```

**Qué salió:** El comando funcionó a la primera. Se editó después el contenido del archivo.
