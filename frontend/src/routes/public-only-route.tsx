import { Navigate, Outlet } from 'react-router'
import { useAuth } from '@/auth/use-auth'
import { FullScreenLoader } from '@/components/full-screen-loader'

/**
 * El espejo de `ProtectedRoute`: con sesión activa, login y registro no tienen
 * sentido. Se rebota a la lista si se acaba de iniciar sesión y al perfil en el
 * resto de casos.
 */
export function PublicOnlyRoute() {
  const { status, landingPath } = useAuth()

  if (status === 'loading') return <FullScreenLoader />
  if (status === 'authenticated') return <Navigate to={landingPath} replace />

  return <Outlet />
}
