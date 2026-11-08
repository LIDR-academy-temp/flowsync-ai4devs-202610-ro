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

**Modelo:** Sonnet 5.5
**Herramienta:** Claude Code

```
Trabaja sobre el requisito "Lo que cada tarea muestra de su responsable" de openspec/specs/task. Trabaja solo ese requisito no con la capability.

Tarea A.1: La matriz de trazabilidad
Mapea cada escenario del requisito y determina si está cubierto por los test. El formato es fija y no es negociable: 
una fila por scenario y cuatro columnas. Encima, dos números: cuántos scenarios tiene el requisito y cuántos resultaron 
cubiertos — el primero se anota al empezar, el segundo al terminar.
1. El scenario, en una línea. Qué se espera y en qué situación. Si no cabe en una línea, es que estás juntando dos.
2. Qué test lo cubre, con el nombre exacto que aparece en la suite. Sin el nombre concreto, la columna va vacía: "seguro que algo lo cubre" no es una fila.
3. Cubierto · No cubierto · No lo sé. Los tres estados son válidos, y el tercero no es un fallo: es el resultado más informativo de los tres.
4. Si pusiste "no lo sé", qué te faltó para decidirlo. Media línea. Suele ser una de dos: no encontraste dónde se comprueba, o encontraste algo que se le parece y no dice exactamente lo mismo.

El resultado de la matriz escríbelo en docs/verificacion/rt.md

No realices nada más que te solicito aquí.
```

**Qué salió:** Funcionó a la primera. Genero la matriz de trazabilidad para los 3 escenarios del requisito. Ninguno está cubierto. Dos marco como "No sé" y uno como "No cubierto".

---

## Prompt 2

**Modelo:** Sonnet 5.5
**Herramienta:** Claude Code

```
Tarea A.2: Los test que faltan
Por cada fila en No cubierto de la matriz de trazabilidad, escribe el test que falta — uno por scenario — siguiendo el estilo de los que ya existen en el proyecto. Sin tocar nada fuera de la carpeta de tests. 

Condiciones:
- Pase lo que pase, no arregles el código ni ajustes el test para que pase. Si algo se pone en rojo, se queda en rojo.
- No ejecutes los test. 

```

**Qué salió:** Genero solamente test para un escenario.

---

## Prompt 3

**Modelo:** Sonnet 5.5
**Herramienta:** Claude Code

```
Verifica en el resto de los test del backend si existe alguno para los escenarios que están marcados como "No lo sé" en la matriz de trazabilidad. Si  alguno de los test del proyecto cubre el escenario, márcalo como cubierto. Caso contrario, genera el test para cubrir el escenario.
```

**Qué salió:** Generó los tests restantes para los escenarios que estban marcados como "No lo sé".
