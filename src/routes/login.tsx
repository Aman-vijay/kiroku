import { Link, createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { authClient } from '#/lib/auth-client'
import { SITE_NAME } from '#/lib/constants'
import { cn } from '#/lib/utils'

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
    <main className="page-wrap px-4 py-16">
      <section className="island-shell mx-auto max-w-md rounded-2xl p-8">
        <p className="island-kicker mb-2">Welcome</p>
        <h1 className="mb-2 text-2xl font-bold text-[var(--sea-ink)]">
          {mode === 'sign-in' ? `Sign in to ${SITE_NAME}` : `Join ${SITE_NAME}`}
        </h1>
        <p className="mb-6 text-sm text-[var(--sea-ink-soft)]">
          Email and password or continue with Google. Sessions are stored in
          Neon via Better Auth + Drizzle.
        </p>

        <div className="mb-5 flex rounded-full border border-[var(--line)] bg-[var(--chip-bg)] p-1">
          {(['sign-in', 'sign-up'] as const).map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => {
                setMode(value)
                setError(null)
              }}
              className={cn(
                'flex-1 rounded-full px-3 py-2 text-sm font-semibold transition',
                mode === value
                  ? 'bg-[rgba(79,184,178,0.2)] text-[var(--lagoon-deep)]'
                  : 'text-[var(--sea-ink-soft)]',
              )}
            >
              {value === 'sign-in' ? 'Sign in' : 'Sign up'}
            </button>
          ))}
        </div>

        <form className="space-y-3" onSubmit={handleEmailAuth}>
          {mode === 'sign-up' ? (
            <label className="block text-sm">
              <span className="mb-1 block font-medium text-[var(--sea-ink)]">
                Name
              </span>
              <input
                type="text"
                autoComplete="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-xl border border-[var(--line)] bg-white/70 px-3 py-2 text-[var(--sea-ink)] outline-none ring-[var(--lagoon)] focus:ring-2 dark:bg-black/20"
                placeholder="Your name"
              />
            </label>
          ) : null}

          <label className="block text-sm">
            <span className="mb-1 block font-medium text-[var(--sea-ink)]">
              Email
            </span>
            <input
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-[var(--line)] bg-white/70 px-3 py-2 text-[var(--sea-ink)] outline-none ring-[var(--lagoon)] focus:ring-2 dark:bg-black/20"
              placeholder="you@example.com"
            />
          </label>

          <label className="block text-sm">
            <span className="mb-1 block font-medium text-[var(--sea-ink)]">
              Password
            </span>
            <input
              type="password"
              required
              minLength={8}
              autoComplete={
                mode === 'sign-up' ? 'new-password' : 'current-password'
              }
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-[var(--line)] bg-white/70 px-3 py-2 text-[var(--sea-ink)] outline-none ring-[var(--lagoon)] focus:ring-2 dark:bg-black/20"
              placeholder="At least 8 characters"
            />
          </label>

          {error ? (
            <p
              role="alert"
              className="rounded-xl border border-red-300/60 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-200"
            >
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={pending}
            className="w-full rounded-full border border-[rgba(50,143,151,0.3)] bg-[rgba(79,184,178,0.18)] px-4 py-2.5 text-sm font-semibold text-[var(--lagoon-deep)] transition hover:bg-[rgba(79,184,178,0.28)] disabled:opacity-60"
          >
            {pending
              ? 'Please wait…'
              : mode === 'sign-in'
                ? 'Sign in'
                : 'Create account'}
          </button>
        </form>

        <div className="my-5 flex items-center gap-3 text-xs text-[var(--sea-ink-soft)]">
          <span className="h-px flex-1 bg-[var(--line)]" />
          or
          <span className="h-px flex-1 bg-[var(--line)]" />
        </div>

        <button
          type="button"
          disabled={pending}
          onClick={() => void handleGoogle()}
          className="w-full rounded-full border border-[var(--line)] bg-white/60 px-4 py-2.5 text-sm font-semibold text-[var(--sea-ink)] transition hover:bg-white/90 disabled:opacity-60 dark:bg-black/20"
        >
          Continue with Google
        </button>

        <p className="mt-6 text-center text-sm">
          <Link
            to="/"
            className="font-semibold text-[var(--lagoon-deep)] no-underline"
          >
            ← Back home
          </Link>
        </p>
      </section>
    </main>
  )
}
