import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router'
import { AuthLayout } from '@/components/auth-layout'
import { FormAlert } from '@/components/form-alert'
import { FormField } from '@/components/form-field'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/lib/auth'
import { toFormErrors, type FormErrors } from '@/lib/error-messages'

export function SignupPage() {
  const { signup } = useAuth()
  const navigate = useNavigate()
  const [errors, setErrors] = useState<FormErrors>({ fields: {} })
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const input = {
      email: String(form.get('email')),
      password: String(form.get('password')),
      passwordConfirmation: String(form.get('passwordConfirmation')),
    }

    if (input.password !== input.passwordConfirmation) {
      setErrors({
        fields: { passwordConfirmation: 'Las contraseñas no coinciden.' },
      })
      return
    }

    setSubmitting(true)
    setErrors({ fields: {} })
    try {
      await signup(input)
      navigate('/profile', { replace: true })
    } catch (error) {
      setErrors(toFormErrors(error, 'signup'))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AuthLayout
      title="Crear cuenta"
      description="Regístrate con tu email y una contraseña."
      footer={
        <p>
          ¿Ya tienes cuenta?{' '}
          <Link to="/login" className="font-medium text-foreground underline">
            Inicia sesión
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
          autoComplete="new-password"
          placeholder="Entre 8 y 32 caracteres"
          required
          error={errors.fields.password}
        />
        <FormField
          id="passwordConfirmation"
          label="Repite la contraseña"
          type="password"
          autoComplete="new-password"
          required
          error={errors.fields.passwordConfirmation}
        />
        <Button type="submit" disabled={submitting}>
          {submitting ? 'Creando cuenta…' : 'Crear cuenta'}
        </Button>
      </form>
    </AuthLayout>
  )
}
