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
Utiliza un subagente de exploración para entender el dominio relacionado con cuentas y acceso.
Trabaja exclusivamente en modo lectura.
No propongas cambios.
No generes código.
No generes requisitos OpenSpec.
Devuelve únicamente hallazgos organizados por áreas funcionales.
```

**Qué salió:** Se obtuvo un mapa completo del dominio de cuentas y acceso, identificando funcionalidades, flujos, restricciones, evidencias e inconsistencias presentes en la implementación actual.


## Prompt 2

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```
A partir de los hallazgos obtenidos, identifica únicamente los comportamientos observables relacionados con cuentas y acceso.
Ignora detalles de implementación.
Para cada comportamiento indica:
- Evidencia.
- Confirmado o inferido.
Agrupa los resultados por áreas funcionales.
```

**Qué salió:** Se obtuvo una lista de comportamientos observables relacionados con cuentas y acceso, clasificados según la evidencia disponible y su nivel de confirmación.


## Prompt 3

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```
A partir de los comportamientos observables confirmados, identifica los requisitos funcionales relacionados con cuentas y acceso e indica la evidencia que los respalda.
```

**Qué salió:** Se identificaron los requisitos funcionales actuales de cuentas y acceso a partir de comportamientos confirmados y evidencia verificable. Aparecieron discrepancias y aspectos pendientes de validación.


## Prompt 4

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```
A partir de los requisitos identificados, genera una propuesta de spec OpenSpec para el dominio de cuentas y acceso.

Formato:

## Purpose

## Requirements

### Requirement

#### Scenario
WHEN ...
THEN ...

Utiliza únicamente requisitos respaldados por evidencia confirmada.

No incluyas comportamientos inferidos ni ambigüedades.
```

**Qué salió:** Se generó una propuesta inicial de spec OpenSpec para el dominio de cuentas y acceso a partir de requisitos respaldados por evidencia confirmada.


## Prompt 5

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```
Reescribe la spec utilizando la terminología estándar de OpenSpec:

- Sustituye DEBE por SHALL.
- Mantén WHEN, THEN y AND en inglés.
- Conserva el resto del texto en español.

Guarda el resultado en:

docs/spec-viva/JLL.md
```

**Qué salió:** Se generó la versión final de la spec OpenSpec utilizando SHALL como palabra clave normativa y manteniendo la estructura estándar de Requirements y Scenarios.

