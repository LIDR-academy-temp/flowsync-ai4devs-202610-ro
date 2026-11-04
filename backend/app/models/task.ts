import { TaskSchema } from '#database/schema'
import User from '#models/user'
import { belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

export default class Task extends TaskSchema {
  @belongsTo(() => User, { foreignKey: 'assigneeId' })
  declare assignee: BelongsTo<typeof User>

  /**
   * Única implementación de la regla de vencimiento. Compara días en formato
   * `YYYY-MM-DD`, sin horas ni zonas: una tarea que vence hoy aún no está vencida.
   */
  isOverdueOn(today: string) {
    if (this.status === 'done' || !this.dueDate) return false

    return this.dueDate.toISODate()! < today
  }
}
