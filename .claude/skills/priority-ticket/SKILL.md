---
name: priority-ticket
description: Busca en Jira (vía el MCP de Atlassian) el ticket de mayor prioridad asignado al usuario en estado "Por hacer", lo resume con sus criterios de aceptación, revisa el repo sin modificarlo y propone un plan en plan mode. Solo tras la aprobación explícita mueve el ticket a "En curso" e implementa.
disable-model-invocation: true
allowed-tools: mcp__atlassian__getAccessibleAtlassianResources, mcp__atlassian__atlassianUserInfo, mcp__atlassian__searchJiraIssuesUsingJql, mcp__atlassian__getJiraIssue, mcp__atlassian__getTransitionsForJiraIssue, Read, Grep, Glob
---

# /priority-ticket

Toma el ticket más prioritario que el usuario tiene pendiente en Jira y prepáralo para implementarlo en FlowSync, **sin tocar código ni Jira hasta que el plan esté aprobado**.

Responde siempre en español.

## Reglas inquebrantables

- Hasta que el usuario apruebe el plan de forma explícita:
  - **No** edites, crees ni borres archivos del repositorio (nada de Edit, Write, NotebookEdit ni comandos de shell que escriban).
  - **No** cambies el ticket en Jira: ni transiciones, ni ediciones, ni comentarios, ni worklogs.
- La aprobación explícita es: aceptar el plan al salir de plan mode (`ExitPlanMode`) o un "sí / apruebo / adelante" inequívoco del usuario referido a ese plan. Silencio, preguntas o comentarios sobre el plan **no** son aprobación: ajusta el plan y vuelve a pedirla.
- Respeta `CLAUDE.md`: el `backend/` no se modifica (solo se lee como contrato de la API); el trabajo va en `frontend/`. Si el ticket exige cambiar el backend, señálalo en el plan como riesgo/decisión pendiente en lugar de asumirlo.

## Paso 1 — Conectar con Jira

1. Llama a `mcp__atlassian__getAccessibleAtlassianResources` y toma el `cloudId` del sitio. Si hay varios sitios, pregunta al usuario cuál usar (con `AskUserQuestion`) y reutiliza ese `cloudId` en todas las llamadas.
2. Opcional: `mcp__atlassian__atlassianUserInfo` para confirmar con qué cuenta se está consultando (útil si la búsqueda no devuelve nada).

## Paso 2 — Buscar el ticket

Usa `mcp__atlassian__searchJiraIssuesUsingJql` con:

```jql
assignee = currentUser() AND status = "Por hacer" ORDER BY priority DESC, created ASC
```

Pide al menos los campos `summary`, `description`, `priority`, `status`, `issuetype`, `created`, `updated`, `labels`, `parent` y un `maxResults` de 20 para poder detectar empates.

- El ticket elegido es el primero de la lista (mayor prioridad).
- Si el JQL falla porque el estado `"Por hacer"` no existe en ese sitio, no inventes otro nombre: informa al usuario y pregunta si quiere reintentar con `statusCategory = "To Do"` (o el nombre exacto de su estado).

## Paso 3 — Casos especiales

### No hay tickets asignados en "Por hacer"
- Dilo claramente, indicando la cuenta consultada y el JQL usado.
- No entres en plan mode ni sigas con el resto de pasos.
- Sugiere comprobaciones: que el ticket esté realmente asignado a esa cuenta, que el estado se llame exactamente "Por hacer", o que el usuario indique una clave de ticket concreta. Termina ahí.

### Varios tickets con la misma prioridad máxima
- No elijas en silencio. Muestra los empatados en una tabla breve (clave, título, tipo, fecha de creación, última actualización).
- Recomienda uno con un criterio explícito (por defecto: el creado hace más tiempo; si alguno es un bloqueante o parte de una épica en curso, menciónalo).
- Pregunta al usuario con `AskUserQuestion` cuál quiere abordar (opción recomendada primero, marcada como "(Recomendado)"). Continúa solo con el elegido.

### Jira no está disponible o devuelve un error
- Si una llamada falla, reintenta **una sola vez** corrigiendo la entrada si el error lo sugiere (p. ej. `cloudId` incorrecto, campo inválido).
- Si vuelve a fallar (servidor MCP no conectado, error de autenticación/401/403, timeout, 5xx…):
  - Muestra el error tal cual y explica la causa probable.
  - Sugiere cómo resolverlo: revisar el servidor con `/mcp` y reautenticar el servidor `atlassian` (definido en `.mcp.json`), comprobar permisos en el proyecto de Jira o reintentar más tarde.
  - **Detente.** No inventes datos del ticket ni continúes con un plan basado en suposiciones. Como alternativa, ofrece continuar si el usuario pega el contenido del ticket manualmente.

