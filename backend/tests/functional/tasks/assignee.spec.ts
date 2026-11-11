import User from '#models/user'
import Task from '#models/task'
import { test } from '@japa/runner'
import testUtils from '@adonisjs/core/services/test_utils'

/**
 * Lo que cada tarea muestra de su responsable. Cubre los tres scenarios del
 * requisito «Lo que cada tarea muestra de su responsable» de
 * `openspec/specs/tasks/spec.md`.
 *
 * «Se obtiene una tarea» se lee en sentido amplio: cada scenario se comprueba
 * en todas las respuestas que devuelven una tarea, no solo en las dos lecturas
 * (suelta y en la lista). Las escrituras (alta, cambio de estado y cambio de
 * fecha) también la devuelven, y una fuga ahí es igual de fuga.
 *
 * Las comprobaciones de cada respuesta se acumulan y se afirman al final, para
 * que un fallo en una no esconda lo que pasa en las demás.
 *
 * Transacción global, igual que en auth: el SQLite es el mismo que el de dev.
 */
test.group('Tasks | responsable', (group) => {
  group.each.setup(() => testUtils.db().withGlobalTransaction())

  const HOY = '2026-11-10'

  async function sesion(client: any, fullName: string | null, email: string) {
    const user = await User.create({ fullName, email, password: 'secreto123' })

    const response = await client.post('/api/v1/auth/login').json({ email, password: 'secreto123' })

    return { user, token: response.body().data.token as string }
  }

  /**
   * El `assignee` de una misma tarea en cada respuesta que la devuelve. La tarea
   * se crea con el modelo para que no dependa del alta. El alta se pide aparte
   * con el mismo token, así que su responsable es la misma cuenta.
   */
  async function assignees(client: any, user: User, token: string) {
    const task = await Task.create({
      title: 'Revisar el informe',
      status: 'pending',
      assigneeId: user.id,
    })
    const auth = `Bearer ${token}`

    const suelta = await client
      .get(`/api/v1/tasks/${task.id}`)
      .qs({ today: HOY })
      .header('Authorization', auth)
    const lista = await client.get('/api/v1/tasks').header('Authorization', auth)
    const alta = await client
      .post('/api/v1/tasks')
      .json({ title: 'Otra tarea' })
      .header('Authorization', auth)
    const estado = await client
      .patch(`/api/v1/tasks/${task.id}/status`)
      .json({ status: 'in_progress' })
      .header('Authorization', auth)
    const fecha = await client
      .put(`/api/v1/tasks/${task.id}/due-date`)
      .json({ today: HOY, dueDate: '2026-11-20' })
      .header('Authorization', auth)

    suelta.assertStatus(200)
    lista.assertStatus(200)
    alta.assertStatus(201)
    estado.assertStatus(200)
    fecha.assertStatus(200)

    const enLista = lista.body().data.find((t: any) => t.id === task.id)

    return {
      'suelta (GET /tasks/:id)': suelta.body().data.assignee,
      'en la lista (GET /tasks)': enLista?.assignee,
      'al crear (POST /tasks)': alta.body().data.assignee,
      'al cambiar el estado (PATCH /tasks/:id/status)': estado.body().data.assignee,
      'al cambiar la fecha (PUT /tasks/:id/due-date)': fecha.body().data.assignee,
    } as Record<string, any>
  }

  test('el responsable llega con su nombre y sus iniciales', async ({ client, assert }) => {
    const { user, token } = await sesion(client, 'Ada Lovelace', 'ada@example.com')

    const fallos: string[] = []
    for (const [respuesta, assignee] of Object.entries(await assignees(client, user, token))) {
      if (typeof assignee !== 'object' || assignee === null) {
        fallos.push(`${respuesta}: no trae assignee`)
        continue
      }
      if (assignee.fullName !== 'Ada Lovelace') {
        fallos.push(`${respuesta}: fullName es ${JSON.stringify(assignee.fullName)}`)
      }
      if (assignee.initials !== 'AL') {
        fallos.push(`${respuesta}: initials es ${JSON.stringify(assignee.initials)}`)
      }
    }

    assert.deepEqual(fallos, [])
  })

  test('el responsable de una tarea no trae su email ni datos de acceso', async ({
    client,
    assert,
  }) => {
    const { user, token } = await sesion(client, 'Ada Lovelace', 'ada@example.com')

    const fallos: string[] = []
    for (const [respuesta, assignee] of Object.entries(await assignees(client, user, token))) {
      if (typeof assignee !== 'object' || assignee === null) {
        fallos.push(`${respuesta}: no trae assignee`)
        continue
      }
      for (const clave of ['email', 'password', 'token', 'accessToken']) {
        if (clave in assignee) fallos.push(`${respuesta}: expone «${clave}»`)
      }
      if (JSON.stringify(assignee).includes('ada@example.com')) {
        fallos.push(`${respuesta}: el email aparece en algún valor`)
      }
    }

    assert.deepEqual(fallos, [])
  })

  test('un responsable sin nombre llega con nombre nulo y con iniciales', async ({
    client,
    assert,
  }) => {
    const { user, token } = await sesion(client, null, 'sin-nombre@example.com')

    const fallos: string[] = []
    for (const [respuesta, assignee] of Object.entries(await assignees(client, user, token))) {
      if (typeof assignee !== 'object' || assignee === null) {
        fallos.push(`${respuesta}: no trae assignee`)
        continue
      }
      if (!('fullName' in assignee) || assignee.fullName !== null) {
        fallos.push(`${respuesta}: fullName es ${JSON.stringify(assignee.fullName)}`)
      }
      // Mismo cálculo que el scenario «sin nombre» de auth: inicial de la parte
      // local y del dominio del email.
      if (assignee.initials !== 'SE') {
        fallos.push(`${respuesta}: initials es ${JSON.stringify(assignee.initials)}`)
      }
    }

    assert.deepEqual(fallos, [])
  })
})
