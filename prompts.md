## Prompt 1

**Modelo:** Claude Opus 5.5
**Herramienta:** Claude Code

```
/init
```

**Qué salió:** generó `CLAUDE.md` en español: stack, comandos, arquitectura del backend y una sección con el contrato del validador (`passwordConfirmation`, 8–32 caracteres).

## Prompt 2

**Modelo:** Claude Opus 5.5
**Herramienta:** Claude Code

```
conecta el MCP de Atlassian a nivel de proyecto
```

**Qué salió:** creó `.mcp.json` con el servidor remoto de Atlassian; faltaba reiniciar y autenticarse con `/mcp`.

## Prompt 3

**Modelo:** Claude Opus 5.5
**Herramienta:** Claude Code

```
como reinicio claude code
```

**Qué salió:** explicó `/exit` + `claude` (o `claude --continue`), aprobar el servidor y autenticar con `/mcp`.

## Prompt 4

**Modelo:** Claude Opus 5.5
**Herramienta:** Claude Code

```
lista mis issues asignados en Por hacer
```

**Qué salió:** no había nada asignado; encontró FLOW-1 sin asignar y en `Selected for Development` (el tablero no tiene un estado «Por hacer»).

## Prompt 5

**Modelo:** Claude Opus 5.5
**Herramienta:** Claude Code

```
Lo he asignado en Jira, verificalo
```

**Qué salió:** confirmó FLOW-1 asignado y pendiente (prioridad Medium).

## Prompt 6

**Modelo:** Claude Opus 5.5
**Herramienta:** Claude Code

```
sí, crea la skill /priority-ticket
```

**Qué salió:** creó `.claude/skills/priority-ticket/SKILL.md`; filtra por categoría de estado y busca la transición a «En curso» sin id fijo.

## Prompt 7

**Modelo:** Claude Opus 5.5
**Herramienta:** Claude Code

```
crea la skill /commit
```

**Qué salió:** creó `.claude/skills/commit/SKILL.md` (Conventional Commits en español, sin `git add`, con `Refs: FLOW-N`).

## Prompt 8

**Modelo:** Claude Opus 5.5
**Herramienta:** Claude Code

```
crea el subagente adversarial-reviewer
```

**Qué salió:** creó `.claude/agents/adversarial-reviewer.md` con solo `Read`, `Grep`, `Glob` y `Bash`; que no edite con `Bash` es solo una instrucción del prompt.

## Prompt 9

**Modelo:** Claude Opus 5.5
**Herramienta:** Claude Code

```
crea el hook que formatea el frontend con Prettier
```

**Qué salió:** instaló Prettier, creó `.prettierrc.json`, el script del hook y `.claude/settings.json` con `PostToolUse`; lo probó a mano con un archivo de `frontend/src` y otro del backend.

## Prompt 10

**Modelo:** Claude Opus 5.5
**Herramienta:** Claude Code

```
Que especifica la pieza 7
```

**Qué salió:** resumió las reglas de proceso del README (rama, `/commit`, `gh pr create`, revisor, solo la URL).

## Prompt 11

**Modelo:** Claude Opus 5.5
**Herramienta:** Claude Code

```
sí, añádelas a CLAUDE.md
```

**Qué salió:** añadió la sección «Reglas de proceso»; además, por su cuenta, fijó el nombre de rama `tipo/CLAVE-descripcion` y el PR contra la rama de partida.

## Prompt 12

**Modelo:** Claude Opus 5.5
**Herramienta:** Claude Code

```
crea el enlace AGENTS.md a CLAUDE.md
```

**Qué salió:** `ln -s CLAUDE.md AGENTS.md`.

## Prompt 13

**Modelo:** Claude Opus 5.5
**Herramienta:** Claude Code

```
prepara el commit del harness
```

**Qué salió:** commit `c457a4d chore(harness): ...` con las 8 piezas (12 archivos), sin push.

## Prompt 14

**Modelo:** Claude Opus 5.5
**Herramienta:** Claude Code

```
/priority-ticket
```

