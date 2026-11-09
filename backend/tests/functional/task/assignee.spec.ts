import Task from '#models/task'
import User from '#models/user'
import { test } from '@japa/runner'
import testUtils from '@adonisjs/core/services/test_utils'

/**
 * Lo que una tarea enseña de su responsable. Cubre el scenario «Responsable
 * identificable» del requisito «Lo que cada tarea muestra de su responsable» de
 * `openspec/specs/tasks/spec.md`, en las dos lecturas que devuelven tareas: la
 * tarea suelta y la lista.
 */
test.group('Task | responsable', (group) => {
  group.each.setup(() => testUtils.db().withGlobalTransaction())

  test('una tarea trae el nombre y las iniciales de su responsable', async ({ client, assert }) => {
    const ada = await User.create({
      fullName: 'Ada Lovelace',
      email: 'ada@example.com',
      password: 'secreto123',
    })
    await User.create({
      fullName: 'Alan Turing',
      email: 'alan@example.com',
      password: 'secreto123',
    })
    const tarea = await Task.create({
      title: 'Revisar el informe',
      status: 'pending',
      assigneeId: ada.id,
    })

    // Mira otra cuenta: así el responsable solo puede salir de la tarea, no de
    // la sesión de quien la consulta.
    const login = await client
      .post('/api/v1/auth/login')
      .json({ email: 'alan@example.com', password: 'secreto123' })
    const token = login.body().data.token

    const suelta = await client
      .get(`/api/v1/tasks/${tarea.id}`)
      .qs({ today: '2026-08-13' })
      .header('Authorization', `Bearer ${token}`)

    suelta.assertStatus(200)
    assert.equal(suelta.body().data.assignee.fullName, 'Ada Lovelace')
    assert.equal(suelta.body().data.assignee.initials, 'AL')

    const lista = await client.get('/api/v1/tasks').header('Authorization', `Bearer ${token}`)

    lista.assertStatus(200)

    // Se busca por id porque la suite comparte la BD con el servidor de desarrollo.
    const enLista = (lista.body().data as any[]).find(({ id }) => id === tarea.id)
    assert.equal(enLista.assignee.fullName, 'Ada Lovelace')
    assert.equal(enLista.assignee.initials, 'AL')
  })
})
