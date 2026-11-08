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

**Modelo:** Sonnet 5.5
**Herramienta:** Claude Code

```
Necesito que revises la documentación del proyecto para entender el alcance general. Me encuentro en fase de revision de la implementación de la spec "Lo que cada tarea muestra de su responsable".
Por ello necesito revisar de forma exhaustiva si los escenarios de este requisito se encuentran bien cubiertos por los test unitarios existentes en el proyecto. Solo me interesa esta spec.
Crea una matriz de trazabilidad con una tabla que cuente con las siguientes columnas: - nombre del escenario - nombre del test que lo cubre - estado del escenario (cubierto/no cubierto/no lo se) -Que te faltó (motivo de por que no lo sabes)

No basta con revisar los nombres de los test, es necesarios revisarlos para estar seguro de que cubren. No modifiques nada del proyecto todavia.
```

**Qué salió:** (opcional, una línea) funcionó a la primera / tuve que insistir / me inventó una ruta que no existe.

---

## Prompt 2

**Modelo:** Sonnet 5.5
**Herramienta:** Claude Code

```
ayudame a rellenar el fichero @prompts.md . Reinicialo y siguiendo el patrón escribe el siguiente prompt lanzado con Sonnet 5.5
```

**Qué salió:** (opcional, una línea) funcionó a la primera / tuve que insistir / me inventó una ruta que no existe.

---

## Prompt 3

**Modelo:** Sonnet 5.5
**Herramienta:** Claude Code

```
De la matriz anterior, trabaja únicamente con los scenarios marcados como «No cubierto».

Por cada scenario:

Escribe un único test que compruebe ese comportamiento.

Sigue el estilo existente en backend/tests/functional/auth/.

Guarda los nuevos tests dentro de backend/tests/functional/tasks/.

No modifiques ningún archivo fuera de backend/tests/.

No modifiques el código de producción aunque el test falle.

No cambies el test para forzar que pase.

Después ejecuta los tests y dime cuáles pasan y cuáles fallan.
```

**Qué salió:** (opcional, una línea) funcionó a la primera / tuve que insistir / me inventó una ruta que no existe.
