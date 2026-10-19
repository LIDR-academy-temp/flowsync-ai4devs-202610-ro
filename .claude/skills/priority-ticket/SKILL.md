---
name: priority-ticket
description: Start working on the highest-priority Jira ticket assigned to you. Use this skill when the user says "empezar ticket", "comenzar tarea", "start ticket", "qué ticket arranco", "qué hago ahora", "próxima tarea", "siguiente ticket", "dame el ticket más prioritario", or wants to pick up the most important pending Jira task. Fetches the top-priority "Por hacer" ticket assigned to the current user, summarizes acceptance criteria, proposes an implementation plan in plan mode, and moves the ticket to "En curso" (In Progress) on approval.
---

# Priority Ticket

Workflow para arrancar el ticket de Jira de mayor prioridad asignado al usuario.

## Paso 1 — Traer el ticket

Obtén el `accountId` del usuario actual con `atlassianUserInfo`.

Luego llama a `searchJiraIssuesUsingJql` con:

```
assignee = "<accountId>" AND status = "Por hacer" ORDER BY priority DESC, created ASC
```

Toma el primer resultado. Si no hay tickets, informa al usuario y detente.

## Paso 2 — Resumir los criterios de aceptación

Lee el ticket completo con `getJiraIssue` (usa `view: "full"` para tener todos los campos).

Presenta al usuario:

```
🎫 [KEY-123] Título del ticket
📌 Prioridad: Alta
📝 Descripción breve (1-2 frases)

Criterios de aceptación:
• Criterio 1
• Criterio 2
• ...

ℹ️  Detalles: Épica / Sprint / Estimación (si están disponibles)
```

Los criterios de aceptación suelen estar en el campo `description` bajo encabezados como "Criterios de Aceptación", "Acceptance Criteria", "Definition of Done", o "DoD". Si no hay sección explícita, infiere los criterios de la descripción.

## Paso 3 — Plan de implementación (plan mode)

Llama a `EnterPlanMode`. Dentro del plan, propón los pasos concretos para implementar el ticket basándote en:
- Los criterios de aceptación resumidos
- El código existente en el repositorio actual
- Las convenciones y arquitectura del proyecto (ver CLAUDE.md si existe)

El plan debe listar archivos a crear/modificar, orden de cambios y cómo verificar cada criterio.

Espera a que el usuario apruebe el plan antes de continuar.

## Paso 4 — Mover el ticket a "En curso"

Cuando el usuario aprueba el plan:

1. Obtén las transiciones disponibles del ticket con `discover` buscando "get issue transitions" o usa `executeRead` con la operación correspondiente.
2. Encuentra la transición cuyo nombre sea "En curso", "In Progress", o "En progreso".
3. Llama a `transitionJiraIssue` con el ticket y el ID de transición correcto.
4. Confirma al usuario: "Ticket [KEY-123] movido a En curso. ¡Arrancamos!"
5. Llama a `ExitPlanMode` y comienza la implementación.

## Manejo de errores

- **Sin tickets asignados:** "No tenés tickets en estado Por hacer asignados a vos."
- **Transición no encontrada:** Muestra las transiciones disponibles y pide al usuario que elija.
- **Error de autenticación Jira:** Pide al usuario que ejecute `/mcp` para reconectarse.
