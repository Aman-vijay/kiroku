import { Link, createFileRoute, redirect } from '@tanstack/react-router'
import { getSession } from '#/server/auth'

export const Route = createFileRoute('/app/')({
  beforeLoad: async () => {
    const session = await getSession()
    if (!session) {
      throw redirect({ to: '/login' })
    }
    return { session }
  },
  component: DashboardPage,
})

function DashboardPage() {
  const { session } = Route.useRouteContext()
  const user = session.user

  return (
    <main className="page-wrap px-4 py-16">
      <section className="island-shell rounded-2xl p-8">
        <p className="island-kicker mb-2">App</p>
        <h1 className="mb-2 text-2xl font-bold text-[var(--sea-ink)]">
          Dashboard
        </h1>
        <p className="mb-2 max-w-xl text-sm text-[var(--sea-ink-soft)]">
          You are signed in. Neon + Better Auth + Drizzle are connected.
        </p>
        <dl className="mb-6 space-y-1 text-sm text-[var(--sea-ink)]">
          <div>
            <dt className="inline font-semibold">Name: </dt>
            <dd className="inline">{user.name}</dd>
          </div>
          <div>
            <dt className="inline font-semibold">Email: </dt>
            <dd className="inline">{user.email}</dd>
          </div>
        </dl>
        <p className="mb-6 text-sm text-[var(--sea-ink-soft)]">
          Daily entries and card templates come next (Phase 2–3).
        </p>
        <Link
          to="/"
          className="text-sm font-semibold text-[var(--lagoon-deep)] no-underline"
        >
          ← Back home
        </Link>
      </section>
    </main>
  )
}
