import Task from '#models/task'
import User from '#models/user'
import { test } from '@japa/runner'
import type { ApiClient } from '@japa/api-client'
import testUtils from '@adonisjs/core/services/test_utils'

/**
 * Lo que cada tarea muestra de su responsable. Cubre los tres scenarios del
 * requisito «Lo que cada tarea muestra de su responsable» de
 * `openspec/specs/tasks/spec.md`, un test por scenario, más un cuarto test que
 * no es un scenario sino una duda de spec (ver al final).
 *
 * El responsable de la tarea es otra cuenta, no la de quien mira, para que lo
 * que salga de ella no se confunda con los datos de la sesión.
 *
 * Cada test junta lo que devuelve cada lectura en un solo objeto y lo compara
 * de una vez: así, si falla, el informe dice qué lecturas fallan y cuáles no,
 * en vez de cortarse en la primera.
 */
test.group('Tasks | responsable', (group) => {
  group.each.setup(() => testUtils.db().withGlobalTransaction())

  const HOY = '2026-11-06'

  async function sesion(client: ApiClient) {
    await User.create({ fullName: 'Quien Mira', email: 'mira@example.com', password: 'secreto123' })

    const response = await client
      .post('/api/v1/auth/login')
      .json({ email: 'mira@example.com', password: 'secreto123' })

    return response.body().data.token as string
  }

  async function tareaDe(fullName: string | null, email: string) {
    const responsable = await User.create({ fullName, email, password: 'secreto123' })

    return Task.create({
      title: 'Escribir la nota G',
      status: 'pending',
      assigneeId: responsable.id,
    })
  }

  /** Las dos formas de obtener una tarea: dentro de la lista y suelta. */
  async function obtener(client: ApiClient, assert: any, token: string, taskId: number) {
    const lista = await client.get('/api/v1/tasks').header('Authorization', `Bearer ${token}`)
    const suelta = await client
      .get(`/api/v1/tasks/${taskId}`)
      .qs({ today: HOY })
      .header('Authorization', `Bearer ${token}`)

    lista.assertStatus(200)
    suelta.assertStatus(200)

    const enLista = (lista.body().data as any[]).find((t: any) => t.id === taskId)
    assert.exists(enLista, 'la tarea no aparece en la lista')

    return { lista: enLista.assignee, suelta: suelta.body().data.assignee }
  }

  test('el responsable llega con su nombre y sus iniciales', async ({ client, assert }) => {
    const token = await sesion(client)
    const task = await tareaDe('Ada Lovelace', 'ada@example.com')

    const assignees = await obtener(client, assert, token, task.id)

    const nombreEIniciales = (a: any) => ({ fullName: a.fullName, initials: a.initials })
    assert.deepEqual(
      { lista: nombreEIniciales(assignees.lista), suelta: nombreEIniciales(assignees.suelta) },
      {
        lista: { fullName: 'Ada Lovelace', initials: 'AL' },
        suelta: { fullName: 'Ada Lovelace', initials: 'AL' },
      }
    )
  })

  test('el responsable no trae el email ni otros datos de la cuenta', async ({
    client,
    assert,
  }) => {
    const token = await sesion(client)
    const task = await tareaDe('Ada Lovelace', 'ada@example.com')
    const auth = { Authorization: `Bearer ${token}` }

    // «Cualquier tarea, suelta o dentro de la lista»: además de las dos
    // lecturas, todas las respuestas que devuelven una tarea con su responsable.
    const { lista, suelta } = await obtener(client, assert, token, task.id)
    const creada = await client.post('/api/v1/tasks').headers(auth).json({ title: 'Otra' })
    const conEstado = await client
      .patch(`/api/v1/tasks/${task.id}/status`)
      .headers(auth)
      .json({ status: 'in_progress' })
    const conFecha = await client
      .put(`/api/v1/tasks/${task.id}/due-date`)
      .headers(auth)
      .json({ today: HOY, dueDate: '2026-12-01' })

    creada.assertStatus(201)
    conEstado.assertStatus(200)
    conFecha.assertStatus(200)

    const respuestas = {
      'GET /tasks': lista,
      'GET /tasks/:id': suelta,
      'POST /tasks': (creada.body().data as any).assignee,
      'PATCH /tasks/:id/status': conEstado.body().data.assignee,
      'PUT /tasks/:id/due-date': conFecha.body().data.assignee,
    }

    // Solo lo justo para identificarlo. No se exige que estén las tres claves
    // (la spec no dice nada del `id`), solo que no haya ninguna más.
    const permitidas = ['id', 'fullName', 'initials']
    const sobrantes = (a: any) => Object.keys(a).filter((k) => !permitidas.includes(k))

    assert.deepEqual(
      Object.fromEntries(Object.entries(respuestas).map(([ruta, a]) => [ruta, sobrantes(a)])),
      Object.fromEntries(Object.keys(respuestas).map((ruta) => [ruta, []]))
    )
  })

  test('un responsable sin nombre llega con nombre nulo y con iniciales', async ({
    client,
    assert,
  }) => {
    const token = await sesion(client)
    const task = await tareaDe(null, 'grace@example.com')

    const assignees = await obtener(client, assert, token, task.id)

    const forma = (a: any) => ({
      fullName: a.fullName,
      tieneIniciales: typeof a.initials === 'string' && a.initials.length > 0,
    })
    assert.deepEqual(
      { lista: forma(assignees.lista), suelta: forma(assignees.suelta) },
      {
        lista: { fullName: null, tieneIniciales: true },
        suelta: { fullName: null, tieneIniciales: true },
      }
    )
  })

  /**
   * Esto NO es un scenario: es una duda de spec, y el rojo es esperado.
   *
   * El scenario «Responsable sin nombre» quiere las iniciales «para que la
   * interfaz pueda representarlo sin recurrir a su email». Este test lo lee
   * como «las iniciales no salen del email». Pero el requisito «Iniciales de la
   * cuenta» de `openspec/specs/auth/spec.md` dice que, sin nombre, se calculan
   * del email, y `auth/initials.spec.ts` lo comprueba. Con `grace@example.com`
   * salen «GE» (la G de «grace» y la E de «example.com»).
   *
   * Las dos lecturas no pueden estar en verde a la vez: hasta que la spec
   * decida qué quería decir, este test se queda rojo.
   */
  test('duda de spec: las iniciales de un responsable sin nombre no salen de su email', async ({
    client,
    assert,
  }) => {
    const token = await sesion(client)
    const task = await tareaDe(null, 'grace@example.com')

    const assignees = await obtener(client, assert, token, task.id)

    const salenDelEmail = (a: any) => a.initials === 'GE'
    assert.deepEqual(
      { lista: salenDelEmail(assignees.lista), suelta: salenDelEmail(assignees.suelta) },
      { lista: false, suelta: false },
      'las iniciales de un responsable sin nombre salen de su email'
    )
  })
})
