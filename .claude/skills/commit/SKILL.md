---
name: commit
description: Revisa el estado de Git y el diff staged (sin modificar archivos), propone un mensaje de commit convencional `tipo(scope): descripción` que describa realmente lo preparado, advierte de cambios no relacionados o archivos sensibles y, solo tras la confirmación explícita del usuario, crea el commit y muestra su resultado y hash.
disable-model-invocation: true
allowed-tools: Bash(git status:*), Bash(git diff:*), Bash(git log:*), Bash(git rev-parse:*), Bash(git show:*), Bash(git commit:*), Read, Grep, Glob, AskUserQuestion
---

# /commit

Crea un commit en FlowSync a partir de los cambios **ya preparados** (staged), con un mensaje convencional verificado contra el diff y **solo tras la confirmación explícita** del usuario.

Responde siempre en español.

## Reglas inquebrantables

- **No modifiques el working tree ni el índice.** Nada de `git add`, `git restore`, `git reset`, `git stash`, `git checkout`, `git rm`, ni Edit/Write sobre archivos del repo. Lo que entra en el commit es exactamente lo que el usuario dejó staged.
- **No crees el commit sin confirmación explícita.** Confirmación es un "sí / confirmo / adelante / haz el commit" inequívoco referido al mensaje propuesto, o elegir la opción de confirmar en `AskUserQuestion`. Silencio, preguntas o comentarios sobre el mensaje **no** son confirmación: ajusta y vuelve a preguntar.
- **Nunca** uses `--no-verify`, `--amend`, `--allow-empty`, `-a`/`--all` ni hagas `git push`.
- Si el usuario pide incluir o excluir archivos, no lo hagas tú: indícale el comando (`git add <ruta>` / `git restore --staged <ruta>`) para que lo ejecute él (puede usar `! <comando>`) y vuelve a empezar desde el Paso 1.

## Paso 1 — Estado de Git

Ejecuta (en paralelo, son de solo lectura):

- `git status --short --branch`
- `git diff --cached --stat`
- `git log --oneline -10` (para seguir el estilo de los mensajes del repo)

Anota: rama actual, archivos staged, archivos modificados sin preparar y archivos sin seguimiento.

## Paso 2 — ¿Hay cambios staged?

Si `git diff --cached --quiet` termina con código 0 (o `--stat` sale vacío), **no hay nada preparado**:

- Dilo claramente: «No hay cambios staged, así que todavía no puedo crear el commit.»
- Si hay cambios sin preparar o archivos sin seguimiento, lístalos y sugiere `git add <ruta>` para los que quiera incluir.
- **Detente aquí.** No propongas mensaje ni pidas confirmación.

## Paso 3 — Revisar el diff staged

Lee el diff completo con `git diff --cached` (si es muy grande, recórrelo por archivo con `git diff --cached -- <ruta>`). Puedes usar `Read`/`Grep` para entender el contexto, sin modificar nada.

Determina:

- **Qué cambia y por qué** (funcionalidad nueva, corrección, refactor, docs, configuración…).
- **Ámbito**: qué parte del repo toca (`frontend`, `backend`, `skills`, `claude`, una sesión del curso como `s1`, etc.).

## Paso 4 — Advertencias antes de continuar

Revisa y, si aplica, advierte **antes** de proponer el commit:

### Archivos sensibles
Señala cualquier archivo staged que pueda contener secretos o no deba versionarse, por ejemplo:

- `.env`, `.env.*` (salvo `.env.example`), claves (`*.pem`, `*.key`, `id_rsa*`), credenciales o tokens (incluidos tokens `oat_` o API keys dentro del diff).
- Bases de datos y temporales: `backend/tmp/`, `*.sqlite3`, `node_modules/`, `dist/`, `build/`.
- Configuración local o personal: `.claude/settings.local.json`, `.mcp.json` si contiene credenciales.
- Código generado que no se edita a mano: `backend/.adonisjs/`, `backend/database/schema.ts` cambiado sin migración nueva.

Recuerda también lo que dice `CLAUDE.md`: en este ejercicio el `backend/` no se modifica; si hay cambios staged en `backend/`, señálalo.

### Cambios no relacionados
Si el diff mezcla cambios de propósitos distintos (p. ej. una feature del frontend + ajustes de configuración de Claude + docs sin relación), adviértelo y sugiere dividirlo en varios commits indicando qué archivos irían en cada uno.

Si hay alguna advertencia, pregunta con `AskUserQuestion` si quiere continuar igualmente o ajustar el staging primero. Si decide ajustar, dale los comandos y detente.

## Paso 5 — Proponer el mensaje

Formato:

```
tipo(scope): descripción
```

- **tipo**, uno de:
  - `feat`: funcionalidad nueva
  - `fix`: corrección de un bug
  - `refactor`: cambio interno sin alterar el comportamiento
  - `test`: tests nuevos o modificados
  - `docs`: solo documentación
  - `chore`: mantenimiento, dependencias, configuración del proyecto
  - `harness`: configuración del entorno de Claude Code (skills, `CLAUDE.md`, `.claude/`, `.mcp.json`, hooks)
- **scope**: corto, en minúsculas, refleja el área tocada (`frontend`, `auth`, `skills`, `s1`…). Puede omitirse si no aporta (`tipo: descripción`).
- **descripción**: en español, en presente, minúscula inicial, sin punto final, ≤ 72 caracteres en total para la primera línea. Sigue el estilo de `git log`.
- **Cuerpo** (opcional): tras una línea en blanco, viñetas breves si el commit tiene varias piezas relevantes o conviene explicar el porqué.
- Si las instrucciones de la sesión exigen líneas de atribución (p. ej. `Co-Authored-By:`), añádelas al final del mensaje.

## Paso 6 — Verificar que el mensaje describe lo staged

Antes de mostrarlo, comprueba punto por punto:

- Cada afirmación del mensaje está respaldada por el diff staged (nada de cambios sin preparar ni intenciones futuras).
- El tipo y el scope encajan con los archivos realmente afectados.
- No se omite ningún cambio significativo del diff.

Si algo no cuadra, corrige el mensaje.

## Paso 7 — Pedir confirmación

Muestra:

- Rama actual.
- Lista de archivos staged (de `git diff --cached --stat`).
- Advertencias pendientes, si las hay.
- El mensaje propuesto completo en un bloque de código.

Pregunta con `AskUserQuestion`, con opciones como:

1. **Crear el commit** con este mensaje
2. **Editar el mensaje** (el usuario indica el cambio; vuelve al Paso 6 con el nuevo mensaje)
3. **Cancelar**

Si cancela, termina sin hacer nada más.

## Paso 8 — Crear el commit

Solo tras la confirmación explícita, crea el commit con el mensaje exacto confirmado, usando un heredoc para preservar el formato:

```bash
git commit -m "$(cat <<'EOF'
tipo(scope): descripción

cuerpo opcional
EOF
)"
```

- Si falla (hook de pre-commit, conflicto, identidad de Git sin configurar…), muestra el error tal cual, explica la causa probable y **detente**. No reintentes con `--no-verify` ni `--amend`; si un hook modificó archivos, indícalo y deja que el usuario decida.

## Paso 9 — Mostrar el resultado

Tras un commit correcto, ejecuta:

- `git log -1 --stat --format='%H%n%an <%ae>%n%ad%n%n%B'`
- `git status --short --branch`

Y muestra:

- **Hash** completo y corto (`git rev-parse --short HEAD`).
- Mensaje, autor y archivos incluidos.
- Estado resultante (p. ej. si quedan cambios sin preparar). No hagas push.
