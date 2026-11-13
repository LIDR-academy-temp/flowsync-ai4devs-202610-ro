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

**Modelo:** Sonnet 5.5
**Herramienta:** Claude Code

```
resume los 15 últimos commits.
```

## Prompt 2

**Modelo:** Sonnet 5.5
**Herramienta:** Claude Code

```
Quiero que me vayas añadiendo los prompts que te voy diciendo al fichero prompts.md.

1. Creame un fichero en docs/auditoria/eds.md
2. Escribe mi apuesta que es:
La rama es por unidad de trabajo: Si
El commit sí es por petición: Si
Un cambio que toque rutas, controladores, validadores o transformers: No
PR van una sola vez: No
Resumen en el chat: Si.
```

## Prompt 3

**Modelo:** Sonnet 5.5
**Herramienta:** Claude Code

```
Con un agente, contrasta esas reglas contra los últimos 15 commits del repositorio y el estado actual del árbol, y deja el resultado escrito en docs/auditoria/eds.md, no en el chat.

  El formato lo fija esta lección, y no es negociable: una fila por regla, con estas cinco casillas.

  Qué pide la regla. Una frase, con tus pas que ahí hay dos reglas metidas en una.
  Qué se miró para comprobarlo. El comando concreto, o el archivo. Sin esta casilla la fila no se escribe: es lo único que separa una auditoría de una opinión.
  Veredicto, y solo hay tres: se cumple, nomprobar con lo que hay. Este tercero no es rendirse, es un dato: significa que esa regla no deja rastro en ninguna parte. Un se cumple sin evidencia detrás es en realidad este, mal etiquetado.
  La evidencia, en una línea. Si el veredio donde se rompió. Si es no se puedecomprobar, qué falta para poder comprobarla.
  Qué harías con ella. Una palabra: dejarla, borrarla o bajarla a algo que se ejecute solo.
  ⚠️ Esto es una auditoría, no un arreglo.te que no cambie ningún archivo. Sin esa restricción se pone a corregir lo que encuentra, y entonces ya no puedes saber qué había antes: el propio arreglo borra la evidencia.