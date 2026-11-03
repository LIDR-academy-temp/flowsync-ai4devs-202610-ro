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
En castellano a partir de ahora, que es para un ejercicio de clase. Quiero que guardes todas mis prompts en prompts.md en la raíz del proyecto a partir de ahora. Luego crea docs/spec-viva/abm.md, que es donde resolveremos el ejercicio en los siguientes minutos.
```

## Prompt 2

**Modelo:** Opus 5.5
**Herramienta:** Claude Code (subagente Explore)

```
@Explore (agent) Vamos a documentar las specs de dos módulos de este proyecto: cuentas y acceso, ninguna más. Documentaremos lo que ocurre en la API y lo que ve el usuario en pantalla.
Seguiremos este formato:

## Purpose: una o dos frases que expliquen para qué existe esta capability.

## Requirements: sección que contiene los requisitos, cada uno encabezado por ### Requirement: y redactado con SHALL para indicar lo que debe hacer el sistema.

#### Scenario:: al menos uno por requisito, con dos viñetas: **WHEN***. Incluye las precondiciones dentro de WHEN, sin utilizar GIVEN.

Idioma: español, excepto las palabras clave de la RFC.

Respeta estas tres reglas:

No utilices ADDED, MODIFIED ni REMOVED. Son secciones propias de una especificación de cambios (delta). En este ejercicio nos centramos en documentar el comportamiento actual del sistema.

Describe solo comportamientos observables desde fuera. No incluyas nombres de clases, archivos ni rutas del código. En la API, describe peticiones y respuestas; en el frontend, lo que el usuario ve y puede hacer.

No modifiques el código. Aunque encuentres errores o inconsistencias, déjalos tal como están. Esos hallazgos forman parte del análisis de la parte B.
```

## Prompt 3

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```
Ok, por mi parte, no comprobaré esta documentación a mano, si no que vas a crearme TDD que respondan a la lógica G/W/T de abm.md (y sí, sé que sólo usa W/T, ya me entiendes). Si los tests pasan, mi lógica es que los specs que Explore ha encontrado son ciertas. Puede que no todas las funcionalidad y edge cases estén ahí, pero al menos no debería haber falsos positivos. Además, rellenarás las tres listas:

1. Requisitos generados y comprobados. Indica cuántos requisitos escribió el agente y cuántos verificaste tú consultando el código. Escribe ambos números, sin redondearlos ni justificarlos. Comprobar significa revisar el código para confirmar el comportamiento, no limitarse a leer un requisito que parece correcto.

2. Incoherencias detectadas. Anota cada inconsistencia en una línea e indica dónde aparece. No necesitas buscarlas expresamente: pueden surgir al intentar describir como regla general un comportamiento que no se cumple en todas las partes del sistema.

3. Comportamientos que no supiste clasificar como bug o contrato. Incluye al menos un caso en el que hayas encontrado un comportamiento y no tengas claro si es un error o si el sistema está diseñado para funcionar así. Explica brevemente las dos posibilidades y por qué el código no permite saber cuál es la correcta.

🧠 Por qué es importante la tercera lista. Una spec describe el comportamiento del sistema desde fuera, pero no todo puede deducirse observando sus respuestas.

Dos implementaciones distintas pueden responder igual a las mismas peticiones. Otros comportamientos solo pueden comprobarse ejecutando el sistema durante cierto tiempo o bajo determinadas condiciones. También encontrarás casos en los que el comportamiento es evidente, pero no puedes saber si responde a una decisión deliberada o es accidental.

Cuando no puedas determinarlo, deja constancia de la duda. Es preferible marcar un comportamiento como pendiente de aclaración que convertir una suposición en un requisito.


Cualquier duda que te surja, por favor pregunta.
```

## Prompt 4

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```
Quiero leer listas 2 i 3
```

## Prompt 5

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```
pq no puedo hacer un checkout a esta misma rama en otra pestaña de terminal? Es la primera vez que me pasa
```

## Prompt 6

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```
Commitea tests
```

## Prompt 7

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```
Ok, pasa la entrega a la rama de antes
```

## Prompt 8

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```
Añade el disclaimer a abm.md de que he usado IA para rebatir sus propios specs, comitea y abre PR.
```
