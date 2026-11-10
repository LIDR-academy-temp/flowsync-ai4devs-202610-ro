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
Busca en backend/tests/ todos los tests que tocan el responsable (assignee) de una tarea y que, por cada uno, dame su nombre exacto y qué afirma literalmente (las líneas del assert). Prohíbele decidir la cobertura, escribir tests y hacer commits.
```

**Qué salió:** lanzó un subagente Explore de solo lectura. Resultado: no existe ningún test de tareas, solo de auth. El assignee solo aparece en el modelo de la aplicación. Prompt redactado con ayuda de Claude (chat).

## Prompt 2

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```
No hagas commits, push ni PRs hasta que yo te lo pida.

Escribe 3 tests funcionales nuevos, uno por scenario del requisito «Lo que cada tarea muestra de su responsable» de openspec/specs/tasks/spec.md:
1. Responsable identificable: la tarea trae el nombre y las iniciales del responsable.
2. La tarea no filtra datos de cuenta: el assignee no incluye el email ni datos de acceso, comprobándolo tanto en una tarea suelta (GET /api/v1/tasks/:id) como dentro de la lista (GET /api/v1/tasks).
3. Responsable sin nombre: con una cuenta registrada sin nombre, el nombre del assignee llega nulo y las iniciales sí llegan.

Reglas:
- Ponlos en backend/tests/functional/tasks/ siguiendo el estilo de los tests de backend/tests/functional/auth/ (nombres en castellano, misma forma de crear cuentas y tokens).
- No toques nada fuera de backend/tests/.
- Usa como nombre de cada test una frase que describa el scenario.
- Ejecuta la suite al terminar.
- Si algún test falla, NO arregles el código de la aplicación ni ajustes el test para que pase: déjalo en rojo y explícame por qué falla.
```

**Qué salió:** escribió 3 tests; 2 verdes y 1 rojo (la lista expone el email del responsable). Sin pedirlo, creó una rama feat/tests-responsable-tareas por indicación de CLAUDE.md; volví a mi rama a mano. Avisó de que POST /api/v1/tasks probablemente tenga la misma fuga, pero no lo probó. Prompt redactado con ayuda de Claude (chat).



