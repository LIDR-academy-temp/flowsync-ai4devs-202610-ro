# Verificación · «Lo que cada tarea muestra de su responsable»

**Scenarios del requisito: 3**
**Cubiertos antes: 0** · **Cubiertos después: 3** (2 en verde, 1 en rojo)

Requisito de `openspec/specs/tasks/spec.md`. La tabla recoge el estado de la suite **antes** de los tests nuevos; el resultado después va debajo.

| Scenario | Prueba que lo cubre | Estado | Qué faltó |
|---|---|---|---|
| Tarea con responsable "Ada Lovelace" → su `assignee` trae nombre e iniciales | | No cubierto | |
| Cualquier tarea, suelta o en la lista → su `assignee` no trae email ni datos de acceso | | No cubierto | |
| Responsable registrado sin nombre → `assignee.fullName` nulo y las iniciales siguen llegando | | No cubierto | |

Criterio: en `backend/tests/` solo hay tests de auth y ninguno pide una tarea. `initials.spec.ts` («un nombre de dos palabras da la inicial de cada una», «sin nombre, las iniciales salen del email») y `signup.spec.ts` («una cuenta puede quedarse sin nombre») comprueban `user` en login/signup, no el `assignee` de una tarea, que pasa por otro transformer: comprueban la regla de cálculo, no que llegue junto a la tarea. Por eso «No cubierto» y no «No lo sé».

**Tests nuevos** (`backend/tests/functional/tasks/assignee.spec.ts`, grupo `Tasks | responsable`). Cada test comprueba el `assignee` en las cinco respuestas que devuelven una tarea: `GET /tasks/:id`, `GET /tasks`, `POST /tasks`, `PATCH /tasks/:id/status` y `PUT /tasks/:id/due-date`. Los fallos se acumulan y se afirman al final, para que uno no esconda los demás.
- Fila 1 → `el responsable llega con su nombre y sus iniciales` · **verde** en las cinco (`fullName` "Ada Lovelace", `initials` `AL`).
- Fila 2 → `el responsable de una tarea no trae su email ni datos de acceso` · **rojo** en tres de cinco: `GET /tasks`, `POST /tasks` y `PATCH /tasks/:id/status` exponen `email`. Las tres usan `TaskTransformer`, que monta el assignee con `UserTransformer` (incluye `email`). `GET /tasks/:id` y `PUT /tasks/:id/due-date` usan el transformer de detalle y no lo exponen.
- Fila 3 → `un responsable sin nombre llega con nombre nulo y con iniciales` · **verde** en las cinco (`fullName` nulo, `initials` `SE`).

## Parte B · Las tres líneas

1. (pendiente: lo escribe el alumno)
2. (pendiente: lo escribe el alumno)
3. (pendiente: lo escribe el alumno)

### Decisiones que tomó el agente al escribir los tests

- Endpoints mirados: «se obtiene una tarea» se lee en sentido amplio, así que entran las dos lecturas (`GET /tasks/:id` con `today=2026-11-10`, obligatorio, y `GET /tasks`) y las tres escrituras que devuelven la tarea (`POST /tasks`, `PATCH /tasks/:id/status`, `PUT /tasks/:id/due-date`).
- Iniciales esperadas fijadas a mano: `AL` para "Ada Lovelace" y `SE` para la cuenta sin nombre (`sin-nombre@example.com`), con el mismo cálculo que el scenario «sin nombre» de auth.
- «Datos de acceso» = claves `email`, `password`, `token` y `accessToken`, más que el email no aparezca en ningún valor del `assignee`. No se exige una lista blanca exacta de claves.
- `id`, `createdAt` y `updatedAt` del assignee no se tratan como fuga en el test, aunque el requisito dice «ningún otro dato de esa cuenta» y el scenario solo nombra email y datos de acceso. Hoy el detalle devuelve `id`; la lista, además, las fechas de la cuenta.
- «Bastan para saber quién la lleva» no se comprueba (no es comprobable de forma automática); solo que nombre e iniciales llegan.
- El usuario y la tarea de partida se crean con los modelos; la sesión se abre por login HTTP con token `Bearer`, como en los tests de auth. Quien hace las peticiones es el propio responsable, así que la tarea creada con `POST /tasks` también es suya.
- Posible hueco de spec: el requisito prohíbe «ningún otro dato» y el scenario 2 solo prueba email/acceso; si `id` o las fechas de la cuenta cuentan como fuga, eso no lo decide ningún scenario.
