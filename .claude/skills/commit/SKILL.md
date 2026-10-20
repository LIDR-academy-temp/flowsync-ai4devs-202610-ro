---
name: commit
description: Crea un commit convencional (tipo(scope): descripción) a partir únicamente de los cambios ya preparados en git (staged). Nunca añade archivos al staging.
disable-model-invocation: true
allowed-tools: Bash(git diff --cached:*), Bash(git status:*), Bash(git log:*), Bash(git commit:*)
---

# /commit

Crea un commit a partir de **lo que ya está en staging**, nada más.

## Pasos

1. Inspecciona solo los cambios preparados:
   - `git diff --cached --stat` para ver los archivos.
   - `git diff --cached` para ver el contenido.
   - `git log -5 --oneline` para ver el estilo de mensajes del repo.
   - No uses `git diff` sin `--cached` para decidir el mensaje: los cambios sin preparar no forman parte del commit.
2. Si no hay nada en staging, díselo al usuario y termina. **No ejecutes `git add`** (ni `-a`, ni `commit -a`) ni ninguna otra forma de añadir archivos. Puedes sugerir qué archivos prepararía el usuario, pero no lo hagas tú.
3. Redacta el mensaje con formato:

   ```
   tipo(scope): descripción
   ```

   - **tipo**: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore` o `revert`, según lo que hagan los cambios.
   - **scope**: área afectada, corto y en minúsculas (por ejemplo `frontend`, `backend`, `auth`, `login`). Si los cambios abarcan áreas sin un nombre común claro, usa el más relevante.
   - **descripción**: imperativo o infinitivo, en minúsculas, sin punto final, idealmente de 72 caracteres o menos en la primera línea. Sigue el idioma de los commits recientes del repo (aquí, español).
   - Añade un cuerpo solo si el porqué no es evidente por el diff.
   - Si los cambios mezclan propósitos muy distintos, avisa al usuario de que convendría dividirlos en varios commits, pero crea uno con lo preparado.
4. Crea el commit con `git commit -m` (sin `-a`, sin `--no-verify`, sin `--amend`). Termina el mensaje con la línea de atribución indicada en las instrucciones de sesión, si las hay.
5. Si un hook de pre-commit falla, informa del error y no reintentes saltándote el hook.
6. Muestra al usuario el mensaje usado y el resultado de `git status --short` para que vea qué queda sin commitear.

## Reglas

- Solo staged: nunca `git add`, `git commit -a`, `git stash` ni nada que cambie qué está preparado.
- No hagas push.
- No incluyas en el mensaje cambios que no estén en `git diff --cached`.
