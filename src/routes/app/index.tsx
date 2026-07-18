import { useEffect, useState } from 'react'
import { Link, createFileRoute } from '@tanstack/react-router'
import {
  EntryCardGrid,
  EntryEmptyState,
  StreakBadge,
  formatDisplayDate,
  todayLocalISO,
} from '#/features/entries'
import { getEntryByDate, listEntries } from '#/server/entries'
import { useEntriesStore, useStreak } from '#/stores'

export const Route = createFileRoute('/app/')({
  loader: async () => {
    const today = todayLocalISO()
    const [entries, todayEntry] = await Promise.all([
      listEntries({ data: { limit: 30 } }),
      getEntryByDate({ data: { entryDate: today } }),
    ])
    const cursor = entries.length > 0 ? entries[entries.length - 1]?.entryDate ?? null : null
    return { entries, todayEntry, today, cursor }
  },
  pendingComponent: DashboardPending,
  component: DashboardPage,
})

function DashboardPending() {
  return (
    <main className="page-wrap px-4 py-10 sm:py-12" aria-busy="true">
      <div className="mb-8 space-y-2">
        <div className="h-4 w-32 animate-pulse rounded bg-[var(--surface)]" />
        <div className="h-8 w-48 animate-pulse rounded-[10px] bg-[var(--surface)]" />
      </div>
      <div className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-3">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="aspect-[1080/1350] animate-pulse rounded-[14px] border border-[var(--line)] bg-[var(--surface)]"
          />
        ))}
      </div>
    </main>
  )
}

function DashboardPage() {
  const { session } = Route.useRouteContext()
  const { entries, todayEntry, today, cursor } = Route.useLoaderData()
  const storeHydrate = useEntriesStore((s) => s.hydrate)
  const loadMore = useEntriesStore((s) => s.loadMore)
  const storeEntries = useEntriesStore((s) => s.entries)
  const storeTodayId = useEntriesStore((s) => s.todayEntryId)
  const cursorVal = useEntriesStore((s) => s.cursor)
  const loading = useEntriesStore((s) => s.loading)

  // Hydrate store from SSR loader on mount + loader data change
  const [hydrated, setHydrated] = useState(false)
  useEffect(() => {
    storeHydrate(entries, todayEntry?.id ?? null, cursor)
    setHydrated(true)
  }, [entries, todayEntry?.id, cursor, storeHydrate])

  const user = session.user
  const firstName = user.name?.split(' ')[0] || 'there'
  const username = firstName
  const streak = useStreak()
  const displayEntries = hydrated ? storeEntries : entries
  const todayId = hydrated ? storeTodayId : (todayEntry?.id ?? null)

  const foundToday = todayId
    ? displayEntries.find((e) => e.id === todayId)
    : null

  return (
    <main className="page-wrap px-4 py-10 sm:py-12">
      <header className="fade-in mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-[var(--muted)]">
            {formatDisplayDate(today)}
          </p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-[var(--ink)]">
            Hi, {firstName}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <StreakBadge streak={streak} compact />
          {foundToday ? (
            <Link
              to="/app/entries/$entryId"
              params={{ entryId: foundToday.id }}
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

      {displayEntries.length === 0 ? (
        <EntryEmptyState />
      ) : (
        <section aria-label="Your entries">
          <EntryCardGrid
            entries={displayEntries}
            username={username}
            todayId={todayId}
          />
          {cursorVal ? (
            <div className="mt-8 text-center">
              <button
                type="button"
                className="btn btn-ghost"
                disabled={loading}
                onClick={() => void loadMore()}
              >
                {loading ? 'Loading…' : 'Load older'}
              </button>
            </div>
          ) : null}
        </section>
      )}
    </main>
  )
}
