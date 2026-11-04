# Design

## Context

El motivo y el alcance están en `proposal.md`, y los requisitos en `specs/tasks/spec.md`. Lo que condiciona el enfoque es esto:

- **Backend:** `TaskTransformer` compone la respuesta y el modelo extiende la clase generada. El servidor corre con `TZ=UTC`, y nada garantiza que sea así en todos los entornos.
- **Fechas:** el generador de esquema convierte una columna `date` en `@column.date()` con `DateTime` de luxon. No hay ningún componente de fecha en el frontend.
- **Validación, ensayado con VineJS:** `vine.date({ formats: ['YYYY-MM-DD'] }).nullable().optional()` rechaza `2026-02-30`, `2026-1-1` y fechas con hora, conserva `null` y omite la clave ausente. Dentro de AdonisJS, una transformación global lo entrega como un `DateTime` de luxon a medianoche **local**.
- **Body parser:** convierte las cadenas vacías en `null`, de modo que `dueDate: ""` y `dueDate: null` significan lo mismo.

## Goals / Non-Goals

**Goals:**

- Una sola implementación de la regla de vencimiento, en el dominio.
- Tratar la fecha como día de calendario en todas las capas, sin conversiones por huso.

**Non-Goals:**

- Índices sobre la fecha, porque no se ordena ni se filtra por ella.
- Actualizar en vivo un diálogo abierto si otra persona cambia la tarea (PA-8).

## Decisions

### Lectura individual como superficie mínima

`GET /api/v1/tasks/:id` entra porque «al abrir la tarea» necesita un veredicto reciente: la medianoche puede haber pasado desde que se cargó la lista (CA-20). Alternativa descartada: abrir con los datos de la fila, que podrían estar obsoletos y dejarían el veredicto en manos de una carga antigua.

**Punto abierto:** la pantalla de detalle completa no entra (PA-6). Cuando se aborde RF-11 hay que decidir si sustituye al diálogo o lo amplía. La lectura individual sirve en ambos casos.

### Modelo de datos

Columna `due_date` de tipo `date` y nula en `tasks`, sin valor por defecto. Las tareas existentes quedan sin fecha, y `isOverdue` no tiene columna.

### Regla en el dominio

Un método `isOverdueOn(today: string): boolean` en el modelo `Task`, que compara cadenas ISO:

```ts
this.status !== 'done' && this.dueDate !== null && this.dueDate.toISODate()! < today
```

Comparar `YYYY-MM-DD` es comparar días, sin que intervenga ninguna hora ni zona. Alternativa descartada: comparar instantes de `DateTime`, que es donde aparece el error del día de más que advierte FS-118.2.

### Día de referencia

`today` viaja como parámetro de consulta en las cuatro operaciones, también en `POST` y `PATCH`, porque sus respuestas incluyen el veredicto.

- **Validación propia:** un `viewerDayValidator` se aplica a `request.qs()`, separado del cuerpo. El controlador lo ejecuta **antes** de escribir, para que un `today` no válido no deje cambios aplicados.
- **Valor resuelto:** una cadena `YYYY-MM-DD`, o `DateTime.utc().toISODate()` si falta. Se pasa al transformer como `TaskTransformer.transform(task, today)`, que admite argumentos de constructor adicionales.
- **Zona IANA descartada:** obligaría a validar zonas, y el cliente ya conoce su día.
- **Cliente que miente:** solo altera su propia respuesta, porque nada se guarda.

### Conversión de la fecha validada

El `DateTime` local que entrega AdonisJS se guarda y se serializa con `toISODate()`, que conserva el día. Nunca hay que pasar por `toISOString()` ni por UTC, que pueden cambiarlo si el servidor no corre en UTC. Ensayado con el servidor en `TZ=America/New_York` y `TZ=Asia/Tokyo`, con el mismo resultado que en UTC.

### Validadores

```ts
createTaskValidator: { title, dueDate: dueDate().nullable().optional() }
updateTaskValidator: {
  status: enum.optional().requiredWhen(presente o ninguno de los tres),
  assigneeId: ... .optional().requiredWhen(presente),
  dueDate: dueDate().nullable().optional(),
}
```

- **`dueDate` nula, a diferencia de los otros dos:** en `status` y `assigneeId` un nulo se rechaza; en `dueDate` significa quitarla.
- **Cuerpo sin campos útiles:** la condición de `status` pasa a contar también `dueDate`, de modo que `{ dueDate: null }` es válido y `{}` o `{ isOverdue: true }` siguen siendo 422.
- **`isOverdue`:** no se declara, así que Vine lo descarta.
- **Sin límite de fechas pasadas:** ni `after` ni `before`, por CA-13.

### Día local en el cliente

`lib/api.ts` añade `today` a cada petición de tareas, calculado en ese momento con `getFullYear`, `getMonth` y `getDate`. Se descarta `toISOString()`, que daría el día UTC. Queda en un solo punto, y los componentes no lo conocen.

### Diálogo de tarea

