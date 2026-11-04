import type Task from '#models/task'
import AssigneeTransformer from '#transformers/assignee_transformer'
import { BaseTransformer } from '@adonisjs/core/transformers'

export default class TaskTransformer extends BaseTransformer<Task> {
  constructor(
    task: Task,
    private today: string
  ) {
    super(task)
  }

  toObject() {
    return {
      ...this.pick(this.resource, ['id', 'title', 'status']),
      dueDate: this.resource.dueDate?.toISODate() ?? null,
      // Se calcula en cada respuesta: el veredicto no se guarda en ningún sitio.
      isOverdue: this.resource.isOverdueOn(this.today),
      assignee: AssigneeTransformer.transform(this.resource.assignee),
    }
  }
}
