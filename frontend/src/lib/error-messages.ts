import { ApiError, NETWORK_ERROR_STATUS } from '@/lib/api'

export type FormErrors = {
  form?: string
  fields: Record<string, string>
}

const NETWORK_MESSAGE =
  'No se ha podido conectar con el servidor. Comprueba que el backend está arrancado.'
const GENERIC_MESSAGE = 'Ha ocurrido un error inesperado. Inténtalo de nuevo.'

// Mensajes por regla de VineJS; los que no estén aquí usan el texto del backend
const RULE_MESSAGES: Record<string, Record<string, string>> = {
  email: {
    'database.unique':
      'Ya existe una cuenta con este email. ¿Quieres iniciar sesión?',
    email: 'Introduce un email válido.',
    required: 'El email es obligatorio.',
    maxLength: 'El email no puede superar los 254 caracteres.',
  },
  password: {
    required: 'La contraseña es obligatoria.',
    minLength: 'La contraseña debe tener al menos 8 caracteres.',
    maxLength: 'La contraseña no puede superar los 32 caracteres.',
  },
  passwordConfirmation: {
    required: 'Repite la contraseña.',
    sameAs: 'Las contraseñas no coinciden.',
  },
}

// El formulario comprueba antes de enviar que las contraseñas coinciden, así que un
// error de longitud en la confirmación repite el del password y no se muestra
function isDuplicate(item: { field?: string; rule?: string }) {
  return (
    item.field === 'passwordConfirmation' &&
    (item.rule === 'minLength' || item.rule === 'maxLength')
  )
}

export function toFormErrors(
  error: unknown,
  context: 'login' | 'signup',
): FormErrors {
  if (!(error instanceof ApiError)) return { form: GENERIC_MESSAGE, fields: {} }
  if (error.status === NETWORK_ERROR_STATUS)
    return { form: NETWORK_MESSAGE, fields: {} }

  // verifyCredentials responde 400 si el email no existe o la contraseña no coincide
  if (context === 'login' && error.status === 400) {
    return { form: 'Email o contraseña incorrectos.', fields: {} }
  }

  if (error.status === 422) {
    const fields: Record<string, string> = {}
    for (const item of error.errors) {
      if (!item.field || fields[item.field] || isDuplicate(item)) continue
      fields[item.field] =
        (item.rule && RULE_MESSAGES[item.field]?.[item.rule]) ?? item.message
    }
    return { fields }
  }

  return { form: GENERIC_MESSAGE, fields: {} }
}
