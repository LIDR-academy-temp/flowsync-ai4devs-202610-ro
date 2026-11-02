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

**Modelo:** Sonnet 4.6
**Herramienta:** Claude Code

```
Vas a escribir la spec de comportamiento ACTUAL del vertical de cuentas y acceso
de este proyecto (registro, inicio de sesión, sesión y perfil), en sus dos capas:
- Backend: rutas, controladores, modelo de usuario, validadores y middlewares.
- Frontend: pantallas de acceso, estado de sesión y protección de rutas.

Reglas:
- No modifiques ningún archivo de código. Solo leer.
- Describí lo que el sistema hace HOY, no lo que debería hacer.
- Solo comportamiento observable desde fuera: en la API, petición y respuesta
  (método, ruta pública, códigos de estado, cuerpo); en pantalla, lo que una
  persona ve y puede hacer. Prohibido nombrar clases, archivos o rutas de código.
- Nada de secciones ADDED, MODIFIED ni REMOVED: es la verdad actual, no un delta.
- Nada fuera de cuentas y acceso (ni tareas ni otras partes), aunque lo veas.

Formato, en castellano salvo las palabras clave de la RFC:
## Purpose (una o dos frases)
## Requirements
### Requirement: <nombre>  → el sistema SHALL ...
#### Scenario: <nombre>
- **WHEN** ... (precondición incluida acá, no hay GIVEN)
- **THEN** ...

Escribila en docs/spec-viva/mc.md.

Además, mientras lees el código, anotá aparte (no en la spec) cada lugar donde
una regla se cumple en casi todas partes pero no en todas, y cada comportamiento
que no puedas decidir si es intencional o accidental, indicando dónde se ve.

```

**Qué salió:** funcionó a la primera; escribió la spec y listó observaciones aparte.

## Prompt 2

**Modelo:** Sonnet 4.6
**Herramienta:** Claude Code

```
No escribas nada. Para el requisito "registro de cuenta nueva" de docs/spec-viva/mc.md, decime en qué archivos 
y líneas del código se ve cada cosa que afirma (ruta, validaciones de cada campo, código de estado 
y forma de la respuesta). Solo la ubicación, sin explicarme qué hace.

```

**Qué salió:** me dio las ubicaciones de los ficheros y líineas de cada parte

## Prompt 3

**Modelo:** Sonnet 4.6
**Herramienta:** Claude Code

```
Hacé lo mismo para el requisito "inicio de sesión"

```

**Qué salió:** me dio las ubicaciones de los ficheros y líineas de cada parte de inicio de sesión

**Nota:** la estructura de la parte B la redacté con ayuda de Claude (chat en claude.ai), a partir de mis notas
de comprobación.