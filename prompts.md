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
Recorre el módulo de cuentas y acceso, tanto backend (rutas, controladores, modelo de usuario, validadores y middlewares) como frontend (pantallas de login, registro y perfil, estado de sesión y protección de rutas). Lista qué comportamientos observas, cita el archivo de cada uno, y no propongas cambios ni mejoras.
```

**Qué salió:** funcionó a la primera; inventario completo de backend y frontend con archivo y línea de cada comportamiento, sin proponer cambios.


## Prompt 2

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```
convertir el inventario en requisitos con escenarios WHEN … THEN …, agrupados por capacidad (registro, login, sesión/logout, perfil, protección de rutas);
marcar cada uno como contrato, accidental o dudoso, con el porqué;
escribirlo en docs/spec-viva/rp.md;
sin proponer cambios ni tocar código.

```

**Qué salió:** escribió 37 requisitos WHEN/THEN clasificados (370 líneas). Además, sin pedírselo, hizo commit y push e intentó abrir el PR; lo bloqueó el modo auto. Pendiente de mi revisión.

## Prompt 3

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```
No hagas commits, push ni PRs a partir de ahora; yo te diré cuándo.

De la spec que escribiste en docs/spec-viva/rp.md, lista SOLO los requisitos que marcaste como dudosos. Para cada uno, en 2-3 líneas:
- qué comportamiento es y en qué archivo se observa,
- qué dos cosas chocan (código vs PRD, comportamiento vs convención del repo, frontend vs backend),
- qué pregunta habría que hacerle al equipo de producto para decidir si es contrato o accidental.

Después dime cuántos requisitos quedaron en cada categoría (contrato / accidental / dudoso) y señala cualquier clasificación de la que tú mismo no estés seguro.

No modifiques el archivo ni propongas cambios en el código.

```

**Qué salió:** listó los 10 dudosos con su contradicción y la pregunta para producto. Recuento real: 45 requisitos (24 contrato, 11 accidental, 10 dudoso); corrigió que antes había dicho 37. Señaló 8 clasificaciones propias de las que no está seguro, incluida una incoherencia (REQ-SES-5 contrato vs REQ-LOG-5 dudoso). Guardó en memoria no hacer commits ni PRs. Prompt redactado con ayuda de Claude (chat).


## Prompt 4

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```
Revisé tus clasificaciones y decido lo siguiente. Aplica SOLO estos cambios en docs/spec-viva/rp.md, sin tocar el resto del archivo, sin commits ni push:

1. REQ-SES-5 (logout revoca solo el token actual): pásalo a DUDOSO. Su alcance depende de REQ-LOG-5 (sesiones múltiples), que ya es dudoso; dejarlo como contrato es incoherente.
2. REQ-PER-5 (contenido de la pantalla de perfil): divídelo en dos. Que exista un punto desde el que cerrar sesión es CONTRATO (lo necesita RF-4). «Miembro desde», las iniciales y «Sin nombre» son ACCIDENTAL: el PRD no pide esa pantalla ni esos campos.
3. REQ-PER-7 (el perfil no se refresca): elimínalo. No describe un comportamiento observable hoy, porque no existe edición de perfil.
4. REQ-SES-9 (error de conexión): sepáralo. Distinguir «backend caído» (status 0) de «token inválido» es CONTRATO; el texto exacto del mensaje es ACCIDENTAL.

Después dame el nuevo recuento por categoría (contrato / accidental / dudoso) y confirma que no has modificado nada más.

```

**Qué salió:** aplicó mis 4 correcciones; recuento 46 = 23 contrato / 13 accidental / 10 dudoso. Solo tocó rp.md (además ajustó la tabla resumen para que cuadre). Me corrigió una cita: cerrar sesión lo exige RF-2, no RF-4 como yo le dije, y tenía razón. Prompt redactado con ayuda de Claude (chat).


## Prompt 5

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```
Reescribe docs/spec-viva/rp.md para que cumpla este formato obligatorio, sin cambiar qué comportamientos se describen y sin commits:

- "## Purpose": 1-2 frases sobre para qué existe la capability de cuentas y acceso.
- "## Requirements": cada requisito con encabezado "### Requirement: <nombre>" y redactado con SHALL.
- Cada requisito con al menos un "#### Scenario: <nombre>" con dos viñetas: "- **WHEN** ..." (incluye las precondiciones aquí, sin GIVEN) y "- **THEN** ...".
- Español, salvo las palabras clave RFC (SHALL, MUST, etc.).
- Elimina TODA referencia a archivos, líneas, clases, funciones o nombres del código. En la API describe peticiones y respuestas; en el frontend, lo que el usuario ve y hace.
- Quita las etiquetas contrato/accidental/dudoso y las tablas de resumen del cuerpo de la spec.
- No uses ADDED, MODIFIED ni REMOVED.

Al final, deja una sección vacía "## Parte B" que completaré yo. Dime cuántos requisitos quedan.

```

**Qué salió:** reescribió la spec al formato obligatorio (Purpose, Requirement con SHALL, Scenario WHEN/THEN): 46 requisitos y 59 escenarios, sin referencias a archivos ni clases. Mantuvo las rutas HTTP y los campos JSON por ser parte observable de la API. Prompt redactado con ayuda de Claude (chat).
