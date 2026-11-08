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
Vamos a trabajar sobre el requisito «Lo que cada tarea muestra de su responsable», de los que tienes en openspec/specs/task/spec.md. En toda la sesión salve que yo te lo indique, sólo debes analizar, pero no modificar o corregir el código. Lee los escenarios del requisito, sin tener en cuenta ninguno más, y busca en toda la suite tests que los cubran. Quiero que escribas una matriz de trazabilidad con lo que encuentres en docs/verificacion/inv.md con la siguiente estructura:
1.El scenario, en una línea. Qué se espera y en qué situación. Si no cabe en una línea, es que estás juntando dos.
2.Qué test lo cubre, con el nombre exacto que aparece en la suite. Sin el nombre concreto, la columna va vacía: "seguro que algo lo cubre" no es una fila.
3.Cubierto · No cubierto · No lo sé. Los tres estados son válidos, y el tercero no es un fallo: es el resultado más informativo de los tres.
4.Si pusiste "no lo sé", qué te faltó para decidirlo. Media línea. Suele ser una de dos: no encontraste dónde se comprueba, o encontraste algo que se le parece y no dice exactamente lo mismo.
No quiero que modifiques nada, ni que hagas commits, push ni PRs por tu cuenta.
```

**Qué salió:** Funcionó a la primera. Leyó la spec en `openspec/specs/tasks/spec.md` (la ruta del prompt, sin la «s», no existía) y toda la suite (18 tests, todos de auth). Escribió la matriz con los 3 scenarios partidos en 5 filas, las 5 «No cubierto», 0 cubiertos y ningún «No lo sé»; debajo explica por qué no cuentan los tests de auth que se parecen.

## Prompt 2

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```
Revisa si entre los tests de auth se comprueba alguno de estos escenarios
```

**Qué salió:** Confirmó que ningún test de auth cubre los scenarios (miran login y registro, no el `assignee` de una tarea). Además, leyendo los transformers, anticipó sin ejecutarlo el bug: la lista, `POST` y `PATCH` serializan el `assignee` con `UserTransformer`, que incluye el email.

## Prompt 3

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```
Quiero que generes en backend/tests/functional/tasks/ un test por cada escenario que no esté cubierto
```

**Qué salió:** Escribió `backend/tests/functional/tasks/assignee.spec.ts` con 5 tests (uno por fila) y empezó a ejecutarlos sin que se lo pidiera; interrumpí esa ejecución para lanzarla yo con la condición de no corregir nada (prompt 4).

## Prompt 4

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```
Ejecuta los tests que has creado, pero si alguno falla, no corrijas nada del código, simplemente indícame por que falla.
```

**Qué salió:** Ejecutó los 5 tests: 4 pasan y 1 falla (`una tarea dentro de la lista no expone el email de su responsable`). Explicó la causa (`TaskTransformer` → `UserTransformer` con `email`) sin tocar código ni test.

## Prompt 5

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```
Crea en inv.md (sin borrar la matriz previa que tenemos), una nueva matriz con la misma estructura que incorpore los tests que hemos creado.
```

**Qué salió:** Añadió la segunda matriz debajo de la primera, sin borrarla: 5 filas «Cubierto», también la 2b en rojo, con la nota de que «Cubierto» = hay un test, no que el sistema cumpla (decisión suya, avisada). Añadió el resultado de la ejecución y los límites de lo probado.

## Prompt 6

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```
Quiero que lances el adversarial reviewer, sin modificar nada, e intenta refutar los escenarios que muestra como cubiertos, o descubir nuevos escenarios que no estén planteados en el requisito.
```

**Qué salió:** Lanzó el subagente `adversarial-reviewer` en solo lectura. Ninguna fila refutada, 2a y 3b dudosas. Encontró fallos reales fuera del requisito (email expuesto en `POST`/`PATCH`, iniciales mal con espacios de más en `user.ts:12`, que el agente verificó leyendo el código) y huecos de la spec. No modificó nada.

## Prompt 7

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```
Añade estos resultados a inv.md, sin modificar los tests o los escenarios.
```

**Qué salió:** Añadió la revisión adversarial al final de `inv.md` en tres tablas (veredicto, escenarios nuevos con fallo real y huecos de spec), sin tocar las matrices, los tests ni el código.
