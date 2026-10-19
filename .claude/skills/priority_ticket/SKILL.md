---
description: Trae de Jira el ticket de mayor prioridad asignado a mí en «Por hacer», resume sus criterios de aceptación, entra en plan mode para proponer cómo implementarlo y, cuando apruebo el plan, lo mueve a «En curso». Úsala cuando pida /priority_ticket o "¿qué ticket me toca?".
disable-model-invocation: true
allowed-tools: mcp__atlassian__getAccessibleAtlassianResources mcp__atlassian__atlassianUserInfo mcp__atlassian__searchJiraIssuesUsingJql mcp__atlassian__getJiraIssue mcp__atlassian__getTransitionsForJiraIssue mcp__atlassian__transitionJiraIssue
---

# /priority_ticket

Flujo para empezar a trabajar en el ticket más prioritario que tengo asignado.
Usa las herramientas del MCP `atlassian` (`mcp__atlassian__*`). Si no están
disponibles, usa las equivalentes de `mcp__claude_ai_Atlassian_MCP__*`. Si ninguna
responde, dime que ejecute `/mcp` para autenticarme y para.

Argumento opcional: `$ARGUMENTS` puede ser una clave de proyecto (p. ej. `FS`)
para limitar la búsqueda a ese proyecto.

## 1. Buscar el ticket

1. Obtén el `cloudId` con `getAccessibleAtlassianResources` (si hay varios sitios,
   pregúntame cuál usar).
2. Busca con `searchJiraIssuesUsingJql`:

   ```
   assignee = currentUser() AND status = "Por hacer" [AND project = <ARG>]
   ORDER BY priority DESC, rank ASC, created ASC
   ```

   Pide `maxResults: 5` y los campos `summary, status, priority, issuetype, description`.
   Si el JQL falla porque el estado no existe con ese nombre, reintenta con
   `statusCategory = "To Do"` en lugar de `status = "Por hacer"`.
3. Si no hay resultados, dímelo y termina.
4. Elige el primero. Si hay empate de prioridad con otros, menciónalos en una línea
   (clave + resumen) por si prefiero otro.

## 2. Leer y resumir

Lee el ticket completo con `getJiraIssue` (con `view: "full"` o los campos
necesarios para ver los custom fields). Los criterios de aceptación pueden estar:

- en un custom field tipo «Acceptance Criteria» / «Criterios de aceptación», o
- dentro de la descripción, bajo un encabezado de ese estilo, o como Given/When/Then
  o checklist.

Muéstrame:

- **Clave, título, tipo, prioridad** y enlace al ticket.
- **Contexto**: 2-3 líneas sobre qué pide.
- **Criterios de aceptación**: lista numerada, cada uno reescrito de forma breve y
  verificable. Si no hay criterios explícitos, dilo claramente e infiere los mínimos
  a partir de la descripción, marcándolos como *inferidos*.
- **Dudas o huecos** del ticket, si los hay.

## 3. Plan mode

Entra en plan mode (`EnterPlanMode`). Dentro, sin modificar nada:

1. Explora el repo actual para ver qué existe ya y qué afecta al ticket (respeta
   las instrucciones de `CLAUDE.md` del proyecto).
2. Prepara un plan que incluya:
   - Archivos a crear o modificar.
   - Pasos de implementación en orden.
   - Cómo se verifica **cada** criterio de aceptación (tests, comando, prueba manual).
   - Riesgos o decisiones abiertas.
3. Presenta el plan con `ExitPlanMode`. Indica en el plan que, al aprobarlo, el
   ticket <CLAVE> pasará a «En curso».

## 4. Al aprobar el plan

Solo si apruebo el plan (si lo rechazo o pido cambios, el ticket no se toca):

1. `getTransitionsForJiraIssue` sobre el ticket y busca la transición cuyo destino
   sea «En curso» (o, si no existe con ese nombre, la de categoría «In Progress»).
2. Ejecútala con `transitionJiraIssue`.
3. Confírmame el nuevo estado. Si la transición falla o no existe, dímelo con el
   error y sigue igualmente con la implementación.
4. Empieza a implementar el plan aprobado.
