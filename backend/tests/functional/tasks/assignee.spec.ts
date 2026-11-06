import Task from '#models/task'
import User from '#models/user'
import { test } from '@japa/runner'
import testUtils from '@adonisjs/core/services/test_utils'

/**
 * Lo que cada tarea muestra de su responsable. Cubre solo los scenarios del
 * requisito «Lo que cada tarea muestra de su responsable» de
 * `openspec/specs/tasks/spec.md` que `docs/verificacion/grr.md` marca como
 * «No cubierto».
 */
test.group('Tasks | responsable', (group) => {
  group.each.setup(() => testUtils.db().withGlobalTransaction())

  /**
   * Scenario: Responsable identificable
   * - WHEN se obtiene una tarea cuyo responsable se llama "Ada Lovelace"
   * - THEN su `assignee` trae el nombre "Ada Lovelace" y sus iniciales, y esos
   *   datos bastan para saber quién la lleva
   */
  test('el assignee de una tarea trae el nombre y las iniciales de su responsable', async ({
    client,
    assert,
  }) => {
    const ada = await User.create({
      fullName: 'Ada Lovelace',
      email: 'ada@example.com',
      password: 'secreto123',
    })
    const task = await Task.create({
      title: 'Revisar el informe',
      status: 'pending',
      assigneeId: ada.id,
    })

    const login = await client
      .post('/api/v1/auth/login')
      .json({ email: 'ada@example.com', password: 'secreto123' })
    const token = login.body().data.token as string

    // DECISIÓN: «se obtiene una tarea» se lee como la tarea suelta
    // (GET /api/v1/tasks/:id); el scenario no menciona la lista. Esa ruta exige
    // el día de referencia `today`, que aquí es irrelevante y se fija a uno cualquiera.
    const response = await client
      .get(`/api/v1/tasks/${task.id}`)
      .qs({ today: '2026-11-05' })
      .header('Authorization', `Bearer ${token}`)

    response.assertStatus(200)

    const { assignee } = response.body().data
    assert.equal(assignee.fullName, 'Ada Lovelace')
    // DECISIÓN: las iniciales esperadas de "Ada Lovelace" son "AL" (inicial de
    // cada palabra), la misma regla que fija `openspec/specs/auth/spec.md`.
    assert.equal(assignee.initials, 'AL')
  })
})
