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

**Modelo:** Opus 5.5 (effort medium)
**Herramienta:** Claude Code (copia CON harness)

```
/init
```

**Qué salió:** Archivo CLAUDE.md completado.

## Prompt 2

**Modelo:** Opus 5.5 (effort medium)
**Herramienta:** Claude Code (copia CON harness)

```
Revisa la conexión del mcp a jira
```

**Qué salió:** Contestó a través del conector «claude.ai Atlassian» (cuenta de empresa), no del servidor del proyecto.

## Prompt 3

**Modelo:** Opus 5.5
**Herramienta:** Claude Code (copia CON harness)

```
Tengo un conflicto, que se conecta a mi cuenta de jira de empresa y no me permite seleccionar la que he creado (https://websoluzion.atlassian.net/)
```

**Qué salió:** Diagnóstico: había dos servidores; «claude.ai Atlassian» solo veía deudae y el `atlassian` del proyecto estaba sin autenticar.

## Prompt 4

**Modelo:** Opus 5.5
**Herramienta:** Claude Code (copia CON harness)

```
a que cuenta se conecta de jira?
```

**Qué salió:** Confirmó que estaba conectado a la cuenta de empresa (Deudae).

## Prompt 5

**Modelo:** Opus 5.5 (effort medium)
**Herramienta:** Claude Code (copia CON harness)

```
como autentico ese mcp.json
```

**Qué salió:** Me dio los pasos para autenticarlo con `/mcp`.

## Prompt 6

**Modelo:** Opus 5.5 (effort medium)
**Herramienta:** Claude Code (copia CON harness)

```
no veo un atlassian aparte de Claude.ai atlassian
```

**Qué salió:** El servidor estaba desactivado en `settings.local.json` (había rechazado el aviso de aprobación); lo reactivó.

## Prompt 7

**Modelo:** Opus 5.5 (effort medium)
**Herramienta:** Claude Code (copia CON harness)

```
Revisa de nuevo la conexión a jira
```

**Qué salió:** El login ya estaba hecho, pero las herramientas no cargaban en esa sesión: había que reconectar.

## Prompt 8

**Modelo:** Opus 5.5 (effort medium)
**Herramienta:** Claude Code (copia CON harness)

```
Ahora parece que sí ha conectado bien, y he deshabilitado claude.ai atlassian
```

**Qué salió:** Confirmado: cuenta inavarro@websoluzion.com, sitio websoluzion y proyecto FLOW visibles.

## Prompt 9

**Modelo:** Opus 5.5 (effort medium)
**Herramienta:** Claude Code (copia CON harness)

```
Crea Una skill /priority-ticket: trae el ticket de mayor prioridad asignado a ti en «Por hacer», resume sus criterios de aceptación, entra en plan mode y propone cómo implementarlo; al aprobar el plan, lo mueve a «En curso».
```

**Qué salió:** Skill creada; no se pudo probar porque FLOW aún no tenía tickets.

## Prompt 10

**Modelo:** Opus 5.5 (effort medium)
**Herramienta:** Claude Code (copia CON harness)

```
Crea ahora Una skill /commit: un commit convencional (tipo(scope): descripción) a partir de los cambios preparados.
```

**Qué salió:** Skill `/commit` creada, sin probar (no había nada en stage).

## Prompt 11

**Modelo:** Opus 5.5 (effort medium)
**Herramienta:** Claude Code (copia CON harness)

```
Y crea ahora Un subagente adversarial-reviewer: revisa un pull request intentando romperlo, no aprobarlo, y sin editar nada.
```

**Qué salió:** Subagente creado con herramientas de solo lectura; sin probar (no hay PR).

## Prompt 12

**Modelo:** Opus 5.5 (effort medium)
**Herramienta:** Claude Code (copia CON harness)

```
Crea Un hook que formatea el frontend cada vez que el agente edita un archivo. El frontend no trae formateador: instala Prettier en frontend/ y dispáralo sobre frontend/src/**
```

**Qué salió:** Prettier instalado con el estilo del repo y hook PostToolUse probado a mano; corrigió por su cuenta un fallo con la ruta del enlace simbólico.

## Prompt 13

**Modelo:** Opus 5.5 (effort medium)
**Herramienta:** Claude Code (copia CON harness)

```
Modifica CLAUDE.md de modo que aplique las reglas de proceso: rama nueva antes de tocar código; al cerrar, /commit y el pull request con gh pr create; después, el subagente revisor sobre el pull request; y en el chat, solo la URL del pull request. Añadelo al final.
```

**Qué salió:** Añadió las reglas, pero metió dos extras por su cuenta (formato de rama, corregir y relanzar el revisor) avisando del choque con el enunciado.

## Prompt 14

**Modelo:** Opus 5.5 (effort medium)
**Herramienta:** Claude Code (copia CON harness)

```
El nombre de la rama está bien, pero si no queremos aplicar el plan según el enunciado, entonces el revisor al encontrar algo bloqueante no debe corregirlo y volver a ejecutar
```

**Qué salió:** Quitó lo de corregir y relanzar el revisor; dejó el formato de rama.

## Prompt 15

**Modelo:** Opus 5.5 (effort medium)
**Herramienta:** Claude Code (copia CON harness)

```
Crea un AGENTS.md como enlace a CLAUDE.md
```

**Qué salió:** Enlace simbólico `AGENTS.md` → `CLAUDE.md` creado.

## Prompt 16

**Modelo:** Opus 5.5 (effort medium)
**Herramienta:** Claude Code (copia CON harness)

```
Quiero hacer commit de los elementos del harness que hemos creado
```

**Qué salió:** Commit `e507ff9` del harness, sin `prompts.md` ni `settings.local.json`, sin push.

## Prompt 17

**Modelo:** Opus 5.5 (effort medium)
**Herramienta:** Claude Code (copia CON harness)

```
/priority-ticket
```

**Qué salió:** Trajo FLOW-1 y entró directo en plan mode, sin el resumen que pide la skill. Plan con tabla de huecos del ticket y cierre según las reglas de proceso. Sin aplicar.

## Prompt 18

**Modelo:** Opus 5.5
**Herramienta:** Claude Code (copia SIN harness)

```
Trae de Jira el ticket de mayor prioridad que tengo asignado en «Por hacer», resume sus criterios de aceptación y entra en plan mode para proponer cómo implementarlo.
```

**Qué salió:** No tenía acceso a Jira: no entró en plan mode y me pidió el ticket.

## Prompt 19

**Modelo:** Opus 5.5
**Herramienta:** Claude Code (copia SIN harness)

```
Te pego el ticket. Quiero que prepares un plan, pero que no lo ejecutes. Este es el contenido del jira:
Asunto: Implementar login en el frontend
Descripción: 

<pasted_content id="e769">
Implementar la autenticación en el frontend, consumiendo el backend de auth ya existente (POST /api/v1/auth/signup, POST /api/v1/auth/login). Usar shadcn/ui para los componentes.

Criterios de aceptación
Pantalla de registro (email+password) que llama a POST /api/v1/auth/signup.

Pantalla de login (email+password) que llama a POST /api/v1/auth/login y guarda el token recibido.

Tras login exitoso: redirige a una vista protegida (p. ej. perfil) que consuma GET /api/v1/account/profile.

Credenciales inválidas en login, o email ya registrado en signup, muestran un mensaje claro — no un error genérico ni de consola.

Enlace de navegación entre login y registro.
</pasted_content id="e769">
```

**Qué salió:** Resumió los criterios, exploró el código con un subagente y presentó el plan (proxy de Vite, sin rama ni PR). Sin aplicar.
