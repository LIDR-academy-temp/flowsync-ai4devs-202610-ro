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

**Modelo:** Sonnet 5.5
**Herramienta:** Claude Code

```
Quiero que realices una auditoría de las reglas de proceso definidas en la sección `## Reglas de proceso` de `CLAUDE.md`.

El objetivo no es corregir ni mejorar el proyecto, sino comprobar hasta qué punto esas reglas se están cumpliendo en la práctica.

Usa como fuentes de evidencia:

- los últimos 15 commits del repositorio;
- el estado actual del árbol de trabajo;
- los archivos del repositorio;
- el historial de Git;
- y, cuando sea necesario y esté disponible, la información relacionada con ramas y pull requests.

No modifiques código ni corrijas ningún incumplimiento que encuentres. Esta tarea es únicamente una auditoría del estado existente. No cambies ningún archivo del proyecto salvo el archivo de auditoría indicado más abajo.

Analiza cada una de las reglas de proceso por separado.

Para cada regla, determina únicamente uno de estos tres veredictos:

- `se cumple`
- `no se cumple`
- `no se puede comprobar con lo que hay`

No consideres que una regla se cumple simplemente porque no encuentres un incumplimiento. Si no existe evidencia suficiente para comprobarla, usa `no se puede comprobar con lo que hay`.

Ten en cuenta que una misma regla puede contener varias afirmaciones. Examina todas las partes relevantes antes de decidir el veredicto global y explica en la evidencia qué partes has podido comprobar y cuáles no.

Crea el resultado en:

`docs/auditoria/dts.md`

Incluye una tabla con una fila por cada regla de proceso y exactamente estas cinco columnas:

1. `Qué pide la regla`: resume la regla en una frase y con tus propias palabras.
2. `Qué se miró para comprobarlo`: indica de forma concreta los comandos ejecutados, commits revisados, archivos consultados o cualquier otra fuente de evidencia utilizada.
3. `Veredicto`: usa exclusivamente uno de los tres valores permitidos.
4. `Evidencia`: resume en una línea la evidencia encontrada. Si no se cumple, indica dónde se observa el incumplimiento. Si no se puede comprobar, explica qué información o rastro falta.
5. `Qué harías con ella`: utiliza únicamente una de estas opciones: `dejarla`, `borrarla` o `bajarla`.

No inventes evidencia ni deduzcas acciones que no hayan dejado un rastro observable.

Presta especial atención a distinguir entre:

- algo que Git o los archivos permiten demostrar;
- algo que únicamente puede inferirse;
- y algo que no deja ningún rastro y, por tanto, no puede auditarse posteriormente.


Antes de terminar, revisa que:

- cada veredicto tenga evidencia que lo justifique;
- ningún `se cumple` esté basado únicamente en ausencia de incumplimientos;
- hayas revisado como máximo los últimos 15 commits;
- no hayas modificado código ni intentado solucionar los problemas encontrados;
- y el archivo de auditoría sea conciso y fácil de revisar.
```

**Qué salió:** Funcionó a la primera.

## Prompt 2

**Modelo:** Sonnet 5.5
**Herramienta:** Claude Code

```
A continuación te indico las reglas junto con mi opinion de si se estaban cumpliendo o no.


- La rama es por unidad de trabajo, no por petición. Antes de tocar código, mira en qué rama estás: si ya es una rama de trabajo —cualquiera que no sea `main` ni una `sN/*`—, sigue en ella en vez de crear otra. Solo desde `main` o desde una `sN/*` se crea una nueva (`git checkout -b feat/<slug>`). Nunca commitear directo en `main` ni en una `sN/*`.
Creo que si porque el titulo del commit se incluye el nombre de la rama ejemplo: feat(OpenApi)

- El commit sí es por petición: al cerrar cada una, usar la skill `/commit`.
Todos los commit siguen una forma homogenea.Puede verse que si se usa.


- Un cambio que toque rutas, controladores, validadores o transformers de una capability se cierra en el mismo commit con el documento OpenAPI y el README de esa capability al día. El documento se construye en cada petición y no hay fichero que generar, así que lo que se commitea es el diff regenerado de `.adonisjs/`; el README es `docs/capabilities/<nombre>/README.md`.
Revisando algunos commit he podido comprobar que si se estan actualizando estos ficheros.

- `gh pr create` (con una descripción completa de los cambios en el cuerpo del PR) y el pase del subagente `adversarial-reviewer` sobre ese PR van **una sola vez, al terminar la unidad de trabajo**, no al cerrar cada petición. El review adversarial es lo último, antes de dar la unidad por terminada.
No he podido validarlo porque en los commit no queda reflejado si hubo un PR

- Cuando abras el PR, no repitas ese resumen en el chat: la sesión se va a perder, el PR no. Responde solo con la URL del PR.
No he podido validar esto.


Después, en el documento docs/auditoria/dts.md  de la auditorien el documento  al final añade añade una sección llamada ## Reflexión con exactamente tres puntos:

La regla sobre la que me equivoqué: déjala preparada para que yo pueda comparar posteriormente mi apuesta inicial con tu auditoría. Indica qué resultado de la auditoría debería tener en cuenta.

La regla que no se puede comprobar: selecciona la más relevante entre las que no puedan demostrarse y explica brevemente qué tendría que cambiar para que dejara evidencia comprobable.

La regla que borraría: selecciona una candidata y explica si la borrarías porque la herramienta ya impone automáticamente ese comportamiento o porque es una regla que no se cumple y cuyo incumplimiento aparentemente no tiene consecuencias.
```

**Qué salió:** Funcionó a la primera.

## Prompt 3

**Modelo:** Sonnet 5.5
**Herramienta:** Claude Code

```
Necesito que actualices el documento prompts.md, siguiendo el formato definido dentro del mismo incluyendo los prompts lanzados en esta sesion
```

**Qué salió:** Funcionó a la primera.
