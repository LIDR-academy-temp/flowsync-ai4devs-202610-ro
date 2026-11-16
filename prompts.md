# Prompts


## Prompt 1

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

Abre el archivo CLAUDE.md de la raíz del proyecto.

Localiza la sección que contiene las reglas de proceso, concretamente las que indican:

- Qué hay que hacer antes de modificar código.
- Cuándo hay que realizar commits.
- Qué comprobaciones o tareas hay que hacer al cerrar un trabajo.

Muéstrame todas esas reglas literalmente, agrupadas por temática.

No modifiques ningún archivo ni ejecutes ninguna acción que cambie el repositorio.

**Qué salió:** Funcionó a la primera. Claude localizó y solo reprodujo 3 reglas.


## Prompt 2

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

Abre el archivo CLAUDE.md de la raíz del proyecto.

Localiza la sección que contiene las reglas de proceso, concretamente las que indican:

Desglosa cada regla.

No modifiques ningún archivo ni ejecutes ninguna acción que cambie el repositorio.

**Qué salió:** Funcionó a la primera. Claude devolvio 11 reglas.

## Prompt 3

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

Vas a hacer una AUDITORÍA, no un arreglo. Prohibido modificar, crear, borrar, stagear o commitear cualquier archivo, con una única excepción: docs/auditoria/AMR.md. Tampoco cambies de rama, no hagas fetch/pull/push y no abras PRs. Si ves algo roto, lo anotas; no lo corriges.

QUÉ AUDITAR
Las reglas de la sección "Reglas de proceso" de CLAUDE.md (solo esa sección). Antes de auditar, divide cada viñeta en reglas atómicas: si una viñeta pide dos cosas, son dos filas.

CONTRA QUÉ
Los últimos 15 commits del repositorio (git log -15, incluyendo en qué rama cayó cada uno) y el estado actual del árbol. Si usas gh para PRs, indícalo. No uses nada fuera de esa ventana salvo que lo digas explícitamente en la evidencia.

FORMATO (no negociable)
Una tabla markdown, una fila por regla, con exactamente estas 5 columnas:
1. Qué pide la regla — una frase.
2. Qué se miró — el comando exacto que ejecutaste o el archivo concreto que leíste. Sin esto, la fila no se escribe.
3. Veredicto — solo uno de estos tres: "se cumple", "no se cumple", "no se puede comprobar con lo que hay".
4. Evidencia — una línea. Si "no se cumple": hash del commit o archivo donde se rompe. Si "no se puede comprobar": qué rastro faltaría para poder comprobarla.
5. Acción — una palabra: dejarla, borrarla o bajarla.

CRITERIO
- "Se cumple" exige evidencia positiva y concreta (hash, archivo, salida de comando). Si solo es que no encontraste incumplimientos, o si la regla nunca llegó a activarse en la ventana, NO es "se cumple": usa "no se puede comprobar" y explica por qué.
- Si una regla depende de algo que vive fuera del repo (el chat, la sesión, qué skill se usó), dilo como tal; no lo infieras del estilo de los mensajes sin señalar que es una inferencia.
- No inventes hashes ni salidas: cada evidencia tiene que salir de un comando que hayas ejecutado en esta sesión.
- La tabla tiene que caber en una pantalla: frases cortas.

SALIDA
Escribe la tabla en docs/auditoria/AMR.md bajo un encabezado "## Tabla de auditoría". Si el archivo ya existe, no toques nada de lo que haya fuera de esa sección (puede contener mi apuesta). No escribas conclusiones, ni las "tres líneas", ni recomendaciones extra: eso lo hago yo.
Al terminar, ejecuta `git status --short` y enséñame la salida, para comprobar que solo cambió ese archivo. En el chat responde solo con esa salida y la lista de comandos que ejecutaste.

**Qué salió:** De las 11 reglas que salen al desglosar las cinco viñetas, 2 no se cumplen, 1 se cumple y 8 no se pueden comprobar con lo que hay