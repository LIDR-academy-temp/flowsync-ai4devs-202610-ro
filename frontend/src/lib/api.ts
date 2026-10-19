const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3333/api/v1'

export type User = {
  id: number
  fullName: string | null
  email: string
  initials: string
  createdAt: string
  updatedAt: string
}

type AuthResponse = { user: User; token: string }

// Forma de los errores del backend: 422 de VineJS trae `field` y `rule`;
// 400 (credenciales) y 401 solo traen `message`.
type ApiErrorItem = { message: string; field?: string; rule?: string }

export class ApiError extends Error {
  status: number
  errors: ApiErrorItem[]

  constructor(status: number, errors: ApiErrorItem[]) {
    super(errors[0]?.message ?? `HTTP ${status}`)
    this.status = status
    this.errors = errors
  }

  hasRule(field: string, rule: string) {
    return this.errors.some((e) => e.field === field && e.rule === rule)
  }
}

// status 0 = no se pudo contactar con el servidor
export const NETWORK_ERROR_STATUS = 0

async function request<T>(
  path: string,
  options: { method?: string; body?: unknown; token?: string | null } = {},
): Promise<T> {
  const headers: Record<string, string> = { Accept: 'application/json' }
  if (options.body !== undefined) headers['Content-Type'] = 'application/json'
  if (options.token) headers.Authorization = `Bearer ${options.token}`

  let response: Response
  try {
    response = await fetch(`${API_URL}${path}`, {
      method: options.method ?? 'GET',
      headers,
      body:
        options.body !== undefined ? JSON.stringify(options.body) : undefined,
    })
  } catch {
    throw new ApiError(NETWORK_ERROR_STATUS, [])
  }

  const payload = await response.json().catch(() => null)
  if (!response.ok) {
    throw new ApiError(response.status, payload?.errors ?? [])
  }
  return payload as T
}

export async function login(email: string, password: string) {
  const { data } = await request<{ data: AuthResponse }>('/auth/login', {
    method: 'POST',
    body: { email, password },
  })
  return data
}

export async function signup(input: {
  email: string
  password: string
  passwordConfirmation: string
}) {
  // El validador del backend exige que `fullName` esté presente, aunque sea null
  const { data } = await request<{ data: AuthResponse }>('/auth/signup', {
    method: 'POST',
    body: { fullName: null, ...input },
  })
  return data
}

export async function getProfile(token: string) {
  const { data } = await request<{ data: User }>('/account/profile', { token })
  return data
}

export async function logout(token: string) {
  // logout no va envuelto en `data`
  await request<{ message: string }>('/account/logout', {
    method: 'POST',
    token,
  })
}
