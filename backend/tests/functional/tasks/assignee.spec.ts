import User from '#models/user'
import Task from '#models/task'
import { test } from '@japa/runner'
import testUtils from '@adonisjs/core/services/test_utils'

const taskAPI = '/api/v1/tasks'

/** Crea una cuenta y una tarea pendiente de la que es responsable. */
async function tareaDe(fullName: string | null, email: string) {
  const user = await User.create({ fullName, email, password: 'secreto123' })
  const task = await Task.create({ title: 'Algo', assigneeId: user.id, status: 'pending' })
  return { user, task }
}

/**
 * Nombre e iniciales del responsable. Cubre los scenarios «Responsable
 * identificable» y «Responsable sin nombre» del requisito «Lo que cada tarea
 * muestra de su responsable» de `openspec/specs/tasks/spec.md`. Las reglas de
 * las iniciales en sí las cubre `auth/initials.spec.ts`; aquí se comprueba que
 * llegan dentro de la tarea.
 */
test.group('Tasks | nombre e iniciales del responsable', (group) => {
  group.each.setup(() => testUtils.db().withGlobalTransaction())

  const casos: Array<[string, string | null, string, string]> = [
    [
      'un responsable con nombre trae su nombre y sus iniciales',
      'Ada Lovelace',
      'ada@example.com',
      'AL',
    ],
    [
      'un responsable sin nombre trae nombre nulo e iniciales del email',
      null,
      'ada@example.com',
      'AE',
    ],
  ]

  for (const [titulo, fullName, email, iniciales] of casos) {
    test(titulo, async ({ client, assert }) => {
      const { user } = await tareaDe(fullName, email)

      const response = await client.get(taskAPI).loginAs(user)

      response.assertStatus(200)
      const [tarea] = response.body().data
      assert.equal(tarea.assignee.fullName, fullName)
      assert.equal(tarea.assignee.initials, iniciales)
    })
  }
})

/**
 * Datos de cuenta. Cubre el scenario «La tarea no filtra datos de cuenta» del
 * mismo requisito: ni en la lista ni en la tarea suelta el `assignee` trae el
 * email ni ningún otro dato de acceso.
 */
test.group('Tasks | el responsable no filtra datos de cuenta', (group) => {
  group.each.setup(() => testUtils.db().withGlobalTransaction())

  test('en la lista, el assignee no trae el email', async ({ client, assert }) => {
    const { user } = await tareaDe('Ada Lovelace', 'ada@example.com')

    const response = await client.get(taskAPI).loginAs(user)

    response.assertStatus(200)
    const [tarea] = response.body().data
    assert.notProperty(tarea.assignee, 'email')
    assert.notProperty(tarea.assignee, 'password')
  })

  test('en la tarea suelta, el assignee no trae el email', async ({ client, assert }) => {
    const { user, task } = await tareaDe('Ada Lovelace', 'ada@example.com')

    const response = await client
      .get(`${taskAPI}/${task.id}`)
      .qs({ today: '2026-11-07' })
      .loginAs(user)

    response.assertStatus(200)
    const { assignee } = response.body().data
    assert.notProperty(assignee, 'email')
    assert.notProperty(assignee, 'password')
  })
})
