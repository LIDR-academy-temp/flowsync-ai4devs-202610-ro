# Prompts

## Prompt 1

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```
haz un resumen de los ultimos commits
```

**Qué salió:** a la primera; resumen de los commits recientes de `s5/start`, agrupados por tema.

## Prompt 2

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```
Lista los ultimos 5 commits, con el texto original
```

**Qué salió:** a la primera; los 5 mensajes completos, tal cual están en git.

## Prompt 3

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```
Contrasta las reglas de proceso especificadas en el fichero Claude.md con los ultimos 15 commits de repositorio y el estado actual del arbol.
Quiero que generes una tabla con una fila por regla. Las columnas son:
1. Que pide la regla: Una frase.
2. Que se miro para comprobarlo: Comando concreto o archivo. 
3. Veredicto: Solo hay 3 opciones. "Se cumple", "No se cumple", "No se puede comprobar con lo que hay".
4. La evidencia: En una sola linea. Si el veredicto no "se cumple", indica donde se rompio. Si "No se puede comprobar con lo que hay" que falta para poder comprobarla.
5. Que harias con ella: "Dejarla", "Borrarla" o "Bajarla" a algo que se ejecute solo.
Esto es una auditoria, no hagas ningun cambio en los archivos.
Deja el resultado escrito en el fichero /docs/auditoria/XHM.md. Usa format markdown para generar el texto, tablas y lo que necesites.
Si tienes alguna pregunta sobre esta solicitud, haz las preguntas necesarias antes de hacer cualquier otra accion
```

**Qué salió:** no funcionó; el agente preguntó si crear rama y commit para el fichero, rechacé la pregunta e interrumpí.

## Prompt 4

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```
Contrasta las reglas de proceso especificadas en el fichero Claude.md con los ultimos 15 commits de repositorio y el estado actual del arbol.
Quiero que generes una tabla con una fila por regla. Las columnas son:
1. Que pide la regla: Una frase.
2. Que se miro para comprobarlo: Comando concreto o archivo. 
3. Veredicto: Solo hay 3 opciones. "Se cumple", "No se cumple", "No se puede comprobar con lo que hay".
4. La evidencia: En una sola linea. Si el veredicto no "se cumple", indica donde se rompio. Si "No se puede comprobar con lo que hay" que falta para poder comprobarla.
5. Que harias con ella: "Dejarla", "Borrarla" o "Bajarla" a algo que se ejecute solo.
Esto es una auditoria, no hagas ningun cambio en los archivos.
Deja el resultado escrito en el fichero /docs/auditoria/XHM.md. Usa format markdown para generar el texto, tablas y lo que necesites.
Si tienes alguna pregunta sobre esta solicitud, haz las preguntas necesarias antes de hacer cualquier otra accion
```

**Qué salió:** mismo prompt relanzado; generó `docs/auditoria/XHM.md` con 5 filas (una por viñeta de CLAUDE.md), sin rama ni commit.

## Prompt 5

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```
Una vez revisado el fichero que has creado "XHM.md", quiero que lo generes de nuevo con estas nuevas especificaciones:

Contrasta las reglas de proceso especificadas en el fichero Claude.md con los ultimos 15 commits de repositorio y el estado actual del arbol.
  Quiero que generes una tabla con una fila por regla. Las columnas son:
  1. Que pide la regla: Una frase con tus palabras. Si necesitas 3 o mas es que hay mas de una regla metida en una.
  2. Que se miro para comprobarlo: Comando concreto o archivo.
  3. Veredicto: Solo hay 3 opciones. "Se cumple", "No se cumple", "No se puede comprobar con lo que hay".
  4. La evidencia: En una sola linea. Si el veredicto no "se cumple", indica donde se rompio. Si "No se puede comprobar con lo que hay" que falta para poder comprobarla.
  5. Que harias con ella: "Dejarla", "Borrarla" o "Bajarla" a algo que se ejecute solo.
     Esto es una auditoria, no hagas ningun cambio en los archivos.
     Deja el resultado escrito en el fichero /docs/auditoria/XHM.md. Usa format markdown para generar el texto, tablas y lo que necesites.
     Si tienes alguna pregunta sobre esta solicitud, haz las preguntas necesarias antes de hacer cualquier otra accion
```

**Qué salió:** regeneró `XHM.md` con 8 filas (partió las viñetas de rama y de PR en varias reglas) y conservó la sección PARTE B que yo había añadido.

## Prompt 6

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```
Revisa ahora el fichero "prompts.md", compruebas las intrucciones que hay y vuelca el contenido de la conversacion de esta sesion en este archivo. Borra las intrucciones originales
```

**Qué salió:** no funcionó; rechacé el comando de shell que lanzó para buscar el fichero e interrumpí.

## Prompt 7

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```
Revisa ahora el fichero "prompts.md", compruebas las intrucciones que hay y vuelca el contenido de la conversacion de esta sesion en este archivo. Borra las intrucciones originales
```

**Qué salió:** mismo prompt relanzado; este fichero, con los prompts de la sesión en el formato de la plantilla y sin sus instrucciones.
