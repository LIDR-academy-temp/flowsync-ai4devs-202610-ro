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

---

## Prompt 1

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```
Escribe las especificaciones en el fichero que ya existe "/docs/spec-viva/XHM.md" en caso contrario, avisame.
Las reglas son las sigguientes y no te puedes salir de ellas:

R.1) En las especificaciones centrate solo en "Cuentas y acceso" (Registro / Inicio de sesion / Sesion / Perfil) no incluyas ningun modulo mas.
R.2) Lo que pasa por la API y lo que se ve en pantalla. Solo comportamiento observable. En la API, observable es la peticion y la respuesta. En Pantalla, observable es lo que un usuario ve y puede hacer.
R.3) No quiero nombres de clase, archivos ni rutas, ni codigo. Centrate en la especificacion
R.4) No propongas modificar ningun fichero ni crear ficheros nuevos.


El formato del fichero tiene que ser el siguiente.
F.1) Arriba, Un ## Purpose de 1 o 2 frases: Para que existe esta capability
F.2) Debajo, ## Requirements, y colgando de el ### Requirement: En los que el sistema SHALL hacer algo.
F.3) Bajo cada requisito, al menos un #### Scenario: de cuatro almohadillas, con dos viñetas - **WHEN** y - **THEN**. NO hay casilla para el GIVEN: La precondicion se mete dentro del WHEN.
F.4) En castellano salvo las mayusculas de la RFC.
F.5) Nada de ADDED, MODIFIED ni REMOVED.

Si algo no te queda claro, pregunta antes de hacer nada.
```

**Qué salió:** Leyó el código del backend y del frontend y escribió la spec en `docs/spec-viva/XHM.md` (9 requisitos con sus escenarios) sin preguntar nada. Después se activó el modo plan para el commit, el PR y la revisión adversarial que pide el CLAUDE.md. Rechacé esa aprobación, así que no hay commit ni PR.

## Prompt 2

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```
Revisa el fichero prompts.md y escribe la conversacion mantenida en esta sesion en este fichero siguiendo las instrucciones indicadas en el mismo fichero
```

**Qué salió:** Registró los prompts de la sesión en este fichero y quitó el ejemplo de plantilla.
