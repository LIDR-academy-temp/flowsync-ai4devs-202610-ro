export interface Session {
  token: string
  user: { id: number; fullName: string | null; email: string }
}

const apiUrl = (import.meta.env.VITE_API_URL || 'http://localhost:3333').replace(/\/$/, '')

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

async function request(path: string, body?: object, token?: string) {
  let response: Response
  try {
    response = await fetch(`${apiUrl}/api/v1/${path}`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        ...(body ? { 'Content-Type': 'application/json' } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
      signal: AbortSignal.timeout(15000),
    })
  } catch {
    throw new Error('No se pudo conectar con el servidor. Comprueba tu conexión e inténtalo de nuevo.')
  }
  // Un token caducado o revocado también termina la sesión local.
  if (token && response.status === 401) return null
  if (response.status === 401 || (path === 'auth/login' && response.status === 400)) {
    throw new Error('El correo electrónico o la contraseña son incorrectos.')
  }
  if (response.status === 422) {
    throw new Error('Revisa el correo electrónico y la contraseña e inténtalo de nuevo.')
  }
  if (response.status === 429) {
    throw new Error('Demasiados intentos. Espera un momento antes de intentarlo de nuevo.')
  }
  if (!response.ok) throw new Error('El servidor no pudo completar la solicitud. Inténtalo de nuevo.')
  try {
    return await response.json() as unknown
  } catch {
    throw new Error('El servidor devolvió una respuesta inesperada. Inténtalo de nuevo.')
  }
}

export async function login(email: string, password: string): Promise<Session> {
  const result = await request('auth/login', { email, password })
  const data = isRecord(result) ? result.data : null
  if (!isRecord(data) || typeof data.token !== 'string' || !data.token ||
    !isRecord(data.user) || typeof data.user.id !== 'number' ||
    typeof data.user.email !== 'string' ||
    !(data.user.fullName === null || typeof data.user.fullName === 'string')) {
    throw new Error('El servidor devolvió una respuesta de inicio de sesión inesperada.')
  }
  return { token: data.token, user: {
    id: data.user.id, email: data.user.email, fullName: data.user.fullName,
  } }
}

export async function logout(token: string): Promise<void> {
  await request('account/logout', undefined, token)
}
