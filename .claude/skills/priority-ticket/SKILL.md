---
name: priority-ticket
description: Trae de Jira el ticket de mayor prioridad asignado al usuario en «Por hacer», resume sus criterios de aceptación, entra en plan mode y propone cómo implementarlo; al aprobarse el plan, mueve el ticket a «En curso». Úsala cuando el usuario quiera empezar el siguiente ticket del tablero.
disable-model-invocation: true
allowed-tools: mcp__atlassian__getAccessibleAtlassianResources, mcp__atlassian__searchJiraIssuesUsingJql, mcp__atlassian__getJiraIssue, mcp__atlassian__getTransitionsForJiraIssue, mcp__atlassian__transitionJiraIssue, EnterPlanMode, ExitPlanMode, Read, Glob, Grep
---

# /priority-ticket

Tablero: proyecto `FLOW` en `websoluzion.atlassian.net` (servidor MCP `atlassian` del proyecto). Usa `websoluzion.atlassian.net` como `cloudId`; si falla, obtén el id con `getAccessibleAtlassianResources`. Si el sitio que aparece no es `websoluzion`, para y avisa: el MCP está autenticado con otra cuenta.

## 1. Traer el ticket

Busca con `searchJiraIssuesUsingJql`:

```
project = FLOW AND assignee = currentUser() AND status = "Por hacer" ORDER BY priority DESC, rank ASC
```

Si la consulta falla por el nombre del estado, repítela con `statusCategory = "To Do"` en lugar de `status = "Por hacer"`.

- Toma el **primero** del resultado (mayor prioridad; a igual prioridad, el que va antes en el tablero).
- Si no hay ninguno, dilo y termina: no inventes ticket ni cojas uno sin asignar.
- Lee el ticket completo con `getJiraIssue` (descripción en markdown).

## 2. Resumir

Muestra al usuario, breve:

- Clave, título, prioridad y enlace (`https://websoluzion.atlassian.net/browse/<CLAVE>`).
- **Criterios de aceptación** en lista, uno por línea, tal como los pide el ticket. Si el ticket no tiene sección de criterios, dilo y deduce los implícitos de la descripción, marcándolos como deducidos.

## 3. Plan mode

Entra en plan mode (`EnterPlanMode`) y, antes de proponer nada, lee el código que toca el ticket: `CLAUDE.md`, y en el backend las rutas, validadores y transformers implicados (el contrato real de la API manda sobre lo que diga el ticket; si el ticket se queda corto respecto a lo que exige el backend, señálalo en el plan).

El plan debe incluir:

- Cada criterio de aceptación y qué cambio lo cubre.
- Archivos a crear o modificar.
- Dependencias nuevas, si hacen falta, y por qué.
- Huecos o ambigüedades del ticket y la decisión que propones para cada uno.
- Cómo se verifica (build, lint, prueba manual contra el backend).

Preséntalo con `ExitPlanMode`.

## 4. Al aprobarse el plan

Solo si el usuario **aprueba** el plan (si lo rechaza o pide cambios, sigue planificando y no toques Jira):

1. `getTransitionsForJiraIssue` sobre el ticket y elige la transición cuyo estado destino es «En curso».
2. Aplícala con `transitionJiraIssue` y confirma en una línea: `<CLAVE> → En curso`.
3. Si no existe esa transición, no la sustituyas por otra: avisa al usuario con las transiciones disponibles.
