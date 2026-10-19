# Comparación: con harness vs. sin harness

> ⏱️ **Reloj agotado en la pieza 3.** El lanzamiento del ticket (A.3) y esta comparación se hicieron **después**, fuera de tiempo.

- **Ticket:** «Implementar login en el frontend» (Jira, proyecto FLOW)
- **Modelo:** Opus 5.5 en ambas copias · **Herramienta:** Claude Code
- **Con harness:** `/priority-ticket` · **Sin harness:** la misma instrucción escrita a mano

| Casilla | Con harness | Sin harness |
|---|---|---|
| 1. Archivos que propone tocar | 18 nombrados (9 de configuración + 9 de código) + 5 componentes shadcn; borra `App.css` | 15 nombrados (7 a modificar + 8 a crear) + 5 componentes shadcn; borra `App.css` |
| 2. Convenciones respetadas / no respetadas | ✅ Backend no se toca · `passwordConfirmation` y 8–32 del validador · respuesta envuelta en `{ data }` · errores 400/422 · verifica con `npm run build` / `npm run lint` · clave del ticket en el título y tabla criterio → cambio (lo pedía la skill). ❌ No crea rama (la regla de proceso, pieza 7, no llegué a montarla) | No había ninguna convención escrita. Aun así las **descubrió leyendo código y README**: backend no se toca, `passwordConfirmation`, `{ data }`, 400/422, build/lint. Incluso más preciso en un punto: `fullName` es obligatorio como clave (envía `null`). Mete un «Paso 0» ajeno a la tarea (copiar el plan a un archivo) |
| 3. Veces que tuve que intervenir | 0 durante la corrida (1 prompt). Antes, el ticket creado por el agente quedó en Backlog y lo moví a mano al Sprint | 4: no tenía Jira → 3 prompts extra + configurar el MCP a mano con `/mcp`. |
| 4. Qué arreglaría a mano | Poco: quitar el logout (no lo pide el ticket) o declararlo como extra; la skill dice «empieza a implementar» al aprobar, y eso habría que cortarlo | Quitar el «Paso 0»; ignoró que el plan debía guardarse en un archivo concreto (lo guardé yo); por lo demás, un plan equivalente |

**Comprobación en Jira tras la corrida:** FLOW-6 sigue en «To Do». La skill no movió el ticket sin aprobación, tal como dice.

---

## Parte B: las tres líneas

1. **Hasta qué pieza llegué y cuál me costó más:** Llegué hasta la pieza 3. Lo que más me costó trabajo fue entender la dinámica de trabajo en Claude Code y el alcance que se puede lograr al ejecutar prompts. 
2. **Primera diferencia entre las dos salidas y dónde estaba mirando:**  La primera diferencia que noté fue la indicación de que el signup exige passwordConfirmation, la contraseña va de 8 a 32 caracteres y los errores vuelven como 422 o 400. Esto lo noté porque explícitamente en el CLAUDE.md quedó descrito como algo que el ticket no especificaba.
3. **Algo escrito en el harness que el agente no cumplió:** La skill pide un plan con «archivos a crear o modificar, pasos en orden y cómo se verifica», pero al generar con harness no se generó la checklist de cumplimiento de criterios y el plan no tiene los pasos en orden. 
