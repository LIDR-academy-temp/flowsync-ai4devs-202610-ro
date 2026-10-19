import { useState, type FormEvent } from 'react'
import { Link, useLocation, useNavigate } from 'react-router'
import { AuthLayout } from '@/components/auth-layout'
import { FormAlert } from '@/components/form-alert'
import { FormField } from '@/components/form-field'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/lib/auth'
import { toFormErrors, type FormErrors } from '@/lib/error-messages'

export function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [errors, setErrors] = useState<FormErrors>({ fields: {} })
  const [submitting, setSubmitting] = useState(false)

  // Si el usuario llegó aquí desde una ruta protegida, vuelve a ella tras el login
  const redirectTo =
    (location.state as { from?: string } | null)?.from ?? '/profile'

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    setSubmitting(true)
    setErrors({ fields: {} })
    try {
      await login(String(form.get('email')), String(form.get('password')))
      navigate(redirectTo, { replace: true })
    } catch (error) {
      setErrors(toFormErrors(error, 'login'))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AuthLayout
      title="Iniciar sesión"
      description="Entra con tu email y tu contraseña."
      footer={
        <p>
          ¿No tienes cuenta?{' '}
          <Link to="/signup" className="font-medium text-foreground underline">
            Regístrate
          </Link>
        </p>
      }
    >
      <form onSubmit={handleSubmit} className="grid gap-4" noValidate>
        <FormAlert message={errors.form} />
        <FormField
          id="email"
          label="Email"
          type="email"
          autoComplete="email"
          required
          error={errors.fields.email}
        />
        <FormField
          id="password"
          label="Contraseña"
          type="password"
          autoComplete="current-password"
          required
          error={errors.fields.password}
        />
        <Button type="submit" disabled={submitting}>
          {submitting ? 'Entrando…' : 'Entrar'}
        </Button>
      </form>
    </AuthLayout>
  )
}
