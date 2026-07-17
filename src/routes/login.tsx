import { Link, createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { authClient } from '#/lib/auth-client'
import { SITE_NAME } from '#/lib/constants'

export const Route = createFileRoute('/login')({
  component: LoginPage,
})

type Mode = 'sign-in' | 'sign-up'

function LoginPage() {
  const navigate = useNavigate()
  const [mode, setMode] = useState<Mode>('sign-in')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [pending, setPending] = useState(false)

  async function handleEmailAuth(event: React.FormEvent) {
    event.preventDefault()
    setError(null)
    setPending(true)

    try {
      if (mode === 'sign-up') {
        const result = await authClient.signUp.email({
          name: name.trim() || email.split('@')[0] || 'User',
          email: email.trim(),
          password,
        })
        if (result.error) {
          setError(result.error.message ?? 'Could not create account')
          return
        }
      } else {
        const result = await authClient.signIn.email({
          email: email.trim(),
          password,
        })
        if (result.error) {
          setError(result.error.message ?? 'Invalid email or password')
          return
        }
      }

      await navigate({ to: '/app' })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setPending(false)
    }
  }

  async function handleGoogle() {
    setError(null)
    setPending(true)
    try {
      await authClient.signIn.social({
        provider: 'google',
        callbackURL: '/app',
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Google sign-in failed')
      setPending(false)
    }
  }

  return (
    <main className="page-wrap flex justify-center px-4 py-14 sm:py-20">
      <section className="panel fade-in w-full max-w-md p-7 sm:p-8">
        <p className="mb-1 text-sm font-medium text-[var(--muted)]">
          {SITE_NAME}
        </p>
        <h1 className="mb-2 text-2xl font-semibold tracking-tight text-[var(--ink)]">
          {mode === 'sign-in' ? 'Sign in' : 'Create account'}
        </h1>
        <p className="mb-6 text-sm leading-relaxed text-[var(--muted)]">
          Email and password, or continue with Google.
        </p>

        <div className="segmented mb-5" role="tablist" aria-label="Auth mode">
          {(['sign-in', 'sign-up'] as const).map((value) => (
            <button
              key={value}
              type="button"
              role="tab"
              aria-selected={mode === value}
              data-active={mode === value}
              className="segmented-item"
              onClick={() => {
                setMode(value)
                setError(null)
              }}
            >
              {value === 'sign-in' ? 'Sign in' : 'Sign up'}
            </button>
          ))}
        </div>

        <form className="space-y-3.5" onSubmit={handleEmailAuth}>
          {mode === 'sign-up' ? (
            <label className="block">
              <span className="field-label">Name</span>
              <input
                type="text"
                autoComplete="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="field-input"
                placeholder="Your name"
              />
            </label>
          ) : null}

          <label className="block">
            <span className="field-label">Email</span>
            <input
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="field-input"
              placeholder="you@example.com"
            />
          </label>

          <label className="block">
            <span className="field-label">Password</span>
            <input
              type="password"
              required
              minLength={8}
              autoComplete={
                mode === 'sign-up' ? 'new-password' : 'current-password'
              }
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="field-input"
              placeholder="At least 8 characters"
            />
          </label>

          {error ? (
            <p role="alert" className="field-error">
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={pending}
            className="btn btn-primary w-full"
          >
            {pending
              ? 'Please wait…'
              : mode === 'sign-in'
                ? 'Sign in'
                : 'Create account'}
          </button>
        </form>

        <div className="my-5 flex items-center gap-3 text-xs text-[var(--muted)]">
          <span className="h-px flex-1 bg-[var(--line)]" />
          or
          <span className="h-px flex-1 bg-[var(--line)]" />
        </div>

        <button
          type="button"
          disabled={pending}
          onClick={() => void handleGoogle()}
          className="btn btn-secondary w-full"
        >
          Continue with Google
        </button>

        <p className="mt-6 text-center text-sm">
          <Link to="/" className="font-medium text-[var(--primary)] no-underline">
            ← Back home
          </Link>
        </p>
      </section>
    </main>
  )
}
