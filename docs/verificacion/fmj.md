# Verificación: «Lo que cada tarea muestra de su responsable»

Spec: `openspec/specs/tasks/spec.md`, requisito «Lo que cada tarea muestra de su responsable».

**Scenarios del requisito:** 3
**Cubiertos:** 0

## Matriz de trazabilidad

| Scenario (una línea) | Prueba que lo cubre (nombre en la suite) | Estado | Si «no lo sé», qué faltó |
|---|---|---|---|
| Al obtener una tarea cuyo responsable es "Ada Lovelace", `assignee` trae ese nombre y sus iniciales | — | No cubierto | |
| Al obtener una tarea, suelta o en la lista, `assignee` no incluye el email ni datos de acceso | — | No cubierto | |
| Si el responsable se registró sin nombre, `assignee.fullName` llega nulo y las iniciales siguen llegando | — | No cubierto | |

### Notas de la revisión

- En `backend/tests/` no hay ningún test de `tasks`: solo `functional/auth/`, y ninguno de esos tests llama a `/api/v1/tasks`.
- Hay dos tests que se parecen, pero comprueban la cuenta, no el `assignee` de una tarea:
  - `Auth | iniciales` › `sin nombre, las iniciales salen del email` comprueba `data.user.initials` en la respuesta del login.
  - `Auth | registro` › `una cuenta puede quedarse sin nombre` comprueba `data.user.fullName` nulo en la respuesta del registro.
- Por eso no cuentan para ninguna fila de esta matriz.

## A.2 · Tests escritos para los scenarios no cubiertos

Fichero: `backend/tests/functional/tasks/assignee.spec.ts`, grupo `Tasks | responsable`.

La matriz de arriba refleja lo que había **antes** de esta tarea (0 de 3). Esta tabla refleja lo que hay **después**: cada scenario tiene ya su test, pero tener test no significa que se cumpla.

| Scenario | Test | Qué lecturas mira | Resultado |
|---|---|---|---|
| Responsable identificable | `el responsable llega con su nombre y sus iniciales` | lista y suelta | ✔ verde |
| La tarea no filtra datos de cuenta | `el responsable no trae el email ni otros datos de la cuenta` | lista, suelta, crear, cambiar estado y cambiar fecha | ✖ **rojo** |
| Responsable sin nombre | `un responsable sin nombre llega con nombre nulo y con iniciales` | lista y suelta | ✔ verde |
| *(no es un scenario: duda de spec)* | `duda de spec: las iniciales de un responsable sin nombre no salen de su email` | lista y suelta | ✖ **rojo esperado** |

Suite completa: 22 en verde y 2 en rojo.

**El rojo del scenario 2.** Estos endpoints devuelven `email`, `createdAt` y `updatedAt` del responsable:

| Endpoint | Expone datos de más |
|---|---|
| `GET /tasks` | sí |
| `POST /tasks` | sí |
| `PATCH /tasks/:id/status` | sí |
| `GET /tasks/:id` | no |
| `PUT /tasks/:id/due-date` | no |

- La causa: los tres que fallan usan `TaskTransformer`, que serializa el `assignee` con `UserTransformer`. Los dos que pasan usan `TaskAssigneeTransformer`.
- El caso más grave es `PATCH /status`: cualquiera puede cambiar el estado de una tarea ajena, y la respuesta le devuelve el email de otra persona.
- No se ha tocado el código.

**El rojo de la duda de spec.**
- El scenario quiere iniciales «para que la interfaz pueda representarlo sin recurrir a su email».
- El requisito «Iniciales de la cuenta» de la spec de auth dice que, sin nombre, las iniciales se calculan del email. `grace@example.com` da `GE`.
- Ese test toma la primera lectura y no puede ponerse en verde sin romper `auth/initials.spec.ts`.
- Se ha sacado aparte para que el test del scenario compruebe solo lo que el scenario dice.

Cambios tras la revisión adversarial:
- Se separó la comprobación de `GE` en su propio test.
- Se añadió `assert.exists` por si la tarea no sale en la lista.
- Cada test compara todas las lecturas en una sola aserción, para que el informe diga cuáles fallan y no se corte en la primera.
- El scenario 2 ahora cubre también crear, cambiar estado y cambiar fecha.
- La comprobación de claves ya no exige el `id`, solo que no haya claves fuera de `id`, `fullName` e `initials`.

## Parte B · Las tres líneas

1. **Antes de mirar:** no tenía claro qué tests había, así que no supe estimar si estaba todo cubierto. **Al final:** 0 de 3 cubiertos.
2. **Responsable sin nombre (hueco de spec):** no sé qué hacer con el responsable cuando tiene los datos a nulo. Creo que falta definir mejor su comportamiento en la spec; puede que sea mejor tener uno con valores por defecto, sin hablar del responsable en sí. Además, la spec pide representarlo «sin recurrir a su email», pero las iniciales salen del email (`grace@example.com` da `GE`), que es lo que dice la spec de auth.
3. *(Sin respuesta: en el momento de cerrar el ejercicio no se me ocurrió nada.)*
