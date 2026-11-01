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
**Herramienta:** Claude Code

```
el objetivo es ayudar a escribir la especificacion del codigo que ya existe y funciona del backend y frontend. sin proponer funcionalidades ni modificar codigo, debes analizar y documentar que es lo que hay y documentar como se comporta actualmente.
Traduce eso a requisitos WHEN/THEN
Como te comente solo vamos a trabajar con backend y frontend, pero vamos a acotarlo a solo el modulo de cuentas y acceso
el formato que vas a tomar para realizar la especificacion es el siguiente:

## Purpose: una o dos frases que expliquen para qué existe esta capability.

## Requirements: sección que contiene los requisitos, cada uno encabezado por ### Requirement: y redactado con SHALL para indicar lo que debe hacer el sistema.

#### Scenario:: al menos uno por requisito, con dos viñetas: **WHEN***. Incluye las precondiciones dentro de WHEN, sin utilizar GIVEN.
todo eso metelo en el archivo josesilva.md
```

**Qué salió:** (opcional, una línea) funcionó a la primera 
# Plan: spec viva del módulo "Cuentas y acceso" en docs/spec-viva/josesilva.md

