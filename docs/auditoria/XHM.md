# Auditoría de las reglas de proceso de `CLAUDE.md`

- **Fecha:** 2026-11-15
- **Alcance:** la sección «Reglas de proceso» de `CLAUDE.md`, contrastada con los últimos 15 commits (`b955a72..cdf903a`, todos en `s5/start`) y con el estado actual del árbol.
- **Rama auditada:** `auditoria-XHM`, que apunta a `cdf903a`, el mismo commit que `s5/start`. El árbol está limpio, salvo `docs/auditoria/` (sin seguimiento).
- **Naturaleza:** es solo una auditoría. Aparte de este fichero, no se ha modificado nada.

## Cómo se han partido las reglas

`CLAUDE.md` agrupa las reglas en 5 viñetas, pero dos de ellas no se pueden explicar en menos de tres frases, así que llevan más de una regla dentro:

| Viñeta de `CLAUDE.md` | Reglas que contiene |
| --- | --- |
| «La rama es por unidad de trabajo…» | 1.1 una rama por unidad · 1.2 dónde y cómo se crea una rama · 1.3 nunca commitear en `main`/`sN/*` |
| «El commit sí es por petición…» | 2 |
| «Un cambio que toque rutas…» | 3 |
| «`gh pr create`… y el pase del `adversarial-reviewer`…» | 4.1 un PR al final de la unidad · 4.2 review adversarial como último paso |
| «Cuando abras el PR…» | 5 |

## Resultado

| # | Qué pide la regla | Qué se miró para comprobarlo | Veredicto | Evidencia | Qué haría con ella |
| --- | --- | --- | --- | --- | --- |
| 1.1 | Si ya estás en una rama de trabajo, sigue en ella: la rama es de la unidad de trabajo, no de cada petición. | `git branch -a -vv`, `git log -15 --graph --format='%h %p %D %s'` | No se puede comprobar con lo que hay | Git no registra qué commits forman una unidad de trabajo. Haría falta un identificador de unidad (ticket o PR) en cada rama y commit para ver si una unidad se repartió en varias ramas, como podría ser el caso de `harness-XHM` y `harness-XHM-setup`. | Dejarla: decidir dónde acaba una unidad requiere criterio y no se puede automatizar. |
| 1.2 | Las ramas nuevas solo se crean desde `main` o desde una `sN/*`, con el nombre `feat/<slug>`. | `git status --short --branch`, `git branch -a -vv`, `git merge-base auditoria-XHM s5/start` | No se cumple | La rama actual, `auditoria-XHM`, parte bien de `s5/start`, pero no sigue el patrón `feat/<slug>`. Lo mismo pasa con `alcance-XHM`, `harness-XHM`, `spec-viva-XHM` y `trazabilidad-XHM`; solo `feat/FLOW-1-login-frontend` lo sigue. | Bajarla: un hook `pre-push` que valide el nombre de la rama, con el patrón que realmente se usa (`<ejercicio>-<iniciales>` o `feat/<slug>`). |
| 1.3 | No se commitea nunca directamente en `main` ni en una `sN/*`. | `git log -15 --graph --format='%h %p %D %s'`, `git branch -a --contains <sha>` (para `4427afc`, `0e56705`, `4e03d1f`, `ea5db1f`, `cbe9617` y `cdf903a`), `git log -15 --merges` | No se cumple | Los 15 commits forman una línea recta, sin merges, que solo contienen `s5/start`/`upstream/s4/end` (más `auditoria-XHM`, creada hoy desde allí). Ni `0e56705`, que introduce la regla, ni los posteriores pasaron por una rama de trabajo. | Bajarla: protección de rama en GitHub para `main` y `s*/*` (sin push directo) y un hook `pre-commit` que rechace commits en esas ramas. |
| 2 | Cada petición se cierra con un commit hecho con la skill `/commit`. | `.claude/skills/commit/SKILL.md`, `git log -15 --format='%h %s %(trailers:key=Co-Authored-By)'` | No se puede comprobar con lo que hay | Git no registra qué herramienta hizo el commit ni dónde empieza y acaba cada petición. Harían falta los transcripts de sesión o una marca que dejara la skill (por ejemplo, un trailer `Via: /commit`). Indicio en contra: `cdf903a` (`docs: …`) no lleva el `(scope)` que exige la skill. | Bajarla: un hook `commit-msg` (commitlint) que valide `tipo(scope): descripción`. |
| 3 | Un cambio en rutas, controladores, validadores o transformers de una capability lleva en el mismo commit el OpenAPI (el diff de `.adonisjs/`) y el README de la capability al día. | `git log -15 --name-only`, `git log -1 -- backend/.adonisjs`, `grep -ri openapi backend/.adonisjs` | Se cumple | La regla entra en `160fbc7`. Después, el único commit que toca una capability es `cbe9617`, y actualiza en ese mismo commit las anotaciones OpenAPI y `docs/capabilities/tasks/README.md`. No hace falta diff de `.adonisjs/`: los decoradores no cambian el código generado. | Bajarla: un check de CI que, si el diff toca `backend/start/routes.ts` o `backend/app/{controllers,validators,transformers}/`, exija el README de la capability y regenere `.adonisjs/` con `git diff --exit-code`. |
| 4.1 | Al terminar la unidad de trabajo se abre un solo PR con `gh pr create` y una descripción completa de los cambios. | `gh pr list --state merged --limit 50`, `gh pr list --state all --search <sha>` para los commits de la línea `4427afc..cbe9617` | No se cumple | `gh pr list --state merged` está vacío y ninguno de los 15 commits llegó a `s5/start` a través de un PR. Unidades cerradas como el fix de `4e03d1f` o el contrato OpenAPI de `cbe9617` se integraron sin PR. | Bajarla: hacer obligatorio el PR con la protección de rama de GitHub en `s*/*` y `main`. |
| 4.2 | El subagente `adversarial-reviewer` revisa ese PR, y es lo último que se hace antes de dar la unidad por terminada. | `.claude/agents/adversarial-reviewer.md`, `gh pr list --state all --search <sha>` | No se cumple | Si no hay PR, no puede haber review sobre él. Además, el agente solo devuelve sus hallazgos al chat, así que de su ejecución no queda nada en git ni en GitHub. | Bajarla: ejecutar el reviewer como GitHub Action al abrir el PR y publicar sus hallazgos como comentario. |
| 5 | Al abrir el PR, en el chat solo se responde con su URL, sin repetir el resumen. | `gh pr list`, historial de git | No se puede comprobar con lo que hay | Es una regla sobre lo que se dice en el chat, y ni git ni GitHub guardan esas respuestas. Harían falta los transcripts de las sesiones en las que se abrió cada PR. | Dejarla: es barata, solo afecta a la conversación y no hay nada que automatizar. |

