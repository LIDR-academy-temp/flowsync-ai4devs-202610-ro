import Task from '#models/task'
import TaskTransformer from '#transformers/task_transformer'
import { createTaskValidator, updateTaskValidator, viewerDayValidator } from '#validators/task'
import type { HttpContext } from '@adonisjs/core/http'
import { DateTime } from 'luxon'

export default class TasksController {
  async index({ request, serialize }: HttpContext) {
    const today = await this.viewerDay(request)
    // Sin `orderBy` a propósito: el orden de la lista no está decidido (PA-3).
    const tasks = await Task.query().preload('assignee')

    return serialize(TaskTransformer.transform(tasks, today))
  }

  async show({ params, request, serialize }: HttpContext) {
    const today = await this.viewerDay(request)
    const task = await Task.query().where('id', params.id).preload('assignee').firstOrFail()

    return serialize(TaskTransformer.transform(task, today))
  }

  async store({ auth, request, serialize }: HttpContext) {
    const today = await this.viewerDay(request)
    const { title, dueDate } = await request.validateUsing(createTaskValidator)

    const task = await Task.create({
      title,
      status: 'pending',
      assigneeId: auth.getUserOrFail().id,
      dueDate: dueDate ?? null,
    })
    await task.load('assignee')

    return serialize(TaskTransformer.transform(task, today))
  }

  async update({ params, request, serialize }: HttpContext) {
    const today = await this.viewerDay(request)
    const task = await Task.findOrFail(params.id)
    const payload = await request.validateUsing(updateTaskValidator)

    await task.merge(payload).save()
    await task.load('assignee')

    return serialize(TaskTransformer.transform(task, today))
  }

  /**
   * El día con el que se calcula `isOverdue`. Se resuelve antes de cualquier
   * escritura, para que un `today` no válido no deje cambios aplicados.
   */
  private async viewerDay(request: HttpContext['request']) {
    const { today } = await request.validateUsing(viewerDayValidator, { data: request.qs() })

    return today ?? DateTime.utc().toISODate()
  }
}
