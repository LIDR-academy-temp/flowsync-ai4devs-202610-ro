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
/init
```

**Qué salió:** generó el archivo CLAUDE.md


## Prompt 2

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```
Lista los proyectos de Jira a los que tengo acceso
```

**Qué salió:** Muestra que tengo acceso al proyecto FLOW



## Prompt 3

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```
Dime cuales son los nombres de las columnas en el proyecto de Jira para tener la información necesaria para crear el skill priority-ticket
```

**Qué salió:** Los 5 estados del tablero en Jira



## Prompt 4

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```
Crea el skill `/priority-ticket`**: trae el ticket de mayor prioridad asignado a ti en «Por hacer», resume sus criterios de aceptación, entra en plan
  mode y propone cómo implementarlo; al aprobar el plan, lo mueve a «En curso».
```

**Qué salió:** Generó el skill

## Prompt 5 (A partir de este prompt ya se habían finalizado los 45 minutos)

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```
Crea en Jira, proyecto FLOW, una tarea asignada a mí con este título y descripción, y déjala en estado «To Do» (no en «Idea»):

"# Implementar login en el frontend

## Descripción
Implementar la autenticación en el frontend, consumiendo el backend de auth ya existente (`POST /api/v1/auth/signup`, `POST /api/v1/auth/login`). Usar shadcn/ui para los componentes.

## Criterios de aceptación
- Pantalla de registro (email+password) que llama a `POST /api/v1/auth/signup`.
- Pantalla de login (email+password) que llama a `POST /api/v1/auth/login` y guarda el token recibido.
- Tras login exitoso: redirige a una vista protegida (p. ej. perfil) que consuma `GET /api/v1/account/profile`.
- Credenciales inválidas en login, o email ya registrado en signup, muestran un mensaje claro — no un error genérico ni de consola.
- Enlace de navegación entre login y registro."
```

**Qué salió:** Generó el ticket en Jira, sin embargo tuve que ajustarlo manualmente porque el ticket quedó en el Backlog y no en el Sprint


## Prompt 6

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```
Ejecuta /priority-ticket y anota esto cómo el prompt 6 en prompts.md
```

**Qué salió:** Presentó el plan y lo guardé en plan-con-harness.md


## Prompt 7 (Ejecutado en el proyecto sin harness)

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```
Trae de Jira (proyecto FLOW) el ticket de mayor prioridad asignado a mí en «To Do», resume sus criterios de aceptación y entra en plan mode para proponer cómo implementarlo. Anote esto cómo el siguiente prompt en prompts.md. Cuando generemos el plan debe quedar guardado en el archivo plan-sin-harness.md en la raíz del proyecto.
```

**Qué salió:** Indica que Jira no está configurado.

---

## Prompt 8 (Ejecutado en el proyecto sin harness)

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```
Configura el MCP. De ahora en adelante todos los prompts debes colocarlos en prompts.md para tener el registro.
```

**Qué salió:** Indica que debo ejecutar /mcp

---

## Prompt 9 (Ejecutado en el proyecto sin harness)

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```
ejecuta /mcp
```

**Qué salió:** Indica que no puede ejecutar /mcp directamente. Hago la configuración manualmente.

---

## Prompt 10 (Ejecutado en el proyecto sin harness)

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```
listo, ya termine de ejecutar /mcp. Siempre los prompts debes anotarlos en prompts.md
```

**Qué salió:** Produjo el plan, no tuvo en cuenta que debía guardarlo en un archivo específico. Guardé el plan plan-sin-harness.md.