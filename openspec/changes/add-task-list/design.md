# Design

## Context

El motivo y el alcance están en `proposal.md`, y los requisitos en `specs/tasks/spec.md`. Lo que condiciona el enfoque es esto:

- **Backend:** los modelos extienden la clase generada en `database/schema.ts`, las respuestas pasan por `serialize()` con un transformer y los controladores se referencian desde `#generated/controllers`.
- **Frontend:** `lib/api.ts` es el único punto de contacto con la API y solo admite `GET` y `POST`. `components/ui/` tiene `alert`, `button`, `card`, `input` y `label`, pero ningún selector.
- **Formularios:** `useAuthForm` ya reparte los errores de la API entre aviso general y campos, aunque su nombre y ubicación hablen de auth.
- **Validación:** ensayado con VineJS, `vine.string().trim()` por sí solo acepta `"   "` y lo deja en `""`. No basta para rechazar títulos en blanco.

## Goals / Non-Goals

**Goals:**

- Seguir los patrones existentes en cada capa, sin capas ni abstracciones nuevas.
- No exponer del responsable más que `id` y `fullName`.
- Que ninguna capa decida un orden por su cuenta.

**Non-Goals:**

- Paginación, caché de datos en cliente o actualización automática.
- Renombrar `useAuthForm` o mover `lib/api.ts` a módulos por dominio.
- Resolver PA-3, PA-4, PA-7 o PA-8.

## Decisions

### Modelo de datos

Tabla `tasks` con `id`, `title` (`string(255)`, no nula), `status` (`enum` no nulo, por defecto `pending`), `assignee_id` (no nulo, con clave foránea a `users.id`) y `created_at`/`updated_at`, como el resto de tablas.

- **`assignee_id` no nulo:** toda tarea tiene responsable desde que nace, y ninguna operación puede quitárselo.
- **Sin columna de creador:** ningún requisito la necesita. El creador solo determina el valor inicial de `assignee_id`.
- **Sin columnas de vencimiento:** la restricción de no dejarlo preparado es explícita.
- **`enum` en la base de datos, además del validador:** el conjunto cerrado se protege también frente a escrituras que no pasen por la API. Alternativa descartada: una columna de texto libre, que confiaría solo en el validador.
- **Timestamps sin exponer:** existen por convención, pero el transformer no los incluye. Así la API no ofrece un dato con el que ordenar o pintar fechas.

### Rutas y controlador

Un `TasksController` con `index`, `store` y `update`, en un grupo `tasks` bajo `/api/v1` con `middleware.auth()`. El parámetro `:id` se restringe a numérico con `router.matchers.number()`, y `update` usa `findOrFail` para responder 404.

- **`PATCH` y no `PUT`:** la actualización es parcial por naturaleza.
- **`store` responde 200:** es lo que hace ya `POST /auth/signup` en esta API. Se prefiere la coherencia a introducir un 201 aislado.
- **`index` usa `Task.query().preload('assignee')` sin `orderBy`:** cumple la restricción de no ordenar explícitamente. El orden resultante queda en manos del motor y no forma parte del contrato.
- **`store` toma el responsable de `auth.getUserOrFail()`:** nunca del cuerpo. Vine descarta las claves no declaradas, de modo que `status` y `assigneeId` enviados en la creación no llegan al controlador.

### Validadores

En `app/validators/task.ts`:

```ts
createTaskValidator: { title: vine.string().trim().minLength(1).maxLength(255) }
updateTaskValidator: {
  status: vine.enum(TASK_STATUSES).optional()
    .requiredWhen((field) => 'status' in field.parent || !('assigneeId' in field.parent)),
  assigneeId: vine.number().withoutDecimals().exists({ table: 'users', column: 'id' }).optional()
    .requiredWhen((field) => 'assigneeId' in field.parent),
}
```

- **`minLength(1)` tras el `trim`:** se mantiene como salvaguarda. Ensayado en la tarea 2.5, el body parser convierte antes los títulos en blanco en `null` y la respuesta es un error `required`; por eso el frontend muestra el mismo mensaje en los dos casos.
- **`requiredWhen`:** hace que un cuerpo sin ninguno de los dos campos sea 422, en lugar de un 200 que no cambia nada. Además rechaza un `null` explícito con un error sobre su propio campo, porque ensayado con VineJS, `optional()` lo trata como campo no enviado y `requiredIfMissing` no bastaba.
- **Firmas pendientes:** `.exists` se usa con la misma forma de opciones que `.unique`. Hay que confirmar su firma y la de `vine.number` en los `.d.ts` al implementar, y mantener el comportamiento de la spec si difieren.

### Serialización

`TaskTransformer` compone `id`, `title` y `status` con un `AssigneeTransformer` que hace `pick` de `id` y `fullName`. Se descarta reutilizar `UserTransformer` porque filtraría el correo, justo lo que advierte la nota de E3-1. Tras `store` y `update` hay que cargar la relación con `load('assignee')` antes de serializar.

### Sincronización de la pantalla

- **Tras crear, se vuelve a pedir la lista:** así el cliente no decide dónde colocar la tarea nueva, lo que sería inventar un orden. Alternativa descartada: insertarla al principio o al final del estado local.
- **Cambio de estado y de responsable, optimistas y en su sitio:** la fila cambia al momento y se sustituye por la respuesta del servidor en la misma posición. Si falla, se restaura el valor anterior y se muestra una alerta. Cumple «de inmediato» sin mover filas.
- **Peticiones concurrentes sobre la misma fila:** los controles de la fila se desactivan mientras haya un cambio en curso. Es la forma más simple de evitar que una respuesta tardía pise un cambio posterior.

