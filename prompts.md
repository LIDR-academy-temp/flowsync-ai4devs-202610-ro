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

Borra el ejemplo de abajo cuando escribas el primero.

---

## Prompt 1

**Modelo:** Sonnet 4.6
**Herramienta:** Claude Code

```
/init
```

**Qué salió:** falló con "API Error: 401 OAuth access token has expired". Tuve que hacer /login.

## Prompt 2

**Modelo:** Sonnet 4.6
**Herramienta:** Claude Code

```
/init
```

**Qué salió:** funcionó a la primera, generó CLAUDE.md. Incluyó una pista del README (que el ticket omite passwordConfirmation).

## Prompt 3

**Modelo:** Sonnet 4.6
**Herramienta:** Claude Code

```
Necesito conectar el servidor MCP de Atlassian a nivel de proyecto, óla configuración quede en el repositorio. Explícame qué vas a hacer en simples pasos y hazlo.
```

**Qué salió:** creó .mcp.json con mcp-remote y /v1/sse → en /mcp aparece failed

## Prompt 4

**Modelo:** Sonnet 4.6
**Herramienta:** Claude Code

```
La conexión del servidor de atlassian o aparece como failed en /mcp, debe usar https://mcp.atlassian.com/v2/mcp, modifica el archivo de configuración para usar http nativo  
```

**Qué salió:** cambió .mcp.json a type http + v2/mcp. Tras reiniciar y autenticar en /mcp, connected

## Prompt 5

**Modelo:** Sonnet 4.6
**Herramienta:** Claude Code

```
Crear una skill que contenga los siguientes pasos, teniendo en cuenta que el panel esta en idioma Español pero puede haber palabras en Ingles:  
1. Traer de Jira el ticket de mayor prioridad, asignado a ti, en estado «Por hacer».
2. Resumir sus criterios de aceptación.
3. Entrar en plan mode y proponer cómo implementarlo.
4. Cuando apruebes el plan, mover el ticket a «En curso».  
```

**Qué salió:** la creó global en ~/.claude/skills/start-ticket, con otro nombre y ORDER BY priority ASC

## Prompt 6

**Modelo:** Sonnet 4.6
**Herramienta:** Claude Code

```
Mover la skill al proyecto, en .claude/skills/priority-ticket/SKILL.md, con name: priority-ticket
borrar la versión global de ~/.claude/skills/start-ticket/
cambiar el orden a ORDER BY priority DESC
buscar solo tickets/tareas en «Por hacer»
```

**Qué salió:** movió la skill al proyecto, renombró, borró la global, corrigió DESC y estado. Todo a la primera
