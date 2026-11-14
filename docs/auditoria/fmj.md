# Auditoría de las reglas de proceso — fmj

Reglas de `CLAUDE.md` («Reglas de proceso») contrastadas contra los últimos 15 commits de
`s5/start` (`b955a72..cdf903a`, 2026-08-20 → 2026-09-23) y el estado actual del árbol.
Sin modificar ningún archivo del repo salvo este y `prompts.md`.

Contexto que condiciona varias filas: las reglas 2, 9 y 10 en su forma actual entran en
`0e56705`, y las 7 y 8 en `160fbc7`; los commits anteriores se juzgaron contra lo que existía.

## Parte A: la tabla

| # | Qué pide la regla | Qué se miró | Veredicto | Evidencia | Qué haría |
|---|---|---|---|---|---|
| 1 | Mirar la rama antes de tocar código | `git log`, `git reflog` | no se puede comprobar | Mirar no deja rastro; solo quedaría en el transcript de la sesión | bajarla (hook que avise si estás en `main`/`sN/*`) |
| 2 | Si ya estás en una rama de trabajo, seguir en ella | `git branch -a --contains <sha>` | no se puede comprobar | Ninguno de los 15 commits vive en una rama de trabajo: no hay caso donde aplicarla | dejarla |
| 3 | Desde `main`/`sN/*`, crear `feat/<slug>` | `git branch -a --contains <sha>` para los 15 | no se cumple | Los 15 solo están en `s4/end`, `s5/start` (y `s4/start`, `trazabilidad-fmj` para `b955a72`); ninguna `feat/*` los contiene | bajarla |
| 4 | Nunca commitear directo en `main` ni en `sN/*` | `git log -15 --format='%p'` (sin merges), `git branch -a --contains <sha>`, `gh api …/commits/<sha>/pulls` | no se puede comprobar | Historia lineal, sin rama `feat/*` ni PR que contenga los commits, pero un PR con squash/rebase o un fast-forward desde una rama borrada deja el mismo rastro; además son commits del docente en ramas de plantilla | bajarla (branch protection que obligue a PR) |
| 5 | Un commit por petición | `git log -15` | no se puede comprobar | Las peticiones no quedan en el repo; no hay forma de emparejar commit ↔ petición | borrarla |
| 6 | Commitear con la skill `/commit` | `.claude/skills/commit/SKILL.md` vs. mensajes de `git log -15` | no se cumple | La skill exige `tipo(scope): descripción`; `cdf903a` es `docs: …` sin scope. En los otros 14 el formato encaja, pero eso no prueba que se usara la skill | bajarla (commit-msg hook que valide el formato) |
| 7 | Si se tocan rutas/controladores/validadores/transformers, el OpenAPI (diff de `.adonisjs/`) en el mismo commit | `git show --stat` de los commits que tocan `backend/app/` o `start/routes.ts` | no se puede comprobar | Único caso tras `160fbc7`: `cbe9617` toca 3 controladores y no trae diff de `.adonisjs/`; saber si debía traerlo exige regenerar los tipos, que no se hizo para no modificar archivos | bajarla (CI que regenere y falle si hay diff) |
| 8 | Si se tocan esas piezas, el README de la capability en el mismo commit | `git show --stat cbe9617` | se cumple (1 caso) | `cbe9617` incluye `docs/capabilities/tasks/README.md` | dejarla |
| 9 | `gh pr create` una vez al terminar la unidad, con descripción completa | `gh pr list -R LIDR-academy-temp/… --state all --limit 200`; `gh api …/commits/<sha>/pulls` | no se cumple | 79 PRs, todos de alumnos; `gh api …/commits/4e03d1f/pulls` y `…/cbe9617/pulls` devuelven vacío | dejarla |
| 10 | Pasar `adversarial-reviewer` sobre el PR, lo último | `.claude/agents/adversarial-reviewer.md`, PRs del punto 9 | no se puede comprobar | El agente es read-only y no deja salida en el repo; además no hay PR sobre el que pasarlo | bajarla (job de CI que lo lance sobre el PR) |
| 11 | Al abrir el PR, responder solo con la URL | — | no se puede comprobar | Vive en el chat de la sesión, que no se conserva | borrarla |

### Apuesta vs. veredicto

| # | Apuesta | Veredicto |
|---|---|---|
| 1 | no | no se puede comprobar |
| 2 | sí | no se puede comprobar |
| 3 | no | no se cumple |
| 4 | sí | **no se puede comprobar** |
| 5 | no | no se puede comprobar |
| 6 | sí | **no se cumple** |
| 7 | ni idea | no se puede comprobar |
| 8 | ni idea | se cumple (1 caso) |
| 9 | no | no se cumple |
| 10 | sí | no se puede comprobar |
| 11 | no | no se puede comprobar |

## Parte B: las tres líneas

1. **La regla sobre la que me equivoqué:** la regla 4, pensaba sinceramente que si se cumplia y que había mecanismos para evitarlo
2. **La regla que no se puede comprobar con lo que hay, y qué tendría que cambiar:** la regla 6 con un hook para forzar pero no estoy seguro de si puede forzar la utilización de la skill o habría que indicarlo en un archivo para su posterior revisión
3. **La regla que borraría, y por qué:** La regla 5 no le veo ninguna utilidad, porque sería necesario hacer un unico comit si pude hacer en varios sin afectar al funcionamiento. Pertenece al grupo de las que no se cumplen nunca.
