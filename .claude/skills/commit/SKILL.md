---
name: commit
description: Crea un commit convencional (`tipo(scope): descripción`) a partir de los cambios preparados (staged). Úsala cuando el usuario pida commitear lo que tiene en el stage.
disable-model-invocation: true
allowed-tools: Bash(git status:*), Bash(git diff:*), Bash(git log:*), Bash(git commit:*)
---

# /commit

## Contexto

- Rama: !`git branch --show-current`
- Archivos preparados: !`git diff --cached --stat`
- Últimos commits (para seguir el estilo): !`git log --oneline -10`

## Pasos

1. Lee el diff preparado completo con `git diff --cached`. **Solo cuenta lo que está en el stage**: no hagas `git add` ni incluyas cambios sin preparar.
2. Si no hay nada preparado, dilo y termina. No prepares nada por tu cuenta.
3. Redacta el mensaje con el formato de Conventional Commits:

   ```
   tipo(scope): descripción

   cuerpo opcional
   ```

   - **tipo**: `feat`, `fix`, `refactor`, `perf`, `test`, `docs`, `style`, `build`, `ci`, `chore`. Elige el que describe el cambio principal; si los cambios son de naturaleza muy distinta, propón al usuario partirlos en varios commits en vez de forzar uno.
   - **scope**: la zona afectada, en minúsculas. En este repo: `frontend`, `backend`, `harness` (`.claude/`, `CLAUDE.md`, `.mcp.json`), o uno más concreto si todo cae en un módulo (`auth`, `profile`…). Si el cambio toca varias zonas sin una dominante, omite el scope.
   - **descripción**: en español, minúscula inicial, sin punto final, en presente (`añade`, `corrige`…), máximo ~72 caracteres en total en la primera línea. Dice **qué** cambia, no qué archivos.
   - **cuerpo**: solo si aporta el **porqué** o algo no obvio del diff. Líneas de ≤ 72 caracteres.
   - Cambio incompatible: `tipo(scope)!: …` y un pie `BREAKING CHANGE: …`.
   - Si el cambio implementa un ticket de Jira (aparece la clave `FLOW-N` en la rama o el usuario la ha mencionado), añade un pie `Refs: FLOW-N`.
4. Haz el commit pasando el mensaje con un heredoc (`git commit -F - <<'EOF' … EOF`). Nunca uses `--no-verify` ni `--amend` salvo que el usuario lo pida.
5. Si un hook de pre-commit falla, muestra el error y para: no lo saltes ni reintentes cambiando cosas sin preguntar.
6. Termina con una línea: el hash corto y la primera línea del mensaje (`git log --oneline -1`).
