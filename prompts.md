# Prompts

## Prompt 1

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```
Dime que es el requisito "Lo que cada tarea muestra de su responsable" y en que fichero lo puedo encontrar
```

**Qué salió:** funcionó a la primera: localizó el requisito en `openspec/specs/tasks/spec.md:97` y resumió sus tres escenarios.

## Prompt 2

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```
Quiero que generes una matriz de trazabilidad.
En esta matriz haz un mapeo escenario por escenario solo del requisito "Lo que cada tarea muestra de su responsable".
Primero has de mostrar una linea con:
1) Cuantos escenarios tiene el requisito
2) Cuantos escenarios han sido cubiertos por los tests

Luego, muesta un cuadro con estas columnas:
1) Escenario: El escenario en una sola linea
2) Test lo cubre: con el nombre exacto del test encontrado en el codigo.
3) Estado: Selecciona una opcion, "Cubierto", "No Cubierto" o "No lo se".
4) Quñe falto: Explica brevemente por que no puedes determinar si un test esta cubierto y por que has lo has indicado como "No lo se".

Si tienes alguna duda sobre estas indicadiones, pregunta antes de hacer nada.
No hagas ningun cambio en el codigo.
```

**Qué salió:** funcionó a la primera: 3 escenarios, 0 cubiertos (no había ningún test de `tasks`, solo de auth).

## Prompt 3

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```
guarda la matriz en docs/verificacion/XHM.md en formato markdown
```

**Qué salió:** funcionó a la primera.

## Prompt 4

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```
Por cada escenario que no cubre los tests con el estado "No cubierto", quiero que generes el test correspondiente, uno por escenario, siguiendo el estilo de los tests que ya estan creados. Una vez los hayas creado, lista los nombres de los ficheros que has creado
```

**Qué salió:** creó `backend/tests/functional/tasks/assignee.spec.ts` con 3 tests; 2 pasan y el de «la tarea no filtra datos de cuenta» falla porque la lista (`GET /tasks`) devuelve el email del responsable (`TaskTransformer` usa `UserTransformer`).

## Prompt 5

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```
¿Hay algo que el escenario no determinaba y tuviste que escribir en el test?
```

**Qué salió:** listó las decisiones no fijadas por los escenarios; las más relevantes: qué cuenta como «dato de acceso» (¿el `id` está permitido?) y que las iniciales de una cuenta sin nombre se derivan del email.

## Prompt 6

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```
Revisa el fichero prompts.md y vuelva el resultado de las preguntas y respuestas de esta sesion respetando el formato definido en este mismo fichero. Borra el contenido que hay actualmente que son las instrucciones de como escribir este fichero
```

**Qué salió:** generó este fichero.
