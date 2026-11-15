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
Audita las "Reglas de proceso" de CLAUDE.md contra los últimos 15 commits (git log -15) y el estado actual del árbol. NO modifiques ningún archivo: solo puedes escribir en la sección "## Tabla" de docs/auditoria/inv.md, sin tocar la apuesta que hay encima.
Una fila por regla, con estas columnas: qué pide (una frase) | qué se miró (comando o archivo concreto) | veredicto (se cumple / no se cumple / no se puede comprobar con lo que hay) | evidencia en una línea (hash del commit si no se cumple; qué falta si no se puede comprobar) | dejarla / borrarla / bajarla.
No des ningún veredicto sin el comando que lo respalda.
```

**Qué salió:** Rellenó la tabla a la primera, con comando y hash en cada fila (primero se equivocó de upstream y lo corrigió solo). Pero dejó la 1 y la 4 como «no se cumple → dejarla» y dio la 3 por cumplida.

## Prompt 2

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```
No me encaja la respuesta de la regla 1. Está dando un veredicto que indica que no se está cumplemdo la regla, pero sin embargo indica que recomienda dejarla. No tiene ningún sentido
```

**Qué salió:** Reconoció la incoherencia y pasó la 1 a «bajarla» a un hook `PreToolUse` que bloquee `git commit` en `main`/`sN/*`. Avisó de que la 4 tenía el mismo problema y preguntó qué hacer.

## Prompt 3

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```
Ok, tiene más sentido pasarla a un hook, efectivamente, sino entiendo que la idea sería quitarla.
Con respecto a la 4, que como indicas, no se cumple, y parece compleja de pasarla a un hook, dado que no se sabe cuando acaba la unidad de trabajo, ¿entonces para qué mantenerla? El único modo de saber que hemos terminado la unidad de trabajo, sería indicárselo a través de un skill o un comando, pero es casi imposible que lo detecte o más bien lo adivine.
```

**Qué salió:** De acuerdo con que en CLAUDE.md no sirve porque el modelo no sabe cuándo acaba la unidad, pero propuso «bajarla» a una skill que invoco yo, en vez de borrarla. Sugirió meter ahí también la 5.

## Prompt 4

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```
La 2 creo que no le entiendo entonces bien el sentido. Yo estaba suponiendo que ejecutamos una skill /commit que (sin haberla mirado) haga lo que sea que tenga definido. Ese proceso al llamarse entiendo que lo normal es que sí se ejecute como indica la skill. Otra cosa es que no podamos comprobar con lo que hay si se ha cumplido o no, porque no tendremos el historial de la conversación
```

**Qué salió:** Aclaró que la regla no dice quién invoca `/commit`: si soy yo, sobra; si es el modelo, depende de que adivine el final de la petición. Admitió que su «bajarla» estaba mal justificado y propuso un trailer `Via: /commit` para que dejara rastro.

## Prompt 5

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```
Eso sí es más lógico, si la invoco yo, entonces no tiene sentido la regla. Pero entonces en este caso tampoco estaría de acuerdo en bajarla, sino eliminarla.
```

**Qué salió:** Cambió la fila 2 a «borrarla» por redundante.

## Prompt 6

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```
En 3 dices que se cumple, pero como sólo añade imports y decoradores, no hay diff. Pero si no hay diff en esos casos concretos, ¿cómo puedes garantizar que se está cumpliendo? Porque si no se cumpliese, el resultado sería el mismo al no tener cambios
```

**Qué salió:** Admitió que en ese commit la parte de `.adonisjs/` no podía fallar y que no lo había comprobado regenerando. Cambió la 3 a «no se puede comprobar → bajarla» a una comprobación automática. Con esto ninguna regla quedó como cumplida.

## Prompt 7

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

**Contexto:** se refiere a la regla 5 (el agente acababa de proponer borrarla; su respuesta no queda en este archivo).

```
Efectivamente no se puede comprobar con una auditoría, pero sí que es comprobable a nivel usuario, si yo lanzo un pr, puedo comprobar si en la terminal se muestra sólo la url o si saca más cosas. Si ese es mi objetivo, no podré auditarlo, pero sí usar la regla.
```

**Qué salió:** Aceptó que «no auditable» no es lo mismo que «inútil»: la 5 la compruebo yo en la terminal. Pasó la 5 de «borrarla» a «bajarla» como último paso de la skill de cierre de la 4.
