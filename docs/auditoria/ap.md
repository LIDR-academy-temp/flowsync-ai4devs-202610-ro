# Auditoría de las «Reglas de proceso» de CLAUDE.md

Alcance: los últimos 15 commits alcanzables desde `HEAD` (`b955a72`..`cdf903a`) y el árbol de trabajo en la rama `auditoria-ap` a fecha 2026-11-13.

La regla 4 tiene dos obligaciones con veredictos distintos (abrir el PR y pasar el revisor adversarial), así que va en dos filas: 4a y 4b.

| # | Qué pide la regla | Qué se miró para comprobarlo | Veredicto | Evidencia | Qué harías con ella |
|---|---|---|---|---|---|
| 1 | Trabajar en una rama por unidad de trabajo (`feat/<slug>`) y no commitear nunca directamente en `main` ni en una `sN/*`. | `git log -15 --format='%h\|%D\|%s'`, `git log -15 --merges`, `git branch -a --contains 4e03d1f`, `git branch -a \| grep feat/` | **no se cumple** | Los 14 commits de `4427afc` a `cbe9617`, incluido `0e56705`, que es el que añade la propia regla, están en un historial lineal sin ningún merge y solo los contienen `upstream/s4/end` y `s5/start`. No hay ninguna rama `feat/*` ni en local ni en los remotos. El árbol actual sí la cumple, porque está en `auditoria-ap`. | bajarla |
| 2 | Al cerrar cada petición, hacer un commit con la skill `/commit`. | `git log -15 --format='%h %s%n%b'` (mensajes y trailers), `.claude/skills/` | **no se puede comprobar con lo que hay** | Los mensajes tienen formato convencional y el trailer `Co-Authored-By: Claude`, pero ni el uso de `/commit` ni el límite entre una petición y la siguiente dejan rastro. Haría falta un trailer propio de la skill o el registro de la sesión. | bajarla |
| 3 | Si un commit toca rutas, controladores, validadores o transformers de una capability, el mismo commit debe incluir el diff regenerado de `.adonisjs/` y el `docs/capabilities/<nombre>/README.md` actualizado. | `git show --stat` de `4e03d1f`, `ea5db1f`, `cbe9617` y `160fbc7`, `git show cbe9617:backend/.adonisjs/server/controllers.ts`, `git diff --stat` | **se cumple** | El único commit posterior a la regla (`160fbc7`) que toca controladores es `cbe9617`, y lleva el README de `tasks`. En `.adonisjs/` no había nada que regenerar porque los controladores ya estaban registrados. Antes de que existiera la regla, `4e03d1f` (transformer) y `ea5db1f` (rutas) se commitearon sin README. El diff actual de `.adonisjs/` son solo saltos de línea CRLF. | bajarla |
| 4a | Al terminar la unidad de trabajo, abrir una sola vez un PR con `gh pr create` y una descripción completa. | `gh pr list --state all --search 4e03d1f`, `gh pr list --state all --search cbe9617`, `git log -15 --merges` | **no se cumple** | No hay ningún PR que contenga los commits de la unidad de `s4/end` (`4427afc`..`cbe9617`), y en el historial no aparece ningún merge de PR. | bajarla |
| 4b | Pasar el subagente `adversarial-reviewer` sobre ese PR como último paso, antes de dar la unidad por terminada. | `.claude/agents/adversarial-reviewer.md`, `gh pr list` (comentarios de PR), mensajes de commit | **no se puede comprobar con lo que hay** | El agente existe, pero su pase no deja rastro: no escribe en el PR, ni en un commit, ni en un fichero. Para comprobarlo tendría que publicar su veredicto como comentario del PR o como check. | bajarla |
| 5 | Después de abrir el PR, responder en el chat solo con su URL, sin repetir el resumen. | Nada versionado lo registra: ni el historial de git, ni `.claude/`, ni el PR | **no se puede comprobar con lo que hay** | Lo que se dice en el chat se pierde con la sesión. Haría falta conservar los transcripts para poder auditarlo. | borrarla |

### 🅱️ Parte B: las tres líneas

1. **La regla sobre la que te equivocaste.** 
- Regla 2 (un commit por petición con /commit): al cerrar cada una, usar la skill `/commit`.
No pude diferenciar si los commits fueron hecho por la skill o por una persona.

2. **La regla que no se puede comprobar con lo que hay**
- Regla 2 (un commit por petición con /commit): tiene arreglo si algo la ejecuta. La skill marcaría sus commits con un trailer propio y un hook Stop impediría cerrar un turno con cambios sin commitear.
- Regla 4b (revisor adversarial al final): tiene arreglo si algo la ejecuta. Su veredicto se publicaría en el PR como comentario o como check, y así quedaría con fecha en GitHub.


3. **La regla que borrarías, y por qué.**
- Regla 5 (responder solo con la URL): no tiene arreglo y vive de la buena voluntad. Se puede borrar sin perder nada, porque la 4a ya exige que el resumen vaya en el cuerpo del PR.