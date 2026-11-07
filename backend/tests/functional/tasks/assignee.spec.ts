import User from '#models/user'
import Task from '#models/task'
import { test } from '@japa/runner'
import testUtils from '@adonisjs/core/services/test_utils'

/**
 * Lo que cada tarea muestra de su responsable. Cubre los tres scenarios del
 * requisito «Lo que cada tarea muestra de su responsable» de
 * `openspec/specs/tasks/spec.md`: responsable identificable, la tarea no
 * filtra datos de cuenta, y el responsable sin nombre.
 */
test.group('Tasks | responsable', (group) => {
  group.each.setup(() => testUtils.db().withGlobalTransaction())

  // `GET /tasks/:id` exige el día de quien mira; su valor no importa aquí.
  const today = '2026-11-06'

  async function tareaDe(fullName: string | null, email: string) {
    const user = await User.create({ fullName, email, password: 'secreto123' })
    const task = await Task.create({
      title: 'Revisar el informe',
      status: 'pending',
      assigneeId: user.id,
    })
    return task
  }

  async function sesion(client: any) {
    await User.create({ fullName: 'Quien Mira', email: 'mira@example.com', password: 'secreto123' })
    const response = await client
      .post('/api/v1/auth/login')
      .json({ email: 'mira@example.com', password: 'secreto123' })
    return response.body().data.token as string
  }

  test('el responsable llega con su nombre y sus iniciales', async ({ client, assert }) => {
    const task = await tareaDe('Ada Lovelace', 'ada@example.com')
    const token = await sesion(client)

    const response = await client
      .get(`/api/v1/tasks/${task.id}`)
      .qs({ today })
      .header('Authorization', `Bearer ${token}`)

    response.assertStatus(200)

    const { assignee } = response.body().data
    assert.equal(assignee.fullName, 'Ada Lovelace')
    assert.equal(assignee.initials, 'AL')
  })

  test('ni la tarea suelta ni la lista exponen el email del responsable', async ({
    client,
    assert,
  }) => {
    const task = await tareaDe('Ada Lovelace', 'ada@example.com')
    const token = await sesion(client)

    const suelta = await client
      .get(`/api/v1/tasks/${task.id}`)
      .qs({ today })
      .header('Authorization', `Bearer ${token}`)

    const lista = await client.get('/api/v1/tasks').header('Authorization', `Bearer ${token}`)

    suelta.assertStatus(200)
    lista.assertStatus(200)

    const tareas = lista.body().data as Array<{ id: number; assignee: Record<string, unknown> }>
    const enLista = tareas.find((t) => t.id === task.id)
    assert.exists(enLista, 'la tarea tiene que aparecer en la lista')

    for (const [donde, assignee] of [
      ['suelta', suelta.body().data.assignee],
      ['lista', enLista!.assignee],
    ]) {
      const serialized = JSON.stringify(assignee)
      assert.notProperty(assignee, 'email', `la tarea ${donde} expone el email`)
      assert.notInclude(serialized, 'ada@example.com', `la tarea ${donde} expone el email`)
      assert.notInclude(serialized, 'password', `la tarea ${donde} expone la contraseña`)
    }
  })

  test('un responsable sin nombre llega con nombre nulo y con iniciales', async ({
    client,
    assert,
  }) => {
    const task = await tareaDe(null, 'ada@example.com')
    const token = await sesion(client)

    const response = await client
      .get(`/api/v1/tasks/${task.id}`)
      .qs({ today })
      .header('Authorization', `Bearer ${token}`)

    response.assertStatus(200)

    const { assignee } = response.body().data
    assert.isNull(assignee.fullName)
    // Sin nombre, las iniciales salen del email, como fija la spec de auth.
    // No comparto la regla (ver línea 2 de la Parte B), pero el test sigue la spec.
    assert.equal(assignee.initials, 'AE')
  })
})
