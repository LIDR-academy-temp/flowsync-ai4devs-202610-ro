import User from '#models/user'
import Task from '#models/task'
import { test } from '@japa/runner'
import testUtils from '@adonisjs/core/services/test_utils'

/**
 * Lo que cada tarea muestra de su responsable. Cubre los tres scenarios del
 * requisito «Lo que cada tarea muestra de su responsable» de
 * `openspec/specs/tasks/spec.md`, en todas las respuestas que traen una tarea:
 * la lista, la tarea suelta, y la tarea que devuelven crear, cambiar el estado
 * y fijar la fecha.
 *
 * Cada test recoge los fallos de todas las respuestas y los afirma al final,
 * para que un rojo diga en cuáles falla y no solo en la primera.
 */
test.group('Tasks | responsable', (group) => {
  group.each.setup(() => testUtils.db().withGlobalTransaction())

  const HOY = '2026-11-08'

  /**
   * Lo único que el requisito deja salir del responsable: nombre e iniciales.
   * El `id` se admite como referencia de la relación; ver «No lo sé» en
   * `docs/verificacion/na.md`.
   */
  const CLAVES_PERMITIDAS = ['id', 'fullName', 'initials']

  async function sesion(client: any, fullName: string | null) {
    const responsable = await User.create({
      fullName,
      email: 'responsable@example.com',
      password: 'secreto123',
    })

    await User.create({
      fullName: 'Grace Hopper',
      email: 'grace@example.com',
      password: 'secreto123',
    })
    const login = await client
      .post('/api/v1/auth/login')
      .json({ email: 'grace@example.com', password: 'secreto123' })
    login.assertStatus(200)

    return { responsable, token: login.body().data.token as string }
  }

  /** El `assignee` de cada respuesta que trae una tarea, por su nombre. */
  async function responsables(client: any, token: string, assigneeId: number) {
    const auth = (request: any) => request.header('Authorization', `Bearer ${token}`)
    const tarea = await Task.create({ title: 'Revisar el registro', status: 'pending', assigneeId })
    const resultado: Record<string, any> = {}

    const lista = await auth(client.get('/api/v1/tasks'))
    lista.assertStatus(200)
    resultado['lista'] = lista.body().data.find((t: any) => t.id === tarea.id)?.assignee

    const suelta = await auth(client.get(`/api/v1/tasks/${tarea.id}`).qs({ today: HOY }))
    suelta.assertStatus(200)
    resultado['tarea suelta'] = suelta.body().data.assignee

    const estado = await auth(client.patch(`/api/v1/tasks/${tarea.id}/status`)).json({
      status: 'in_progress',
    })
    estado.assertStatus(200)
    resultado['cambio de estado'] = estado.body().data.assignee

    const fecha = await auth(client.put(`/api/v1/tasks/${tarea.id}/due-date`)).json({
      today: HOY,
      dueDate: '2026-11-20',
    })
    fecha.assertStatus(200)
    resultado['cambio de fecha'] = fecha.body().data.assignee

    return resultado
  }

  /** La tarea recién creada: su responsable es quien la crea, aquí la sesión de Grace. */
  async function responsableAlCrear(client: any, token: string) {
    const creada = await client
      .post('/api/v1/tasks')
      .header('Authorization', `Bearer ${token}`)
      .json({ title: 'Revisar el registro' })
    creada.assertStatus(201)

    return creada.body().data.assignee
  }

  test('el responsable se identifica por su nombre y sus iniciales', async ({ client, assert }) => {
    const { responsable, token } = await sesion(client, 'Ada Lovelace')
    const fallos: string[] = []

    for (const [respuesta, assignee] of Object.entries(
      await responsables(client, token, responsable.id)
    )) {
      if (assignee?.fullName !== 'Ada Lovelace') fallos.push(`${respuesta}: nombre`)
      if (assignee?.initials !== 'AL') fallos.push(`${respuesta}: iniciales`)
    }

    assert.deepEqual(fallos, [], fallos.join(' | '))
  })

  test('la tarea no filtra el email ni otros datos de la cuenta del responsable', async ({
    client,
    assert,
  }) => {
    const { responsable, token } = await sesion(client, 'Ada Lovelace')
    const lecturas = await responsables(client, token, responsable.id)
    lecturas['creación'] = await responsableAlCrear(client, token)
    const fallos: string[] = []

    for (const [respuesta, assignee] of Object.entries(lecturas)) {
      const sobran = Object.keys(assignee ?? {}).filter((k) => !CLAVES_PERMITIDAS.includes(k))
      if (sobran.length > 0) fallos.push(`${respuesta}: ${sobran.join(', ')}`)
      if (JSON.stringify(assignee).includes('@')) {
        fallos.push(`${respuesta}: email`)
      }
    }

    assert.deepEqual(fallos, [], fallos.join(' | '))
  })

  test('un responsable sin nombre llega con nombre nulo, con iniciales y sin su email', async ({
    client,
    assert,
  }) => {
    const { responsable, token } = await sesion(client, null)
    const fallos: string[] = []

    for (const [respuesta, assignee] of Object.entries(
      await responsables(client, token, responsable.id)
    )) {
      if (assignee?.fullName !== null) fallos.push(`${respuesta}: nombre no nulo`)
      if (!/^[A-Z]{1,2}$/.test(assignee?.initials ?? '')) {
        fallos.push(`${respuesta}: iniciales «${assignee?.initials}»`)
      }
      if (JSON.stringify(assignee).includes('@')) {
        fallos.push(`${respuesta}: email`)
      }
    }

    assert.deepEqual(fallos, [], fallos.join(' | '))
  })
})
