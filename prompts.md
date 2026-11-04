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

**Modelo:** claude-opus-5-5
**Herramienta:** Claude Code

```
añademe los prompts siempre al fichero prompts.md, si tienes que crear un hook crealo.
```

## Prompt 2

**Modelo:** claude-opus-5-5
**Herramienta:** Claude Code

```
Esto no no estás haciendo en s3?
```

## Prompt 3

**Modelo:** claude-opus-5-5
**Herramienta:** Claude Code

```
openspec init
```

## Prompt 4

**Modelo:** claude-opus-5-5
**Herramienta:** Claude Code

```
Vamos a documentar como spec de OpenSpec la capability que YA existe en este proyecto: la de cuentas y acceso (registro, inicio de sesión, sesión y perfil). Esto es ingeniería inversa: leer el código y escribir lo que hace HOY, no proponer nada nuevo ni cambiar una línea.1. Explora el vertical de autenticación COMPLETO, en las dos capas. En
`backend/`:
sus controladores, el modelo de usuario, sus validadores, sus rutas y sus middlewares. En
`frontend/`:
las pantallas de acceso, el estado de sesión y la protección de rutas. Ignora todo lo que no sea autenticación.2. Escribe
`openspec/specs/auth/spec.md`
con el formato exacto de una spec VIVA de OpenSpec: un `## Purpose` de una o dos frases, y debajo `## Requirements`, con `### Requirement:` en los que el sistema SHALL hacer algo, y bajo cada uno al menos un `#### Scenario:` de cuatro almohadillas con sus dos viñetas
`-
**WHEN**` y
`-
**THEN**`. En castellano, salvo las mayúsculas
RFC-2119.
3. NO uses secciones ADDED, MODIFIED ni REMOVED: eso es de un delta, y esto no es un delta, es la verdad actual del sistema.4. Describe solo comportamiento observable desde fuera. Nada de nombres de clase ni de rutas de archivo. Para el backend, observable = la petición y la respuesta HTTP. Para el frontend, observable = lo que una persona ve y puede hacer en pantalla.5. Al terminar, dime qué comportamiento del código NO has podido expresar como requisito, y por qué.
```

## Prompt 5

**Modelo:** claude-opus-5-5
**Herramienta:** Claude Code

```
¿Porque aqui no se utiliza el hook que en el que está guardando los promt en prompts.md? solucionalo y añade los ultimos prompts que no estában
```

## Prompt 6

**Modelo:** claude-opus-5-5
**Herramienta:** Claude Code

```
openspec validate auth --strict
```

## Prompt 7

**Modelo:** claude-opus-5-5
**Herramienta:** Claude Code

```
openspec config list
```

## Prompt 8

**Modelo:** claude-opus-5-5
**Herramienta:** Claude Code

```


<pasted_content id="bcf0">
/opsx:propose
Dale de alta la capability de tareas del equipo, que todavía no existe. Llama al change exactamente
`add-task-list`
y a la capability exactamente `tasks` (el delta va en
`specs/tasks/spec.md`,
no inventes otro nombre). El alcance son cinco historias del backlog, con sus criterios de aceptación:
@docs/backlog/E3-actividad-equipo/us-lista-compartida.md
y
@docs/backlog/E2-gestion-tareas/us-crear-tarea.md,
@docs/backlog/E2-gestion-tareas/us-titulo-obligatorio.md,
@docs/backlog/E2-gestion-tareas/us-responsable-y-estado-por-defecto.md
y
@docs/backlog/E2-gestion-tareas/us-cambiar-estado.md.
Léelas enteras antes de proponer nada.Este change es
FULL-STACK:
la API de AdonisJS en
`backend/`
Y la interfaz de React 19 en
`frontend/`.
La interfaz reutiliza los componentes que ya hay en
`frontend/src/components/ui/`
y el patrón de páginas y rutas que ya existe para el login. No montes design system nuevo ni añadas dependencias.SIN TESTS: no montes base de pruebas ni escribas tests en este change. Ni tasks.md ni el delta deben incluirlos.Los tres estados de una tarea viajan por la API como `pending`, `in_progress` y `done`, y se pintan en pantalla como Pendiente, En curso y Hecho. Es un conjunto cerrado: cualquier otro valor se rechaza con 422. NO uses los valores en castellano como identificadores.Seis restricciones que NO son negociables, aunque no me preguntes por ellas:1. La tarea NO tiene fecha de vencimiento en este change, y la lista no muestra fechas ni marcas de vencida. No la añadas ni la dejes preparada.2. La API tiene exactamente tres operaciones: listar todas las tareas, crear una y actualizarla. NO hay lectura individual de una tarea, no hay borrado y no hay endpoints de equipo.3. Al crear, el título es lo ÚNICO que se pide: el formulario no ofrece ni sugiere responsable, estado ni fecha. La tarea nace en pendiente y con quien la crea como responsable.4. NO hay regla de orden decidida para la lista. No inventes un criterio de ordenación, no ordenes explícitamente, y anótalo como punto abierto en el proposal.5. Una sola lista compartida, la misma para todos: no hay tareas privadas ni vista de "mis tareas", y cualquiera puede cambiar el estado y el responsable de cualquier tarea.6. En la lista, el responsable se identifica por su NOMBRE. Si no tiene nombre puesto se pinta "Sin nombre": nunca su correo ni su id.Traduce cada criterio de aceptación a scenarios de la spec delta, no lo copies tal cual. Y antes de escribir, pregúntame lo que de verdad cambie el alcance o el comportamiento observable.
Lo
</pasted_content id="bcf0">

