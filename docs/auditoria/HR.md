# Auditoría de las reglas de proceso

- **Fecha:** 2026-11-15
- **Rama auditada:** `auditoria-hr` (mismo historial que `s5/start`)
- **Alcance:** los últimos 15 commits, de `b955a72` a `cdf903a` (`git log -15`).
- **Reglas:** la sección «Reglas de proceso» de `CLAUDE.md`. Las reglas actuales entraron en `0e56705` (rama, commit, PR y review) y en `160fbc7` (contrato de la capability). Cada regla se contrasta solo con los commits que vienen después del que la introdujo.
- **Repos consultados:** `origin` = `humbertoenGit/flowsync-ai4devs-202610-ro`; `gh` resuelve a `LIDR-academy-temp/flowsync-ai4devs-202610-ro` (`upstream`).

| # | Qué pide la regla | Qué se miró para comprobarlo | Veredicto | La evidencia | Qué harías con ella |
|---|---|---|---|---|---|
| 1 | Si ya estás en una rama de trabajo (cualquiera que no sea `main` ni una `sN/*`), sigues en ella; solo se crea una rama nueva (`feat/<slug>`) cuando estás en `main` o en una `sN/*`. | `git log -15 --format="%h\|%p\|%s"`, `git branch -a --contains <sha>` para cada commit y `git log -15 --merges` | no se puede comprobar con lo que hay | El historial es lineal y sin merges, así que no se sabe en qué rama estaba cada commit al hacerse, ni por tanto si se creó una rama nueva estando ya en una de trabajo. Faltan merge commits o PRs que dejen constancia de la rama de origen. | bajarla |
| 2 | Nunca se commitea directamente en `main` ni en una `sN/*`. | `git branch -a --contains <sha>` (los 13 commits desde `0e56705` solo están en `s4/end`/`s5/start` y en las ramas `auditoria-hr` creadas después) y `gh pr list --state merged` (`[]`) | no se puede comprobar con lo que hay | Los 13 commits llegaron a `sN/*` sin ningún merge ni PR, pero eso no distingue un commit directo de un fast-forward desde otra rama. Falta protección de rama en el remoto, o bien el reflog del autor. | bajarla |
| 3 | Se hace un commit por cada petición y se crea con la skill `/commit`. | `.claude/skills/commit/SKILL.md` (pide el formato `tipo(scope): descripción`) y los asuntos de `git log -15 --format=%s` | no se puede comprobar con lo que hay | Las peticiones no quedan registradas en ningún sitio y la skill no deja marca en el commit. Lo único observable es el formato, y `cdf903a` (`docs: …`, sin scope) ni siquiera lo sigue. | bajarla |
| 4 | Un cambio en rutas, controladores, validadores o transformers de una capability actualiza en ese mismo commit su documento OpenAPI, su `docs/capabilities/<nombre>/README.md` y el diff regenerado de `.adonisjs/`. | `git show --stat` de los commits posteriores a `160fbc7` que tocan `backend/app/controllers`, `validators`, `transformers` o `start/routes.ts` (solo `cbe9617`), y `git diff --stat` del árbol de trabajo | se cumple | `cbe9617` toca los tres controladores de tasks y en el mismo commit añade los decoradores OpenAPI y actualiza `docs/capabilities/tasks/README.md`. Al regenerar, `.adonisjs/` queda sin diff de contenido (solo cambian los finales de línea), así que no faltaba nada por commitear. | dejarla |
| 5 | Al terminar la unidad de trabajo se abre un solo PR con `gh pr create` y una descripción completa. | `gh pr list --state all`, `gh pr list --state merged` y `gh pr list --search <sha>` para `0e56705`, `4e03d1f`, `8f9e715`, `160fbc7` y `cbe9617` | no se puede comprobar con lo que hay | Ningún PR contiene estos commits: hay 0 PRs mergeados, y las dos coincidencias de `cbe9617` (#80 y #85) son PRs de alumnos que solo lo citan. El trabajo se hizo en otro repo (ver el merge `9987cf0` de `mentors-local/main`), y aquí falta el PR que lo trajo. | bajarla |
| 6 | El subagente `adversarial-reviewer` revisa ese PR, y esa revisión es lo último antes de dar la unidad por terminada. | `.claude/agents/adversarial-reviewer.md` (solo lectura: no puede escribir ni comentar) y el campo `comments` de `gh pr list --json comments` (vacío en todos) | no se puede comprobar con lo que hay | La revisión solo vive en la sesión de chat: no queda ningún comentario, check ni fichero que demuestre que se ejecutó, ni en qué orden. | bajarla |
| 7 | Al abrir el PR, la respuesta en el chat es solo la URL del PR, sin repetir el resumen. | Se buscó en el repo algún registro de sesiones o transcripciones (en `.claude/` solo están `settings.json`, `skills/` y `agents/`) | no se puede comprobar con lo que hay | La regla trata de la salida del chat, que por diseño se pierde, así que no deja rastro en git ni en GitHub. | borrarla |

## Notas

- La regla sobre la que te equivocaste. Los commits `b955a72` y `4427afc` son anteriores a `0e56705`, que es el que introdujo las reglas actuales de rama, PR y review, así que esas reglas no se les aplican. Por la misma razón, `4e03d1f` (que toca `task_transformer.ts`) y `ea5db1f` (que toca `start/routes.ts`) no cuentan para la regla 4, que entró después en `160fbc7`. Aun así, `ea5db1f` ya commiteó su diff de `.adonisjs/`.
- **Qué significa «bajarla»:**
  - Regla 2: proteger `main` y `sN/*` en el remoto, o añadir un hook `pre-commit` que se niegue a commitear en esas ramas.
  - Regla 1: ese mismo hook obliga a crear una rama cuando estás en `main` o en una `sN/*`. La otra mitad, seguir en la rama de trabajo en vez de abrir otra, no se puede automatizar del todo; como mucho, un hook que avise si se crea una `feat/*` partiendo de otra rama de trabajo.
  - Regla 3: añadir un hook `commit-msg` que valide el formato convencional. La parte de «un commit por petición» no se puede automatizar.
  - Reglas 5 y 6: un check de CI sobre el PR, o hacer que la revisión adversarial quede publicada en él.
- **Regla 7:** se propone borrarla porque nunca va a ser auditable. Su intención, que la descripción completa viva en el PR, ya la cubre la regla 5.

## Las Tres Lineas
1. **La regla sobre la que te equivocaste:** Me quivoque en todas menos en la regla de gh pr create y el pase del subagente adversarial-reviewer sobre ese PR, que el modelo dividio en 5 y 6 en la tabla de arriba. Aposte a que no se puede determinar si se hizo o no porque no hay registro de que se tomaron esas acciones.

2. **La regla que no se puede comprobar con lo que hay.** El agente adversarial-reviewer tendria que dejar rastro de que se ejecuto, tal vez en un fichero de auditoria associando el PR con la ejecucion.

3. **La regla que borrarías, y por qué.** La regla de Cuando abras el PR... Porque ya esta especificado en la regla 6 en la tabla de arriba, solo hay que poder enforzarla.