import Task from '#models/task'
import User from '#models/user'
import { test } from '@japa/runner'
import testUtils from '@adonisjs/core/services/test_utils'

/**
 * Lo que cada tarea muestra de su responsable. Cubre los tres scenarios del
 * requisito «Lo que cada tarea muestra de su responsable» de
 * `openspec/specs/tasks/spec.md`: responsable identificable, la tarea que no
 * filtra datos de cuenta y el responsable sin nombre.
 */
test.group('Tasks | responsable', (group) => {
  group.each.setup(() => testUtils.db().withGlobalTransaction())

  async function sesion(
    client: any,
    fullName: string | null = 'Ada Lovelace',
    email = 'ada@example.com'
  ) {
    const user = await User.create({ fullName, email, password: 'secreto123' })

    const response = await client.post('/api/v1/auth/login').json({ email, password: 'secreto123' })

    return { user, token: response.body().data.token as string }
  }

  test('la tarea no filtra datos de cuenta del responsable, ni suelta ni en la lista', async ({
    client,
    assert,
  }) => {
    const { user, token } = await sesion(client)
    const task = await Task.create({ title: 'Escribir el motor', status: 'pending', assigneeId: user.id })

    const lista = await client.get('/api/v1/tasks').header('Authorization', `Bearer ${token}`)
    const suelta = await client
      .get(`/api/v1/tasks/${task.id}`)
      .qs({ today: '2026-01-15' })
      .header('Authorization', `Bearer ${token}`)

    lista.assertStatus(200)
    suelta.assertStatus(200)

    const responsables = [lista.body().data[0].assignee, suelta.body().data.assignee]

    for (const assignee of responsables) {
      assert.notProperty(assignee, 'email')
      assert.notProperty(assignee, 'password')
      assert.notProperty(assignee, 'createdAt')
      assert.notProperty(assignee, 'updatedAt')
    }
  })

  test('el responsable llega con su nombre y sus iniciales, suelta y en la lista', async ({
    client,
    assert,
  }) => {
    const { user, token } = await sesion(client)
    const task = await Task.create({ title: 'Escribir el motor', status: 'pending', assigneeId: user.id })

    const lista = await client.get('/api/v1/tasks').header('Authorization', `Bearer ${token}`)
    const suelta = await client
      .get(`/api/v1/tasks/${task.id}`)
      .qs({ today: '2026-01-15' })
      .header('Authorization', `Bearer ${token}`)

    lista.assertStatus(200)
    suelta.assertStatus(200)

    for (const assignee of [lista.body().data[0].assignee, suelta.body().data.assignee]) {
      assert.equal(assignee.fullName, 'Ada Lovelace')
      assert.equal(assignee.initials, 'AL')
    }
  })

  test('un responsable sin nombre llega con nombre nulo e iniciales', async ({
    client,
    assert,
  }) => {
    const { user, token } = await sesion(client, null)
    const task = await Task.create({ title: 'Escribir el motor', status: 'pending', assigneeId: user.id })

    const lista = await client.get('/api/v1/tasks').header('Authorization', `Bearer ${token}`)
    const suelta = await client
      .get(`/api/v1/tasks/${task.id}`)
      .qs({ today: '2026-01-15' })
      .header('Authorization', `Bearer ${token}`)

    lista.assertStatus(200)
    suelta.assertStatus(200)

    for (const assignee of [lista.body().data[0].assignee, suelta.body().data.assignee]) {
      assert.isNull(assignee.fullName)
      assert.equal(assignee.initials, 'AE')
    }
  })
})
