import User from '#models/user'
import Task from '#models/task'
import { test } from '@japa/runner'
import testUtils from '@adonisjs/core/services/test_utils'

/**
 * El responsable dentro de una tarea. Cubre los tres scenarios del requisito
 * «Lo que cada tarea muestra de su responsable» de
 * `openspec/specs/tasks/spec.md`: el responsable se identifica por nombre e
 * iniciales, la tarea no arrastra ningún otro dato de la cuenta, y una cuenta
 * sin nombre sigue llegando representable.
 */
test.group('Tasks | responsable', (group) => {
  group.each.setup(() => testUtils.db().withGlobalTransaction())

  const HOY = '2026-11-09'

  /** Lo único que una tarea puede contar de su responsable. */
  const CAMPOS_DEL_RESPONSABLE = ['id', 'fullName', 'initials']

  async function sesion(client: any, fullName: string | null, email: string) {
    const user = await User.create({ fullName, email, password: 'secreto123' })

    const response = await client.post('/api/v1/auth/login').json({ email, password: 'secreto123' })

    return { user, token: response.body().data.token as string }
  }

  /**
   * Cada endpoint de tareas que devuelve una tarea (o varias), para comprobar
   * que todos cuentan lo mismo del responsable y no solo el que se mira.
   */
  async function todasLasLecturas(client: any, token: string, task: Task) {
    const auth = { Authorization: `Bearer ${token}` }

    const lista = await client.get('/api/v1/tasks').headers(auth)
    const suelta = await client.get(`/api/v1/tasks/${task.id}`).qs({ today: HOY }).headers(auth)
    const creada = await client.post('/api/v1/tasks').json({ title: 'Otra' }).headers(auth)
    const conEstado = await client
      .patch(`/api/v1/tasks/${task.id}/status`)
      .json({ status: 'in_progress' })
      .headers(auth)
    const conFecha = await client
      .put(`/api/v1/tasks/${task.id}/due-date`)
      .json({ today: HOY, dueDate: '2026-12-01' })
      .headers(auth)

    for (const response of [lista, suelta, creada, conEstado, conFecha]) {
      response.assertStatus(response === creada ? 201 : 200)
    }

    return {
      'GET /tasks': lista.body().data.find((t: any) => t.id === task.id).assignee,
      'GET /tasks/:id': suelta.body().data.assignee,
      'POST /tasks': creada.body().data.assignee,
      'PATCH /tasks/:id/status': conEstado.body().data.assignee,
      'PUT /tasks/:id/due-date': conFecha.body().data.assignee,
    }
  }

  test('el responsable llega con su nombre y sus iniciales', async ({ client, assert }) => {
    const { user, token } = await sesion(client, 'Ada Lovelace', 'ada@example.com')
    const task = await Task.create({ title: 'Revisar', status: 'pending', assigneeId: user.id })

    const lecturas = await todasLasLecturas(client, token, task)

    for (const [endpoint, assignee] of Object.entries(lecturas)) {
      assert.equal(assignee.id, user.id, endpoint)
      assert.equal(assignee.fullName, 'Ada Lovelace', endpoint)
      assert.equal(assignee.initials, 'AL', endpoint)
    }
  })

  test('la tarea no filtra el email ni otros datos de la cuenta', async ({ client, assert }) => {
    const { user, token } = await sesion(client, 'Ada Lovelace', 'ada@example.com')
    const task = await Task.create({ title: 'Revisar', status: 'pending', assigneeId: user.id })

    const lecturas = await todasLasLecturas(client, token, task)

    for (const [endpoint, assignee] of Object.entries(lecturas)) {
      assert.notProperty(assignee, 'email', endpoint)
      assert.notProperty(assignee, 'password', endpoint)
      assert.sameMembers(Object.keys(assignee), CAMPOS_DEL_RESPONSABLE, endpoint)
    }
  })

  test('un responsable sin nombre llega con nombre nulo y con iniciales', async ({
    client,
    assert,
  }) => {
    const { user, token } = await sesion(client, null, 'ada@example.com')
    const task = await Task.create({ title: 'Revisar', status: 'pending', assigneeId: user.id })

    const lecturas = await todasLasLecturas(client, token, task)

    for (const [endpoint, assignee] of Object.entries(lecturas)) {
      assert.isNull(assignee.fullName, endpoint)
      assert.equal(assignee.initials, 'AE', endpoint)
      // Las iniciales salen del email, pero el email en sí no viaja.
      assert.notProperty(assignee, 'email', endpoint)
    }
  })
})
