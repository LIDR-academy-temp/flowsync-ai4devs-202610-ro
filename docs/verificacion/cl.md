Scenarios en el requisito: 4 · Cubiertos: ___



┌────────────────────────────────┬─────────────────┬──────────────────────────────────────────────────────────────┐
│            Scenario            │  Test que lo    │                Lo más parecido (no lo cubre)                 │
│                                │    comprueba    │                                                              │
├────────────────────────────────┼─────────────────┼──────────────────────────────────────────────────────────────┤
│ Responsable identificable      │ Ninguno         │ registrarse devuelve la cuenta y un token que ya sirve y un  │
│ (spec.md:101)                  │                 │ nombre de dos palabras da la inicial de cada una             │
├────────────────────────────────┼─────────────────┼──────────────────────────────────────────────────────────────┤
│ La tarea no filtra datos de    │ Ninguno         │ la contraseña nunca sale en la respuesta                     │
│ cuenta (spec.md:106)           │                 │                                                              │
├────────────────────────────────┼─────────────────┼──────────────────────────────────────────────────────────────┤
│ Responsable sin nombre         │ Ninguno         │ una cuenta puede quedarse sin nombre y sin nombre, las       │
│ (spec.md:111)                  │                 │ iniciales salen del email                                    │
└────────────────────────────────┴─────────────────┴──────────────────────────────────────────────────────────────┘

Valores concretos

┌───────────────────────────┬────────────────┬────────────────────────────────────────────────────────────────────┐
│           Valor           │     Origen     │                                Nota                                │
├───────────────────────────┼────────────────┼────────────────────────────────────────────────────────────────────┤
│ Ada Lovelace              │ Spec           │ Es el ejemplo del scenario                                         │
├───────────────────────────┼────────────────┼────────────────────────────────────────────────────────────────────┤
│ 'AL'                      │ Tests de auth  │ La spec dice «sus iniciales», sin valor                            │
├───────────────────────────┼────────────────┼────────────────────────────────────────────────────────────────────┤
│ 'SE'                      │ Decisión mía   │ La spec solo pide que «sigan llegando»; es más estricto. Si cambia │
│                           │                │  cómo se derivan las iniciales, falla aunque el scenario se cumpla │
├───────────────────────────┼────────────────┼────────────────────────────────────────────────────────────────────┤
│ sin-nombre@example.com    │ signup.spec.ts │ De él sale 'SE'                                                    │
├───────────────────────────┼────────────────┼────────────────────────────────────────────────────────────────────┤
│ ada@example.com,          │ Tests de auth  │                                                                    │
│ secreto123                │                │                                                                    │
├───────────────────────────┼────────────────┼────────────────────────────────────────────────────────────────────┤
│ Alan Turing,              │ Decisión mía   │ La spec no pide que consulte otra cuenta                           │
│ alan@example.com          │                │                                                                    │
├───────────────────────────┼────────────────┼────────────────────────────────────────────────────────────────────┤
│ Revisar el informe        │ Spec           │ Viene de otro scenario                                             │
├───────────────────────────┼────────────────┼────────────────────────────────────────────────────────────────────┤
│ status: 'pending'         │ Decisión mía   │ Tiene que ser pendiente o en curso, porque la lista sin filtro     │
│                           │                │ excluye las hechas. No pruebo los otros estados                    │
├───────────────────────────┼────────────────┼────────────────────────────────────────────────────────────────────┤
│ today: '2026-08-13'       │ Decisión mía   │ El endpoint lo exige; la tarea no tiene fecha, así que no influye  │
└───────────────────────────┴────────────────┴────────────────────────────────────────────────────────────────────┘

Qué interpreté de la spec

- «Se obtiene una tarea»: lo limité a GET /tasks/:id y GET /tasks. No pruebo POST /tasks, PATCH /tasks/:id/status ni PUT /tasks/:id/due-date, aunque también devuelven tareas.
- «Datos de acceso»: prohíbo la clave email, el valor del email, el texto password y la contraseña. Busco solo dentro del assignee, no en el resto de la tarea.
- Lo que no prohíbo: id, createdAt y updatedAt, aunque el requisito dice «ningún otro dato de esa cuenta».
- «Esos datos bastan para saber quién la lleva»: no lo compruebo; no es verificable con una aserción.

Vacío o null

- fullName: null: es el único caso sin nombre que pruebo. La cuenta se crea con User.create, no por el signup.
- Clave fullName ausente: el test falla, porque assert.isNull no acepta undefined.
- Sin probar: fullName como "" o solo espacios.
- Sin assignee: los tests fallan al leerlo, con un TypeError o un error de la aserción, no con un mensaje claro.
- Tarea ausente de la lista: los tests nuevos fallan con assert.isDefined. El de «Responsable identificable» no tiene esa comprobación y falla con un TypeError.

Límites sin probar

- Nombres de tres o más palabras (las iniciales solo usan las dos primeras).
- Nombres de una palabra o de una sola letra, ni nombres muy largos, dentro de una tarea.
- Listas con varias tareas de distintos responsables: cada test crea una sola tarea.
- Espacios dobles en el nombre.

Creía cubiertos 5, estaban cubiertos 24 y 1 falla. Usa los números tal cual quedaron, sin redondear.


## El scenario en el que dudaste si faltaba un test o faltaba la regla en la spec, y qué te hizo dudar.

el escenario de la tarea no filtra datos de respuesta

## Algo que el scenario no determinaba y tuviste que decidir tú al escribir el test (por ejemplo, qué se muestra si el responsable no tiene nombre).

lo de si un test esta en rojo se quede en rojo.