import { Link, createFileRoute } from '@tanstack/react-router'
import {
  EntryCardGrid,
  EntryEmptyState,
  StreakBadge,
  computeStreak,
  todayLocalISO,
} from '#/features/entries'
import { getEntryByDate, listEntries } from '#/server/entries'

export const Route = createFileRoute('/app/')({
  loader: async () => {
    const today = todayLocalISO()
    const [entries, todayEntry] = await Promise.all([
      listEntries({ data: { limit: 30 } }),
      getEntryByDate({ data: { entryDate: today } }),
    ])
    return { entries, todayEntry, today }
  },
  pendingComponent: DashboardPending,
  component: DashboardPage,
})

function DashboardPending() {
  return (
    <main className="page-wrap px-4 py-12 sm:py-14" aria-busy="true">
      <div className="mb-8 h-10 w-48 animate-pulse rounded-[10px] bg-[var(--surface)]" />
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="aspect-[1080/1350] animate-pulse rounded-[14px] bg-[var(--surface)]"
          />
        ))}
      </div>
    </main>
  )
}

function DashboardPage() {
  const { session } = Route.useRouteContext()
  const { entries, todayEntry } = Route.useLoaderData()
  const user = session.user
  const firstName = user.name?.split(' ')[0] || 'there'
  const username = firstName
  const streak = computeStreak(entries.map((e) => e.entryDate))

  return (
    <main className="page-wrap px-4 py-12 sm:py-14">
      <header className="fade-in mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-1 text-sm font-medium text-[var(--muted)]">
            Dashboard
          </p>
          <h1 className="text-2xl font-semibold tracking-tight text-[var(--ink)]">
            Hi, {firstName}
          </h1>
          <p className="mt-1 max-w-md text-sm text-[var(--muted)]">
            Your days as cards. One entry per calendar day.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <StreakBadge streak={streak} compact />
          {todayEntry ? (
            <Link
              to="/app/entries/$entryId"
              params={{ entryId: todayEntry.id }}
              className="btn btn-primary shrink-0"
            >
              Edit today
            </Link>
          ) : (
            <Link to="/app/entries/new" className="btn btn-primary shrink-0">
              Log today
            </Link>
          )}
        </div>
      </header>

      {entries.length === 0 ? (
        <EntryEmptyState />
      ) : (
        <section aria-label="Your entries">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="m-0 text-sm font-semibold text-[var(--ink)]">
              Your cards
            </h2>
            <span className="text-xs text-[var(--muted)]">
              {entries.length} {entries.length === 1 ? 'day' : 'days'}
            </span>
          </div>
          <EntryCardGrid entries={entries} username={username} />
        </section>
      )}

      <p className="mt-10 text-sm">
        <Link to="/" className="font-medium text-[var(--primary)] no-underline">
          ← Back home
        </Link>
      </p>
    </main>
  )
}
