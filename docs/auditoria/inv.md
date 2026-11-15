# Auditoría de las reglas de proceso — inv

## Apuesta (escrita antes de mirar nada)

| # | Regla | Apuesta | Por qué |
|---|---|---|---|
| 1 | Rama por unidad de trabajo; nunca commitear en `main` ni en `sN/*` | ni idea | Tengo mis dudas de que tenga o no permisos o que sepa cuándo debe hacerlo, pero no lo tengo nada claro. |
| 2 | Commit por petición, con la skill `/commit` | sí | Supongo que al usar un skill es más probable que se ejecute. |
| 3 | Cambio en rutas/controladores/validadores/transformers → mismo commit con `.adonisjs/` (OpenAPI) y README de la capability | no | Creo que no es suficientemente claro para que sepa lo que quiere que se haga, o quizá el que no lo está entendiendo soy yo y por eso no lo veo. |
| 4 | Al terminar la unidad: `gh pr create` con descripción completa + `adversarial-reviewer`, una sola vez | ni idea | Es posible que lo haga, pero no tengo demasiadas garantías de que así sea. |
| 5 | Al abrir el PR, responder solo con la URL | sí | — |

## Tabla

Alcance: `git log -15` (de `b955a72` a `cdf903a`) y el árbol en `auditoria-inv`. Cada regla se juzga solo contra los commits posteriores a su entrada en CLAUDE.md (`git log -L '/## Reglas de proceso/,+8:CLAUDE.md'`): la 1, la 4 y la 5 entran en `0e56705`, la 3 en `160fbc7` y la 2 ya estaba en `8f871d3`.

| # | Qué pide | Qué se miró | Veredicto | Evidencia | Recomendación |
|---|---|---|---|---|---|
| 1 | Trabajar en una rama por unidad de trabajo y no commitear nunca directo en `main` ni en `sN/*` | `git branch -r --contains <hash>` y `git log -15 --format='%h %p'` (padres) para cada commit | no se cumple | `4e03d1f` y los 11 commits posteriores a `0e56705` solo están en ramas `sN/*` (`upstream/s4/end`, `s5/start`), con historia lineal, sin merges y sin PR asociado. Ningún hook la impone: `.claude/settings.json` solo tiene un `PostToolUse` sobre `Write\|Edit` | bajarla (a un hook `PreToolUse` que bloquee `git commit` cuando `git branch --show-current` sea `main` o `sN/*`) |
| 2 | Cerrar cada petición con un commit hecho mediante la skill `/commit` | `git log -15 --format='%h %s' \| grep -vE '^[0-9a-f]+ (feat\|fix\|refactor\|docs\|test\|chore)\([^)]+\): '` contra `.claude/skills/commit/SKILL.md` | no se puede comprobar con lo que hay | Git no guarda ni la skill usada ni a qué petición corresponde cada commit; solo se ve que `cdf903a` no sigue el formato `tipo(scope):` de la skill. Si `/commit` lo invoca el usuario, esa invocación ya garantiza que la skill se ejecuta, y la frase en CLAUDE.md no añade nada | borrarla |
| 3 | Si un cambio toca rutas, controladores, validadores o transformers, ese mismo commit trae el diff de `.adonisjs/` y el README de la capability | `git show --stat` de cada commit, filtrado por `routes\|controllers\|validators\|transformers\|\.adonisjs\|capabilities`, más el diff de `tasks_controller.ts` en `cbe9617` | no se puede comprobar con lo que hay | Hay un solo caso posterior a la regla, `cbe9617`. Trae el README (parte cumplida), pero solo añade imports y decoradores, así que cumplir u omitir el diff de `.adonisjs/` da el mismo commit; tampoco se ha regenerado para confirmar que no debía haber diff. `ea5db1f` sí tocaba rutas, pero es anterior a la regla | bajarla (a una comprobación que regenere `.adonisjs/` y falle si `git diff` no sale vacío, y que exija el README de la capability cuando haya staged rutas, controladores, validadores o transformers) |
| 4 | Abrir el PR con `gh pr create` una sola vez, al acabar la unidad y con descripción completa, y pasar después el `adversarial-reviewer` | `gh api repos/LIDR-academy-temp/flowsync-ai4devs-202610-ro/commits/<sha>/pulls` para cada commit posterior a `0e56705`, y `gh pr list -R … --state all` | no se cumple | Ningún commit posterior a `0e56705` tiene PR asociado (por ejemplo, `cbe9617`), aunque el repo sí tiene PRs. El pase del revisor tampoco deja rastro que se pueda comprobar. Ningún hook puede imponerla, porque nada marca el final de una unidad de trabajo | bajarla (sacarla de CLAUDE.md a una skill que el usuario invoca al cerrar la unidad: `gh pr create` con descripción y, después, `adversarial-reviewer`) |
| 5 | Al abrir el PR, responder en el chat solo con la URL | Ningún archivo ni comando puede responder esto: `git log` y `gh pr list` no guardan el chat | no se puede comprobar con lo que hay | Faltan los transcripts de las sesiones que abrieron PR, y además no hay ningún PR de estos commits. No se puede auditar, pero el usuario lo ve en su terminal cada vez que se abre un PR | bajarla (como último paso de la skill de cierre de la regla 4: responder solo con la URL del PR) |

## Comprobación manual (fila 3)

Revisada a mano con `git show --stat cbe9617` y `git show cbe9617 -- backend/app/controllers`: el commit trae `docs/capabilities/tasks/README.md`, no toca `.adonisjs/`, y en los controladores solo cambian imports y decoradores `@Api*` (la única línea borrada es un import que se amplía; ninguna línea nueva con lógica). Coincide con lo que dice el agente.

## Las tres líneas

1. **La regla sobre la que me equivoqué: la 2 (commit con `/commit`).** Aposté «sí» porque, al ser una skill, supuse que se ejecutaría. Salió «no se puede comprobar»: git no guarda qué skill hizo el commit, así que mi «sí» se apoyaba en una suposición, no en nada que hubiera visto.
2. **La regla que no se puede comprobar con lo que hay: la 5 (responder solo con la URL del PR).** Solo vive en el chat, que no queda en ninguna parte. Para que dejara rastro tendría que ir dentro de una skill de cierre que abra el PR y termine respondiendo con la URL.
3. **La regla que borraría: la 2.** Es de las que se cumplen solas porque la herramienta ya lo impone: si el que lanza `/commit` soy yo, la skill ya se ejecuta, y la frase en `CLAUDE.md` no añade nada.
