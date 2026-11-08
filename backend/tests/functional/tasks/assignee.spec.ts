import User from '#models/user'
import Task from '#models/task'
import { test } from '@japa/runner'
import testUtils from '@adonisjs/core/services/test_utils'

/**
 * Lo que cada tarea muestra de su responsable. Cubre los tres scenarios del
 * requisito «Lo que cada tarea muestra de su responsable» de
 * `openspec/specs/tasks/spec.md`: el responsable identificable, la tarea que no
 * filtra datos de cuenta y el responsable sin nombre.
 */
test.group('Tasks | responsable', (group) => {
  group.each.setup(() => testUtils.db().withGlobalTransaction())

  const HOY = '2026-11-08'

  async function sesion(client: any) {
    await User.create({
      fullName: 'Quien Mira',
      email: 'mira@example.com',
      password: 'secreto123',
    })

    const response = await client
      .post('/api/v1/auth/login')
      .json({ email: 'mira@example.com', password: 'secreto123' })

    return response.body().data.token as string
  }

  test('el responsable de una tarea llega con su nombre y sus iniciales', async ({
    client,
    assert,
  }) => {
    const token = await sesion(client)
    const ada = await User.create({
      fullName: 'Ada Lovelace',
      email: 'ada@example.com',
      password: 'secreto123',
    })
    const tarea = await Task.create({ title: 'Escribir el motor', assigneeId: ada.id })

    const response = await client
      .get(`/api/v1/tasks/${tarea.id}`)
      .qs({ today: HOY })
      .header('Authorization', `Bearer ${token}`)

    response.assertStatus(200)
    assert.equal(response.body().data.assignee.fullName, 'Ada Lovelace')
    assert.equal(response.body().data.assignee.initials, 'AL')
  })

  test('el responsable de una tarea no trae el email ni otros datos de la cuenta, suelta o en la lista', async ({
    client,
    assert,
  }) => {
    const token = await sesion(client)
    const ada = await User.create({
      fullName: 'Ada Lovelace',
      email: 'ada@example.com',
      password: 'secreto123',
    })
    const tarea = await Task.create({ title: 'Escribir el motor', assigneeId: ada.id })

    const suelta = await client
      .get(`/api/v1/tasks/${tarea.id}`)
      .qs({ today: HOY })
      .header('Authorization', `Bearer ${token}`)
    const lista = await client.get('/api/v1/tasks').header('Authorization', `Bearer ${token}`)

    suelta.assertStatus(200)
    lista.assertStatus(200)

    const responsables = [
      suelta.body().data.assignee,
      ...lista.body().data.map((t: any) => t.assignee),
    ]
    assert.lengthOf(responsables, 2)

    for (const assignee of responsables) {
      assert.notProperty(assignee, 'email')
      assert.notProperty(assignee, 'password')
      assert.notProperty(assignee, 'createdAt')
      assert.notProperty(assignee, 'updatedAt')
    }
    assert.notInclude(JSON.stringify([suelta.body(), lista.body()]), 'ada@example.com')
  })

  test('un responsable sin nombre llega con el nombre nulo y con iniciales', async ({
    client,
    assert,
  }) => {
    const token = await sesion(client)
    const sinNombre = await User.create({
      fullName: null,
      email: 'ada@example.com',
      password: 'secreto123',
    })
    const tarea = await Task.create({ title: 'Sin nombre', assigneeId: sinNombre.id })

    const response = await client
      .get(`/api/v1/tasks/${tarea.id}`)
      .qs({ today: HOY })
      .header('Authorization', `Bearer ${token}`)

    response.assertStatus(200)
    assert.isNull(response.body().data.assignee.fullName)
    assert.equal(response.body().data.assignee.initials, 'AE')
  })
})
