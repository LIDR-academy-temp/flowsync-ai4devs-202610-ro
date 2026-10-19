# Prompts

Aquí van **todos los prompts que lanzaste** para hacer el ejercicio, en el orden en que los
lanzaste, con el modelo y la herramienta de cada uno.

Esto no es papeleo. Lo que se revisa es **cómo pediste las cosas**, no solo lo que salió: un
resultado flojo con un prompt bueno y un resultado flojo con un prompt vago necesitan feedback
distinto, y sin este archivo no se distinguen.

---

## Prompt 1

**Modelo:Opus 5.5 · esfuerzo medio (por defecto)
**Herramienta:** Claude Code CLI v2.1.303 — copia con harness

```
/mpc
```

**Qué salió:** no funcionó: error de tecleo, el comando no existe.

## Prompt 2

**Modelo:Opus 5.5 · esfuerzo medio (por defecto)
**Herramienta:** Claude Code CLI v2.1.303 — copia con harness

```
run /mcp
```

**Qué salió:** no funcionó: lo envié como mensaje y el agente respondió que /mcp hay que escribirlo directamente.

## Prompt 3

**Modelo:Opus 5.5 · esfuerzo medio (por defecto)
**Herramienta:** Claude Code CLI v2.1.303 — copia con harness

```
/mcp
```

**Qué salió:** funcionó: autenticación con Atlassian correcta.

## Prompt 4

**Modelo:Opus 5.5 · esfuerzo medio (por defecto)
**Herramienta:** Claude Code CLI v2.1.303 — copia con harness

```
Lista los elementos del proyecto FLOW en mi Jira
```

**Qué salió:** funcionó a la primera: devolvió FLOW-1, FLOW-2 y FLOW-3.

## Prompt 5

**Modelo:Opus 5.5 · esfuerzo medio (por defecto)
**Herramienta:** Claude Code CLI v2.1.303 — copia con harness

```
/init
```

**Qué salió:** generó el CLAUDE.md base; después le añadí a mano la sección "Working rules".

## Prompt 6

**Modelo:Opus 5.5 · esfuerzo medio (por defecto)
**Herramienta:** Claude Code CLI v2.1.303 — copia con harness

```
/hooks
```

**Qué salió:** confirmé que el hook PostToolUse estaba cargado.

## Prompt 7

**Modelo:Opus 5.5 · esfuerzo medio (por defecto)
**Herramienta:** Claude Code CLI v2.1.303 — copia con harness

```
/memory
```

**Qué salió:** confirmé que el CLAUDE.md se estaba leyendo.

## Prompt 8 — el encargo, copia con harness

**Modelo:Opus 5.5 · esfuerzo medio (por defecto)
**Herramienta:** Claude Code CLI v2.1.303 — copia con harness

```
Implementa el ticket FLOW-5 de mi Jira.Implementa el ticket FLOW-5 de mi Jira.
```

**Qué salió:** completó el ticket sin intervenciones. Nota: el texto quedó pegado dos veces por error, así que no es literalmente idéntico al de la copia sin harness, aunque el contenido es el mismo.

## Prompt 9 — el encargo, copia sin harness

**Modelo:Opus 5.5 · esfuerzo medio (por defecto)
**Herramienta:** Claude Code CLI v2.1.303 — copia sin harness

```
Implementa el ticket FLOW-5 de mi Jira.
```

**Qué salió:** completó el ticket sin intervenciones.