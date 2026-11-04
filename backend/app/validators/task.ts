import vine from '@vinejs/vine'

export const TASK_STATUSES = ['pending', 'in_progress', 'done'] as const

/**
 * Fecha de calendario, sin hora. AdonisJS la entrega como un `DateTime` de luxon
 * a medianoche local, que conserva ese mismo día aunque el servidor no corra en UTC.
 */
const calendarDate = () => vine.date({ formats: ['YYYY-MM-DD'] })

/**
 * El título y la fecha son lo único que admite la creación: el estado y el
 * responsable enviados se descartan al no estar declarados.
 */
export const createTaskValidator = vine.create({
  title: vine.string().trim().minLength(1).maxLength(255),
  dueDate: calendarDate().nullable().optional(),
})

/**
 * Exige al menos un campo actualizable, para que un cuerpo sin ninguno sea un
 * 422 y no un 200 que no cambia nada.
 *
 * `optional()` por sí solo trata un `null` como campo no enviado y lo ignoraría.
 * Por eso `status` y `assigneeId` son obligatorios si están presentes: un nulo
 * explícito se rechaza. En `dueDate`, en cambio, el nulo significa quitarla.
 */
export const updateTaskValidator = vine.create({
  status: vine
    .enum(TASK_STATUSES)
    .optional()
    .requiredWhen(
      (field) =>
        'status' in field.parent || !('assigneeId' in field.parent || 'dueDate' in field.parent)
    ),
  assigneeId: vine
    .number()
    .withoutDecimals()
    .exists({ table: 'users', column: 'id' })
    .optional()
    .requiredWhen((field) => 'assigneeId' in field.parent),
  dueDate: calendarDate().nullable().optional(),
})

/**
 * El día de quien mira, para el veredicto de vencimiento. Se valida aparte del
 * cuerpo porque viaja en la consulta.
 */
export const viewerDayValidator = vine.create({
  today: calendarDate()
    .optional()
    .transform((value) => value.toISODate()!),
})
