## Prompt 1

**Modelo:** Opus 5.5 (claude-opus-5-5)
**Herramienta:** Claude Code

```
revisa si los tests del proyecto cubren de verdad el req
uisito  openspec/specs/tasks/spec.md «Lo que cada tarea
muestra de su responsable»
```

**Qué salió:** revisó sus propios tests y encontró que c
ubren menos de lo que pide el requisito.

## Prompt 2

**Modelo:** Opus 5.5 (claude-opus-5-5)
**Herramienta:** Claude Code

```
genera una matriz de trazabilidad
  - Arriba, dos números: scenarios totales y cuántos están cubiertos.
  - Una fila por scenario, con cuatro columnas:
    - el scenario en una línea;
    - el nombre exacto del test que lo cubre;
    - Cubierto / No cubierto / No lo sé;
    - si pusiste "No lo sé", qué te faltó para decidirlo.
  - Para marcar "Cubierto" tienes que abrir el test y leer qué comprueba. Que el nombre se parezca no basta.
```

**Qué salió:** Añadió a docs/verificacion/ap.md una matriz, hecha contra la suite actual (0 cubiertos)

## Prompt 3

**Modelo:** Opus 5.5 (claude-opus-5-5)
**Herramienta:** Claude Code

```

Por cada fila en No cubierto, escribe el test que falta — uno por scenario — siguiendo el estilo de los que ya existen en el proyecto. Sin tocar nada fuera de la carpeta de tests. Cuando los tengas, ejecútalos.
```

**Qué salió:** Escribió los tres tests en backend/tests/functional/tasks/assignee.spec.ts, uno por scenario.

## Prompt 4

**Modelo:** Opus 5.5 (claude-opus-5-5)
**Herramienta:** Claude Code

```
tasks/*
```

**Qué salió:** ejecutó: 2 en verde y 1 en rojo

- ✅ el responsable llega con su nombre y sus iniciales
- ✅ un responsable sin nombre llega con nombre nulo y con iniciales
- ❌ ni la tarea suelta ni la lista exponen el email del responsable: en la lista, el assignee trae email (assignee.spec.ts:77).

Si quieres lanzarlas tú y que la salida aparezca aquí en el chat, escribe en el prompt:

! cd backend; node ace test --files="tasks/*"

Ojo: tasks/* solo no es un comando. Es el valor de la opción --files, así que tiene que ir detrás de node ace test..
