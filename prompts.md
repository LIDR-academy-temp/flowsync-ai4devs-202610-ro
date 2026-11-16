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

**Modelo:** Opus 5.5
**Herramienta:** Claude Code (extensión de VS Code)

```
Audita las reglas de proceso de CLAUDE.md (solo la sección "## Reglas de proceso") contra los últimos 15 commits del repositorio (git log -15 desde HEAD) y el estado actual del árbol.

Restricciones, no negociables:
- Es una auditoría, no un arreglo. NO modifiques, crees, borres ni formatees ningún archivo, salvo docs/auditoria/grr.md y prompts.md. Si encuentras algo roto, no lo corrijas: solo lo anotas.
- Las reglas de proceso de CLAUDE.md son el objeto de la auditoría y no se aplican a esta petición: no hagas commit, no crees ramas, no uses /commit, no abras PR y no lances el adversarial-reviewer.
- Usa solo comandos de lectura: git log, git show, git branch -a, git status, git diff, gh pr list / gh pr view (sobre origin y sobre upstream LIDR-academy-temp/flowsync-ai4devs-202610-ro), y lectura de archivos.

Qué hacer:
1. Separa la sección en reglas atómicas: si una frase pide dos cosas, son dos filas.
2. Comprueba cada regla contra el historial y el árbol.
3. En docs/auditoria/grr.md, debajo de la sección "## Mi apuesta" (que no debes tocar), añade una sección "## Tabla" con una fila por regla y exactamente estas columnas:
   | # | Qué pide la regla | Qué se miró | Veredicto | Evidencia | Qué haría |
   - Qué pide la regla: una frase.
   - Qué se miró: el comando exacto o la ruta del archivo. Si no hay nada que mirar, dilo.
   - Veredicto: solo "se cumple", "no se cumple" o "no se puede comprobar con lo que hay". Un "se cumple" sin evidencia concreta es "no se puede comprobar con lo que hay".
   - Evidencia, en una línea: si no se cumple, el hash del commit o el archivo donde se rompió; si no se puede comprobar, qué rastro faltaría para poder comprobarla.
   - Qué haría: una sola palabra: dejarla, borrarla o bajarla (a algo que se ejecute solo).
4. La tabla tiene que caber en una pantalla y solo puede contener reglas de proceso.
5. En el chat, devuélveme solo la lista de comandos que ejecutaste para cada regla, para que yo pueda repetir alguno.
```

**Qué salió:** 14 reglas atómicas: 2 se cumplen, 3 no se cumplen (nombre `feat/*`, commits directos en `s5/start`, PR ausente) y 9 no se pueden comprobar por falta de rastro.

## Prompt 2

**Modelo:** Opus 5.5
**Herramienta:** Claude Code (extensión de VS Code)

```
Haz double check de la columna veredicto, asegúrate de que en verdad no se puede comprobar y de que la evidencia hace match con el veredicto. También reconfirma la columna "Qué haría".
```

**Qué salió:** encontró que el historial está reescrito (padre con committer posterior al hijo, hash 5cb8726 citado que no existe), así que las filas 5 y 10 pasan de "no se cumple" a "no se puede comprobar"; la fila 4 se apoya en el README del curso; la 14 pasa de borrarla a dejarla. Queda: 2 se cumplen, 1 no se cumple, 11 no se pueden comprobar.
