# Auditoría de reglas de proceso — eds

## Mi apuesta

Escrita antes de ver ningún resultado.

| Regla | Apuesta |
|---|---|
| La rama es por unidad de trabajo | Sí |
| El commit sí es por petición | Sí |
| Un cambio que toque rutas, controladores, validadores o transformers cierra con OpenAPI y README al día | No |
| El PR va una sola vez | No |
| Resumen en el chat al abrir el PR | Sí |

## Resultado de la auditoría

Contraste de las reglas de proceso de `CLAUDE.md` contra los últimos 15 commits (`git log -15`) y el árbol actual. Auditoría de solo lectura: no se cambió ningún archivo del repo. El bullet de PR + revisor se separó en dos reglas (4 y 5) y se añadió la del resumen en el chat (6).

| Qué pide la regla | Qué se miró | Veredicto | Evidencia | Qué haría |
|---|---|---|---|---|
| 1. Trabajar en una rama por unidad de trabajo: seguir en la rama de trabajo, crear `feat/<slug>` solo desde main o sN/*, y no commitear nunca directo en main ni en sN/*. | `git branch -a --contains <hash>` para cada commit de los 15; `git log --merges`; `git branch -a` | no se puede comprobar | Los 15 commits están en `s5/start`, `upstream/s4/end` y `auditoria-eds`, historia lineal sin merges. Git no guarda en qué rama se creó cada commit: falta el reflog de la época o los PRs de origen. | bajarla |
| 2. Cada petición cierra con un commit hecho con la skill /commit. | `git log -15 --format` (mensajes y trailers); `ls .claude/skills` | no se puede comprobar | Los mensajes son convencionales y llevan `Co-Authored-By: Claude`, pero usar la skill no deja marca. Falta un trailer o marcador que identifique a la skill. | bajarla |
| 3. Un cambio en rutas, controladores, validadores o transformers de una capability se cierra en el mismo commit con el OpenAPI (diff de `.adonisjs/`) y el README `docs/capabilities/<x>/README.md` al día. | `git log -15 --stat`; fichero a fichero en `4e03d1f`, `cbe9617` y `ea5db1f` | no se cumple | `4e03d1f` toca `task_transformer.ts` sin README ni `.adonisjs/`; `cbe9617` añade dos controladores y toca el README, pero no `.adonisjs/`; `ea5db1f` toca rutas y `.adonisjs/`, pero no el README (aunque solo registra la ruta del propio documento OpenAPI, así que podría no aplicarle). | bajarla |
| 4. `gh pr create` con descripción completa, una sola vez al terminar la unidad de trabajo. | `gh pr list --state all --author edaza86`; `gh pr view 77` | se cumple | PR #77 (`trazabilidad-eds`) tiene cuerpo detallado (cambios, tabla de tests, decisiones). Es de una rama distinta de los 15 commits. | dejarla |
| 5. Pasar el subagente adversarial-reviewer sobre el PR una sola vez, al final, como último paso. | `gh pr view 77 --json comments,reviews`; `.claude/agents/adversarial-reviewer.md` | no se puede comprobar | PR #77 con 0 comentarios y 0 reviews; el subagente es de solo lectura y devuelve al chat, sin rastro. Falta publicar su resultado en el PR o guardarlo en un fichero. | bajarla |
| 6. Al abrir el PR, responder en el chat solo con la URL, sin repetir el resumen. | Búsqueda de rastro de chat en el repo y en `gh` | no se puede comprobar | Las sesiones de chat no dejan rastro. Falta el transcript de la sesión. | borrarla |

Notas:
- `s4/end` ya contiene los 15 commits, así que el trabajo de la regla 3 se hizo sobre la línea s1-s4, no en una rama `feat/*`. Apunta a commits directos en una sN, pero no lo prueba.
- La regla 4 se midió con el PR #77 (y #56), no con los 15 commits. El PR #77 sigue abierto y sin review.
- Los veredictos salen del informe del subagente; no los he re-verificado uno a uno.

Respuesta a las preguntas:

1.- La regla sobre la que te equivocaste. Compara tu apuesta con el veredicto y escribe la que más se separó, en un sentido o en el otro. Si acertaste todas, escríbelo tal cual y añade en una frase en qué te apoyabas para acertar: si la respuesta es "me sonaba", eso también es el dato:
- PR una sola vez: aposte "No" y es "se cumple". Pensaba que era por el que el agente solamente pasaba una vez, y había pensado que el agente revisor no se ejecuta si no se llama.


2.- La regla que no se puede comprobar con lo que hay, y en una frase qué tendría que cambiar para que dejara rastro. Puede ser reescribirla, puede ser que algo la ejecute, puede ser que no haya arreglo posible y toque asumir que vive de la buena voluntad:
- Un check de CI o hook que falle si el commit toca controllers/, validators/, transformers/ o start/routes.ts sin tocar docs/capabilities/*/README.md y .adonisjs/.

3.- La regla que borrarías, y por qué. Hay dos candidatas típicas: la que se cumple sola porque la herramienta ya lo impide, y la que no se cumple nunca y a nadie le ha importado. Elige una y di a cuál de los dos grupos pertenece:
- Eliminaria la de mostrarla por el chat porque no le importa a nadie y ademas siempre te muestra algo en el chat.