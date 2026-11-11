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

**Modelo:** Opus 5.5 (`claude-opus-5-5`)
**Herramienta:** Claude Code (sesión principal)

```
Con un agente, y sobre el requisito «Lo que cada tarea muestra de su responsable», produce dos cosas y déjalas escritas en archivos versionados del repositorio, no en el chat.

A.1 · La matriz de trazabilidad
El formato lo fija esta lección, y no es negociable: una fila por scenario, con estas cuatro casillas, y dos números arriba del todo.

Los dos números son cuántos scenarios tiene ese requisito y cuántos resultaron estar cubiertos. El segundo se escribe al final; el primero, al principio.

El scenario, en una línea. Qué se espera y en qué situación. Si no cabe en una línea, es que estás juntando dos.
Qué prueba lo cubre, nombrada tal cual aparece en la suite. Sin el nombre concreto, la casilla se queda vacía: "seguro que algo lo cubre" no es una fila.
Cubierto · No cubierto · No lo sé. Los tres estados existen, y el tercero no es un fallo tuyo: es el resultado más informativo de los tres.
Si pusiste "no lo sé", qué te faltó para decidirlo. Media línea. Suele ser una de dos: no encontraste dónde se comprueba, o encontraste algo que se le parece y no dice exactamente lo mismo.
```

**Qué salió:** la sesión principal leyó el README y la spec y delegó en un subagente con el Prompt 2.

---

## Prompt 2

**Modelo:** Opus 5.5 (`claude-opus-5-5`), subagente `general-purpose`
**Herramienta:** Claude Code (Agent tool), redactado por la sesión principal a partir del Prompt 1

```
Trabajas en el repo /home/edaza/AI4Devs/s4/flowsync-ai4devs-202610-ro (rama `trazabilidad-eds`, ya creada; no cambies de rama, no commitees, no hagas push). Lee CLAUDE.md y la sección «La tarea» de README.md (líneas ~105-200) antes de empezar.

Alcance: SOLO el requisito «Lo que cada tarea muestra de su responsable» de `openspec/specs/tasks/spec.md` (empieza en la línea ~97). No otros requisitos ni la capability entera, aunque se solapen.

Produce dos cosas en archivos:

## A.1 · Matriz de trazabilidad → `docs/verificacion/eds.md` (carpeta nueva)
Formato fijo, no negociable:
- Arriba del todo, dos números: «Scenarios del requisito: N» (rellénalo al principio, contando los scenarios del requisito en la spec) y «Cubiertos: M» (rellénalo al final).
- Una fila por scenario, tabla con cuatro columnas:
  1. El scenario en una línea (qué se espera y en qué situación).
  2. Qué prueba lo cubre, con el nombre EXACTO del test tal cual aparece en la suite (fichero + título de `test('...')`). Sin nombre concreto, la casilla vacía.
  3. Cubierto · No cubierto · No lo sé.
  4. Si «No lo sé»: media línea de qué faltó (no encontraste dónde se comprueba, o hay algo parecido que no afirma exactamente lo mismo).
- Para marcar «Cubierto» tienes que ABRIR el test y leer sus asserts: un nombre parecido no es cobertura. Busca en todo `backend/tests/` (hoy solo hay tests de auth; los de auth comprueban iniciales del usuario en el perfil, que NO es lo mismo que el assignee de una tarea — decide con criterio y explica). Sé honesto: si dudas, «No lo sé».
- La matriz se rellena con el estado ANTES de tus tests nuevos (lo que había en la suite). Después, en una nota bajo la tabla, indica qué test nuevo escribiste para cada fila «No cubierto» y su resultado (verde/rojo, con el mensaje de fallo resumido si es rojo).
- Debajo, deja una sección `## Parte B · Las tres líneas` con las tres líneas como placeholders `(pendiente: lo escribe el alumno)` — NO las rellenes. Pero añade una subsección `### Decisiones que tomó el agente al escribir los tests` con viñetas concretas de valores/límites/casos que el scenario no fijaba y tuviste que decidir tú (p.ej. qué nombre de prueba, cómo calcular las iniciales esperadas, qué campos consideras «otro dato», si `id` del assignee cuenta como dato expuesto, qué endpoints miraste: listado, creación, detalle…). Y si algún scenario te pareció un posible hueco de spec más que de test, dilo ahí en una línea.
- Tiene que caber en una pantalla. Castellano.

## A.2 · Tests que faltan → `backend/tests/functional/tasks/`
- Un test por cada scenario «No cubierto», siguiendo el estilo de `backend/tests/functional/auth/` (Japa, `apiClient` tipado, cómo crean usuarios y tokens, hooks de BD). Ojo: la BD de tests es el mismo SQLite que dev; aísla con `testUtils.db()` (truncate o transacción global) como hagan los de auth.
- Lee las rutas, controlador, modelo y transformer de tasks para saber qué endpoints existen (`node ace list:routes` desde `backend/`), pero NO modifiques nada fuera de `backend/tests/`. Ni código de app, ni la spec.
- Ejecuta: `cd backend && node ace test functional --files=tasks` (o equivalente) y también la suite entera para confirmar que no rompes auth.
- Si un test sale rojo: NO arregles el código y NO aflojes el test. Se queda rojo y se documenta. Solo puedes corregir un test si el fallo es un error tuyo de escritura (import mal, sintaxis), no una discrepancia de comportamiento.
- Si regenerar `.adonisjs/` produce diffs al correr tests, déjalos y menciónalo.

Al terminar, responde con: lista de ficheros creados/modificados (`git status`), los dos números, el estado de cada fila, y la salida resumida de los tests (qué pasa y qué falla y por qué).
```
