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

**Modelo:** Sonnet 4.6
**Herramienta:** Claude Code

```
Trabajá SOLO sobre el requisito "Lo que cada tarea muestra de su responsable" de openspec/specs/tasks/spec.md. No cubras otros requisitos de esa spec.

Armá una matriz de trazabilidad en docs/verificacion/mc.md con este formato:
- Arriba del todo, dos números: cuántos scenarios tiene el requisito y cuántos están cubiertos (este último dejalo como "pendiente").
- Una tabla con una fila por scenario y cuatro columnas:
  1. El scenario en una línea (qué se espera y en qué situación).
  2. El test que lo cubre, con el nombre exacto con el que aparece en la suite.
  3. Estado: Cubierto, No cubierto o No lo sé.
  4. Si es "No lo sé", qué faltó para decidirlo (media línea).

Reglas:
- Para marcar "Cubierto" tenés que abrir el test y leer lo que afirma; que el nombre se parezca no alcanza. Si el test comprueba solo una parte o algo parecido pero no igual, marcá "No lo sé" y decí por qué.
- Todavía no escribas tests.
- No modifiques ningún archivo fuera de docs/verificacion/.

```

**Qué salió:** armó la matriz con 3 scenarios, todos No cubierto

## Prompt 2

**Modelo:** Sonnet 4.6
**Herramienta:** Claude Code

```
Ahora escribí los tests que faltan para las filas en "No cubierto" de docs/verificacion/mc.md: uno por scenario.

Reglas:
- Ponelos en backend/tests/functional/tasks/, siguiendo el estilo de los tests de backend/tests/functional/auth/.
- No modifiques nada fuera de backend/tests/ ni de docs/verificacion/.
- Si un test sale en rojo, no lo arregles ni lo aflojes para que pase, y no toques el código de la aplicación. Dejalo en rojo y contame por qué falla.
- Después ejecutalos con npm test desde backend/.

Al final, decime: qué tests escribiste, cuáles quedaron en verde y cuáles en rojo, y qué valores o casos tuviste que decidir vos porque el scenario no los especificaba (por ejemplo, un nombre concreto, un límite o qué pasa con un dato vacío).

```

**Qué salió:** escribió 2 tests; uno verde y uno rojo (la tarea expone el email del responsable). Le aprobé correr las migraciones porque faltaba la tabla de tareas en mi base local.

**Nota:** la parte B la redacté con ayuda de Claude (chat en claude.ai), a partir de los resultados de Claude Code.