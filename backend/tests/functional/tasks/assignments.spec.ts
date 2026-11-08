import User from '#models/user'
import Task from '#models/task'
import { test } from '@japa/runner'
import testUtils from '@adonisjs/core/services/test_utils'

/**
 * Lo que cada tarea muestra de su responsable. Cubre los tres scenarios del
 * requisito «Lo que cada tarea muestra de su responsable» de
 * `openspec/specs/tasks/spec.md`: el responsable identificable, la tarea que no
 * filtra datos de cuenta y el responsable sin nombre.
 *
 * Cada scenario se comprueba en las dos lecturas que enseñan al responsable: la
 * tarea suelta (`GET /api/v1/tasks/:id`) y la lista (`GET /api/v1/tasks`). El
 * que mira es siempre una cuenta distinta del responsable, para que lo que
 * llega no pueda deberse a que uno se mira a sí mismo.
 */
test.group('Tasks | responsable', (group) => {
  group.each.setup(() => testUtils.db().withGlobalTransaction())

  const HOY = '2026-08-12'

  async function sesion(client: any, email = 'alan@example.com') {
    await User.create({ fullName: 'Alan Turing', email, password: 'secreto123' })

    const response = await client.post('/api/v1/auth/login').json({ email, password: 'secreto123' })

    return response.body().data.token as string
  }

  async function tareaDe(fullName: string | null, email = 'ada@example.com') {
    const responsable = await User.create({ fullName, email, password: 'secreto123' })

    return Task.create({ title: 'Revisar el informe', status: 'pending', assigneeId: responsable.id })
  }

  async function tareaSuelta(client: any, token: string, id: number) {
    const response = await client
      .get(`/api/v1/tasks/${id}`)
      .qs({ today: HOY })
      .header('Authorization', `Bearer ${token}`)

    response.assertStatus(200)

    return response.body().data
  }

  async function tareaEnLaLista(client: any, token: string, id: number) {
    const response = await client.get('/api/v1/tasks').header('Authorization', `Bearer ${token}`)

    response.assertStatus(200)

    return response.body().data.find((tarea: any) => tarea.id === id)
  }

  test('el responsable de una tarea suelta llega con su nombre y sus iniciales', async ({
    client,
    assert,
  }) => {
    const token = await sesion(client)
    const tarea = await tareaDe('Ada Lovelace')

    const { assignee } = await tareaSuelta(client, token, tarea.id)

    assert.equal(assignee.fullName, 'Ada Lovelace')
    assert.equal(assignee.initials, 'AL')
  })

  test('el responsable de una tarea en la lista llega con su nombre y sus iniciales', async ({
    client,
    assert,
  }) => {
    const token = await sesion(client)
    const tarea = await tareaDe('Ada Lovelace')

    const enLista = await tareaEnLaLista(client, token, tarea.id)

    assert.isDefined(enLista)
    assert.equal(enLista.assignee.fullName, 'Ada Lovelace')
    assert.equal(enLista.assignee.initials, 'AL')
  })

  test('una tarea suelta no filtra el email ni ningún dato de acceso de su responsable', async ({
    client,
    assert,
  }) => {
    const token = await sesion(client)
    const tarea = await tareaDe('Ada Lovelace')

    const { assignee } = await tareaSuelta(client, token, tarea.id)

    assert.notProperty(assignee, 'email')
    assert.notProperty(assignee, 'password')
    assert.notInclude(JSON.stringify(assignee), 'ada@example.com')
    assert.notInclude(JSON.stringify(assignee), 'secreto123')
  })

  test('una tarea dentro de la lista no filtra el email ni ningún dato de acceso de su responsable', async ({
    client,
    assert,
  }) => {
    const token = await sesion(client)
    const tarea = await tareaDe('Ada Lovelace')

    const enLista = await tareaEnLaLista(client, token, tarea.id)

    assert.isDefined(enLista)
    assert.notProperty(enLista.assignee, 'email')
    assert.notProperty(enLista.assignee, 'password')
    assert.notInclude(JSON.stringify(enLista.assignee), 'ada@example.com')
    assert.notInclude(JSON.stringify(enLista.assignee), 'secreto123')
  })

  test('un responsable sin nombre llega con el nombre nulo y sus iniciales en una tarea suelta', async ({
    client,
    assert,
  }) => {
    const token = await sesion(client)
    const tarea = await tareaDe(null)

    const { assignee } = await tareaSuelta(client, token, tarea.id)

    assert.isNull(assignee.fullName)
    assert.isString(assignee.initials)
    assert.isNotEmpty(assignee.initials)
    // Las iniciales salen del email, pero el email en sí no viaja.
    assert.notProperty(assignee, 'email')
    assert.notInclude(JSON.stringify(assignee), 'ada@example.com')
  })

  test('un responsable sin nombre llega con el nombre nulo y sus iniciales en la lista', async ({
    client,
    assert,
  }) => {
    const token = await sesion(client)
    const tarea = await tareaDe(null)

    const enLista = await tareaEnLaLista(client, token, tarea.id)

    assert.isDefined(enLista)
    assert.isNull(enLista.assignee.fullName)
    assert.isString(enLista.assignee.initials)
    assert.isNotEmpty(enLista.assignee.initials)
    assert.notProperty(enLista.assignee, 'email')
    assert.notInclude(JSON.stringify(enLista.assignee), 'ada@example.com')
  })
})
