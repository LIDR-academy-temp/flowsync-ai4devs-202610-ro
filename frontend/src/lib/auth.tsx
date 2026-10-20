import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from 'react'
import type { ReactNode } from 'react'
import * as api from '@/lib/api'
import type { SignupInput } from '@/lib/api'

const TOKEN_KEY = 'flowsync.token'

type AuthContextValue = {
  token: string | null
  login: (email: string, password: string) => Promise<void>
  signup: (input: SignupInput) => Promise<void>
  logout: () => void
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
    // almacenamiento no disponible: la sesión dura solo mientras la pestaña esté abierta
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(readToken)
  const tokenRef = useRef(token)

  const store = useCallback((next: string | null) => {
    tokenRef.current = next
    writeToken(next)
    setToken(next)
  }, [])

  // Referencia estable: no cambia al iniciar o cerrar sesión
  const logout = useCallback(() => {
    const current = tokenRef.current
    store(null)
    // Se invalida el token en el servidor; si falla, la sesión local ya está cerrada
    if (current) api.logout(current).catch(() => {})
  }, [store])

  const value = useMemo<AuthContextValue>(
    () => ({
      token,
      login: async (email, password) => {
        store((await api.login(email, password)).token)
      },
      signup: async (input) => {
        store((await api.signup(input)).token)
      },
      logout,
    }),
    [token, store, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider')
  return ctx
}