```

## Prompt 9

**Modelo:** claude-opus-5-5
**Herramienta:** Claude Code

```
openspec show add-task-list
```

## Prompt 10

**Modelo:** claude-opus-5-5
**Herramienta:** Claude Code

```


<pasted_content id="4cff">
/opsx:update
add-task-list
Antes de implementar, corrige el contrato: Una vez autenticado debe de ir al listado de tareas. Toca el delta de
specs/
y, si hace falta, tasks.md. No escribas código todavía.
</pasted_content id="4cff">

```

## Prompt 11

**Modelo:** claude-opus-5-5
**Herramienta:** Claude Code

```
Cambiar el destino solo tras el login que iria a task y el del registro que iria a login.
```

## Prompt 12

**Modelo:** claude-opus-5-5
**Herramienta:** Claude Code

```
Sí, añade el aviso de «Cuenta creada» en `/login` y despues ejecuta 

<pasted_content id="4cff">
/opsx:apply
add-task-list
Haz solo las secciones de backend de tasks.md (modelo de datos y API). Para al terminar la última de backend y no toques el frontend todavía.Seguimos en la misma rama: no crees una rama nueva, no abras PR y no lances el subagente
adversarial-reviewer.
</pasted_content id="4cff">

```

## Prompt 13

**Modelo:** claude-opus-5-5
**Herramienta:** Claude Code

```
<task-notification>
<task-id>bp322hlgd</task-id>
<tool-use-id>toolu_01Xap6RpiWhU4QMghdTi5q14</tool-use-id>
<output-file>/tmp/claude-1000/-home-edaza-AI4Devs-s3-flowsync-ai4devs-202610-ro/3c4e7945-6445-4d33-9181-eea2fa1ea42b/tasks/bp322hlgd.output</output-file>
<status>failed</status>
<summary>Background command "Back up dev database and start backend dev server" failed with exit code 144</summary>
</task-notification>
```

## Prompt 14

**Modelo:** claude-opus-5-5
**Herramienta:** Claude Code

```


<pasted_content id="4cff">
/opsx:apply
add-task-list
Continúa con las secciones de frontend de tasks.md: la capa de acceso a la API y la interfaz de la lista. La sección de verificación de punta a punta la hago yo a mano en el navegador, no la marques.Seguimos en la misma rama: no crees una rama nueva, no abras PR y no lances el subagente
adversarial-reviewer.
</pasted_content id="4cff">

```

## Prompt 15

**Modelo:** claude-opus-5-5
**Herramienta:** Claude Code

```
<task-notification>
<task-id>bp5nt9i0p</task-id>
<tool-use-id>toolu_01LXREuasnD38Mx7ExFcqoaD</tool-use-id>
<output-file>/tmp/claude-1000/-home-edaza-AI4Devs-s3-flowsync-ai4devs-202610-ro/3c4e7945-6445-4d33-9181-eea2fa1ea42b/tasks/bp5nt9i0p.output</output-file>
<status>failed</status>
<summary>Background command "Start frontend dev server for browser checks" failed with exit code 144</summary>
</task-notification>
```

## Prompt 16

**Modelo:** claude-opus-5-5
**Herramienta:** Claude Code

```
<task-notification>
<task-id>bulcgl5ie</task-id>
<tool-use-id>toolu_012BX1PbvNYhYQBA1Sr5TdVC</tool-use-id>
<output-file>/tmp/claude-1000/-home-edaza-AI4Devs-s3-flowsync-ai4devs-202610-ro/3c4e7945-6445-4d33-9181-eea2fa1ea42b/tasks/bulcgl5ie.output</output-file>
<status>failed</status>
<summary>Background command "Start backend dev server for browser checks" failed with exit code 1</summary>
</task-notification>
```

## Prompt 17

**Modelo:** claude-opus-5-5
**Herramienta:** Claude Code

```
me gustaría hacer un commit ahora para despues ejecutar openspec archive add-task-list y realizar otro commit y así veo la diferencia en el repo
```

## Prompt 18

**Modelo:** claude-opus-5-5
**Herramienta:** Claude Code

```
haz un commit de los ficheros de open spec y los promts y un push para poder verlo en la web de github
```
