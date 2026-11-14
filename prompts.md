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
dime el numero de commit ejecutados en las ultimas dos semanas
```

**Qué salió:** funcionó a la primera: 6 commits desde el 31-oct-2026, todos en otras ramas (trazabilidad-fmj, spec-viva-fmj, feat/fs-118-tickets); ninguno en `s5/start`.

## Prompt 2

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```
guarda en el archivo prompts.md todo lo que te escriba junto con un resumen de lo que me digas tal y como indica el ejemplo
```

**Qué salió:** funcionó a la primera: se sustituyó el ejemplo por los prompts 1 y 2 con su resumen.

## Prompt 3

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```
git checkout -b auditoria-fmj
```

**Qué salió:** funcionó a la primera: rama `auditoria-fmj` creada desde `s5/start`, con los cambios de `prompts.md` sin commitear.

## Prompt 4

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```
no hagas commit hasta que finalizemos el ejercicio
```

**Qué salió:** entendido: no se commitea nada hasta terminar el ejercicio; `prompts.md` sigue acumulando cambios en `auditoria-fmj`.

## Prompt 5

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```
no hagas ningun cambio de codigo en esta sesión sino lo pido explicitamente. estoy un poco confuso, lee el readme y dime en que consiste el ejercicio de de hoy. NO hagas nada solo comentamelo
```

**Qué salió:** funcionó a la primera: resumen del README (auditar las reglas de proceso de `CLAUDE.md` contra los últimos 15 commits, tabla en `docs/auditoria/<iniciales>.md` + tres líneas de la parte B + `prompts.md`, entrega por PR).

## Prompt 6

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```
dime las reglas para que te vaya diciendo mi apuesta
```

**Qué salió:** funcionó a la primera: lista numerada de las reglas de proceso de `CLAUDE.md`, separadas una por una, para que el usuario apueste sí / no / ni idea en cada una.

## Prompt 7

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```
1 no
```

**Qué salió:** apuesta registrada para la regla 1 (mirar la rama antes de tocar código): **no**.

## Prompt 8

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```
2 si
```

**Qué salió:** apuesta registrada para la regla 2 (seguir en la rama de trabajo existente): **sí**.

## Prompt 9

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```
3 no
4 si
5 no
6 si
7 ni idea
8 ni idea
9 no
10 si
11 no
```

**Qué salió:** apuestas registradas para las reglas 3 a 11. Apuesta completa (antes de mirar nada):

| # | Regla | Apuesta |
|---|---|---|
| 1 | Mirar la rama antes de tocar código | no |
| 2 | Seguir en la rama de trabajo existente | sí |
| 3 | Desde `main`/`sN/*`, crear `feat/<slug>` | no |
| 4 | Nunca commitear en `main` ni `sN/*` | sí |
| 5 | Un commit por petición | no |
| 6 | El commit se hace con `/commit` | sí |
| 7 | Cambios de API → OpenAPI (`.adonisjs/`) en el mismo commit | ni idea |
| 8 | Cambios de API → README de la capability en el mismo commit | ni idea |
| 9 | `gh pr create` una sola vez al terminar, con descripción completa | no |
| 10 | `adversarial-reviewer` una vez, lo último | sí |
| 11 | Al abrir el PR, responder solo con la URL | no |

## Prompt 10

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```
solo puedes cambiar el archivo de prompts.md y  docs/auditoria/fmj.md y ninguno mas. lanza la auditoria contra los últimos 15 commits
```

**Qué salió:** funcionó a la primera: tabla de 11 reglas en `docs/auditoria/fmj.md` (3 no se cumplen, 2 se cumplen con un solo caso, 6 no se pueden comprobar), con comparación apuesta vs. veredicto y la parte B en blanco para el usuario. Solo se tocaron esos dos archivos.

## Prompt 11

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```
git branch -a --contains 4e03d1f
```

**Qué salió:** comprobación manual de la regla 4: `4e03d1f` solo aparece en `auditoria-fmj` (creada hoy desde `s5/start`) y en ramas `s4/end` / `s5/start` (local, origin y upstream); ninguna `feat/*`.

## Prompt 12

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```
dime que pide para la parte B, te la voy a añadir aqui
```

**Qué salió:** resumen de lo que pide la parte B del README (las tres líneas) para que el usuario las dicte.

## Prompt 13

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```
1. la regla 4, pensaba sinceramente que si se cumplia y que había mecanismos para evitarlo
```

**Qué salió:** línea 1 de la parte B pegada tal cual en `docs/auditoria/fmj.md`.

## Prompt 14

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```
2 la regla 6 con un hook para forzar pero no estoy seguro de si puede forzar la utilización de la skill o habría que indicarlo en un archivo para su posterior revisión
```

**Qué salió:** línea 2 de la parte B pegada tal cual; respuesta a la duda: un hook no puede saber si se usó la skill, pero sí validar lo que deja (formato o una marca/trailer en el mensaje).

## Prompt 15

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```
3 La regla 5 no le veo ninguna utilidad, porque sería necesario hacer un unico comit si pude hacer en varios sin afectar al funcionamiento
```

**Qué salió:** línea 3 de la parte B pegada tal cual. Aviso: el README pide decir a cuál de los dos grupos pertenece y la línea no lo dice.

## Prompt 16

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```
añade que no se cumple nunca
```

**Qué salió:** añadido a la línea 3 de la parte B que la regla 5 pertenece al grupo de las que no se cumplen nunca.

## Prompt 17

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```
haz el commit, el push y abre el PR
```

**Qué salió:** commit de `docs/auditoria/fmj.md` y `prompts.md` con `/commit`, push de `auditoria-fmj` al fork y PR contra el repo del curso.

## Prompt 18

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```
corrige las filas 4, 6 y 7 y sube el PR
```

**Qué salió:** tras el review adversarial, fila 4 pasa a «no se puede comprobar» (squash/rebase deja el mismo rastro; commits del docente), fila 6 a «no se cumple» (`cdf903a` sin scope) y fila 7 a «no se puede comprobar» (falta regenerar `.adonisjs/`). Commit y push al PR #80.
