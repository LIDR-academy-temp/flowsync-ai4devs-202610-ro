# Prompts

Aquí van **todos los prompts que lanzaste** para hacer el ejercicio, en el orden en que los
lanzaste, con el modelo y la herramienta de cada uno.

Esto no es papeleo. Lo que se revisa es **cómo pediste las cosas**, no solo lo que salió: un
resultado flojo con un prompt bueno y un resultado flojo con un prompt vago necesitan feedback
distinto, y sin este archivo no se distinguen.

---

## Prompt 1

**Modelo:** Sonnet 5.5 (claude-sonnet-5-5)
**Herramienta:** Claude Code

```
resume last commits
```

**Qué salió:** Resumen de los últimos commits de `auditoria-rt` y aviso de los dos `package-lock.json` sin commitear.

## Prompt 2

**Modelo:** Sonnet 5.5 (claude-sonnet-5-5)
**Herramienta:** Claude Code

````
Lee el archivo de instrucciones del agente en este repositorio (ej. `CLAUDE.md` o similar) y extrae ÚNICAMENTE las **reglas de proceso** (qué hacer antes de tocar código, cuándo/cómo hacer commits y qué hacer al cerrar el trabajo). Ignora reglas de estilo de código, arquitectura o negocio.

Reglas estrictas para este turno:
- No modifiques, crees ni borres ningún archivo todavía.
- Muéstrame en el chat una lista numerada con cada regla resumida en una sola frase. Si en un párrafo hay dos reglas distintas, sepáralas.
- Si alguna regla es ambigua, dime cuál es antes de continuar.
````

**Qué salió:** Lista de 13 reglas de proceso, con las ambigüedades y el conflicto con la memoria de no hacer push ni PR.

## Prompt 3

**Modelo:** Sonnet 5.5 (claude-sonnet-5-5)
**Herramienta:** Claude Code

```
No realices nada. Solo actualiza tu memoria
```

**Qué salió:** Memoria `no-push-no-pr` actualizada para que prevalezca `CLAUDE.md`, sin tocar el repo.

## Prompt 4

**Modelo:** Sonnet 5.5 (claude-sonnet-5-5)
**Herramienta:** Claude Code

```
aplica el plan
```

**Qué salió:** Confirmación de que el plan ya estaba aplicado (la memoria), sin cambios nuevos.

## Prompt 5

**Modelo:** Sonnet 5.5 (claude-sonnet-5-5)
**Herramienta:** Claude Code

````
Con las reglas de proceso confirmadas, realiza una auditoría contrastándolas contra los últimos 15 commits del repositorio (`git log -n 15`) y el estado actual del árbol de trabajo (`git status` / `git diff`).

### Restricciones críticas
- **Solo lectura:** Prohibido modificar, arreglar o borrar cualquier archivo del proyecto. La única escritura permitida es crear el reporte en `docs/auditoria/rt.md` (crea la carpeta si no existe).
- **Cero suposiciones:** Un veredicto "se cumple" sin un comando o archivo verificable detrás debe etiquetarse como "no se puede comprobar con lo que hay".

### Formato obligatorio en `docs/auditoria/rt.md`
Escribe una tabla Markdown con una fila por regla y exactamente estas 5 columnas:
1. **Qué pide la regla:** Una frase con tus palabras.
2. **Qué se miró para comprobarlo:** El comando `git` concreto o el archivo inspeccionado.
3. **Veredicto:** Usa exclusivamente una de estas tres opciones: `se cumple`, `no se cumple`, o `no se puede comprobar con lo que hay`.
4. **La evidencia:** En una sola línea. Si es `no se cumple`, indica el hash del commit o archivo donde se rompió. Si es `no se puede comprobar con lo que hay`, indica qué rastro o herramienta falta.
5. **Qué harías con ella:** Una sola palabra: `dejarla`, `borrarla` o `bajarla` (si es algo que se puede automatizar para que se ejecute solo).
````

**Qué salió:** Informe `docs/auditoria/rt.md` con 13 reglas: 4 se cumplen, 2 no se cumplen y 7 no se pueden comprobar.

## Prompt 6

**Modelo:** Sonnet 5.5 (claude-sonnet-5-5)
**Herramienta:** Claude Code

```
Renumera las reglas para saber que regla pertenece a las viñetas originales de CLAUDE.md. por ejemplo 1.1, 1.2, 2.1, 2.2, etc. Rescribe el archivo docs/auditoria/rt.md
```

**Qué salió:** `docs/auditoria/rt.md` reescrito con numeración de 1.1 a 5.1 y una tabla de las viñetas originales.

## Prompt 7

**Modelo:** Sonnet 5.5 (claude-sonnet-5-5)
**Herramienta:** Claude Code

````
Verifica con `git status` que el único archivo nuevo o modificado en todo el repositorio sea `docs/auditoria/rt.md`. 

Adicionalmente, dame el comando `git show` o `git log` exacto para que yo mismo pueda inspeccionar manualmente en mi terminal la evidencia de la regla más crítica que marcaste como "no se cumple" (o "se cumple" si todas pasaron).
````

**Qué salió:** `git status` mostró también los dos `package-lock.json` modificados de antes, y se dio `git reflog | tail -8` para la regla 1.4.

## Prompt 8

**Modelo:** Sonnet 5.5 (claude-sonnet-5-5)
**Herramienta:** Claude Code

````
Lee el archivo `prompts.md` y rellénalo con los prompts literales que te he enviado durante toda esta sesión (incluyendo este mismo prompt al final).

Sigue estas reglas estrictas:
1. **Estructura:** Conserva el encabezado principal `# Prompts` y la introducción, pero elimina la sección `## Cómo rellenarlo` y el `## Prompt 1` de ejemplo.
2. **Formato por prompt:** Usa exactamente la plantilla del archivo para cada uno de mis mensajes en orden cronológico (`## Prompt 1`, `## Prompt 2`, etc.):
   - `**Modelo:**` [Indica el modelo exacto que estás usando ahora; si no tienes acceso a ese dato, pon `COMPLETAR MANUALMENTE`].
   - `**Herramienta:**` [Indica la herramienta/CLI exacta desde donde ejecutamos esta sesión, ej. Claude Code / Cursor].
   - Bloque de código (` ``` `) con mi prompt **palabra por palabra**, respetando saltos de línea y sin corregir faltas ni resumir nada.
   - `**Qué salió:**` Una sola línea objetiva resumiendo el resultado de ese turno.
3. **Alcance:** Modifica únicamente `prompts.md`. No toques ningún otro archivo del repositorio.
````

**Qué salió:** `prompts.md` rellenado con los 8 prompts de la sesión, tras pasar por modo plan.
