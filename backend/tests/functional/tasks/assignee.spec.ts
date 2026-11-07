import User from '#models/user'
import { test } from '@japa/runner'
import testUtils from '@adonisjs/core/services/test_utils'

/**
 * Datos del responsable en la tarea. Cubre los dos scenarios "No cubierto"
 * del requisito «Lo que cada tarea muestra de su responsable» de
 * `openspec/specs/tasks/spec.md`: que el assignee trae nombre e iniciales, y
 * que no expone el email de la cuenta.
 *
 * Se testea vía `GET /api/v1/tasks` (la lista) porque es el camino principal
 * y porque el bug existe ahí: `TaskTransformer` delega en `UserTransformer`,
 * que sí incluye el email. `GET /api/v1/tasks/:id` usa `TaskAssigneeTransformer`
 * y ya no lo expone.
 */
test.group('Tasks | datos del responsable', (group) => {
  group.each.setup(() => testUtils.db().withGlobalTransaction())

  async function sesionConTarea(client: any) {
    await User.create({ fullName: 'Ada Lovelace', email: 'ada@example.com', password: 'secreto123' })

    const login = await client
      .post('/api/v1/auth/login')
      .json({ email: 'ada@example.com', password: 'secreto123' })
    const token = login.body().data.token as string

    await client
      .post('/api/v1/tasks')
      .header('Authorization', `Bearer ${token}`)
      .json({ title: 'Revisar el informe' })

    return token
  }

  test('el assignee trae el nombre y las iniciales del responsable', async ({ client, assert }) => {
    const token = await sesionConTarea(client)

    const response = await client
      .get('/api/v1/tasks')
      .header('Authorization', `Bearer ${token}`)

    response.assertStatus(200)

    const tarea = response.body().data[0]
    assert.equal(tarea.assignee.fullName, 'Ada Lovelace')
    assert.equal(tarea.assignee.initials, 'AL')
  })

  test('el assignee no expone el email de la cuenta', async ({ client, assert }) => {
    const token = await sesionConTarea(client)

    const response = await client
      .get('/api/v1/tasks')
      .header('Authorization', `Bearer ${token}`)

    response.assertStatus(200)

    const tarea = response.body().data[0]
    assert.notProperty(tarea.assignee, 'email')
  })
})
