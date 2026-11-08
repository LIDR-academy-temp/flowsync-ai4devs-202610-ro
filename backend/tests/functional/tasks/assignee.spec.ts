import Task from '#models/task'
import User from '#models/user'
import { test } from '@japa/runner'
import testUtils from '@adonisjs/core/services/test_utils'

/**
 * El responsable dentro de una tarea. Cubre los tres scenarios del requisito
 * «Lo que cada tarea muestra de su responsable» de
 * `openspec/specs/tasks/spec.md`: responsable identificable, la tarea no filtra
 * datos de cuenta, y responsable sin nombre.
 *
 * La tarea se crea directamente con el modelo y no por `POST /tasks` para poder
 * elegir quién es el responsable sin depender de quién tiene la sesión.
 */
test.group('Tasks | responsable', (group) => {
  group.each.setup(() => testUtils.db().withGlobalTransaction())

  // Leer una tarea suelta exige el día de quien mira; cualquier día vale aquí.
  const hoy = '2026-11-08'

  async function sesion(client: any) {
    await User.create({
      fullName: 'Grace Hopper',
      email: 'grace@example.com',
      password: 'secreto123',
    })

    const response = await client
      .post('/api/v1/auth/login')
      .json({ email: 'grace@example.com', password: 'secreto123' })

    return response.body().data.token as string
  }

  async function tareaDe(fullName: string | null, email: string) {
    const responsable = await User.create({ fullName, email, password: 'secreto123' })

    return Task.create({ title: 'Revisar el informe', status: 'pending', assigneeId: responsable.id })
  }

  test('el responsable llega con su nombre y sus iniciales', async ({ client, assert }) => {
    const token = await sesion(client)
    const tarea = await tareaDe('Ada Lovelace', 'ada@example.com')

    const response = await client
      .get(`/api/v1/tasks/${tarea.id}`)
      .qs({ today: hoy })
      .header('Authorization', `Bearer ${token}`)

    response.assertStatus(200)

    const { assignee } = response.body().data
    assert.equal(assignee.fullName, 'Ada Lovelace')
    assert.equal(assignee.initials, 'AL')
  })

  test('el responsable no trae el email ni datos de acceso, ni suelto ni en la lista', async ({
    client,
    assert,
  }) => {
    const token = await sesion(client)
    const tarea = await tareaDe('Ada Lovelace', 'ada@example.com')

    const suelta = await client
      .get(`/api/v1/tasks/${tarea.id}`)
      .qs({ today: hoy })
      .header('Authorization', `Bearer ${token}`)

    const lista = await client.get('/api/v1/tasks').header('Authorization', `Bearer ${token}`)

    suelta.assertStatus(200)
    lista.assertStatus(200)

    const enLista = lista.body().data.find((t: { id: number }) => t.id === tarea.id)
    assert.exists(enLista, 'la tarea tiene que aparecer en la lista')

    // Se comprueba sobre el objeto serializado entero: el requisito prohíbe
    // cualquier dato de la cuenta, no solo un campo con un nombre concreto.
    for (const assignee of [suelta.body().data.assignee, enLista.assignee]) {
      const serialized = JSON.stringify(assignee)
      assert.notProperty(assignee, 'email')
      assert.notInclude(serialized, 'ada@example.com')
      assert.notInclude(serialized, 'password')
      assert.notInclude(serialized, 'secreto123')
    }
  })

  test('un responsable sin nombre llega con el nombre nulo y con iniciales', async ({
    client,
    assert,
  }) => {
    const token = await sesion(client)
    const tarea = await tareaDe(null, 'sin-nombre@example.com')

    const response = await client
      .get(`/api/v1/tasks/${tarea.id}`)
      .qs({ today: hoy })
      .header('Authorization', `Bearer ${token}`)

    response.assertStatus(200)

    const { assignee } = response.body().data
    assert.isNull(assignee.fullName)
    assert.isString(assignee.initials)
    assert.isNotEmpty(assignee.initials)
  })
})
