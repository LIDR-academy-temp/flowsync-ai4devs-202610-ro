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

**Modelo:** Opus 5.5 medium
**Herramienta:** Claude Code

```
Ayudame a trabajar el requisito "Lo que cada tarea muestra de su responsable"
El objetivo es realizar una matriz de trazabilidad si el requisito esta cubierto por los tests
El formato es el siguiente:
cuántos scenarios en el requisito: (numero) - Cubiertos (numero)

 Crea una fila por cada scenario con cuatro columnas. 
La primer columna con el scenario, la segunda el test que cubre (con el nombre que aparece en la suite), la tercera si esta cubierto, no lo esta o no lo sé y la cuarta si pusiste "no lo sé", que te faltó para decidirlo
```

**Qué salió:** 
Guardé la matriz en docs/verificacion/js.md. El enunciado pide que vaya en un archivo del repo, no en el chat. Usé js como iniciales; renómbralo si usas otras.



## Prompt 2

**Modelo:** Opus 5.5 medium
**Herramienta:** Claude Code

```
Escribe los tests por cada uno de los scenarios en backend/tests/functional/tasks/ y ejecutarlos, si alguno sale en rojo se entrega en rojo, sin tocar el código.
```

**Qué salió:** 
Generó los test faltantes y los casos que pasaron y los que fallaron al ejecutarse
