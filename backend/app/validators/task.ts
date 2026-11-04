import vine from '@vinejs/vine'

export const TASK_STATUSES = ['pending', 'in_progress', 'done'] as const

/**
 * El título es lo único que admite la creación: el estado y el responsable
 * enviados se descartan al no estar declarados.
 */
export const createTaskValidator = vine.create({
  title: vine.string().trim().minLength(1).maxLength(255),
})

/**
 * Exige al menos uno de los dos campos, para que un cuerpo vacío sea un 422 y
 * no un 200 que no cambia nada.
 *
 * `optional()` por sí solo trata un `null` como campo no enviado y lo ignoraría.
 * Por eso cada campo presente en el cuerpo es obligatorio: un nulo explícito se
 * rechaza con un error sobre ese mismo campo.
 */
export const updateTaskValidator = vine.create({
  status: vine
    .enum(TASK_STATUSES)
    .optional()
    .requiredWhen((field) => 'status' in field.parent || !('assigneeId' in field.parent)),
  assigneeId: vine
    .number()
    .withoutDecimals()
    .exists({ table: 'users', column: 'id' })
    .optional()
    .requiredWhen((field) => 'assigneeId' in field.parent),
})
