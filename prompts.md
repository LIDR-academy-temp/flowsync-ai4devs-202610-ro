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

**Modelo:** claude-opus-5-5
**Herramienta:** Claude Code

```
Haremos una matriz de trazabilidad. A partir de tasks/spec.md, tomaremos el requisito «Lo que cada tarea muestra de su responsable» para hacer este ejercicio. Crearemos 4 columnas para ver si los tests realmente validan los escenarios.


<pasted_content id="a343">
El scenario, en una línea. Qué se espera y en qué situación. Si no cabe en una línea, es que estás juntando dos.

Qué test lo cubre, con el nombre exacto que aparece en la suite. Sin el nombre concreto, la columna va vacía: "seguro que algo lo cubre" no es una fila.

Cubierto · No cubierto · No lo sé. Los tres estados son válidos, y el tercero no es un fallo: es el resultado más informativo de los tres.

Si pusiste "no lo sé", qué te faltó para decidirlo. Media línea. Suele ser una de dos: no encontraste dónde se comprueba, o encontraste algo que se le parece y no dice exactamente lo mismo.
</pasted_content id="a343">


Las columnas 2, 3 y 4 LAS RELLENO YO, tú solo crealas.

Haz esto en el archivo docs/verificacion/abm.md
```

## Prompt 2

**Modelo:** claude-opus-5-5
**Herramienta:** Claude Code

```
Estoy haciendo un test del endpoint '/api/v1/tasks'. De momento tengo esto, pero no sé si es correcto para Get o si se corresponde a lo que pide api.ts
```
