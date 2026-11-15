# Auditoría — JMP

## Mi apuesta

| Regla | Mi apuesta |
|---|---|
| Una rama por unidad de trabajo: si ya estás en una rama de trabajo, sigue en ella; solo desde `main` o una `sN/*` se crea una nueva (`feat/<slug>`). | ni idea|
| Nunca se commitea directamente en `main` ni en una `sN/*`. | si |
| Un commit por petición, cerrándola con la skill `/commit`. | no|
| Un cambio en rutas, controladores, validadores o transformers de una capability va en el mismo commit que su OpenAPI (diff regenerado de `.adonisjs/`) y su `docs/capabilities/<nombre>/README.md`. | si |
| `gh pr create`, con una descripción completa de los cambios, se lanza una sola vez, al terminar la unidad de trabajo. | ni idea|
| El subagente `adversarial-reviewer` revisa el PR una sola vez, como último paso antes de dar la unidad por terminada. | no|
| Al abrir el PR, en el chat solo se responde con la URL del PR, sin repetir el resumen. | si |

## Tabla contrastada

Contrastada contra `git log -15` (b955a72..cdf903a, rama `auditoria-jmp` creada desde `s5/start`) y el árbol actual. Contexto: la historia es lineal y sin merges. Además está reescrita: 4e03d1f cita el commit `5cb8726`, que no existe en el repo, y el committer de 10 commits no coincide con el autor. No hay CI (`.github/`), ni `.husky/`, ni git hooks, y `.claude/settings.json` solo trae un hook de Prettier para el frontend.

| Qué pide la regla | Qué se miró | Veredicto | Evidencia | Qué harías |
|---|---|---|---|---|
| Trabajar en una sola rama por unidad de trabajo y crear `feat/<slug>` solo cuando se parte de `main` o de una `sN/*`. | `git branch -a --contains <sha>`, `git log --graph --oneline -25 --all`, `git reflog` | no se cumple | `git reflog` muestra que la rama actual se creó desde `s5/start` como `auditoria-jmp`, no como `feat/<slug>`. La unidad 4427afc..cbe9617 no está en ninguna rama `feat/*`. | dejarla |
| Ningún commit entra directamente en `main` ni en una `sN/*`. | `git log -15 --format='%h\|%p'`, `git log --merges`, `git branch -a --contains`, `gh pr list --state all --search <sha>` | no se cumple | 4427afc → cbe9617 forman una cadena lineal directamente sobre `s5/start`, sin merge y sin PR asociado. | bajarla |
| Cada petición se cierra con exactamente un commit hecho con la skill `/commit`. | `.claude/skills/commit/SKILL.md`, formato y trailers de los 15 mensajes | no se puede comprobar | La skill no deja ninguna marca propia: el formato convencional no distingue un commit de `/commit` de uno a mano. Para comprobar "uno por petición" harían falta las sesiones de chat. | bajarla |
| Si cambian rutas, controladores, validadores o transformers de una capability, el mismo commit incluye el diff regenerado de `.adonisjs/` y `docs/capabilities/<nombre>/README.md`. | `git show --stat` de los 15 commits, `git log -- backend/.adonisjs docs/capabilities/tasks/README.md` | no se cumple | **4e03d1f:** cambia `task_transformer.ts` sin README ni `.adonisjs/`. **ea5db1f:** cambia `routes.ts` sin README. **cbe9617:** cambia controladores sin `.adonisjs/`. 4e03d1f y ea5db1f son anteriores a la regla (160fbc7). | bajarla |
| Se abre un único PR, con descripción completa, cuando se cierra la unidad de trabajo. | `gh pr list --state all`, `gh pr list --search <sha>`, `git log --merges` | no se puede comprobar | No hay PR ni merge para 4427afc..cbe9617 en este repo. Como la historia está reescrita, haría falta el repo de origen o la URL del PR. | dejarla |
| El subagente `adversarial-reviewer` revisa el PR una sola vez, como último paso. | `.claude/agents/adversarial-reviewer.md`, búsqueda de ficheros `*review*`, `*adversarial*` y `*.jsonl` | no se puede comprobar | El agente es de solo lectura y responde en el chat, así que no deja rastro. Harían falta comentarios en el PR o los transcripts. | bajarla |
| Al abrir el PR, la respuesta en el chat es solo la URL, sin repetir el resumen. | Búsqueda de transcripts de sesión en el repo (no hay ninguno) | no se puede comprobar | Solo ocurre en el chat, que no se guarda. Harían falta los transcripts. | borrarla |

## Parte B: las tres lineas

1. **La regla en la que me equivoqué:** "Nunca se commitea directamente en `main` ni en una `sN/*`". Aposté a que se cumplía, y la auditoría dice que no: la unidad 4427afc → cbe9617 está directamente sobre `s5/start`, en una cadena lineal sin merge ni PR. Es la que más se separó, porque fallé de lleno y con evidencia firme. La regla del contrato en el mismo commit también la aposté como cumplida y no se cumple, pero con matices: dos de sus tres fallos son anteriores a la regla.
2. **La regla que no se puede comprobar:** "El subagente `adversarial-reviewer` revisa el PR una sola vez, como último paso". Dejaría rastro si el review no se quedara en el chat y se publicara como comentario en el PR, ya fuera con `gh pr comment` desde el propio flujo o con un job de CI que lo lance al abrir el PR.
3. **La regla que borraría:** "En el chat, solo la URL del PR". Creo que se cumplirá siempre que se cree un PR, así que no aporta nada como regla escrita.

