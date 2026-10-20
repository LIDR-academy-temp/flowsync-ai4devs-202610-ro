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

type ErrorBody = { errors?: { message?: string }[]; message?: string }

async function apiFetch<T>(
  path: string,
  options: { method?: string; body?: unknown; token?: string | null } = {},
): Promise<T> {
  const headers: Record<string, string> = { Accept: 'application/json' }
  if (options.body !== undefined) headers['Content-Type'] = 'application/json'
  if (options.token) headers.Authorization = `Bearer ${options.token}`

  let response: Response
  try {
    response = await fetch(`${API_URL}/api/v1${path}`, {
      method: options.method ?? 'GET',
      headers,
      body: options.body === undefined ? undefined : JSON.stringify(options.body),
    })
  } catch {
    throw new ApiError('No se pudo conectar con el servidor. Inténtalo de nuevo.', 0)
  }

  const payload = await response.json().catch(() => null)
  if (!response.ok) {
    const body = (payload ?? {}) as ErrorBody
    const messages = body.errors?.map((e) => e.message).filter(Boolean) ?? []
    const message =
      messages.length > 0
        ? messages.join('. ')
        : (body.message ?? 'Ha ocurrido un error inesperado.')
    throw new ApiError(message, response.status)
  }
  return (payload as { data: T }).data
}

export const signup = (input: SignupInput) =>
  apiFetch<AuthResult>('/auth/signup', { method: 'POST', body: input })

export const login = (email: string, password: string) =>
  apiFetch<AuthResult>('/auth/login', { method: 'POST', body: { email, password } })

export const getProfile = (token: string) =>
  apiFetch<User>('/account/profile', { token })