**Qué salió:** trajo FLOW-1, resumió sus criterios y sus huecos, leyó el validador y las clases de error del backend, y propuso un plan; rechacé el plan, así que el ticket no se movió.

## Prompt 15

**Modelo:** Claude Opus 5.5
**Herramienta:** Claude Code

```
Puedes hacer un resumen de los ficheros que modificarias?
```

**Qué salió:** 25 archivos en tablas separadas por tipo (7 modificados, 14 nuevos, 4 borrados).

## Prompt 16

**Modelo:** Claude Opus 5.5
**Herramienta:** Claude Code

```
Ponlos todos en una sola lista y columna
```

**Qué salió:** una sola lista, pero sin la columna con el tipo de cambio.

## Prompt 17

**Modelo:** Claude Opus 5.5
**Herramienta:** Claude Code

```
Estos cambios ya estan activos o son solo en base al ticket?
```

**Qué salió:** solo era un plan; en plan mode no se tocó nada y el ticket no se movió.

## Prompt 18

**Modelo:** Claude Opus 5.5
**Herramienta:** Claude Code

```
Que convenciones del proyecto has usado?
```

**Qué salió:** enumeró las convenciones de `CLAUDE.md`, de la skill y del frontend, separó las decisiones propias y detectó que `CLAUDE.md` decía «sin formateador» aunque ya había hook.

## Prompt 19

**Modelo:** Claude Opus 5.5
**Herramienta:** Claude Code

```
/priority-ticket
```

**Qué salió:** volvió a traer FLOW-1, añadió al plan la sección de convenciones y lo presentó; lo rechacé.

## Prompt 20

**Modelo:** Claude Opus 5.5
**Herramienta:** Claude Code

```
PUedes hacer un resumen de todos los ficheros que vas a modificar en el plan? Los quiero todos en una sola lista y con el tipo de modificacion que se va a hacer (nuevo, modificacion, borrado)
```

**Qué salió:** una lista con «archivo: tipo».

## Prompt 21

**Modelo:** Claude Opus 5.5
**Herramienta:** Claude Code

```
PUedes hacer un resumen de todos los ficheros que vas a modificar en el plan? Los quiero todos en una sola lista y con el tipo de modificacion que se va a hacer (nuevo, modificacion, borrado)
```

**Qué salió:** el mismo prompt repetido; respondió con una tabla de dos columnas (archivo | tipo).

## Prompt 22

**Modelo:** Claude Opus 5.5
**Herramienta:** Claude Code

```
/priority-ticket
```

**Qué salió:** incluyó la tabla de archivos en el plan y lo aprobé. Movió FLOW-1 a In Progress, creó la rama, implementó y pasó `build` y `lint`; se paró porque `better-sqlite3` no compilaba con Node 26 (npm bloquea sus scripts de instalación).

## Prompt 23

**Modelo:** Claude Opus 5.5
**Herramienta:** Claude Code

```
hazlo tú, autoriza better-sqlite3 y recompílalo
```

**Qué salió:** compiló el binario con `node-gyp` sin tocar `backend/package.json`, verificó la API con curl (no había navegador), hizo `/commit`, abrió el PR #1 contra `harness-XHM` y lanzó el revisor. Al final respondió solo con la URL.

## Prompt 24

**Modelo:** Claude Opus 5.5
**Herramienta:** Claude Code

```
¿Ha terminado ya la revisión?
```

**Qué salió:** veredicto «mergeable con cambios», con 3 hallazgos menores: el mensaje de red tapado por el 502 del proxy de Vite, el email sin pasar a minúsculas y la contraseña sin recortar.

## Prompt 25

**Modelo:** Claude Opus 5.5
**Herramienta:** Claude Code

```
POr ahora no
```

**Qué salió:** dejó el PR como estaba y recordó qué falta para la entrega.

## Prompt 26

**Modelo:** Claude Opus 5.5
**Herramienta:** Claude Code

```
En el fichero "prompts.md" tienes instrucciones de como generarlo. Vuelca el contenido de las preguntas y respuestas de esta sesion en este fichero respetando las intrucciones solicitadas con el formato indicado
```

**Qué salió:** este archivo.
