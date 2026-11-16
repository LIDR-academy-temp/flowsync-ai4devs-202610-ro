# Auditoría de las reglas de proceso

Reglas de la sección «Reglas de proceso» de `CLAUDE.md`, contrastadas el 2026-11-15 contra `git log -n 15` (de `b955a72` a `cdf903a`, rama `auditoria-rt`) y el árbol de trabajo (`git status`: solo `backend/package-lock.json` y `frontend/package-lock.json` modificados, sin staged). Donde la ventana de 15 commits no basta, se ha usado `git reflog` y `gh pr list`, y se dice en la evidencia.

Criterio: un veredicto solo es `se cumple` o `no se cumple` si el rastro está dentro de esa ventana o del árbol de trabajo; lo que solo se ve fuera de ella (reflog local, otras ramas, PR) se cita como pista en la evidencia, pero el veredicto es `no se puede comprobar con lo que hay`. La tabla lleva una sexta columna, `#`, añadida para numerar las reglas.

Numeración: el primer número es la viñeta original de `CLAUDE.md` y el segundo, la regla concreta dentro de ella.

| Viñeta | Contenido de la viñeta original |
|---|---|
| 1 | La rama es por unidad de trabajo, no por petición (mirar la rama, seguir en una de trabajo, crear solo desde `main` o `sN/*`, nunca commitear en ellas). |
| 2 | El commit es por petición, con la skill `/commit`. |
| 3 | Un cambio en una capability se cierra con el OpenAPI y su README al día. |
| 4 | `gh pr create` y el `adversarial-reviewer`, una sola vez al terminar la unidad. |
| 5 | Al abrir el PR, responder solo con la URL. |

| # | Qué pide la regla | Qué se miró para comprobarlo | Veredicto | La evidencia | Qué harías con ella |
|---|---|---|---|---|---|
| 1.1 | Antes de tocar código, mirar en qué rama se está. | `git reflog`, `git log -n 15` | no se puede comprobar con lo que hay | Mirar la rama es una acción que no deja rastro en git; falta un log de comandos de la sesión o un hook que lo registre. | bajarla |
| 1.2 | Si ya se está en una rama de trabajo (ni `main` ni `sN/*`), seguir en ella. | `git branch --show-current`, `git branch -a`, `git status` | se cumple | Rama actual `auditoria-rt`; el reflog muestra una rama por unidad (`spect-viva-rt`, `trazabilidad-rt`, `auditoria-rt`) sin ramas extra por petición. | dejarla |
| 1.3 | Solo desde `main` o `sN/*` se crea una rama nueva, con `git checkout -b feat/<slug>`. | `git reflog` | se cumple | Ramas creadas desde `sN/*`: `s5/start` a `auditoria-rt`, `s4/start` a `trazabilidad-rt`, `s3/start` a `spect-viva-rt`; los nombres no usan el prefijo `feat/`, que la regla solo da como ejemplo. | dejarla |
| 1.4 | Nunca commitear directo en `main` ni en una `sN/*`. | `git reflog`, `git branch -a --contains <hash>` | no se puede comprobar con lo que hay | Dentro de los 15 commits no hay rastro de la rama de cada uno; el reflog local solo muestra `45458b6` y `2a28f82` en `s1/start`, fuera de la ventana y anteriores a la regla (`2a28f82` la introduce), y un reflog local caduca. | bajarla |
| 1.5 | La rama es por unidad de trabajo, no por petición. | `git branch -a`, `gh pr list --author @me --state all` | no se puede comprobar con lo que hay | Hay una rama por unidad (`spect-viva-rt`, `trazabilidad-rt`, `auditoria-rt`), pero falta una definición escrita de «unidad de trabajo» y un registro de peticiones para contrastarla. | dejarla |
| 2.1 | Cerrar cada petición con un commit hecho con la skill `/commit`. | `git log -n 15 --format=%s`, `.claude/skills/commit/SKILL.md`, `git reflog` | no se puede comprobar con lo que hay | Los 15 asuntos siguen `tipo(scope): descripción`, pero falta el registro de peticiones y de uso de la skill; fuera de la ventana hay asuntos no convencionales (`b1c3611` «Tarea 3», `09f9629` «Cierra tarea 1», `0ab8d24` «Add priority-ticket»). | dejarla |
| 3.1 | Un cambio en rutas, controladores, validadores o transformers de una capability se cierra en el mismo commit con el OpenAPI y su README al día. | `git log -n 15 --name-only`, `git show 160fbc7 -- CLAUDE.md` | no se puede comprobar con lo que hay | `cbe9617` toca controladores, `config/openapi.ts` y el README de tasks, pero no `.adonisjs/`, que es lo que `CLAUDE.md` manda commitear como documento OpenAPI; falta regenerar y comparar para saber si el README y el documento están al día. | bajarla |
| 3.2 | Commitear el diff regenerado de `.adonisjs/` junto a ese cambio. | `git show --stat cbe9617`, `git log -n 15 --name-only` | no se puede comprobar con lo que hay | `cbe9617` no toca `.adonisjs/`; falta regenerar los tipos en un worktree limpio y comparar (`git diff --exit-code`), que aquí escribiría ficheros. | bajarla |
| 3.3 | El README de la capability vive en `docs/capabilities/<nombre>/README.md`. | `ls docs/capabilities`, `git log -n 15 --name-only` | se cumple | Existe `docs/capabilities/tasks/README.md` (`7662fb1`, actualizado en `cbe9617`); la capability `auth` no tiene README, pero ningún commit de la ventana la toca. | dejarla |
| 4.1 | Hacer `gh pr create` con descripción completa una sola vez, al terminar la unidad. | `gh pr list --author @me --state all`, `gh pr list --head feat/frontend-login --state all`, `gh pr view 47 71` | no se puede comprobar con lo que hay | Ningún commit de la ventana tiene PR identificable y falta saber si la unidad está cerrada; fuera de ella, `feat/frontend-login` (`09f9629`) no tiene PR en `gh pr list`, y los PR #47 y #71 de este repo sí son uno por unidad. | dejarla |
| 4.2 | Pasar el subagente `adversarial-reviewer` sobre ese PR, una sola vez al terminar la unidad. | `gh pr view 47 71 --json reviews,comments`, `git log -n 15` | no se puede comprobar con lo que hay | Cada PR tiene 1 review sin autor identificable como el subagente y 0 comentarios; falta el transcript de la sesión o un log del subagente. | dejarla |
| 4.3 | El review adversarial es lo último antes de dar la unidad por terminada. | `gh pr view 47 71 --json commits,reviews`, `git log -n 15` | no se puede comprobar con lo que hay | Sin fecha ni autor fiables del review no se puede ordenar frente al último commit; falta el log del subagente. | dejarla |
| 5.1 | Al abrir el PR, no repetir el resumen en el chat y responder solo con la URL. | (ninguno posible) | no se puede comprobar con lo que hay | Es una regla sobre la conversación y la sesión se pierde; falta el transcript del chat. | dejarla |
