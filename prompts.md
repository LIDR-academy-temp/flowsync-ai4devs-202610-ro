# Prompts

> **Transparencia:** este ejercicio lo ejecutó Claude Code (agente) a petición del alumno, con el plazo ya vencido.
> El alumno lanzó los prompts 1-3 al agente principal; el agente montó el harness y lanzó él mismo los prompts 4 y 5
> como subagentes de planificación (solo lectura). Los prompts están pegados tal cual se lanzaron.

---

## Prompt 1

**Modelo:** Claude Opus 5.5
**Herramienta:** Claude Code (app de escritorio, pestaña Code)

```
(pegado del enunciado del ejercicio completo desde training.lidr.co, sin texto propio)
```

**Qué salió:** el agente revisó el entorno (carpeta vacía, Node 22, sin `gh`, fork inexistente) y pidió usuario de GitHub e iniciales.

## Prompt 2

**Modelo:** Claude Opus 5.5
**Herramienta:** Claude Code (app de escritorio)

```
noureddine anchaoui
```

**Qué salió:** dedujo la cuenta `noureddine-lluert` por SSH, clonó `LIDR-academy-temp`, vio que el README pide Node 24; instaló Node 24 con nvm, levantó backend y frontend, creó `harness-na` y la copia `flowsync-sin-harness`.

## Prompt 3

**Modelo:** Claude Opus 5.5
**Herramienta:** Claude Code (app de escritorio)

```
creala y entregala
```

**Qué salió:** montó el harness (CLAUDE.md, Prettier + hook PostToolUse, AGENTS.md) y lanzó los prompts 4 y 5. El fork lo tiene que crear el alumno (no hay `gh` y el navegador no tenía sesión de GitHub).

## Prompt 4 — copia SIN harness

**Modelo:** Claude Opus 5.5 (subagente Plan, solo lectura)
**Herramienta:** Claude Code, lanzado por el agente

```
Directorio de trabajo: /var/www/projectes/classes_IA_dev/flowsync-sin-harness

Este es el ticket de mayor prioridad asignado a mí en «Por hacer». Resume sus criterios de aceptación y entra en plan mode: propón cómo implementarlo. No edites ningún archivo.

# Implementar login en el frontend

## Descripción
Implementar la autenticación en el frontend, consumiendo el backend de auth ya existente (`POST /api/v1/auth/signup`, `POST /api/v1/auth/login`). Usar shadcn/ui para los componentes.

## Criterios de aceptación
- Pantalla de registro (email+password) que llama a `POST /api/v1/auth/signup`.
- Pantalla de login (email+password) que llama a `POST /api/v1/auth/login` y guarda el token recibido.
- Tras login exitoso: redirige a una vista protegida (p. ej. perfil) que consuma `GET /api/v1/account/profile`.
- Credenciales inválidas en login, o email ya registrado en signup, muestran un mensaje claro — no un error genérico ni de consola.
- Enlace de navegación entre login y registro.

Al terminar, añade al final de tu respuesta una sección "## Ficheros" con la lista exacta de archivos que el plan crearía o modificaría.
```

**Qué salió:** plan completo a la primera; terminó con 4 preguntas de decisión.

## Prompt 5 — copia CON harness

**Modelo:** Claude Opus 5.5 (subagente Plan, solo lectura)
**Herramienta:** Claude Code, lanzado por el agente

```
Directorio de trabajo: /var/www/projectes/classes_IA_dev/flowsync-ai4devs

[Contexto de proyecto cargado automáticamente al arrancar en este directorio: contenido de CLAUDE.md — léelo tú mismo en /var/www/projectes/classes_IA_dev/flowsync-ai4devs/CLAUDE.md antes de nada y síguelo.]

Este es el ticket de mayor prioridad asignado a mí en «Por hacer». Resume sus criterios de aceptación y entra en plan mode: propón cómo implementarlo. No edites ningún archivo.

# Implementar login en el frontend

## Descripción
Implementar la autenticación en el frontend, consumiendo el backend de auth ya existente (`POST /api/v1/auth/signup`, `POST /api/v1/auth/login`). Usar shadcn/ui para los componentes.

## Criterios de aceptación
- Pantalla de registro (email+password) que llama a `POST /api/v1/auth/signup`.
- Pantalla de login (email+password) que llama a `POST /api/v1/auth/login` y guarda el token recibido.
- Tras login exitoso: redirige a una vista protegida (p. ej. perfil) que consuma `GET /api/v1/account/profile`.
- Credenciales inválidas en login, o email ya registrado en signup, muestran un mensaje claro — no un error genérico ni de consola.
- Enlace de navegación entre login y registro.

Al terminar, añade al final de tu respuesta una sección "## Ficheros" con la lista exacta de archivos que el plan crearía o modificaría.
```

**Qué salió:** plan completo a la primera, sin preguntas abiertas. La línea entre corchetes es la única diferencia con el prompt 4: emula la carga automática de `CLAUDE.md`, porque el subagente arranca desde el directorio padre y no la haría solo.
