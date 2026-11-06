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

**Modelo:** Opus 5.5 (claude-opus-5-5)
**Herramienta:** Claude Code (extensión de VS Code)

```
Trabaja solo sobre el requisito «Lo que cada tarea muestra de su responsable» de openspec/specs/tasks/spec.md. No cubras ningún otro requisito ni la capability entera.

Para cada uno de sus scenarios:
1. Resúmelo en una línea (situación + qué se espera).
2. Busca en backend/tests/ qué test lo cubre. ABRE cada test candidato y lee lo que afirma realmente (asserts, endpoint que llama, datos que crea). No te fíes del nombre del test ni del fichero.
3. Clasifícalo como Cubierto, No cubierto o No lo sé. Solo "Cubierto" si un assert comprueba exactamente lo que dice el scenario, sobre el assignee de una tarea (no sobre otro endpoint). Si el test comprueba algo parecido pero no lo mismo, es "No lo sé" y explica en media línea qué faltó.
4. Nombra la prueba tal cual aparece en la suite (grupo + título del test) y su fichero. Si no hay, deja la casilla vacía.

Rellena la tabla de docs/verificacion/grr.md (ya tiene el esqueleto) con una fila por scenario. No toques el número de "Scenarios cubiertos" ni las tres líneas todavía. No escribas tests ni modifiques ningún otro archivo. Al terminar, enséñame la tabla y los asserts concretos en los que te basaste para cada estado.
```

**Qué salió:** Funcionó a la primera. Ninguno de los 3 scenarios está cubierto: en `backend/tests/` no hay ni un test de `tasks` ni ninguna mención a `assignee`. Los 3 quedaron como «No lo sé» porque solo hay tests parecidos de auth, que miran otros endpoints.

## Prompt 2

**Modelo:** Opus 5.5 (claude-opus-5-5)
**Herramienta:** Claude Code (extensión de VS Code)

```
Para cada fila de docs/verificacion/grr.md marcada como "No cubierto", escribe UN test funcional por scenario en backend/tests/functional/tasks/ (carpeta nueva), siguiendo el estilo de backend/tests/functional/auth/*.spec.ts: Japa, test.group con nombre "Tasks | responsable", group.each.setup(() => testUtils.db().withGlobalTransaction()), usuarios creados con User.create, token obtenido por login o por el provider de access tokens, y llamadas con client tipado.

Reglas:
- No modifiques nada fuera de backend/tests/. Ni controladores, ni transformers, ni la spec.
- Cada test comprueba exactamente lo que dice su scenario, ni más ni menos. Cubre el caso "suelta" (GET /api/v1/tasks/:id) y "dentro de la lista" (GET /api/v1/tasks) solo si el scenario lo dice.
- Si el scenario no fija un valor (iniciales esperadas, qué campos cuentan como "dato de acceso", qué es "nombre nulo"), elige uno, déjalo en un comentario "// DECISIÓN: ..." encima del assert y dímelo al final.
- Cada test lleva un comentario con el texto del scenario que cubre.

Después ejecuta solo esos tests con: cd backend && node ace test functional --files=tasks
Si alguno sale rojo, NO arregles el código ni aflojes el test: déjalo rojo y explícame qué afirma y qué devuelve la API en realidad.
```

**Qué salió:** Solo había una fila «No cubierto» (Responsable identificable), así que salió un único test, en `backend/tests/functional/tasks/assignee.spec.ts`. Con `--files=tasks` no se ejecutó ningún test, porque el filtro compara con el nombre del fichero. Con `--files=tasks/assignee` sale rojo, pero no por la API: la BD local no tiene las migraciones de `tasks` aplicadas (`no such table: tasks`).

## Prompt 3

**Modelo:** Opus 5.5 (claude-opus-5-5)
**Herramienta:** Claude Code (extensión de VS Code)

```
Actualiza docs/verificacion/grr.md: en las filas que eran "No cubierto" y ahora tienen test, pon el nombre exacto del test nuevo (grupo + título) y su resultado de ejecución (verde o rojo). Un test en rojo no cuenta como "Cubierto": márcalo "No cubierto (test en rojo: <motivo en media línea>)". No cambies las filas que no tengan test nuevo. Rellena "Scenarios cubiertos" con el recuento final. No toques las tres líneas.
```

**Qué salió:** Funcionó a la primera. La fila «Responsable identificable» pasó a «Cubierto», con el test `Tasks | responsable` en verde (tras aplicar las migraciones de `tasks`). Las otras dos filas siguen en «No lo sé». Scenarios cubiertos: 1.
