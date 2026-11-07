import Task from '#models/task'
import User from '#models/user'
import { test } from '@japa/runner'
import testUtils from '@adonisjs/core/services/test_utils'

/**
 * Lo que cada tarea muestra de su responsable. Cubre los tres scenarios del
 * requisito «Lo que cada tarea muestra de su responsable» de
 * `openspec/specs/tasks/spec.md`: el responsable se identifica por nombre e
 * iniciales, la tarea no expone su email ni datos de acceso, y una cuenta sin
 * nombre sigue llegando con iniciales.
 *
 * El scenario de la fuga se comprueba en las tres lecturas que devuelven una
 * tarea (la lista, la tarea suelta y la respuesta al crearla): el requisito
 * habla de «cualquier tarea, suelta o dentro de la lista».
 */
test.group('Tasks | responsable', (group) => {
  group.each.setup(() => testUtils.db().withGlobalTransaction())

  const HOY = '2026-11-07'

  async function sesion(
    client: any,
    fullName: string | null = 'Ada Lovelace',
    email = 'ada@example.com'
  ) {
    const user = await User.create({ fullName, email, password: 'secreto123' })

    const response = await client.post('/api/v1/auth/login').json({ email, password: 'secreto123' })

    return { user, token: response.body().data.token as string }
  }

  function sinDatosDeCuenta(assert: any, assignee: Record<string, unknown>, email: string) {
    assert.notProperty(assignee, 'email')
    assert.notProperty(assignee, 'password')
    assert.notInclude(JSON.stringify(assignee), email)
  }

  test('una tarea suelta identifica a su responsable por nombre e iniciales', async ({
    client,
    assert,
  }) => {
    const { user, token } = await sesion(client)
    const task = await Task.create({ title: 'Revisar el informe', assigneeId: user.id })

    const response = await client
      .get(`/api/v1/tasks/${task.id}`)
      .qs({ today: HOY })
      .header('Authorization', `Bearer ${token}`)

    response.assertStatus(200)

    const { assignee } = response.body().data
    assert.equal(assignee.fullName, 'Ada Lovelace')
    assert.equal(assignee.initials, 'AL')
  })

  test('cada tarea de la lista identifica a su responsable por nombre e iniciales', async ({
    client,
    assert,
  }) => {
    const { user, token } = await sesion(client)
    await Task.create({ title: 'Revisar el informe', assigneeId: user.id })

    const response = await client.get('/api/v1/tasks').header('Authorization', `Bearer ${token}`)

    response.assertStatus(200)

    const [tarea] = response.body().data as any[]
    assert.equal(tarea.assignee.fullName, 'Ada Lovelace')
    assert.equal(tarea.assignee.initials, 'AL')
  })

  test('una tarea suelta no expone el email ni datos de acceso del responsable', async ({
    client,
    assert,
  }) => {
    const { user, token } = await sesion(client)
    const task = await Task.create({ title: 'Revisar el informe', assigneeId: user.id })

    const response = await client
      .get(`/api/v1/tasks/${task.id}`)
      .qs({ today: HOY })
      .header('Authorization', `Bearer ${token}`)

    response.assertStatus(200)
    sinDatosDeCuenta(assert, (response.body().data as any).assignee, 'ada@example.com')
  })

  test('las tareas de la lista no exponen el email ni datos de acceso del responsable', async ({
    client,
    assert,
  }) => {
    const { user, token } = await sesion(client)
    await Task.create({ title: 'Revisar el informe', assigneeId: user.id })

    const response = await client.get('/api/v1/tasks').header('Authorization', `Bearer ${token}`)

    response.assertStatus(200)
    for (const tarea of response.body().data as any[]) {
      sinDatosDeCuenta(assert, tarea.assignee, 'ada@example.com')
    }
  })

  test('la tarea recién creada no expone el email ni datos de acceso del responsable', async ({
    client,
    assert,
  }) => {
    const { token } = await sesion(client)

    const response = await client
      .post('/api/v1/tasks')
      .json({ title: 'Revisar el informe' })
      .header('Authorization', `Bearer ${token}`)

    response.assertStatus(201)
    sinDatosDeCuenta(assert, (response.body().data as any).assignee, 'ada@example.com')
  })

  test('un responsable sin nombre llega con nombre nulo y con iniciales', async ({
    client,
    assert,
  }) => {
    const { user, token } = await sesion(client, null, 'sin-nombre@example.com')
    const task = await Task.create({ title: 'Revisar el informe', assigneeId: user.id })

    const suelta = await client
      .get(`/api/v1/tasks/${task.id}`)
      .qs({ today: HOY })
      .header('Authorization', `Bearer ${token}`)

    suelta.assertStatus(200)
    assert.isNull(suelta.body().data.assignee.fullName)
    assert.isString(suelta.body().data.assignee.initials)
    assert.isNotEmpty(suelta.body().data.assignee.initials)

    const lista = await client.get('/api/v1/tasks').header('Authorization', `Bearer ${token}`)

    lista.assertStatus(200)
    const [tarea] = lista.body().data as any[]
    assert.isNull(tarea.assignee.fullName)
    assert.isString(tarea.assignee.initials)
    assert.isNotEmpty(tarea.assignee.initials)
  })
})
