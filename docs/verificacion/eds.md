# Verificación · «Lo que cada tarea muestra de su responsable»

**Scenarios del requisito: 3**
**Cubiertos: 0**

Requisito de `openspec/specs/tasks/spec.md`. Estado de la suite **antes** de los tests nuevos.

| Scenario | Prueba que lo cubre | Estado | Qué faltó |
|---|---|---|---|
| Tarea con responsable "Ada Lovelace" → su `assignee` trae nombre e iniciales | | No cubierto | |
| Cualquier tarea, suelta o en la lista → su `assignee` no trae email ni datos de acceso | | No cubierto | |
| Responsable registrado sin nombre → `assignee.fullName` nulo y las iniciales siguen llegando | | No cubierto | |

Criterio: en `backend/tests/` solo hay tests de auth y ninguno pide una tarea. `initials.spec.ts` («un nombre de dos palabras da la inicial de cada una», «sin nombre, las iniciales salen del email») y `signup.spec.ts` («una cuenta puede quedarse sin nombre») comprueban `user` en login/signup, no el `assignee` de una tarea, que pasa por otro transformer: comprueban la regla de cálculo, no que llegue junto a la tarea. Por eso «No cubierto» y no «No lo sé».

**Tests nuevos** (`backend/tests/functional/tasks/assignee.spec.ts`, grupo `Tasks | responsable`):
- Fila 1 → `el responsable llega con su nombre y sus iniciales` · **verde**.
- Fila 2 → `el responsable de una tarea no trae su email ni datos de acceso` · **rojo**: `assignee en la lista expone el email` (`GET /tasks` serializa el assignee con `UserTransformer`, que incluye `email`; la lectura suelta `GET /tasks/:id` sí lo omite).
- Fila 3 → `un responsable sin nombre llega con nombre nulo y con iniciales` · **verde**.

## Parte B · Las tres líneas

1. (pendiente: lo escribe el alumno)
2. (pendiente: lo escribe el alumno)
3. (pendiente: lo escribe el alumno)

### Decisiones que tomó el agente al escribir los tests

- Endpoints mirados: solo `GET /tasks/:id` (con `today=2026-11-10`, obligatorio) y `GET /tasks`, que son «suelta» y «en la lista». **No** se probaron `POST /tasks` ni `PATCH /tasks/:id/status`, que también usan `TaskTransformer` y por lectura de código también exponen el email; `PUT /:id/due-date` usa el transformer de detalle.
- Iniciales esperadas para "Ada Lovelace": `AL` fijado a mano. Para la cuenta sin nombre solo se exige string no vacío; no se fija `SE` (derivado del email `sin-nombre@example.com`), porque el cálculo es de la spec de auth.
- «Datos de acceso» = claves `email` y `password`, más que el email no aparezca en ningún valor del `assignee`. No se comprueban tokens ni hash por nombre, ni se exige una lista blanca exacta de claves.
- `id`, `createdAt` y `updatedAt` del assignee no se tratan como fuga en el test, aunque el requisito dice «ningún otro dato de esa cuenta» y el scenario solo nombra email y datos de acceso. Hoy el detalle devuelve `id`; la lista, además, las fechas de la cuenta.
- «Bastan para saber quién la lleva» no se comprueba (no es comprobable de forma automática); solo que nombre e iniciales llegan.
- El usuario y la tarea se crean con los modelos directamente y la sesión con `loginAs`, no por login HTTP; quien pide la lista es el propio responsable.
- Posible hueco de spec: el requisito prohíbe «ningún otro dato» y el scenario 2 solo prueba email/acceso; si `id` o las fechas de la cuenta cuentan como fuga, eso no lo decide ningún scenario.
