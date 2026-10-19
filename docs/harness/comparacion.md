# Comparación: mismo ticket con harness y sin harness

**Ticket:** FLOW-1 «Tarea 1 flowsync» — *"Implementa el login y el registro consumiendo el backend de auth ya existente."*
**Modelo / herramienta:** Claude Opus 5.5 · Claude Code (extensión VS Code)

| | Con harness | Sin harness |
|---|---|---|
| **1. Archivos que propone tocar** | Plan: 5 piezas (`lib/api.ts`, AuthContext, Login, Signup, Profile) + Tailwind/shadcn + react-router. Real: **26 archivos** en `frontend/` — 7 modificados, 4 borrados (plantilla Vite), 15 nuevos (9 escritos a mano, 6 generados por shadcn). 0 en `backend/`. | |
| **2. Convenciones respetadas / no respetadas** | ✅ No tocó el backend. ✅ Leyó el validador antes de asumir campos: detectó `passwordConfirmation` y `fullName` (nullable), límites 8–32, el envoltorio `{ data }` y los formatos de error 400/422. ✅ Usó shadcn/ui. ✅ Sin librería de formularios; justificó react-router. ✅ Rama nueva antes de tocar código. ❌ Dejó sin arreglar un aviso de oxlint en `components/ui/button.tsx` (código generado por shadcn en ese mismo cambio). | |
| **3. Veces que intervine** | **2.** (a) El ticket estaba vacío en Jira la primera vez: el agente paró y preguntó; le pedí que lo releyera tras añadir la descripción. (b) Confirmé que implementara (el README dice que no se aplique el plan). | |
| **4. Qué arreglaría a mano antes de enseñarlo** | Probar la UI en el navegador (solo se verificó la API con curl). Borrar el usuario de prueba `qa…@test.com` de `db.sqlite3`. Revisar dependencias que metió el CLI de shadcn sin pedirlo (`lucide-react`, `@fontsource-variable/geist`, `shadcn` como dependencia de runtime). Completar el ticket en Jira con criterios de aceptación. | |

## Las tres líneas

1. **Hasta qué pieza llegué y cuál costó más:** llenar el AGENTS.MD
2. **Primera diferencia entre las dos salidas y dónde miraba:** generó mas cambios en otros archivos el que no tiene implementado el harness
3. **Algo escrito en el harness que el agente no cumplió:** `VALIDATOR.md` dice que los avisos del linter "arréglalos si son de tu cambio", y el aviso `react(only-export-components)` en `button.tsx` salió de ese mismo cambio (lo añadió `shadcn add`); el agente lo reportó como "código generado" y no lo arregló.
