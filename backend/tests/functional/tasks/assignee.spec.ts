import User from '#models/user'
import Task from '#models/task'
import { test } from '@japa/runner'
import testUtils from '@adonisjs/core/services/test_utils'

/**
 * Lo que cada tarea muestra de su responsable. Cubre los tres scenarios del
 * requisito «Lo que cada tarea muestra de su responsable» de
 * `openspec/specs/tasks/spec.md`, mirando la tarea en las dos lecturas que la
 * spec nombra: suelta (`GET /tasks/:id`) y dentro de la lista (`GET /tasks`).
 *
 * Transacción global, igual que en auth: el SQLite es el mismo que el de dev.
 */
test.group('Tasks | responsable', (group) => {
  group.each.setup(() => testUtils.db().withGlobalTransaction())

  const HOY = '2026-11-10'

  async function tareaDe(fullName: string | null, email: string) {
    const user = await User.create({ fullName, email, password: 'secreto123' })
    const task = await Task.create({
      title: 'Revisar el informe',
      status: 'pending',
      assigneeId: user.id,
    })
    return { user, task }
  }

  async function lecturas(client: any, user: User, taskId: number) {
    const suelta = await client.get(`/api/v1/tasks/${taskId}`).qs({ today: HOY }).loginAs(user)
    const lista = await client.get('/api/v1/tasks').loginAs(user)

    suelta.assertStatus(200)
    lista.assertStatus(200)

    const enLista = lista.body().data.find((t: any) => t.id === taskId)
    return { suelta: suelta.body().data.assignee, enLista: enLista?.assignee }
  }

  test('el responsable llega con su nombre y sus iniciales', async ({ client, assert }) => {
    const { user, task } = await tareaDe('Ada Lovelace', 'ada@example.com')

    const { suelta, enLista } = await lecturas(client, user, task.id)

    for (const assignee of [suelta, enLista]) {
      assert.isObject(assignee)
      assert.equal(assignee.fullName, 'Ada Lovelace')
      assert.equal(assignee.initials, 'AL')
    }
  })

  test('el responsable de una tarea no trae su email ni datos de acceso', async ({
    client,
    assert,
  }) => {
    const { user, task } = await tareaDe('Ada Lovelace', 'ada@example.com')

    const { suelta, enLista } = await lecturas(client, user, task.id)

    for (const [lectura, assignee] of [
      ['suelta', suelta],
      ['en la lista', enLista],
    ] as const) {
      assert.isObject(assignee, `assignee ${lectura}`)
      assert.notProperty(assignee, 'email', `assignee ${lectura} expone el email`)
      assert.notProperty(assignee, 'password', `assignee ${lectura} expone la contraseña`)
      assert.notInclude(JSON.stringify(assignee), 'ada@example.com', `assignee ${lectura}`)
    }
  })

  test('un responsable sin nombre llega con nombre nulo y con iniciales', async ({
    client,
    assert,
  }) => {
    const { user, task } = await tareaDe(null, 'sin-nombre@example.com')

    const { suelta, enLista } = await lecturas(client, user, task.id)

    for (const assignee of [suelta, enLista]) {
      assert.isObject(assignee)
      assert.property(assignee, 'fullName')
      assert.isNull(assignee.fullName)
      assert.isString(assignee.initials)
      assert.isNotEmpty(assignee.initials)
    }
  })
})
