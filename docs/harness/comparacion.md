# Comparación FLOW-5: sin harness vs con harness

Encargo: `Implementa el ticket FLOW-5 de mi Jira.` · Claude Code CLI · Opus 5.5 (esfuerzo medio).
En la copia con harness el texto quedó pegado dos veces por error (ver `prompts.md`).

## 1. Archivos tocados

| | Sin harness | Con harness |
|---|---|---|
| Tocados por el agente | **4** | **27** |
| Modificados | 2 (`App.tsx`, `App.css`) | 8 (`App.tsx`, `index.css`, `index.html`, `package.json`, `package-lock.json`, `tsconfig.json`, `tsconfig.app.json`, `vite.config.ts`) |
| Borrados | 0 | 4 (`App.css` y 3 imágenes de la plantilla) |
| Nuevos | 2 (`src/api.ts`, `src/SignupPage.tsx`) | 15 (9 de andamiaje shadcn + 6 propios en `features/`, `lib/api.ts`, `env.d.ts`, `.env.example`) |

Excluidos en ambas: 11 archivos de `backend/` idénticos en las dos copias, regenerados por el setup (`.adonisjs/`, `schema.ts`; `.env.example` solo por LF/CRLF). Excluidos en la copia con harness: `CLAUDE.md` y `.claude/settings.json` (los puse yo).

## 2. Convenciones

**Sin harness:** no había ninguna escrita para el agente (sin `CLAUDE.md`).

**Con harness** (reglas de mi `CLAUDE.md`):
- ✅ No tocar archivos de `backend/` · ✅ No editar README ni generados · ✅ No subir `.env`
- ✅ shadcn/ui · ✅ Un solo módulo de API (`src/lib/api.ts`) con `VITE_API_URL`
- ✅ Una carpeta por funcionalidad (`src/features/auth`, `src/features/account`)
- ✅ Errores 422 en su campo; mensaje genérico para el resto
- ✅ Lint y build pasan (con un aviso en `button.tsx` de shadcn)
- ✅ Repasó cada criterio de aceptación · ✅ Listó los supuestos
- Sin verificar: "no desactivar reglas del linter" y "componentes pequeños"

## 3. Intervenciones

| | Sin harness | Con harness |
|---|---|---|
| Corregir / aclarar / repetir / parar | 0 | 0 |

Después del encargo, en las dos sesiones solo hubo `/exit`.

## 4. Qué arreglaría a mano antes de enseñarlo

**Sin harness:** URL del backend con respaldo hardcodeado; imágenes de la plantilla sin usar en `src/assets`; archivos sueltos en `src/`; nombre obligatorio aunque el backend lo acepta vacío; dos usuarios de prueba en la base de datos.

**Con harness:** cuatro usuarios de prueba en la base de datos; aviso de lint en `button.tsx`.

**Sin terminar:** no probé ninguna de las dos en el navegador.

---

## Parte B

1. **Piezas:** `CLAUDE.md` (generado con `/init` y ampliado a mano con "Working rules") y un hook `PostToolUse` en `.claude/settings.json` que corre `npm run lint` y `tsc -b` en `frontend/`. Lo que más me costó fue el `CLAUDE.md`: tenía cambios sin guardar en VS Code mientras `/init` reescribía el archivo, y tuve que comprobar con `/memory` qué versión leía el agente.

2. **Primera diferencia:** dónde puso el código. En el resumen final de la terminal, la copia sin harness listaba `src/api.ts` y `src/SignupPage.tsx` sueltos, y la de harness `src/lib/api.ts` y componentes shadcn. Lo confirmé con `git status` en las dos carpetas, sin abrir archivos.

3. **Escrito y no cumplido:** mi regla decía "Never modify anything under `backend/`". El agente no tocó ningún archivo del backend, pero al probar con `curl` dejó cuatro usuarios de prueba en su base de datos. Cumplió la letra (archivos) y no el espíritu (no alterar el backend).
