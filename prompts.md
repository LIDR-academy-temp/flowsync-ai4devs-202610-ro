# Prompts

## Prompt 1

**Modelo:** Opus 5.5
**Herramienta:** Claude Code (app de escritorio)

```
@"/home/noureddine/Baixades/BORRAR/ejercicio_flowsync_mide_que_esta_probado.pdf" @"/home/noureddine/Baixades/BORRAR/cuatro_artefactos_documentacion_viva.pdf" @"/home/noureddine/Baixades/BORRAR/deficit_documental_documentacion_viva.pdf" @"/home/noureddine/Baixades/BORRAR/revision_adversarial_validar_vs_refutar.pdf" @"/home/noureddine/Baixades/BORRAR/tests_verdes_verificacion_trazabilidad.pdf"
te paso unos documentos y egersicio del modolo4 lee y deme que hay que hacer sin hcer nada
```

**Qué salió:** resumió el ejercicio y los pasos, sin tocar nada. Avisó de que el primer número de la línea 1 había que escribirlo antes de empezar; no lo escribí.

## Prompt 2

**Modelo:** Opus 5.5
**Herramienta:** Claude Code (app de escritorio)

```
ha el ejersisio pero no publicas nada y genera y debate la solucion para hacerlo mejor
```

**Qué salió:** primera versión de la matriz y de los tests (2 verdes, 1 rojo). Después lanzó la revisión adversarial (prompt 3) y rehízo las dos cosas con los hallazgos: lista blanca de claves, todas las respuestas que traen una tarea, fallos recogidos en vez de parar en el primero y matriz con el formato del README. Resultado: 1 verde y 2 rojos. No hizo commit ni push.

## Prompt 3 (lanzado por el agente, no por mí)

**Modelo:** subagente Explore de Claude Code, de solo lectura
**Herramienta:** Claude Code (app de escritorio)

```
Eres un revisor adversarial y escéptico. Tu ÚNICO objetivo es REFUTAR el trabajo de verificación que te describo, no aprobarlo. Read-only: no edites ni crees archivos y no ejecutes nada que modifique el repo (puedes leer código y, si quieres, ejecutar los tests con `cd backend && PATH=$HOME/.nvm/versions/node/v24.22.0/bin:$PATH node ace test --files=tasks/assignee`).

Repo: /var/www/projectes/curso_Ia_dev/flowsync-ai4devs (rama trazabilidad-na).

Contexto del ejercicio: construir una matriz de trazabilidad del requisito «Lo que cada tarea muestra de su responsable» de openspec/specs/tasks/spec.md (líneas ~97-115), scenario a scenario: qué test lo cubre, cubierto / no cubierto / no lo sé; y escribir un test por cada scenario no cubierto, sin tocar código de la app. Si un test sale en rojo se entrega en rojo. Además, tres líneas: (1) cuántos scenarios se creían cubiertos antes de mirar vs cuántos lo estaban; (2) el scenario donde no se supo si faltaba test o faltaba regla en la spec; (3) algo que el scenario no determinaba y hubo que decidir al escribir el test.

Archivos a revisar:
- docs/verificacion/na.md (matriz + tres líneas)
- backend/tests/functional/tasks/assignee.spec.ts (tests nuevos)
Código relevante: backend/app/controllers/tasks_controller.ts, task_statuses_controller.ts, task_due_dates_controller.ts, backend/app/transformers/task_transformer.ts, task_assignee_transformer.ts, task_detail_transformer.ts, user_transformer.ts, backend/app/models/user.ts, backend/start/routes.ts. Estilo de tests existentes: backend/tests/functional/auth/*.spec.ts.

Busca con dureza:
1. Afirmaciones de la matriz o de las tres líneas que sean falsas o no se sostengan contra el código/spec.
2. Tests que digan cubrir un scenario pero comprueben otra cosa, solo la mitad, o que pasarían aunque el código estuviera mal (falsos verdes). Y lo contrario: rojos que sean fallo del test y no del código.
3. Diseño de los tests que oculte información (p. ej. un bucle que se para en la primera aserción fallida y no dice si la otra lectura también falla).
4. Huecos de cobertura que la matriz no menciona (otras rutas que devuelven tareas: crear, cambiar estado, fecha de vencimiento; datos de cuenta como id, createdAt, updatedAt).
5. Desviaciones del enunciado (¿un test por scenario? ¿nada fuera de tests?), del estilo de los tests existentes o de AGENTS.md/CLAUDE.md.
6. Si la matriz cumple: cabe en una pantalla, tiene al menos un «no lo sé», los dos números de la línea 1 no coinciden.

Devuelve hallazgos PRIORIZADOS (alto/medio/bajo), cada uno con evidencia concreta (archivo:línea) y qué se rompe o qué es falso. Si no encuentras nada, busca más a fondo. Termina con una lista corta de las 3 mejoras de mayor impacto.
```

**Qué salió:** 4 hallazgos altos, 5 medios y 4 bajos. Los más útiles: el test se paraba en el primer fallo y ocultaba si la tarea suelta filtraba; la matriz no seguía el formato (faltaban los dos números y había 4 filas para 3 scenarios); una línea 1 que no era «antes de mirar»; y una línea de la spec (la lista debe devolver «los mismos datos que antes») que contradice el scenario.

## Prompt 4

**Modelo:** Opus 5.5
**Herramienta:** Claude Code (app de escritorio)

```
pepasa cada ponto del ejercicion y deme la que no si ha echo o la que falla
```

**Qué salió:** repasó el enunciado punto por punto. Faltaban: el primer número de la línea 1, comprobar que el proyecto levanta en esta rama, el prompt 3 entero, y el commit, el push y el PR. Tampoco se respetó el límite de 45 minutos.

## Prompt 5

**Modelo:** Opus 5.5
**Herramienta:** Claude Code (app de escritorio)

```
pues comprova esos pontos
```

**Qué salió:** comprobó el push con `--dry-run`, arrancó el proyecto con `make start` e inició sesión en el navegador. Confirmó el rojo contra la app en marcha (la lista devuelve el email del responsable y la tarea suelta no) y pegó entero el prompt 3.

## Prompt 6

**Modelo:** Opus 5.5
**Herramienta:** Claude Code (app de escritorio)

```
recopera y ejecuta todo
```

**Qué salió:** volvió a pasar la suite (21 verdes, 2 rojos), hizo el commit y el push de la rama `trazabilidad-na` a mi fork.

## Prompt 7

**Modelo:** Opus 5.5
**Herramienta:** Claude Code (app de escritorio)

```
has todo el ejercecio
```

**Qué salió:** comprobó que todo estaba hecho salvo el PR, que tengo que abrir yo, y la línea 1 sin estimación previa.

## Prompt 8

**Modelo:** Opus 5.5
**Herramienta:** Claude Code (app de escritorio)

```
hasme una estimacio privia
```

**Qué salió:** se negó a inventarla, porque ya conocía el resultado. Propuso usar la estimación real que hizo el agente antes de abrir los tests (2 de 3), diciendo quién la hizo.

## Prompt 9

**Modelo:** Opus 5.5
**Herramienta:** Claude Code (app de escritorio)

```
¿Cambio la línea 1 por la opción 1 y hago commit y push? El PR lo tendrías que seguir abriendo tú.
```

**Qué salió:** cambió la línea 1 por la estimación del agente indicando su origen, e hizo commit y push.
