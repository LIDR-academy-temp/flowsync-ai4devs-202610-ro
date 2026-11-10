import User from '#models/user'
import { test } from '@japa/runner'
import testUtils from '@adonisjs/core/services/test_utils'

/**
 * Lo que cada tarea muestra de su responsable. Cubre los tres scenarios del
 * requisito «Lo que cada tarea muestra de su responsable» de
 * `openspec/specs/tasks/spec.md`: responsable identificable, la tarea no filtra
 * datos de cuenta (suelta y dentro de la lista) y responsable sin nombre.
 *
 * Mismo aislamiento que en `auth`: transacción global, porque la suite pega
 * contra el mismo fichero SQLite que el servidor de desarrollo.
 */
test.group('Tasks | responsable', (group) => {
  group.each.setup(() => testUtils.db().withGlobalTransaction())

  async function sesion(client: any, email = 'ada@example.com') {
    await User.create({ fullName: 'Ada Lovelace', email, password: 'secreto123' })

    const response = await client.post('/api/v1/auth/login').json({ email, password: 'secreto123' })

    return response.body().data.token as string
  }

  async function crearTarea(client: any, token: string) {
    const response = await client
      .post('/api/v1/tasks')
      .header('Authorization', `Bearer ${token}`)
      .json({ title: 'Revisar el informe' })

    response.assertStatus(201)
    return response.body().data.id as number
  }

  test('una tarea trae el nombre y las iniciales de su responsable', async ({
    client,
    assert,
  }) => {
    const token = await sesion(client)
    const id = await crearTarea(client, token)

    const response = await client
      .get(`/api/v1/tasks/${id}`)
      .qs({ today: '2026-11-10' })
      .header('Authorization', `Bearer ${token}`)

    response.assertStatus(200)

    const { assignee } = response.body().data
    assert.equal(assignee.fullName, 'Ada Lovelace')
    assert.equal(assignee.initials, 'AL')
  })

  test('el responsable de una tarea no expone el email ni datos de acceso, ni suelta ni en la lista', async ({
    client,
    assert,
  }) => {
    const token = await sesion(client)
    const id = await crearTarea(client, token)

    const suelta = await client
      .get(`/api/v1/tasks/${id}`)
      .qs({ today: '2026-11-10' })
      .header('Authorization', `Bearer ${token}`)

    suelta.assertStatus(200)

    const lista = await client.get('/api/v1/tasks').header('Authorization', `Bearer ${token}`)

    lista.assertStatus(200)

    const enLista = lista.body().data.find((tarea: { id: number }) => tarea.id === id)
    assert.exists(enLista, 'la tarea creada aparece en la lista')

    for (const [donde, assignee] of [
      ['tarea suelta', suelta.body().data.assignee],
      ['lista', enLista.assignee],
    ]) {
      assert.notProperty(assignee, 'email', `${donde}: el assignee no trae email`)
      assert.notProperty(assignee, 'password', `${donde}: el assignee no trae contraseña`)

      const serialized = JSON.stringify(assignee)
      assert.notInclude(serialized, 'ada@example.com', `${donde}: el email no aparece`)
      assert.notInclude(serialized, 'secreto123', `${donde}: la contraseña no aparece`)
      assert.notInclude(serialized, token, `${donde}: el token no aparece`)
    }
  })

  test('el responsable registrado sin nombre llega con nombre nulo y con iniciales', async ({
    client,
    assert,
  }) => {
    const signup = await client.post('/api/v1/auth/signup').json({
      fullName: null,
      email: 'sin-nombre@example.com',
      password: 'secreto123',
      passwordConfirmation: 'secreto123',
    })

    signup.assertStatus(200)
    const { token } = signup.body().data

    const id = await crearTarea(client, token)

    const response = await client
      .get(`/api/v1/tasks/${id}`)
      .qs({ today: '2026-11-10' })
      .header('Authorization', `Bearer ${token}`)

    response.assertStatus(200)

    const { assignee } = response.body().data
    assert.isNull(assignee.fullName)
    assert.equal(assignee.initials, 'SE')
  })
})
