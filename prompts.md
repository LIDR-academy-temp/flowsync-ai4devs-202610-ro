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

**Modelo:** Opus 5.5 xMedium
**Herramienta:** Claude Code

```
Lee los scenarios de la spec viva del requisito "Lo que cada tarea muestra de su responsable" y los tests existentes.
Genera una tabla de trazabilidad: cada criterio de aceptación → qué prueba lo cubre → cubierto / NO cubierto.
No cambies nada.
```

**Qué salió:** 
Me dijo que ninguno de los 3 criterios del requisito tiene pruebas y que no de ellos incumple lo que hay en el código .

## Prompt 2

**Modelo:** Opus 5.5 xMedium
**Herramienta:** Claude Code

```
Crea unos tests para el requisito "Lo que cada tarea muestra de su responsable" y guardalos en "backend/tests/functional/tasks" siguiendo el estilo y formato que ya hay en "backend/tests/functional/auth". No toques nada fuera de "backend/tests/"
```

**Qué salió:** 
Escribió algunos tests en la carpeta que le indiqué.
Me creo un PR y pasó la revision Adversarial


## Prompt 3

**Modelo:** Opus 5.5 xMedium
**Herramienta:** Claude Code

```
Vuelve a leer los escenarios de la spec viva del requisito "Lo que cada tarea muestra de su responsable" y los nuevos tests creados.
Genera la matriz de trazabilidad para identificar si el requisito está cubierto por los tests. Guarda la matriz en la carpeta /docs/verification/ - si no existe la carpeta la puedes crear. El nombre del fichero deberá ser jmp.md dentro de la carpeta. 
En la matriz pon una sola fila por escenario. Lamatriz deberá tener 4 columnas tal que así:
1) El scenario, en una línea. Qué se espera y en qué situación. Si no cabe en una línea, es que estás juntando dos.
2) Qué test lo cubre, con el nombre exacto que aparece en la suite. Sin el nombre concreto, la columna va vacía: "seguro que algo lo cubre" no es una fila.
3) Cubierto · No cubierto · No lo sé. Los tres estados son válidos, y el tercero no es un fallo: es el resultado más informativo de los tres.
4) Si pusiste "no lo sé", qué te faltó para decidirlo. Media línea. Suele ser una de dos: no encontraste dónde se comprueba, o encontraste algo que se le parece y no dice exactamente lo mismo

Encima de la Matriz pones el número de los escenarios que tiene el requisito y el núkmero de cuantos quedan cubiertos - éste último lo anotas al terminar la matriz.
No cambies nada de código. No hagas tampoco ningún PR. 
```

**Qué salió:** 
Creó el fichero jmp.md con la matriz. Me dijo que estaban cubiertos los 3 aunque me hizo saber que dos de los escenarios NO se cumplian.
 

