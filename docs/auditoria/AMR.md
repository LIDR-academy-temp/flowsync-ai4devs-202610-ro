## Tabla de auditoría

Ventana: `git log -15` (4427afc → eba33b0), historial lineal sin merges. Reglas: sección "Reglas de proceso" de `CLAUDE.md`.

| # | Qué pide la regla | Qué se miró | Veredicto | Evidencia | Acción |
|---|---|---|---|---|---|
| 1 | Mirar la rama antes de tocar código y seguir en la de trabajo si ya lo es | `git reflog -20` | no se puede comprobar con lo que hay | "Mirar" no deja rastro; faltaría un hook que registre/valide la rama al editar | bajarla |
| 2 | Ramas nuevas solo desde `main`/`sN/*` y con nombre `feat/<slug>` | `git branch -a -vv`, `git reflog -20` | no se cumple | `auditoria-AMR` y `trazabilidad-AM` salen de `s5/start`/`s4/start`, pero ninguna se llama `feat/…` | bajarla |
| 3 | Nunca commitear directo en `main` ni en `sN/*` | `git reflog show s5/start`, `git log -15 --graph --all` | no se cumple | eba33b0 se commiteó en `s5/start` (reflog: `s5/start@{2026-11-16}: commit`) | bajarla |
| 4 | Un commit por petición | `git log -15` | no se puede comprobar con lo que hay | La petición vive en el chat; faltaría enlazar petición↔commit (p. ej. id en el mensaje) | borrarla |
| 5 | El commit se hace con la skill `/commit` | `.claude/skills/commit/SKILL.md`, `git log -15 --format=%s` | no se puede comprobar con lo que hay | La skill no deja marca; eba33b0 no es convencional, lo que sugiere que no pasó por ella (inferencia) | bajarla |
| 6 | Cambio en rutas/controladores/validadores/transformers de una capability → diff de `.adonisjs/` en el mismo commit | `git log -15 --name-only` | no se puede comprobar con lo que hay | cbe9617 toca controladores de `tasks` sin `.adonisjs/`; saber si debía haber diff exige regenerar (modifica archivos). 4e03d1f y ea5db1f son anteriores a la regla (160fbc7) | bajarla |
| 7 | Mismo caso → `docs/capabilities/<nombre>/README.md` en el mismo commit | `git log -15 --name-only` | se cumple | cbe9617 (único caso tras 160fbc7) incluye `docs/capabilities/tasks/README.md` | dejarla |
| 8 | Un único `gh pr create` al terminar la unidad de trabajo | `gh pr list --state all --search <hash>` (upstream y fork), `git log -15 --merges` | no se puede comprobar con lo que hay | Sin merges en la ventana y ningún PR de upstream introduce estos commits (#85 y #80 solo los traen de base); los PR podrían vivir en otro repo | dejarla |
| 9 | El PR lleva una descripción completa de los cambios | Ídem fila 8 | no se puede comprobar con lo que hay | No hay PR asociado a la ventana que leer | dejarla |
| 10 | Pasar `adversarial-reviewer` sobre el PR, como último paso | Ídem fila 8; `.claude/agents/adversarial-reviewer.md` | no se puede comprobar con lo que hay | Es read-only y no deja comentario ni archivo; faltaría que publicara su informe en el PR | bajarla |
| 11 | Tras abrir el PR, responder en el chat solo con la URL | — (no existe en el repo) | no se puede comprobar con lo que hay | Vive en la sesión de chat, que no se conserva | borrarla |
