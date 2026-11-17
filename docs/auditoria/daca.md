# Auditoría de las reglas de proceso — daca

- **Objeto:** apartado «Reglas de proceso» de `CLAUDE.md`.
- **Muestra:** los últimos 15 commits de `s5/start` (`git log -15`), de `b955a72` a `cdf903a`.
- **Fecha:** 2026-11-16. Rama de la auditoría: `auditoria-daca`.
- **Alcance:** solo lectura. No se ha tocado código, configuración ni historia.

Dos reglas entraron en `CLAUDE.md` en mitad de la muestra, así que solo se juzgan los commits posteriores a ellas:

- `0e56705` (2026-08-20 16:45) introdujo la rama por unidad de trabajo y el PR único con review adversarial. Aplica de `4e03d1f` en adelante.
- `160fbc7` (2026-08-20 17:07) introdujo «contrato y README en el mismo commit». Aplica de `7662fb1` en adelante.

| Qué pide la regla | Qué se miró | Veredicto | Evidencia | Qué haría con ella |
|---|---|---|---|---|
| Comprobar en qué rama se está antes de tocar código. | `git reflog`; mensajes de los 15 commits (`git log -15 --format='%h %s%n%b'`) | No se puede comprobar | Es un gesto previo que no deja rastro: git no registra qué rama se consultó y el reflog de los autores no está en el repo. | Borrarla |
| Cada unidad de trabajo va en su propia rama `feat/<slug>`, creada desde `main` o desde una `sN/*`. | `git branch -a`; `git branch -a --contains <sha>` sobre `4427afc`, `4e03d1f`, `cbe9617` y `cdf903a` | No se cumple | No existe ninguna `feat/*` ni en `origin` ni en `upstream`. Los commits de `4e03d1f` a `cdf903a` solo están en `s4/end` y `s5/start`. | Bajarla |
| Nunca commitear directo en `main` ni en una `sN/*`. | `git log --merges -15`; `git log -15 --format='%h %P'` (un solo padre por commit) | No se cumple | La historia es lineal y sin merges dentro de `upstream/s4/end` → `s5/start`. Los 12 commits posteriores a `0e56705` (de `4e03d1f` a `cdf903a`) cayeron directamente en la rama de sesión. | Bajarla |
| Hacer un commit al cerrar cada petición. | `git log -15`; búsqueda de algún registro de peticiones o prompts en el repo | No se puede comprobar | Ningún fichero vincula peticiones con commits, así que no hay forma de saber cuántas peticiones hubo entre un commit y otro. | Bajarla |
| Los commits se hacen con la skill `/commit` (formato `tipo(scope): descripción`). | `.claude/skills/commit/SKILL.md`; `git log -15 --format='%h %s'` | No se cumple | `cdf903a` (`docs: las instrucciones…`) no lleva scope ni trailer `Co-Authored-By: Claude`. `afc4b74` y `b955a72` tampoco llevan el trailer. | Bajarla |
| Un cambio en rutas, controladores, validadores o transformers de una capability se commitea junto al diff de `.adonisjs/` y al README de esa capability. | `git show --stat` de cada commit; `npm test` en `backend/` (codegen: «created 5 file(s)») seguido de `git status --short` | Se cumple | `cbe9617` toca tres controladores de tasks junto a `docs/capabilities/tasks/README.md`. El codegen de hoy no deja diff en `.adonisjs/`, así que no faltaba nada por commitear. `4e03d1f` (transformer sin README) es anterior a la regla. | Dejarla |
| Abrir un PR, con descripción completa, una sola vez al terminar la unidad de trabajo. | `gh api repos/LIDR-academy-temp/flowsync-ai4devs-202610-ro/commits/<sha>/pulls` sobre `4427afc`, `4e03d1f`, `ea5db1f`, `cbe9617` y `cdf903a`; `gh pr list --state all` | No se cumple | Ninguno de esos commits tiene un PR asociado. Los PR abiertos del repo son de alumnos y no contienen ningún commit de la muestra. | Bajarla |
| El subagente `adversarial-reviewer` revisa ese PR, como último paso antes de cerrar la unidad. | `.claude/agents/adversarial-reviewer.md` (Tools: Read, Grep, Glob); comentarios de PR vía `gh` | No se puede comprobar | El agente es solo lectura y no escribe nada. Sin PR no hay hilo donde buscar su salida. Haría falta que el review dejara un comentario en el PR o un fichero versionado. | Bajarla |
| Al abrir el PR, contestar en el chat solo con su URL. | Repo completo y historia de git | No se puede comprobar | El chat de la sesión no se versiona, así que la regla no deja rastro en ninguna parte. | Borrarla |

## Cómo se bajarían a algo que se ejecute solo

- **Rama y commits directos:** un hook `PreToolUse` sobre `Bash(git commit*)` que aborte si la rama es `main` o `s*/*`, y protección de rama en GitHub para `main` y `s*/*`. Con eso sobra «comprobar la rama antes de tocar código».
- **Formato de commit:** un hook `commit-msg` (commitlint o una regex) que exija `tipo(scope): descripción`.
- **Commit por petición:** un hook `Stop` que avise si hay cambios sin commitear al terminar el turno.
- **PR único:** la propia protección de rama en `sN/*` obliga a pasar por PR.
- **Review adversarial:** ejecutarlo en una GitHub Action sobre el PR, que publique sus hallazgos como comentario y deje así una evidencia comprobable.

### Parte B: las tres líneas

La regla sobre la que te equivocaste:

A primera vista la que pense que se cumpliria era la primera, la de comprobar la rama antes de tocar código. Pero al mirar el reflog y los commits, me di cuenta de que no hay forma de saber si alguien miró la rama antes de hacer un commit. No hay evidencia en git de ese gesto previo.

La regla que no se puede comprobar con lo que hay:

Para cada registro o proceso de la IA deberiamos especificar que deje un rastro en el repo, ya sea un commit, un fichero o un comentario en el PR. Sin eso, no hay forma de comprobar si se cumplió la regla.

La regla que borrarías, y por qué:

Eliminaría la regla de comprobar la rama antes de tocar código, porque no deja evidencia y no se puede verificar. Además, con la protección de ramas y los hooks sugeridos, se puede garantizar que no se comitea directamente en `main` o `sN/*`, haciendo innecesaria la verificación manual.