## Paso 4 — Presentar el ticket

Si hace falta más detalle que el que devolvió la búsqueda, usa `mcp__atlassian__getJiraIssue`. Muestra:

- **Identificador** (clave, p. ej. `FS-12`) y enlace si está disponible.
- **Título**.
- **Prioridad**, tipo y estado actual.
- **Descripción** completa, convertida de ADF/markup a Markdown legible (sin resumirla ni recortarla).

## Paso 5 — Criterios de aceptación

Resume los criterios de aceptación como una lista numerada de condiciones verificables:

- Búscalos en la descripción (secciones tipo "Criterios de aceptación", "Acceptance criteria", "AC", Gherkin *Dado/Cuando/Entonces*) y en campos personalizados si existen.
- Si no hay criterios explícitos, dilo y propón unos **inferidos** de la descripción, marcados claramente como inferidos y pendientes de confirmar.
- Señala ambigüedades o contradicciones, en especial con el contrato real de la API (ver `CLAUDE.md`: p. ej. el signup exige `passwordConfirmation` aunque el ticket no lo mencione).

## Paso 6 — Revisar el contexto del repositorio (solo lectura)

Con `Read`, `Grep` y `Glob` (y comandos de shell estrictamente de lectura como `git status` o `git log`), revisa lo relevante para el ticket, por ejemplo:

- `CLAUDE.md` y la estructura de `frontend/` (`src/main.tsx`, `src/App.tsx`, `package.json`, configuración de Vite/TS/oxlint).
- Si el ticket toca la API: `backend/start/routes.ts`, los controladores implicados, `backend/app/validators/`, `backend/app/transformers/` y `backend/providers/api_provider.ts` para conocer rutas, payloads, respuestas `{ data: ... }` y errores (422/400).
- Dependencias que haría falta instalar (router, cliente HTTP, shadcn/ui, etc.) y si ya están presentes.

No ejecutes comandos que instalen, generen o modifiquen archivos.

## Paso 7 — Plan mode y propuesta

1. Entra en plan mode con `EnterPlanMode` (si ya estás en plan mode, continúa en él).
2. Redacta un plan concreto que incluya:
   - Ticket (clave y título) y criterios de aceptación que cubre.
   - Archivos a crear/modificar, con su ruta, y qué cambia en cada uno.
   - Dependencias nuevas y comandos a ejecutar (p. ej. `npx shadcn@latest init`, `npm install ...`).
   - Pasos ordenados de implementación.
   - Cómo se verificará cada criterio de aceptación (`npm run build`, `npm run lint`, prueba manual contra el backend en `:3333`, etc.).
   - Riesgos, supuestos y preguntas abiertas.
   - Nota final: al aprobarse, primero se moverá el ticket a "En curso" y después se implementará.
3. Presenta el plan con `ExitPlanMode` y espera la decisión del usuario. Si lo rechaza o pide cambios, ajústalo y vuelve a presentarlo; no toques nada mientras tanto.

## Paso 8 — Tras la aprobación explícita

En este orden estricto:

1. **Mover el ticket a "En curso"**:
   - `mcp__atlassian__getTransitionsForJiraIssue` para listar las transiciones disponibles.
   - Elige la transición cuyo destino sea "En curso". Si no existe o hay varias candidatas, pregunta al usuario cuál usar.
   - Ejecútala con `mcp__atlassian__transitionJiraIssue` y confirma el nuevo estado (p. ej. con `getJiraIssue`).
   - Si la transición falla, informa del error y pregunta si quiere implementar igualmente o detenerse. No empieces a implementar sin esa respuesta.
2. **Solo entonces** empieza la implementación siguiendo el plan aprobado. Si durante la implementación necesitas desviarte de forma significativa del plan, avisa y pide confirmación antes.
3. Al terminar, ejecuta las verificaciones del plan (`npm run build`, `npm run lint` en `frontend/`) e informa del resultado real, criterio por criterio. No cierres ni muevas el ticket a otro estado salvo que el usuario lo pida.
