import Task from '#models/task'
import User from '#models/user'
import { test } from '@japa/runner'
import testUtils from '@adonisjs/core/services/test_utils'

/**
 * Lo que cada tarea muestra de su responsable. Cubre los scenarios del
 * requisito «Lo que cada tarea muestra de su responsable» de
 * `openspec/specs/tasks/spec.md`, uno por fila de `docs/verificacion/inv.md`:
 *
 * - Responsable identificable
 * - La tarea no filtra datos de cuenta (suelta / dentro de la lista)
 * - Responsable sin nombre (nombre nulo / iniciales presentes)
 *
 * El responsable es siempre una cuenta distinta de la que consulta, para que
 * lo que se compruebe sea el `assignee` y no la sesión de quien mira.
 */
test.group('Tasks | responsable', (group) => {
  group.each.setup(() => testUtils.db().withGlobalTransaction())

  const TODAY = '2026-11-08'

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

  async function tareaDe(fullName: string | null, email: string) {
    const assignee = await User.create({ fullName, email, password: 'secreto123' })
    return Task.create({ title: 'Revisar el informe', status: 'pending', assigneeId: assignee.id })
  }

  function sinDatosDeAcceso(assert: any, assignee: Record<string, unknown>, email: string) {
    assert.notProperty(assignee, 'email')
    assert.notProperty(assignee, 'password')
    // Ni bajo otro nombre de campo: el valor del email no aparece en ningún sitio.
    assert.notInclude(JSON.stringify(assignee), email)
  }

  test('la tarea trae el nombre y las iniciales de su responsable', async ({ client, assert }) => {
    const token = await sesion(client)
    const task = await tareaDe('Ada Lovelace', 'ada@example.com')

    const response = await client
      .get(`/api/v1/tasks/${task.id}`)
      .qs({ today: TODAY })
      .header('Authorization', `Bearer ${token}`)

    response.assertStatus(200)

    const { assignee } = response.body().data
    assert.equal(assignee.fullName, 'Ada Lovelace')
    assert.equal(assignee.initials, 'AL')
  })

  test('una tarea suelta no expone el email de su responsable', async ({ client, assert }) => {
    const token = await sesion(client)
    const task = await tareaDe('Ada Lovelace', 'ada@example.com')

    const response = await client
      .get(`/api/v1/tasks/${task.id}`)
      .qs({ today: TODAY })
      .header('Authorization', `Bearer ${token}`)

    response.assertStatus(200)
    sinDatosDeAcceso(assert, response.body().data.assignee, 'ada@example.com')
  })

  test('una tarea dentro de la lista no expone el email de su responsable', async ({
    client,
    assert,
  }) => {
    const token = await sesion(client)
    const task = await tareaDe('Ada Lovelace', 'ada@example.com')

    const response = await client.get('/api/v1/tasks').header('Authorization', `Bearer ${token}`)

    response.assertStatus(200)

    const enLista = response.body().data.find((t: { id: number }) => t.id === task.id)
    assert.exists(enLista, 'la tarea creada no aparece en la lista')
    sinDatosDeAcceso(assert, enLista.assignee, 'ada@example.com')
  })

  test('un responsable sin nombre llega con el nombre nulo', async ({ client, assert }) => {
    const token = await sesion(client)
    const task = await tareaDe(null, 'ada@example.com')

    const response = await client
      .get(`/api/v1/tasks/${task.id}`)
      .qs({ today: TODAY })
      .header('Authorization', `Bearer ${token}`)

    response.assertStatus(200)

    const { assignee } = response.body().data
    assert.property(assignee, 'fullName')
    assert.isNull(assignee.fullName)
  })

  test('un responsable sin nombre sigue llegando con sus iniciales', async ({
    client,
    assert,
  }) => {
    const token = await sesion(client)
    const task = await tareaDe(null, 'ada@example.com')

    const response = await client
      .get(`/api/v1/tasks/${task.id}`)
      .qs({ today: TODAY })
      .header('Authorization', `Bearer ${token}`)

    response.assertStatus(200)

    const { assignee } = response.body().data
    assert.isString(assignee.initials)
    assert.isNotEmpty(assignee.initials)
    // Regla de «Iniciales de la cuenta» (auth): sin nombre, salen del email.
    assert.equal(assignee.initials, 'AE')
  })
})
