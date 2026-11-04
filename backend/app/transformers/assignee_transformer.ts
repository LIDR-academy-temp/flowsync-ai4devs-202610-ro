import type User from '#models/user'
import { BaseTransformer } from '@adonisjs/core/transformers'

/**
 * Lo único que la API de tareas expone de una persona. `UserTransformer` no
 * sirve aquí porque filtraría el correo.
 */
export default class AssigneeTransformer extends BaseTransformer<User> {
  toObject() {
    return this.pick(this.resource, ['id', 'fullName'])
  }
}
