import { useEffect } from 'react'
import { Link, useNavigate } from '@tanstack/react-router'

export function RoutePending() {
  return (
    <main
      className="page-wrap flex min-h-[40vh] items-center justify-center px-4 py-16"
      aria-busy="true"
      aria-live="polite"
    >
      <p className="m-0 text-sm text-[var(--muted)]">Loading…</p>
    </main>
  )
}

export function RouteError({ error }: { error: Error }) {
  const navigate = useNavigate()

  useEffect(() => {
    if (error.name === 'UnauthorizedError') {
      navigate({ to: '/login', replace: true })
    }
  }, [error, navigate])

  if (error.name === 'UnauthorizedError') return null

  return (
    <main className="page-wrap px-4 py-16 text-center" role="alert">
      <h1 className="text-xl font-semibold text-[var(--ink)]">
        Something went wrong
      </h1>
      <p className="mt-2 text-sm text-[var(--muted)]">
        {error.message || 'Please try again.'}
      </p>
      <p className="mt-6">
        <Link to="/" className="btn btn-primary">
          Go home
        </Link>
      </p>
    </main>
  )
}

export function RouteNotFound() {
  return (
    <main className="page-wrap px-4 py-16 text-center">
      <h1 className="text-xl font-semibold text-[var(--ink)]">Page not found</h1>
      <p className="mt-2 text-sm text-[var(--muted)]">
        That URL doesn't match anything here.
      </p>
      <p className="mt-6">
        <Link to="/" className="btn btn-primary">
          Go home
        </Link>
      </p>
    </main>
  )
}
