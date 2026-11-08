# Matriz de trazabilidad — «Lo que cada tarea muestra de su responsable»

Requisito: `openspec/specs/tasks/spec.md` (línea 97).

**Escenarios del requisito: 3 · Escenarios cubiertos por tests: 0**

| Escenario | Test lo cubre | Estado | Qué faltó |
|---|---|---|---|
| Si el responsable de una tarea se llama "Ada Lovelace", su `assignee` trae ese nombre y sus iniciales | — | No Cubierto | Ningún test pide una tarea ni mira su `assignee`. El test `'un nombre de dos palabras da la inicial de cada una'` (`backend/tests/functional/auth/initials.spec.ts`) comprueba el cálculo de iniciales, pero en la respuesta del login (`data.user.initials`), no en una tarea. |
| Al pedir una tarea, sola o dentro de la lista, su `assignee` no incluye el email ni ningún dato de acceso | — | No Cubierto | No hay ningún test que pida `/api/v1/tasks`. `'la contraseña nunca sale en la respuesta'` (`backend/tests/functional/auth/signup.spec.ts`) comprueba que no se filtran datos, pero solo en el registro. |
| Si el responsable se registró sin nombre, el nombre llega `null` y las iniciales siguen llegando | — | No Cubierto | Ningún test sobre tareas. `'sin nombre, las iniciales salen del email'` (`initials.spec.ts`) y `'una cuenta puede quedarse sin nombre'` (`signup.spec.ts`) cubren una cuenta sin nombre, pero en auth, no en el `assignee` de una tarea. |

## Por qué ningún escenario es «No lo sé»

La búsqueda no deja dudas:

- **Sin tests de tareas:** los únicos tests del repo son los cuatro ficheros de `backend/tests/functional/auth/`. La carpeta `backend/tests/functional/tasks/` existe pero está vacía.
- **Sin referencias en los tests:** ningún test menciona `assignee` ni `tasks`. Esa lógica solo aparece en el código de la app, sobre todo en `backend/app/transformers/task_transformer.ts` y `backend/app/transformers/task_detail_transformer.ts`.
- **Sin tests en el frontend:** no hay ningún runner de tests instalado.

## PARTE B

1. **Cuántos scenarios creías cubiertos antes de mirar, y cuántos lo estaban**

    0 / 0

2. **El scenario en el que no supiste si faltaba un test o faltaba la regla en la spec**

    El escenario "La tarea no filtra datos de cuenta" es la que ha dado error al pasar los tests. Ya que aunque el  escenario específicamente indica que no deberia mostrar datos de la cuenta, la API está devolviendo el email.

    ¿Es problema del test, de la especificación o del código?

3. **Algo que el scenario no determinaba y tuviste que decidir al escribir el test.**

    Hay varios, por ejemplo en el escenario 2 especifica que no se devuelva el email ni ningún otro dato de acceso, pero no especifica cuales. Por lo tanto, se debería especificar los campos para afinar con los tests: Password, CreatedAt, UpdatedAt. Estos campos se han de incluir en el escenario y no dejarlo a interpretación.

    En los escenarios 1 y 3 se habla de tareas pero no de donde se obtiene el dato, si de una lista de tareas que llama a una parte del código específica o de una tarea suelta, que es otra llamada al código. Podría pasar que una part del codigo (lista) no cumpla la especificacion o test y la otra sí. Para los tests se especifica que se trabaja sobre la tarea y no sobre la lista.