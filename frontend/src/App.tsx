import { useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { login, logout } from './auth'
import type { Session } from './auth'
import './App.css'

function App() {
  const [session, setSession] = useState<Session | null>(null)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const pending = useRef(false)

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (pending.current) return
    pending.current = true
    setBusy(true)
    setError('')
    try {
      setSession(await login(email.trim(), password))
      setPassword('')
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'No se pudo iniciar sesión.')
    } finally {
      pending.current = false
      setBusy(false)
    }
  }

  async function signOut() {
    if (!session || pending.current) return
    pending.current = true
    setBusy(true)
    setError('')
    try {
      await logout(session.token)
      setSession(null)
      setPassword('')
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'No se pudo cerrar sesión.')
    } finally {
      pending.current = false
      setBusy(false)
    }
  }

  return (
    <main className="auth-shell">
      <section className="auth-card" aria-labelledby="page-title">
        <p className="brand">FlowSync</p>
        {session ? (
          <>
            <h1 id="page-title">¡Te damos la bienvenida{session.user.fullName ? `, ${session.user.fullName}` : ''}!</h1>
            <p>Has accedido a tu cuenta.</p>
            <p className="account-email">{session.user.email}</p>
            <button disabled={busy} onClick={signOut} type="button">
              {busy ? 'Cerrando sesión…' : 'Cerrar sesión'}
            </button>
          </>
        ) : (
          <>
            <h1 id="page-title">Inicia sesión</h1>
            <p>Accede a tu cuenta para continuar.</p>
            <form onSubmit={submit} aria-busy={busy}>
              <label htmlFor="email">Correo electrónico</label>
              <input id="email" name="email" type="email" autoComplete="username"
                maxLength={254} required value={email} disabled={busy}
                onChange={(event) => setEmail(event.target.value)} />
              <label htmlFor="password">Contraseña</label>
              <input id="password" name="password" type="password" autoComplete="current-password"
                required value={password} disabled={busy}
                onChange={(event) => setPassword(event.target.value)} />
              <button type="submit" disabled={busy}>
                {busy ? 'Iniciando sesión…' : 'Iniciar sesión'}
              </button>
            </form>
          </>
        )}
        {error && <p className="error" role="alert">{error}</p>}
      </section>
    </main>
  )
}

export default App
