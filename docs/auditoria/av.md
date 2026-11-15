# Auditoría de las reglas de proceso — av

**Reglas auditadas:** sección «Reglas de proceso» de `CLAUDE.md` (5 viñetas; la primera lleva dos reglas y se parte en R1a y R1b).
**Ventana:** los 15 últimos commits de `HEAD` (`cdf903a` … `4427afc`, 2026-08-20 → 2026-09-23) y el árbol actual (`auditoria-av`).
**Auditoría, no arreglo:** no se modificó ningún archivo salvo este.

## Parte A: la tabla

| # | Qué pide la regla | Qué se miró | Veredicto | Evidencia | Qué harías |
|---|---|---|---|---|---|
| R1a | Mirar la rama antes de tocar código: si ya es de trabajo (ni `main` ni `sN/*`), seguir en ella; solo desde `main` o `sN/*` se corta una nueva. | `git status`; `git diff s5/start..auditoria-av`; `.git/logs/HEAD` (reflog) | **se cumple** | `HEAD` está en `auditoria-av`, cortada de `s5/start` y sin commits propios todavía. El reflog muestra una rama de trabajo por módulo, cortada de su `sN/start` *antes* de commitear en 4 de 5 casos (el 5.º, `alcance-av`, está en R1b). Ninguna se llama `feat/<slug>`, que la regla da como ejemplo. | dejarla |
| R1b | Nunca commitear directo en `main` ni en una `sN/*`. | `git branch --contains <sha>`; mensajes de `git show`; reflog | **no se cumple** (2 de 15 en la ventana, 1 más fuera de ella) | (a) `b955a72` y `afc4b74` dicen en su propio mensaje que van «en la rama de partida» (s4 y s5); autor «LIDR Academy», sin trailer de Claude: mantenimiento del curso, no una sesión de agente. (b) Reflog: `commit: alcance: MVP + prompts` (`6f4c879`) se hizo con `s2/start` activa, y `git branch --contains 6f4c879` devuelve `alcance-av` **y `s2/start`**. Los otros 13 commits de la ventana solo cuelgan de `s5/start` / `upstream/s4/end` (ninguno de `main`), pero git no guarda en qué rama se escribió cada uno. | bajarla: protección de rama o hook que aborte si la rama es `main` o `sN/*` |
| R2 | Un commit por petición, al cerrarla, con la skill `/commit`. | `git log` (15); `.claude/skills/commit/SKILL.md`; trailers con `git show` | **no se puede comprobar** | Solo hay rastro indirecto: 15/15 siguen `tipo(scope): …` (`cdf903a` sin scope) y 12 llevan `Co-Authored-By: Claude`, pero ese formato lo puede producir cualquiera, y `SKILL.md` pide una línea mientras 12 commits traen cuerpo largo. Ningún mensaje dice a qué petición cierra ni que usara la skill. Falta: un trailer que registre la skill, o un hook que valide el formato. | bajarla |
| R3 | Si un cambio toca rutas, controladores, validadores o transformers de una capability, ese mismo commit lleva al día el OpenAPI y el README (y el diff de `.adonisjs/`). | `git show` de `4e03d1f`, `ea5db1f`, `cbe9617`; `start/routes.ts` frente a `.adonisjs/server/routes.d.ts`; `docs/capabilities/` | **se cumple** | La regla nace en `160fbc7`; desde entonces solo `cbe9617` toca código de tasks, y trae decoradores OpenAPI + `docs/capabilities/tasks/README.md` en el mismo commit. Antes de la regla, `4e03d1f` (transformer de tasks) no habría pasado, pero aún no existían README ni documento. En el árbol, las 12 rutas de `routes.ts` coinciden con `routes.d.ts`. **Reservas:** no se arrancó el servidor, así que no se comparó el `/api.json` servido; y `auth` (3 controladores) sigue sin anotar y sin README. | bajarla: job de CI que regenere y compare |
| R4 | Un solo `gh pr create` (descripción completa) y un solo pase de `adversarial-reviewer`, al terminar la unidad; el review es lo último. | `git log`; `.claude/agents/adversarial-reviewer.md`; `git status` | **no se puede comprobar** | El revisor existe y está afinado (`8f9e715`: contrasta contra la spec, sin `Bash`), pero invocarlo no deja nada en git; ningún mensaje cita un PR y desde aquí no hay acceso a GitHub para listar PR ni descripciones. Falta: un job de CI que lo lance sobre el PR y deje el informe como comentario. | bajarla |
| R5 | Al abrir el PR, no repetir el resumen en el chat: responder solo con la URL. | Nada que mirar | **no se puede comprobar** | Es conducta de la conversación, y la propia regla dice que la sesión se pierde: nada llega a git. | dejarla |

## Estado del árbol

- Rama `auditoria-av`, idéntica a `s5/start` (`git diff s5/start..auditoria-av` vacío), sin commits propios.
- Sin preparar: `backend/package-lock.json` y `frontend/package-lock.json` modificados; sin seguimiento: `.history/`. Ya estaban así antes de esta auditoría.
- La ventana son commits del curso (12 de Earvin Saúl Pérez Ramos con trailer de Claude; 3 de las cuentas del curso). Tus 4 commits locales (`harness-av`, `alcance-av`, `spec-viva-av`, `trazabilidad-av`) quedan fuera de los 15; solo entran como evidencia en R1a y R1b.

## Parte B: las tres líneas

1. **La regla sobre la que te equivocaste:** Me equivoqué en la R4 y R5. Pensé que sí se podían comprobar pero no al parecer no es posible
2. **La regla que no se puede comprobar con lo que hay:** R4. Para que dejara rastro, el `adversarial-reviewer` tendría que lanzarlo un job de CI sobre el PR y publicar su informe como comentario, en vez de depender de que alguien lo invoque. 
3. **La regla que borrarías, y por qué:** 
R5. No da valor 