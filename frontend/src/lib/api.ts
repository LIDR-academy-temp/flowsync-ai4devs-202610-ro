const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3333'

export type User = {
  id: number
  fullName: string | null
  email: string
  createdAt: string
  updatedAt: string | null
  initials: string
}

export type AuthResult = { user: User; token: string }

export type SignupInput = {
  // el validador del backend exige la clave: nullable, pero no opcional
  fullName: string | null
  email: string
  password: string
  passwordConfirmation: string
}

export class ApiError extends Error {
  status: number

  constructor(message: string, status: number) {
    super(message)
    this.status = status
  }
}

type ApiErrorItem = { message?: string; rule?: string; field?: string }
type ErrorBody = { errors?: ApiErrorItem[]; message?: string }

const FIELD_LABELS: Record<string, string> = {
  fullName: 'El nombre',
  email: 'El email',
  password: 'La contraseña',
  passwordConfirmation: 'La confirmación de la contraseña',
}

// Traduce los errores de VineJS (por regla y campo); si no hay traducción, deja el mensaje del servidor
function translateError({
  message,
  rule,
  field,
}: ApiErrorItem): string | undefined {
  const label = (field && FIELD_LABELS[field]) || 'El campo'
  switch (rule) {
    case 'database.unique':
      return 'Ya existe una cuenta con ese email.'
    case 'required':
      return `${label} es obligatorio.`
    case 'email':
      return 'Introduce un email válido.'
    case 'minLength':
    case 'maxLength':
      return field === 'email'
        ? 'El email es demasiado largo.'
        : `${label} debe tener entre 8 y 32 caracteres.`
    case 'sameAs':
      return 'Las contraseñas no coinciden.'
    default:
      return message
  }
}

async function request(
  path: string,
  options: { method?: string; body?: unknown; token?: string | null } = {},
): Promise<unknown> {
  const headers: Record<string, string> = { Accept: 'application/json' }
  if (options.body !== undefined) headers['Content-Type'] = 'application/json'
  if (options.token) headers.Authorization = `Bearer ${options.token}`

  let response: Response
  try {
    response = await fetch(`${API_URL}/api/v1${path}`, {
      method: options.method ?? 'GET',
      headers,
      body:
        options.body === undefined ? undefined : JSON.stringify(options.body),
    })
  } catch {
    throw new ApiError(
      'No se pudo conectar con el servidor. Inténtalo de nuevo.',
      0,
    )
  }

  const payload: unknown = await response.json().catch(() => null)
  if (!response.ok) {
    const body = (
      payload && typeof payload === 'object' ? payload : {}
    ) as ErrorBody
    const messages = [
      ...new Set((body.errors ?? []).map(translateError).filter(Boolean)),
    ]
    const message =
      messages.length > 0
        ? messages.join(' ')
        : (body.message ?? 'Ha ocurrido un error inesperado.')
    throw new ApiError(message, response.status)
  }
  return payload
}

// Las respuestas de datos van envueltas en `data` (ver providers/api_provider.ts del backend)
async function requestData<T>(...args: Parameters<typeof request>): Promise<T> {
  const payload = await request(...args)
  if (!payload || typeof payload !== 'object' || !('data' in payload)) {
    throw new ApiError('La respuesta del servidor no es válida.', 502)
  }
  return payload.data as T
}

export const signup = (input: SignupInput) =>
  requestData<AuthResult>('/auth/signup', { method: 'POST', body: input })

export async function login(email: string, password: string) {
  try {
    return await requestData<AuthResult>('/auth/login', {
      method: 'POST',
      body: { email, password },
    })
  } catch (err) {
    // el backend responde 400 "Invalid user credentials" cuando email o contraseña no coinciden
    if (err instanceof ApiError && (err.status === 400 || err.status === 401)) {
      throw new ApiError(
        'El email o la contraseña no son correctos.',
        err.status,
      )
    }
    throw err
  }
}

export const getProfile = (token: string) =>
  requestData<User>('/account/profile', { token })

// Logout devuelve `{ message }` sin envolver
export const logout = (token: string) =>
  request('/account/logout', { method: 'POST', token }).then(() => undefined)
