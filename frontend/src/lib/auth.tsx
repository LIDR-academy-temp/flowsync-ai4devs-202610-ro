import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from 'react'
import * as api from '@/lib/api'

const TOKEN_KEY = 'flowsync.token'

type AuthContextValue = {
  token: string | null
  login: (email: string, password: string) => Promise<void>
  signup: (input: Parameters<typeof api.signup>[0]) => Promise<void>
  logout: () => Promise<void>
  clearSession: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

function readToken() {
  try {
    return localStorage.getItem(TOKEN_KEY)
  } catch {
    return null
  }
}

function writeToken(token: string | null) {
  try {
    if (token) localStorage.setItem(TOKEN_KEY, token)
    else localStorage.removeItem(TOKEN_KEY)
  } catch {
    // Sin localStorage la sesión solo dura mientras la pestaña esté abierta
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(readToken)

  const saveToken = useCallback((value: string | null) => {
    writeToken(value)
    setToken(value)
  }, [])

  const login = useCallback(
    async (email: string, password: string) => {
      const data = await api.login(email, password)
      saveToken(data.token)
    },
    [saveToken],
  )

  const signup = useCallback(
    async (input: Parameters<typeof api.signup>[0]) => {
      // El signup ya devuelve un token, así que el usuario entra directamente
      const data = await api.signup(input)
      saveToken(data.token)
    },
    [saveToken],
  )

  const logout = useCallback(async () => {
    if (token) await api.logout(token).catch(() => {})
    saveToken(null)
  }, [token, saveToken])

  const clearSession = useCallback(() => saveToken(null), [saveToken])

  return (
    <AuthContext value={{ token, login, signup, logout, clearSession }}>
      {children}
    </AuthContext>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth debe usarse dentro de <AuthProvider>')
  return context
}
