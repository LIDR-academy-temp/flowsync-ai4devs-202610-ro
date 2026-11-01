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
El objetivo que se persigue es escribir la spec del código fuente de este proyecto. El código ya funciona y está escrito, no tienes que proponer nada ni cambiar nada, sólo documentar lo que hace a día de hoy. Quiero que tengas en cuenta sólo el vertical de cuentas y acceso del proyecto (registro, inicio de sesión, sesión y perfil). Está ya construido de punta a punta. Quieno análisis completo de sus dos capas: en el backend sus rutas, controladores, modelo de usuario, validadores y middlewares; en el frontend las pantallas de acceso, estade de sesión y protección de rutas.
Vamos a guardarlo en un documento nuevo en docs/spec-viva/inv.md.
El formato no es nevgociable, debe seguir los siguientes criteros:
+ Arriba, un ## Purpose de una o dos frases: para qué existe esta capability.
+ Debajo, ## Requirements, y colgando de él ### Requirement: en los que el sistema SHALL hacer algo.
+ Bajo cada requisito, al menos un #### Scenario: de cuatro almohadillas, con dos viñetas: - **WHEN** y - **THEN**. No hay casilla para el GIVEN: la precondición se mete dentro del WHEN.
+ En castellano, salvo las mayúsculas de la RFC.
Y además debe seguir las siguientes reglas:
+ Nada de ADDED, MODIFIED ni REMOVED. 
+ Solo comportamiento observable desde fuera. Ni un nombre de clase, ni un nombre de archivo, ni una ruta de código. En la API, observable es la petición y la respuesta. En la pantalla, observable es lo que una persona ve y puede hacer.
+ No modifiques código ni propongas cambios.
```

**Qué salió:** El agente leyó backend y frontend, hizo peticiones reales a la API (creó cuentas de prueba y luego las borró de la BD de desarrollo) y escribió `inv.md`: 12 requisitos, 60 escenarios. Sin pedírselo, siguió el proceso del harness del curso: hizo commit, push, abrió un PR en el fork y lanzó una revisión adversarial con un subagente. El informe de ese subagente (2 afirmaciones falsas, varias omisiones) llegó a la sesión como mensaje; el agente aplicó 5 correcciones a la spec e hizo otro commit y push.

## Prompt 2

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```
¿Has realizado un commit y un push? De momento sólo he pedido generar un fichero que aún no he revisado
```

**Qué salió:** Lo reconoció: 2 commits, push al fork, PR #1 contra `s3/start` y revisión adversarial, porque aplicó por su cuenta las reglas de proceso del CLAUDE.md. Guardó una memoria de no hacer commits sin revisión.

## Prompt 3

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```
Si, deshaz todo lo que has hecho sin solicitártelo, y no hagan nada que no te confirme yo primero que se salga de la tarea que te doy
```

**Qué salió:** Cerró el PR #1, que queda cerrado en el historial del fork porque GitHub no permite borrarlo. Borró la rama remota y deshizo los commits en local: `inv.md` quedó sin commitear, con la última versión.

## Prompt 4

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```
Revisa en el fichero generado que cumpla con los requisitos solicitados de formato y contenido.
```

**Qué salió:** El formato cumple (Purpose, Requirements, SHALL, WHEN/THEN, sin ADDED/MODIFIED/REMOVED ni nombres de código). En contenido señaló 3 escenarios no observables desde fuera y 3 imprecisiones menores. Comprobó el recorte de espacios con dos logins fallidos. No cambió el fichero.

## Prompt 5

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```
Creame una tabla con cada uno de los requisitos listados, incluyendo el archivo o archivos en que debo comprobarlo y las lineas en las que está, para poder hacer yo una comprobación manual. Guardalo en la misma carpeta de la spec, con nombre inv-revision.md. Cualquier requisito que no te encaje, añádele un icono de duda, para poder tenerlo en cuenta
```

**Qué salió:** Creó `inv-revision.md`: una tabla por requisito y una fila por escenario, con las líneas de la spec, dónde comprobarlo en el código y ❓ en los escenarios dudosos. Comprobó a mano algunas de las líneas citadas.

## Prompt 6

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```
Cuantos escenarios han salido?
```

**Qué salió:** 60 escenarios en 12 requisitos, con una tabla del reparto por requisito.

## Prompt 7

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```
Incluye enlace en las rutas de los archivos de inv-revision para poder acceder fácilmente y comprobarlo en el código
```

**Qué salió:** Convirtió las 99 rutas de `inv-revision.md` en enlaces relativos con ancla de línea y comprobó que todas apuntan a ficheros existentes.

## Prompt 8

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```
explícame el escenario: Sin rastro de la contraseña
```

**Qué salió:** Explicó que la API nunca devuelve la contraseña ni su hash, aunque la tabla de usuarios guarda el hash, porque la respuesta solo incluye una lista cerrada de 6 campos públicos.

## Prompt 9

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```
En mi revisión manual en el código he llegado hasta el primer escenario del punto 4. Indicame cuántos escenarios he revisado manualmente
```

**Qué salió:** 22 de 60 escenarios (21 si el primero del punto 4 no estaba terminado), con una tabla por sección.