`components/task-dialog.tsx`, sobre `components/ui/dialog.tsx`, generado con `npx shadcn@latest add dialog`. Aporta foco atrapado, Escape y lector de pantalla. El generador añadía el paquete `cn` e importaba de él: se revierte la dependencia y esa única línea importa de `@/lib/utils`, como el resto de `ui/`. Es una excepción a no editar los componentes generados, que hay que repetir si se regenera. El botón de cerrar que trae se anuncia en inglés, así que el diálogo usa el suyo, con `showCloseButton={false}`. `TaskListPage` guarda solo el id de la tarea abierta y el título de la fila pasa a ser un botón. El estado de la tarea vive en el diálogo, que la pide al abrirse, porque la lista no pinta la fecha.

### Campo de fecha y guardado automático

`<input type="date">` nativo con las clases de `Input`, sin dependencias, y `max="9999-12-31"` porque sin él Chrome admite años de seis dígitos. Es aquí donde CA-14 y CA-16 rozan: guardar sin botón y conservar el valor ante una fecha inválida.

Alternativas descartadas: guardar solo al perder el foco, porque en Chromium teclear una fecha completa no lo quita y la señal no aparecería de inmediato; y guardar en cada `change`, porque teclear `15/11/2026` emite ocho valores, entre ellos `2026-01-15` y `0002-11-15`.

- **`validity.badInput`:** una fecha incompleta o inexistente da `value === ""`, igual que un campo vacío. Hay que distinguirlas: con `badInput` se muestra el error, se cancela el guardado pendiente y no se envía nada. Sin él, un campo vacío es quitar la fecha.
- **Año a medio teclear:** un año por debajo de 1000 se trata como fecha sin terminar, porque el campo pasa por `0002-…` y la API lo rechaza.
- **Espera de 500 ms tras cada cambio válido:** al teclear, el campo emite fechas intermedias válidas, como cada día de un mes. Esperar evita guardarlas todas y sigue cubriendo la elección en el calendario, que no quita el foco. Al perder el foco o cerrar, se guarda lo pendiente sin esperar.
- **Peticiones en orden:** se encadenan, para que una respuesta tardía no pise un cambio posterior. La señal se actualiza con la respuesta del servidor, no por adelantado, porque el veredicto es suyo.
- **Cerrar con un cambio pendiente:** se espera al guardado. Si falla, el diálogo sigue abierto con el error y el campo vuelve a lo guardado, de modo que volver a cerrar sí cierra (CA-16). Si el campo tiene una fecha inválida no hay nada que guardar, y se cierra conservando la anterior.
- **«Quitar fecha»:** envía `dueDate: null` de inmediato, sin confirmación, y solo se muestra si hay fecha.

### Errores y señal

- **Errores por campo:** `ApiError.fieldErrors` y `FieldError`, igual que en el título, con estado propio en el diálogo. `useAuthForm` no sirve aquí: no indica si el envío ha ido bien, que hace falta para cerrar, ni permite limpiar un error de cliente. `translate` gana la regla `date` con «Esa fecha no existe o está incompleta.», y la etiqueta de `dueDate`.
- **Señal de vencida:** `Alert` con icono y el texto «Vencida», de modo que no depende del color. Solo se pinta con `isOverdue` verdadero.
- **Sin cambios en la lista:** los campos nuevos llegan a su estado, pero no se pintan. El guardado del diálogo no necesita actualizarla.

## Risks / Trade-offs

- **[Cliente sin `today`]** → Recibe un veredicto en UTC sin saberlo. Se acepta por decisión del change: la web siempre lo envía.
- **[Reloj del cliente equivocado]** → El veredicto corresponde al día que cree tener. Se acepta: solo le afecta a esa persona.
- **[Fecha con servidor fuera de UTC]** → El `Date` de Vine es de medianoche local. Se mitiga con la conversión anterior y se comprueba arrancando con otro `TZ`.
- **[Veredicto obsoleto en un diálogo abierto]** → Si pasa la medianoche con el diálogo abierto, la señal no cambia hasta reabrirlo. CA-20 solo exige reabrir.
- **[`isOverdue` en la lista de la API]** → La lista recibe un dato que no pinta. Es lo que pide la representación única y no se muestra en pantalla.
- **[Tecleo lento]** → Con una pausa de más de 500 ms se guardan fechas intermedias: en un ensayo, `2026-01-03` antes de llegar a `2026-11-03`, con la señal apareciendo un momento. Y si después se abandona una fecha imposible, la tarea conserva la última intermedia, no la original. Se acepta frente a las alternativas: queda visible y se corrige.
- **[Calendario sin ensayar]** → No se ha probado que elegir en el selector de calendario mantenga el foco; solo se ha ensayado el tecleo.
- **[Colisiones]** → Gana la última escritura (PA-8).
- **[`shadcn add` necesita red]** → Si cambiara `package.json`, hay que parar y revisarlo, porque no se prevé ninguna dependencia nueva.
- **[Sin tests]** → Decisión explícita. FS-118.2 y FS-118.3 piden pruebas, así que esos tickets quedan sin cerrar según su Definition of Done, que no se cumple en este punto. Las comprobaciones se limitan a tipos, lint, build y recorridos manuales.

## Migration Plan

`node ace migration:run` añade la columna y regenera `database/schema.ts`. Para revertir, `node ace migration:rollback` la elimina y se pierden las fechas guardadas, sin afectar al resto de la tarea. La migración debe ejecutarse limpia sobre una base con tareas.

## Open Questions

- Si el detalle completo sustituye al diálogo o lo amplía (PA-6). No cambia este change.