## Notas

- **Autoría de los commits auditados.** Los 15 commits son del equipo del curso (`Earvin Saúl Pérez Ramos`, `LIDR Academy`, `LIDR-AI4Devs`) y llegaron a la rama de partida desde `upstream`. Las reglas 1.3, 4.1 y 4.2 se rompen en el historial de la rama de partida, no en trabajo del alumno. Aun así, están escritas sin excepciones.
- **Orden temporal.** Las reglas 1.x y 4.x entran en `0e56705` y la regla 3 en `160fbc7`. Solo se han evaluado contra los commits posteriores a su introducción. Antes de `160fbc7`, `4e03d1f` cambia `task_transformer.ts` sin README de capability, porque el README aún no existía (llega en `7662fb1`).
- **Ninguna regla está automatizada hoy.** No hay `.github/workflows/`, ni `.husky/`, ni `core.hooksPath`, ni hooks activos en `.git/hooks`. El único hook de `.claude/settings.json` es el de Prettier sobre `frontend/`. Todo depende de que el agente o la persona se acuerden.

## PARTE B

1. **La regla sobre la que te equivocaste**

    La regla 2: `El commit sí es por petición: al cerrar cada una, usar la skill /commit`

    En mi caso puse que se cumplia, ya que entendí que la regla era clara y que el agente la ejecutaría si o si, pero no hay evidencias de que esto se esté cumpliendo a rajatabla, y que en este caso el agente la categorizó como "No se puede comprobar" y que esto entonces lo recomendable sería bajarlo a un hook para asegurar que siempre se cumpla.

2. **La regla que no se puede comprobar con lo que hay**

    Un ejemplo es la 5: `Cuando abras el PR, no repitas ese resumen en el chat: la sesión se va a perder, el PR no. Responde solo con la URL del PR.`

    no hay nada que indique que se esté cumpliendo ya que haría falta entonces tener un volcado de todo el prompt para saberlo.

3. **La regla que borrarías, y por qué.**

    Eliminaria la regla 5:

    >`Cuando abras el PR, no repitas ese resumen en el chat: la sesión se va a perder, el PR no. Responde solo con la URL del PR.`

    No entiendo que valor aporta tenerla o no tenerla.

    Aunque solo se pide un ejemplo, dejo también esta parte para cuando yo revise este ejercicio.

    En la regla 4:

    >`gh pr create` (con una descripción completa de los cambios en el cuerpo del PR) y el pase del subagente `adversarial-reviewer` sobre ese PR van **una sola vez, al terminar la unidad de trabajo**, no al cerrar cada petición. El review adversarial es lo último, antes de dar la unidad por terminada.`

    Él último apartado sobre ejecutar el subagente 'adversarial-reviewer', lo recomendable seria no tener este punto en una regla de proceso si no en un hook. De este modo nos asegurariamos que siempre se ejecutaría este punto. POr lo tanto, este punto lo borraría de la regla y pasaría a ser un hook.
