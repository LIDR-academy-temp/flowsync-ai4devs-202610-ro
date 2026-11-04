import { createContext } from 'react'
import type { LoginPayload, SignupPayload, User } from '@/lib/types'

export type AuthStatus = 'loading' | 'authenticated' | 'anonymous'

export type AuthContextValue = {
  user: User | null
  token: string | null
  status: AuthStatus
  /** Motivo por el que se perdió una sesión previa, para poder explicarlo. */
  sessionError: string | null
  /** Se acaba de crear una cuenta y falta iniciar sesión con ella. */
  accountCreated: boolean
  /** A dónde lleva `PublicOnlyRoute` a quien ya tiene sesión. */
  landingPath: string
  login: (payload: LoginPayload) => Promise<void>
  signup: (payload: SignupPayload) => Promise<void>
  logout: () => Promise<void>
}

/**
 * Vive en su propio fichero (sin componentes) para no chocar con la regla
 * `react/only-export-components` de oxlint.
 */
export const AuthContext = createContext<AuthContextValue | null>(null)
