## Prompt 1

**Modelo:** Opus 5.5 (`claude-opus-5-5`)
**Herramienta:** Claude Code

```
  escribre las especificaciones del funcionamiento actual del sistema
  tanto backendo como el frontend del modeulo de cuentes y acceso,
  usa este formato:

## Purpose: una o dos frases que expliquen para qué existe esta capability.

## Requirements: sección que contiene los requisitos, cada uno encabezado por ### Requirement: y redactado con SHALL para indicar lo que debe hacer el sistema.

#### Scenario:: al menos uno por requisito, con dos viñetas: **WHEN***. Incluye las precondiciones dentro de WHEN, sin utilizar GIVEN.

Idioma: español, excepto las palabras clave de la RFC

no uses ADDED, MODIFIED ni REMOVED, describe solo comportamientos observables desde fuera. No incluyas nombres de clases, archivos ni rutas del código. En la API, describe peticiones y respuestas; en el frontend, lo que el usuario ve y puede hacer. 

No modifiques el codigo
```

**Qué salió:** el agente leyó el vertical en las dos capas y algunas librerías, sin ejecutar nada, y escribió `docs/spec-viva/ap.md` con 21 requisitos (12 de API y 9 de interfaz). El prompt no pedía la viñeta `**THEN**` y el agente la añadió igualmente.

---

## Prompt 2

**Modelo:** Opus 5.5 (`claude-opus-5-5`)
**Herramienta:** Claude Code

```
llena prompts.md
```

**Qué salió:** el agente rellenó este archivo con los dos prompts de la sesión.
