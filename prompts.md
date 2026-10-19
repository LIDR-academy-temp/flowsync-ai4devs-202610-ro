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

**Modelo:** Opus 1M xHigh
**Herramienta:** Claude Code

```
Este es el ejemplo. Bórralo.

El prompt va aquí dentro, entero y con sus saltos de línea,
para que se sepa dónde empieza y dónde acaba.
```

**Qué salió:** (opcional, una línea) funcionó a la primera / tuve que insistir / me inventó una ruta que no existe.

## Prompt 1

**Modelo:** opus (claude-opus-5-5) Medium effort
**Herramienta:** Claude Code

```
Crea la conexión MCP a Atlassian Jira
```
**Qué salió:** Ha creado el .mcp.json a nivel de repositorio y me pide reiniciar "claude", para aprobar el nuevo MCP y autenticarlo.

## Prompt 2

**Modelo:** opus (claude-opus-5-5) Medium effort
**Herramienta:** Claude Code

```
 quiero que la skill que me has creado la pongas a nivel del repositorio actual
```
**Qué salió:** Ha creado la skill a nivel general y me indica que ha indicado que ha puesto disable-model-invocation: true para que lo tenga que llamar yo de forma explícita. Y me ha mostrado las instrucciones de uso

## Prompt 3

**Modelo:** opus (claude-opus-5-5) Medium effort
**Herramienta:** Claude Code

```
 Crea una skill personal "/priority_ticket" que trae el ticket de mayor prioridad asignado a mi en «Por hacer», resume sus criterios de aceptación, entra en plan mode y propone cómo implementarlo; al aprobar el plan, lo mueve a «En curso».
```
**Qué salió:** He movido la skill al repositorio: ahora está en .claude/skills/priority_ticket/SKILL.md y ya no queda copia en tu carpeta personal. El contenido no ha cambiado y se sigue invocando con /priority_ticket; puede que tengas que reiniciar la sesión para que la detecte.

## Prompt 4

**Modelo:** opus (claude-opus-5-5) Medium effort
**Herramienta:** Claude Code

```
 Crea un hook para este proyecto que , cada vez que el agente termine de editar, formatee el código.  Quiero usar Prettier (no está instalado)
```
**Qué salió:** Prettier ya está en el backend pero falta en el frontend, así que lo voy a instalar ahí con una configuración que mantenga el estilo actual (comillas simples, sin punto y coma). Me indica que "CLAUDE.MD" no sigue diciendo que el frontend no tiene formateador. ¿Quieres que lo actualice?

## Prompt 5

**Modelo:** opus (claude-opus-5-5) Medium effort
**Herramienta:** Claude Code

```
Actualiza "CLAUDE.md"
```
**Qué salió:** 
He actualizado CLAUDE.md y me indica los cambios que ha hecho.


## Prompt 6

**Modelo:** opus (claude-opus-5-5) Medium effort
**Herramienta:** Claude Code

```
 # Implementar login en el frontend

## Descripción
Implementar la autenticación en el frontend, consumiendo el backend de auth ya existente (`POST /api/v1/auth/signup`, `POST /api/v1/auth/login`). Usar shadcn/ui para los componentes.

## Criterios de aceptación
- Pantalla de registro (email+password) que llama a `POST /api/v1/auth/signup`.
- Pantalla de login (email+password) que llama a `POST /api/v1/auth/login` y guarda el token recibido.
- Tras login exitoso: redirige a una vista protegida (p. ej. perfil) que consuma `GET /api/v1/account/profile`.
- Credenciales inválidas en login, o email ya registrado en signup, muestran un mensaje claro — no un error genérico ni de consola.
- Enlace de navegación entre login y registro.
```
**Qué salió:** 


## Prompt 4

**Modelo:** opus (claude-opus-5-5) Medium effort
**Herramienta:** Claude Code

```
 
```
**Qué salió:** 
