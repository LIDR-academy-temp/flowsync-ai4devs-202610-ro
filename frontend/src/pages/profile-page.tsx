import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { FormAlert } from '@/components/form-alert'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { ApiError, getProfile, type User } from '@/lib/api'
import { useAuth } from '@/lib/auth'
import { toFormErrors } from '@/lib/error-messages'

export function ProfilePage() {
  const { token, logout, clearSession } = useAuth()
  const navigate = useNavigate()
  const [user, setUser] = useState<User | null>(null)
  const [error, setError] = useState<string>()

  useEffect(() => {
    if (!token) return
    let cancelled = false
    getProfile(token)
      .then((profile) => {
        if (!cancelled) setUser(profile)
      })
      .catch((err) => {
        if (cancelled) return
        // Token caducado o revocado: se descarta y ProtectedRoute manda al login
        if (err instanceof ApiError && err.status === 401) clearSession()
        else setError(toFormErrors(err, 'login').form)
      })
    return () => {
      cancelled = true
    }
  }, [token, clearSession])

  async function handleLogout() {
    await logout()
    navigate('/login', { replace: true })
  }

  return (
    <main className="flex min-h-svh items-center justify-center bg-muted p-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-xl">Tu perfil</CardTitle>
          <CardDescription>Datos de tu cuenta en FlowSync.</CardDescription>
        </CardHeader>
        <CardContent>
          <FormAlert message={error} />
          {!user && !error && (
            <p className="text-sm text-muted-foreground">Cargando…</p>
          )}
          {user && (
            <div className="flex items-center gap-4">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary text-lg font-semibold text-primary-foreground">
                {user.initials}
              </div>
              <dl className="grid min-w-0 gap-1 text-sm">
                <dt className="sr-only">Nombre</dt>
                <dd className="font-medium">{user.fullName ?? 'Sin nombre'}</dd>
                <dt className="sr-only">Email</dt>
                <dd className="truncate text-muted-foreground">{user.email}</dd>
                <dt className="sr-only">Miembro desde</dt>
                <dd className="text-muted-foreground">
                  Miembro desde{' '}
                  {new Date(user.createdAt).toLocaleDateString('es-ES', {
                    dateStyle: 'long',
                  })}
                </dd>
              </dl>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button variant="outline" className="w-full" onClick={handleLogout}>
            Cerrar sesión
          </Button>
        </CardFooter>
      </Card>
    </main>
  )
}
