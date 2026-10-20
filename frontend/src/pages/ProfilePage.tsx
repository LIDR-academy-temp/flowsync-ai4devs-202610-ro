import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { ApiError, getProfile } from '@/lib/api'
import type { User } from '@/lib/api'
import { useAuth } from '@/lib/auth'

export default function ProfilePage() {
  const { token, logout } = useAuth()
  const navigate = useNavigate()
  const [user, setUser] = useState<User | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    if (!token) return
    let cancelled = false
    getProfile(token)
      .then((profile) => {
        if (!cancelled) setUser(profile)
      })
      .catch((err) => {
        if (cancelled) return
        if (err instanceof ApiError && err.status === 401) {
          logout()
          navigate('/login', { replace: true })
          return
        }
        setError(
          err instanceof Error ? err.message : 'No se pudo cargar el perfil.',
        )
      })
    return () => {
      cancelled = true
    }
  }, [token, logout, navigate, attempt])

  function onRetry() {
    setError(null)
    setAttempt((n) => n + 1)
  }

  function onLogout() {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <main className="flex min-h-svh items-center justify-center p-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Mi perfil</CardTitle>
          <CardDescription>Datos de tu cuenta.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {error && (
            <Alert variant="destructive" role="alert">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {error && (
            <Button variant="secondary" onClick={onRetry}>
              Reintentar
            </Button>
          )}
          {!user && !error && (
            <p className="text-sm text-muted-foreground">Cargando…</p>
          )}
          {user && (
            <div className="flex items-center gap-4">
              <div
                className="flex size-12 items-center justify-center rounded-full bg-primary text-primary-foreground font-medium"
                aria-hidden="true"
              >
                {user.initials}
              </div>
              <div>
                <p className="font-medium">{user.fullName ?? 'Sin nombre'}</p>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>
            </div>
          )}
          <Button variant="outline" onClick={onLogout}>
            Cerrar sesión
          </Button>
        </CardContent>
      </Card>
    </main>
  )
}
