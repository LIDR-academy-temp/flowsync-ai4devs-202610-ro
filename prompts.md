# Prompts

Aquí van **todos los prompts que lanzaste** para hacer el ejercicio, en el orden en que los
lanzaste, con el modelo y la herramienta de cada uno.

Esto no es papeleo. Lo que se revisa es **cómo pediste las cosas**, no solo lo que salió: un
resultado flojo con un prompt bueno y un resultado flojo con un prompt vago necesitan feedback
distinto, y sin este archivo no se distinguen.

## Cómo rellenarlo

- Un apartado `## Prompt N` por cada prompt.
- **Pega el prompt tal cual lo lanzaste**, dentro del bloque de código, aunque ocupe diez líneas
  y aunque tenga faltas. No lo reescribas para que quede bien: el que arreglaste mentalmente
  después no es el que lanzaste.
- Incluye también los que **no funcionaron**. Suelen ser los más útiles de leer.
- `Modelo` y `Herramienta` en todos. Si cambiaste de una a otra a mitad, se nota aquí.

---

## Prompt 1

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```text
Crea una skill llamada /priority-ticket para este proyecto.

La skill debe:
1. Consultar Jira mediante el servidor MCP de Atlassian.
2. Buscar el ticket de mayor prioridad que esté asignado a mí y en estado "Por hacer".
3. Mostrar el identificador, título y descripción del ticket.
4. Resumir claramente sus criterios de aceptación.
5. Revisar el contexto relevante del repositorio, sin modificar archivos.
6. Entrar en plan mode y proponer un plan concreto para implementar el ticket.
7. No modificar código ni mover el ticket mientras el plan no sea aprobado explícitamente.
8. Cuando yo apruebe el plan, mover el ticket a "En curso" y recién entonces comenzar la implementación.

Incluye instrucciones para manejar estos casos:
- No hay tickets asignados en "Por hacer".
- Hay varios tickets con la misma prioridad.
- Jira no está disponible o devuelve un error.

Guarda la skill en la ubicación y formato que Claude Code reconoce para las skills del proyecto. No ejecutes todavía la skill ni implementes el ticket.
```

**Qué salió:** Creó `.claude/skills/priority-ticket/SKILL.md` sin ejecutar la skill ni modificar el código.

## Prompt 2

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```text
Crea una skill llamada /commit para este proyecto.

La skill debe:
1. Revisar el estado de Git y los cambios preparados para commit.
2. Revisar el diff staged sin modificar archivos.
3. Proponer un mensaje de commit convencional con el formato:
   tipo(scope): descripción
4. Usar tipos convencionales como feat, fix, refactor, test, docs, chore o harness.
5. Confirmar que el mensaje describa realmente los cambios preparados.
6. Si no hay cambios staged, informar claramente que no puede crear el commit todavía.
7. Si hay cambios no relacionados o archivos sensibles, advertirlo antes de continuar.
8. Pedir confirmación explícita antes de crear el commit.
9. Al confirmar, crear el commit usando el mensaje propuesto.
10. Mostrar el resultado del commit y su hash.

No ejecutes la skill ni crees ningún commit ahora. Solo crea la skill en la ubicación y formato que Claude Code reconoce para las skills del proyecto.
```

**Qué salió:** Creó `.claude/skills/commit/SKILL.md` sin ejecutar la skill ni crear un commit.

