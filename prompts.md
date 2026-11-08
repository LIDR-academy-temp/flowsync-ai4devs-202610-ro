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

**Modelo:** Claude Sonnet 5.5
**Herramienta:** Claude (claude.ai)

```
Build a traceability matrix ONLY for the requirement "Lo que cada tarea muestra de su responsable" that is located in the tasks Specifications file "flowsync-ai4devs-202610-ro/openspec/specs/tasks/spec.md". 

The traceability matrix identifies if the scenario given in the spec file is actually validated by the tests located at "flowsync-ai4devs-202610-ro/backend/tests". 
 
The traceability matrix will have four columns. The first column will hold the title for the scenarios contained inside the mentioned requirement. The second column will specify the exact name of the test that handles the scenario located in the test suite mentioned before. In case there are not tests that handles such scenario the cell will be left blank. The third column will specify any of the following 3 values: "Cubierto" when the test FULLY covers the scenario; "No cubierto" when the test DOES NOT FULLY covers the scenario; "No lo sé" if it was not possible to determine which test handles the scenario, or if a test was found that seems to validate the scenario but it actually does not. The fourth will only contain details when the value for the third column is "No lo sé" and the content will be the reason why it was not possible to determine if the scenario is covered or not by any of the tests in the test suite.

The traceability matrix will be stored at "flowsync-ai4devs-202610-ro/docs/verificacion/av.md".

DO NOT modify any other file or tests.
```

**Qué salió:** Funcionó a la primera. Como no especifiqué el título de las columnas de la Matriz de Trazabilidad me puso el título que creyó mas apropiado.

---

## Prompt 2

**Modelo:** Claude Sonnet 5.5
**Herramienta:** Claude (claude.ai)

```
in the file "flowsync-ai4devs-202610-ro/openspec/specs/tasks/spec.md",  below section "## Resultado de Claude" and above the Traceability matix, write "Escenarios en el requisito: <number_of_actual_scenarios_you_found> * Cubiertos: <number_of_actual_scenarios_that_are_covered_by_the_tests>
```

**Qué salió:** Funcionó a la primera. A pesar de haber dado mal la instrucción, me actualizó el archivo de "flowsync-ai4devs-202610-ro/docs/verificacion/av.md"

---

## Prompt 3

**Modelo:** Claude Sonnet 5.5
**Herramienta:** Claude (claude.ai)

```
In the file "flowsync-ai4devs-202610-ro/backend/tests/functional/tasks/assignments.spec.ts", write the required tests ONLY for the missing scenarios that you found. Follow the same format and code pattern as in the other tests. DO NOT add any library and ONLY USE the tests libraries already provided in the project. The test should validate that the spec is met. If the code does not provide the functionality for the spec, DO NOT modify any other files, code or tests, rather write the test as if we were doing Test Driven Development.
```

**Qué salió:** Me escribió los tests pero ya no me alcanzó el tiempo para verificar si estaban bien, completos, mal o la funcionalidad actual del backend no soportaba la validación de los tests. Fallaron todos los tests. Sin embargo, Claude reportó que solo algunos tests fallarían puesto que, a su parecer, el backend tiene un bug.

---

## Prompt 4

**Modelo:** Claude Sonnet 5.5
**Herramienta:** Claude (claude.ai)

```
Read file "flowsync-ai4devs-202610-ro/prompts.md" follow it's structure, and write all prompts given here to such file. DO NOT write any content in the section "**Qué salió:**"
```

**Qué salió:** Funcionó a la primera
