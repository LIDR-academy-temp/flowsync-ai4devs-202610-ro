# Auditoría de reglas de proceso — grr

Ventana: últimos 15 commits de `s5/start` (`git log -15`) + estado del árbol.

## Mi apuesta (escrita antes de comprobar nada)

| # | Regla | Mi apuesta |
|---|---|---|
| 1 | Antes de tocar código se mira la rama; si es de trabajo se sigue en ella | si |
| 2 | Las ramas nuevas se crean solo desde `main` o `sN/*`, con nombre `feat/<slug>` | si |
| 3 | Nunca se commitea directo en `main` ni en una `sN/*` | no |
| 4 | Cada petición se cierra con un commit hecho con la skill `/commit` | no |
| 5 | Un cambio en rutas/controladores/validadores/transformers lleva en el mismo commit el diff de `.adonisjs/` y el README de la capability | ni idea |
| 6 | `gh pr create` con descripción completa, una sola vez, al terminar la unidad | no |
| 7 | El `adversarial-reviewer` pasa una sola vez sobre el PR, y es lo último | si |
| 8 | Al abrir el PR el agente responde solo con la URL | si |

## Tabla

| # | Qué pide la regla | Qué se miró | Veredicto | Evidencia | Qué haría |
|---|---|---|---|---|---|
| 1 | Una rama por unidad de trabajo: si ya estás en una de trabajo, sigues en ella | `git log -15 --graph --oneline --decorate --all`; `git cat-file -t 5cb8726` | no se puede comprobar con lo que hay | historial reescrito (4e03d1f cita 5cb8726, que no existe); faltaría la rama original donde se hicieron | dejarla |
| 2 | Antes de tocar código, mirar en qué rama estás | nada que mirar: no deja rastro | no se puede comprobar con lo que hay | faltaría un log de sesión con `git branch` antes de cada edición | bajarla |
| 3 | Las ramas nuevas salen solo de `main` o de una `sN/*` | `git merge-base <rama>-grr sN/start` | se cumple | las 4 `*-grr` tienen merge-base = punta de su `sN/start` (p. ej. auditoria-grr → cdf903a) | dejarla |
| 4 | La rama nueva se llama `feat/<slug>` | `git branch -a`; `git show HEAD:README.md` | no se cumple | rama `auditoria-grr`: el README del curso (línea 109) manda `auditoria-<iniciales>`, no `feat/*` | borrarla |
| 5 | Nunca commitear directo en `main` ni en una `sN/*` | `git log -15 --merges`; `git log -16 --format='%h %cd'` | no se puede comprobar con lo que hay | lineales y sin merges, pero trasplantados (b955a72, padre, committer 08-28 > 4427afc, hijo, 08-20); faltaría la rama original | bajarla |
| 6 | Un commit por petición | `git log -15 --stat` | no se puede comprobar con lo que hay | faltaría el registro petición → commit (transcript o prompts.md con hash) | dejarla |
| 7 | El commit se hace con la skill `/commit` | `.claude/skills/commit/SKILL.md`; `git log -15` | no se puede comprobar con lo que hay | la skill no deja marca en el mensaje; faltaría un trailer o hook que la identifique | bajarla |
| 8 | Si se tocan rutas/controladores/validadores/transformers, el OpenAPI (diff de `.adonisjs/`) va en el mismo commit | `git show --stat cbe9617`; `git log -1 -- backend/.adonisjs` | no se puede comprobar con lo que hay | cbe9617 toca controladores sin diff de `.adonisjs/`; faltaría un check que regenere y falle si hay diff | bajarla |
| 9 | Si se tocan esos ficheros, el README de la capability va en el mismo commit | `git show --stat cbe9617 4e03d1f 160fbc7` | se cumple | cbe9617 (único posterior a 160fbc7, la regla, que toca controladores) incluye `docs/capabilities/tasks/README.md` | dejarla |
| 10 | `gh pr create` una sola vez, al terminar la unidad | `gh pr list --state all` (origin y upstream) | no se puede comprobar con lo que hay | ningún PR en estos repos, pero los commits vienen de otro (merge 9987cf0 de `mentors-local`); faltaría el PR del repo de origen | bajarla |
| 11 | El cuerpo del PR describe los cambios de forma completa | `gh pr view 57 --json body` | no se puede comprobar con lo que hay | "completa" no tiene criterio; faltaría una plantilla de PR con secciones obligatorias | bajarla |
| 12 | El `adversarial-reviewer` pasa una sola vez sobre el PR | `gh pr view 49/57 --json comments,reviews`; `.claude/agents/adversarial-reviewer.md` | no se puede comprobar con lo que hay | los reviews de 49/57 son de LIDR-AI4Devs; el subagente es read-only y no publica; faltaría su salida en el PR | bajarla |
| 13 | El review adversarial es lo último antes de cerrar la unidad | ídem fila 12 | no se puede comprobar con lo que hay | faltaría la marca temporal del review para compararla con el último commit | bajarla |
| 14 | Al abrir el PR, responder en el chat solo con la URL | nada que mirar: el chat no se conserva | no se puede comprobar con lo que hay | faltaría el transcript de la sesión | dejarla |

**Fila verificada por mí:** fila 4 — `git branch -a` → no hay ninguna rama que inicie con el prefijo "feat/". Coincide con lo que el agente encontró.

## Tres líneas

**La regla sobre la que me equivoqué:** la 2 de mi apuesta, «las ramas nuevas se crean solo desde `main` o `sN/*`, con nombre `feat/<slug>`». Aposté «sí» y la mitad del nombre es el único «no se cumple» de la tabla (fila 4): ninguna rama es `feat/*`, empezando por la mía, `auditoria-grr`. La otra mitad, el origen (fila 3), sí coincidió con la apuesta.

**La regla que no se puede comprobar:** el pase del `adversarial-reviewer` sobre el PR (filas 12 y 13). Dejaría rastro si el subagente, o una action de CI, publicara su veredicto como comentario o review en el PR: así se vería que pasó, cuántas veces y si fue después del último commit.

**La regla que borraría:** la de nombrar la rama `feat/<slug>`. Es del grupo de las que no se cumplen nunca sin que a nadie le importe: el README del curso (línea 109) manda `auditoria-<iniciales>`, todas mis ramas de trabajo siguen esa convención y en upstream no hay ni una rama `feat/*`.