## Prompt 3

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```text
Crea un subagente llamado adversarial-reviewer para este proyecto.

Debe guardarse en la ubicación y formato que Claude Code reconoce para los subagentes del proyecto.

Objetivo:
Revisar un pull request intentando romperlo, no aprobarlo.

Reglas:
1. Recibir como entrada el número o URL de un pull request.
2. Leer el diff y los archivos relevantes del repositorio.
3. Revisar errores funcionales, casos límite, regresiones, validaciones faltantes, problemas de seguridad y violaciones de las convenciones documentadas en CLAUDE.md.
4. Priorizar hallazgos reales y reproducibles sobre comentarios de estilo.
5. No editar, crear ni borrar archivos.
6. No ejecutar comandos destructivos.
7. No aprobar ni modificar el pull request.
8. Informar cada hallazgo con severidad, archivo, líneas afectadas, explicación y una prueba o escenario para reproducirlo.
9. Si no encuentra problemas, decirlo claramente y explicar qué revisó.
10. Diferenciar entre un hallazgo confirmado y una sospecha que necesita verificación.

No ejecutes el subagente ahora ni revises ningún pull request. Solo crea su archivo de configuración.
```

**Qué salió:** Creó `.claude/agents/adversarial-reviewer.md` sin ejecutar el subagente ni revisar un pull request.

## Prompt 4

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```text
Crea un hook de Claude Code para este proyecto.

Objetivo:
Formatear automáticamente con Prettier los archivos del frontend cada vez que el agente edite un archivo.

Requisitos:
1. Usar el mecanismo de hooks que Claude Code reconoce para el proyecto.
2. Ejecutarse después de una edición exitosa de archivos.
3. Actuar solo si el archivo editado está dentro de frontend/src/.
4. Ejecutar Prettier usando la instalación local de frontend:
   frontend/node_modules/.bin/prettier --write <archivo>
5. No formatear backend/ ni archivos fuera de frontend/src/.
6. Manejar correctamente rutas con espacios o caracteres especiales.
7. Si Prettier falla, informar el error claramente y no ocultarlo.
8. No modificar otros hooks o configuraciones existentes.
9. No crear scripts innecesarios si el hook puede configurarse directamente.

No edites archivos de código ni ejecutes el hook ahora. Solo crea la configuración del hook.
```

**Qué salió:** Creó `.claude/settings.json` con un hook `PostToolUse` limitado a `frontend/src/**`.

## Prompt 5

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```text
Agrega al final de CLAUDE.md una sección llamada "Reglas de proceso para esta tarea".

Incluye estas reglas:
1. Antes de tocar código, verificar que se está trabajando en una rama nueva y confirmar su nombre.
2. Mantener el backend en modo solo lectura; los cambios de implementación deben hacerse en frontend/.
3. Al cerrar la implementación, revisar el diff y usar /commit para crear un commit convencional después de la confirmación explícita del usuario.
4. Después del commit, abrir el pull request desde la rama actual usando:
   gh pr create
   El pull request debe apuntar al repositorio del curso y describir los cambios y las verificaciones realizadas.
5. Después de crear el pull request, ejecutar el subagente adversarial-reviewer sobre ese pull request.
6. Si el revisor encuentra problemas, informarlos y no corregirlos automáticamente sin confirmación.
7. Al finalizar el flujo, responder en el chat únicamente con la URL del pull request.
8. Registrar todos los prompts usados en prompts.md, incluyendo los prompts que fallen.

No cambies ninguna otra sección de CLAUDE.md y no modifiques archivos de código.
```

**Qué salió:** Agregó la sección de reglas de proceso al final de `CLAUDE.md`; después se creó `AGENTS.md` como enlace simbólico a `CLAUDE.md`.

## Prompt 6

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```text
/priority-ticket
```

**Qué salió:** Encontró FLOW-1, revisó el contrato real de la API y propuso un plan sin modificar código ni mover el ticket a "En curso".

## Prompt 7

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```text
Busca en Jira el ticket de mayor prioridad asignado a mí que esté en estado "Por hacer". Muestra su identificador, título y descripción, resume sus criterios de aceptación y revisa el repositorio para proponer un plan concreto de implementación. No modifiques archivos ni cambies el estado del ticket; solo presenta el plan para que pueda compararlo con otra ejecución.
```

**Qué salió:** Encontró FLOW-1 y propuso un plan detallado sin modificar archivos ni cambiar el estado del ticket.
