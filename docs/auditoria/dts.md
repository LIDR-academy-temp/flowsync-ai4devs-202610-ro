#Parte A:
# Auditoría de las reglas de proceso de `CLAUDE.md`

Alcance: sección `## Reglas de proceso` (5 reglas). Fecha: 2026-11-15. Solo lectura: no se ha tocado código.

Fuentes comunes: `git log -15` (de `cdf903a` a `4427afc`), `git branch -a`, `git reflog`, `git log --merges`, `git status`, `git log -S` sobre `CLAUDE.md`. La CLI `gh` no está instalada, así que no hay información de PRs. En el árbol hay 175 ficheros «modificados», pero `git diff --ignore-cr-at-eol` no muestra ninguna diferencia de contenido en `CLAUDE.md`: son finales de línea.

| Qué pide la regla | Qué se miró para comprobarlo | Veredicto | Evidencia | Qué harías con ella |
|---|---|---|---|---|
| Trabajar en una rama por unidad de trabajo, crear `feat/<slug>` solo desde `main` o `sN/*`, y no commitear nunca en `main` ni en `sN/*`. | `git branch -a`, `git reflog` (solo `clone` y `checkout main → s5/start`), `git log --merges` y `git log -15 --format='%h %P'` (historia lineal), `git branch --contains 4e03d1f`. | no se puede comprobar con lo que hay | Los 15 commits son lineales y están contenidos en `s5/start` y `upstream/s4/end`, ramas `sN/*`. Sin merges ni nombres de rama en los mensajes, no se distingue «commiteado en una `sN/*`» de «traído desde una rama de trabajo por fast-forward». El clon no conserva rastro de las ramas originales. | dejarla |
| Al cerrar cada petición, commitear con la skill `/commit`. | Los 15 mensajes con `git log -15`, y `.claude/skills/commit/SKILL.md`. | no se puede comprobar con lo que hay | Los 15 mensajes siguen `tipo(scope): descripción`, pero eso lo produce cualquiera con la convención. Invocar la skill no deja rastro en Git, y tampoco el reparto en «un commit por petición». | bajarla |
| Si un cambio toca rutas, controladores, validadores o transformers de una capability, el mismo commit actualiza el OpenAPI (diff de `.adonisjs/`) y `docs/capabilities/<nombre>/README.md`. | `git log -15 --stat`, `git log -S` para la fecha de la regla (`160fbc7`, 2026-08-20 17:07) y `git show` de los commits que tocan esos ficheros. | se cumple | Solo `cbe9617` toca controladores de `tasks` después de existir la regla, y en el mismo commit actualiza `docs/capabilities/tasks/README.md`. Parte no comprobada: no cambia `.adonisjs/`, y no hay fichero OpenAPI que contrastar (se genera en cada petición). Solo se sostiene sobre ese commit. `4e03d1f` toca un transformer sin README, pero es anterior a la regla y no cuenta. | dejarla |
| `gh pr create` con descripción completa y el pase de `adversarial-reviewer` sobre el PR, una sola vez al terminar la unidad y como último paso. | `git log --merges`, `git branch -a -r`, `git log -15 --grep=adversarial`, `gh pr list` (`gh` no existe en esta máquina). | no se puede comprobar con lo que hay | Faltan PRs, merges de PR y el informe del revisor. `8f9e715` solo configura el subagente, no es un pase sobre un PR. Sin `gh` ni acceso a GitHub, el contenido del PR y el orden «review al final» son inverificables. | dejarla |
| Tras abrir el PR, responder en el chat solo con su URL. | Nada: es una regla sobre la conversación. Se buscó en `git log` y en los ficheros del repo. | no se puede comprobar con lo que hay | La respuesta del chat no se guarda en Git ni en ningún fichero, y la propia regla dice que la sesión se pierde. | borrarla |

Notas:
- `bajarla` = pasarla de regla obligatoria a recomendación. `borrarla` = quitarla, porque no se puede auditar.
- Ninguna regla tiene el veredicto `no se cumple`: ninguna prueba un incumplimiento, pero tampoco hay nada con qué confirmar las demás.
- De las cinco reglas, solo la 3 deja rastro en Git. Las otras cuatro dependen de datos que este repositorio no guarda: nombres de rama, uso de skills, PRs y el chat.

#Parte B:
## Reflexión

1. **La regla sobre la que me equivoqué: la 1 (rama por unidad de trabajo).** Tu apuesta fue «sí se cumple», porque el título del commit incluye el nombre de la rama (`feat(OpenApi)`). La auditoría dice `no se puede comprobar con lo que hay`. El paréntesis de un commit convencional es el *scope* (`tipo(scope): descripción`, según `.claude/skills/commit/SKILL.md`), no el nombre de la rama, y la rama se llama `feat/<slug>`. Además, en los 15 commits no aparece ningún nombre de rama, la historia es lineal y el reflog solo recoge el `clone` y el `checkout`. Para comparar, ten en cuenta que ese commit y otros 14 están en `s5/start` y `upstream/s4/end` (ramas `sN/*`), y que Git no distingue «commiteado en la rama `sN/*`» de «traído por fast-forward desde una rama de trabajo». La regla 2 es una desviación parcial del mismo tipo: la forma homogénea de los mensajes es coherente con usar `/commit`, pero no lo demuestra. Las reglas 3, 4 y 5 coinciden con tu valoración.

2. **La regla que no se puede comprobar: la 4 (PR y `adversarial-reviewer` una sola vez, al final).** Es la más relevante porque es el cierre del proceso y no deja nada en el repositorio. Para dejar evidencia comprobable haría falta que:
   - el PR se integre con merge commit (no squash ni fast-forward), de modo que quede un `Merge pull request #N` en `git log`;
   - el informe del revisor se guarde como fichero en el repo (por ejemplo `docs/revisiones/<rama>.md`, con fecha y commit revisado) o se enlace desde el cuerpo del PR;
   - `gh` esté instalado, para poder listar PRs desde Git con `gh pr list` y `gh pr view`.

3. **La regla que borraría: la 5 (responder solo con la URL del PR).** No la borraría porque la herramienta ya imponga ese comportamiento, porque no lo impone: es una preferencia de estilo que depende solo de que el agente la obedezca. La borraría porque no se puede auditar (ni el chat ni la sesión quedan en Git) y porque incumplirla no tiene consecuencias observables en el repositorio: el PR sigue ahí con su descripción completa, y lo único que se pierde es un resumen redundante en un chat que la regla misma da por perdido.