### Controles de la fila sin añadir dependencias

- **Estado: tres `Button` en la fila.** El activo usa la variante `default` y los otros `outline`, con `aria-pressed`. Muestra los tres destinos, cambia con un solo clic y hace visible el estado. Alternativa descartada: `npx shadcn add select`, que añadiría una dependencia.
- **Responsable: `<select>` nativo** con las clases de `Input`, sin componente nuevo de `ui/`. Las opciones son los responsables distintos de la lista cargada, deduplicados por `id` y en orden de primera aparición, sin ordenar. El `value` es el `id`, de modo que dos «Sin nombre» siguen siendo opciones distintas aunque se lean igual.

### Reutilización en el frontend

- **`useAuthForm(['title'])`** gestiona el formulario tal como está. Un hook paralelo duplicaría la lógica.
- **`lib/api.ts`** gana `PATCH`, `listTasks`, `createTask` y `updateTask`, y etiquetas para `title`, `status` y `assigneeId`.
- **`translate`** gana un mensaje para `database.exists` y trata `minLength` con `meta.min === 1` como campo sin rellenar, para no pintar «al menos 1 caracteres».
- **`TaskListPage`** vive en `pages/` y su ruta dentro de `ProtectedRoute`. Se usa `Card` para el marco y un `Link` a cada lado, como en las pantallas de acceso.
- **Un 401 en la lista** muestra el mensaje de sesión caducada sin cerrar la sesión, igual que el perfil, que no reacciona hasta la siguiente carga.

### Destino tras login y registro

- **Login a `/tasks`:** hoy es `PublicOnlyRoute` quien saca de `/login` al cambiar la sesión, así que un `navigate` en la página competiría con esa redirección. `AuthProvider` expone por eso un destino, `/profile` por defecto: `login` lo pone en `/tasks` en la misma actualización que abre la sesión, `clearSession` lo restablece y `PublicOnlyRoute` lo usa. Abrir `/login` con sesión implica recargar y vuelve al valor por defecto, de modo que sigue yendo a `/profile`.
- **Registro a `/login`:** `signup` llama a la API, ignora el token y ejecuta `clearSession` y `setSessionError(null)`. Así no sobrevive un token anterior conservado tras un corte, que al recargar devolvería la sesión de otra cuenta, y el aviso de sesión perdida no reaparece en el login. Después `RegisterPage` navega a `/login` con `replace`.
- **Aviso de cuenta creada:** `AuthProvider` guarda en memoria que se acaba de crear la cuenta, igual que `sessionError`, y `startSession` lo limpia. `LoginPage` lo pinta con la variante normal de `Alert`, y el error del intento actual tiene prioridad. Alternativa descartada: el `state` de la navegación, que sobrevive a una recarga en el historial del navegador y haría reaparecer el aviso.
- **La API de registro no cambia:** sigue devolviendo un token utilizable. Alternativa descartada: quitarlo de la respuesta, que rompería la spec `auth` de la API sin necesidad.

## Risks / Trade-offs

- **[Orden no determinista entre consultas]** → Sin regla decidida, las filas podrían cambiar de posición tras recargar o crear. Se acepta y queda como PA-3. En SQLite, en la práctica, cabe esperar un orden estable.
- **[«Quién está en qué» difícil con 200 tareas]** → Sin orden ni agrupación, E3-1 CA-5 se cumple a costa de recorrer la lista. Se acepta y queda como PA-3.
- **[Selector de responsable incompleto]** → Quien no tenga tareas no se puede elegir, y una persona desaparece del selector al perder su última tarea. Es consecuencia de no tener endpoint de equipo. Consta en el proposal como punto abierto.
- **[Destinos indistinguibles]** → Dos personas con el mismo nombre, o dos «Sin nombre», se leen igual, y no se puede mostrar correo ni id. Se acepta y queda como punto abierto.
- **[Selector basado en datos que pueden estar obsoletos]** → Sin refresco automático, una persona elegida sigue existiendo porque las cuentas no se borran, así que el `assigneeId` siempre es válido. Gana la última escritura (PA-8).
- **[Marcar Hecho por error con un clic]** → Sin confirmación, por requisito. Se puede volver atrás con otro clic.
- **[Token de registro sin usar]** → Cada registro desde la web deja en el servidor un token vigente que nadie guarda. Se acepta: no sale del navegador ni se persiste. Revocarlo exigiría una llamada más que puede fallar.
- **[Fricción y desviación de RF-1]** → Quien se registra tiene que volver a escribir sus credenciales, aunque el aviso de cuenta creada explica por qué. Es una decisión explícita y consta en el proposal.
- **[Cerrar sesión queda más lejos]** → Tras el login se llega a la lista y el botón sigue solo en el perfil, a un clic más. Se acepta para no ampliar el alcance.
- **[Sin tests]** → Decisión explícita de este change. Las comprobaciones se limitan a tipos, lint, build y un recorrido manual.

## Migration Plan

Solo hay una tabla nueva: `node ace migration:run`, que además regenera `database/schema.ts`. Para revertir, `node ace migration:rollback` elimina la tabla sin afectar a las cuentas. No hay datos existentes que migrar.
