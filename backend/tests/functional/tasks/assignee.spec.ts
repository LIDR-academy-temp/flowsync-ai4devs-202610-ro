import Task from '#models/task'
import User from '#models/user'
import { test } from '@japa/runner'
import testUtils from '@adonisjs/core/services/test_utils'

/**
 * Lo que cada tarea muestra de su responsable. Cubre los tres scenarios del
 * requisito «Lo que cada tarea muestra de su responsable» de
 * `openspec/specs/tasks/spec.md`: responsable identificable, la tarea no filtra
 * datos de cuenta y responsable sin nombre.
 *
 * «Se obtiene una tarea» se comprueba por los dos caminos de lectura que hay:
 * la tarea suelta (`GET /tasks/:id`) y la tarea dentro de la lista (`GET /tasks`).
 */
test.group('Tasks | responsable', (group) => {
  group.each.setup(() => testUtils.db().withGlobalTransaction())

  const HOY = '2026-11-09'

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

  async function assigneeEnAmbasLecturas(client: any, token: string, taskId: number) {
    const suelta = await client
      .get(`/api/v1/tasks/${taskId}`)
      .qs({ today: HOY })
      .header('Authorization', `Bearer ${token}`)
    suelta.assertStatus(200)

    const lista = await client.get('/api/v1/tasks').header('Authorization', `Bearer ${token}`)
    lista.assertStatus(200)
    const enLista = lista.body().data.find((t: any) => t.id === taskId)

    return { suelta: suelta.body().data.assignee, enLista: enLista?.assignee }
  }

  test('el responsable llega con su nombre y sus iniciales', async ({ client, assert }) => {
    const token = await sesion(client)
    const ada = await User.create({
      fullName: 'Ada Lovelace',
      email: 'ada@example.com',
      password: 'secreto123',
    })
    const task = await Task.create({ title: 'Analizar la máquina', assigneeId: ada.id })

    const { suelta, enLista } = await assigneeEnAmbasLecturas(client, token, task.id)

    for (const assignee of [suelta, enLista]) {
      assert.isObject(assignee)
      assert.equal(assignee.fullName, 'Ada Lovelace')
      assert.equal(assignee.initials, 'AL')
    }
  })

  test('el responsable de una tarea no expone su email ni datos de acceso', async ({
    client,
    assert,
  }) => {
    const token = await sesion(client)
    const ada = await User.create({
      fullName: 'Ada Lovelace',
      email: 'ada@example.com',
      password: 'secreto123',
    })
    const task = await Task.create({ title: 'Analizar la máquina', assigneeId: ada.id })

    const { suelta, enLista } = await assigneeEnAmbasLecturas(client, token, task.id)

    for (const [lectura, assignee] of [
      ['tarea suelta', suelta],
      ['tarea en la lista', enLista],
    ] as const) {
      assert.isObject(assignee, lectura)
      assert.notProperty(assignee, 'email', `${lectura}: el assignee trae el email`)
      assert.notProperty(assignee, 'password', `${lectura}: el assignee trae la contraseña`)

      const serializado = JSON.stringify(assignee)
      assert.notInclude(serializado, 'ada@example.com', `${lectura}: el email aparece en el assignee`)
      assert.notInclude(serializado, 'secreto123', `${lectura}: la contraseña aparece`)
    }
  })

  test('un responsable sin nombre llega con nombre nulo y con iniciales', async ({
    client,
    assert,
  }) => {
    const token = await sesion(client)
    const sinNombre = await User.create({
      fullName: null,
      email: 'sin-nombre@example.com',
      password: 'secreto123',
    })
    const task = await Task.create({ title: 'Tarea sin nombre', assigneeId: sinNombre.id })

    const { suelta, enLista } = await assigneeEnAmbasLecturas(client, token, task.id)

    for (const assignee of [suelta, enLista]) {
      assert.isObject(assignee)
      assert.property(assignee, 'fullName')
      assert.isNull(assignee.fullName)
      assert.isString(assignee.initials)
      assert.isNotEmpty(assignee.initials)
    }
  })
})
