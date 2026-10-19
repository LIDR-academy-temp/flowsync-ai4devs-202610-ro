# Comparación: con harness vs sin harness

**Encargo:** ticket «Implementar login en el frontend» (texto del README, idéntico en las dos copias; no hay Jira conectado, se pasó el texto en el prompt).
**Modelo:** Claude Opus 5.5, subagente Plan (solo lectura) en los dos lados. **Se comparan planes, no se aplicó ninguno.**
**Ejecutado por:** Claude Code a petición del alumno, fuera de plazo (ver `prompts.md`).

| Casilla | Sin harness (`flowsync-sin-harness/`) | Con harness (`flowsync-ai4devs/`) |
|---|---|---|
| 1. Archivos que tocaría | **24**: 13 nuevos, 7 modificados (+ lock), 4 borrados | **30**: 17 nuevos, 9 modificados (+ lock), 4 borrados |
| 2. Convenciones | No había ninguna escrita. Por su cuenta: backend intacto, una página por archivo, errores en UI. URL de la API resuelta con **proxy de Vite** (`/api` → 3333), sin variable de entorno. Sin rama, sin commit, sin PR, sin `format`. | Respeta: backend intacto, `src/lib/api.ts` único, `VITE_API_URL` + `.env.example` + `vite-env.d.ts`, tipos explícitos sin `any`, dependencias justificadas una a una, `PascalCase.tsx`, rama nueva, `npm run format`, `/commit` → `gh pr create` → `adversarial-reviewer`. Añade `.env` al `.gitignore` del frontend. |
| 3. Intervenciones | 0. Pero cierra con **4 decisiones abiertas** que me devuelve (campo confirmar contraseña, qué pasa tras registro, dónde guardar el token, logout). | 0. Toma esas mismas decisiones él y las justifica. |
| 4. Qué arreglaría a mano | Decidir las 4 preguntas; que el proxy solo vale en dev (en build no hay `/api`); manda `fullName: null` explícito (innecesario). | Nombre de rama con `<ticket>` literal sin rellenar; el plan cuenta con `/commit` y `adversarial-reviewer`, que **no existen** en este harness; 4-6 archivos más que el otro (`useAuth.ts` aparte, `FieldError.tsx`, `.env.example`, `vite-env.d.ts`). |

Los dos encontraron solos lo importante del hueco del ticket: `passwordConfirmation` obligatorio en el validador y la respuesta envuelta en `{ data }` (`backend/providers/api_provider.ts`).

---

## Parte B: las tres líneas

1. **Piezas montadas:** `CLAUDE.md` (escrito a mano tras leer el código, no con `/init`), Prettier en `frontend/` + hook `PostToolUse` en `.claude/settings.json` que formatea `frontend/src/**`, y `AGENTS.md → CLAUDE.md`. No llegué a Atlassian MCP, `/priority-ticket`, `/commit` ni `adversarial-reviewer`. Lo que más costó no fue ninguna pieza sino el entorno: Node 22 no arranca el backend (`ERR_UNKNOWN_FILE_EXTENSION`) y hubo que instalar Node 24 con nvm y reinstalar `node_modules`.
2. **Primera diferencia:** en la sección de configuración del plan, cómo llega el frontend al backend. Sin harness propone un **proxy en `vite.config.ts`**; con harness, **`import.meta.env.VITE_API_URL`** con `.env.example`. Lo vi comparando las listas de «Modificados»: `.gitignore` y `.env.example` solo aparecen en un lado.
3. **Escrito en el harness y no cumplido:** `CLAUDE.md` dice «rama nueva `feat/<ticket>-<slug>`» y el plan la copió con el `<ticket>` literal, sin poner una clave. Y las reglas de proceso mandan cerrar con `/commit` y el subagente `adversarial-reviewer`: el plan los incluye obedientemente aunque esas piezas no existen, así que la regla se cumplió en el papel y no podría cumplirse en la práctica. Además el propio `CLAUDE.md` estaba incompleto: no mencionaba el envoltorio `{ data }` de las respuestas; el agente lo encontró igual leyendo el código, y la copia pelada también. El hook de formato no se llegó a ejercitar porque ningún plan edita archivos.

**Sin terminar:** no se aplicó ningún plan (como pide el README), ni se montaron 4 de las 8 piezas, ni el ticket está en Jira.
