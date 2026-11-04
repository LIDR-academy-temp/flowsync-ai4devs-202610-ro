import Task from '#models/task'
import TaskTransformer from '#transformers/task_transformer'
import { createTaskValidator, updateTaskValidator } from '#validators/task'
import type { HttpContext } from '@adonisjs/core/http'

export default class TasksController {
  async index({ serialize }: HttpContext) {
    // Sin `orderBy` a propósito: el orden de la lista no está decidido (PA-3).
    const tasks = await Task.query().preload('assignee')

    return serialize(TaskTransformer.transform(tasks))
  }

  async store({ auth, request, serialize }: HttpContext) {
    const { title } = await request.validateUsing(createTaskValidator)

    const task = await Task.create({
      title,
      status: 'pending',
      assigneeId: auth.getUserOrFail().id,
    })
    await task.load('assignee')

    return serialize(TaskTransformer.transform(task))
  }

  async update({ params, request, serialize }: HttpContext) {
    const task = await Task.findOrFail(params.id)
    const payload = await request.validateUsing(updateTaskValidator)

    await task.merge(payload).save()
    await task.load('assignee')

    return serialize(TaskTransformer.transform(task))
  }
}
