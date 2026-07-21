import { useEffect, useState } from 'react'
import { Link, createFileRoute, useRouter } from '@tanstack/react-router'
import {
  EntryCardGrid,
  EntryEmptyState,
  StreakBadge,
  formatDisplayDate,
  todayLocalISO,
} from '#/features/entries'
import { GoalTagSelect } from '#/features/goals'
import { TaskMinutesInput } from '#/features/tasks'
import { getEntryByDate, listEntries } from '#/server/entries'
import { listTasksByDate, toggleTask, updateTask } from '#/server/task'
import { listGoals } from '#/server/goal'
import {
  useEntriesStore,
  useGoalsStore,
  useStreak,
  useTasksStore,
} from '#/stores'

export const Route = createFileRoute('/app/')({
  loader: async () => {
    const today = todayLocalISO()
    const [entries, todayEntry, todayTasks, goals] = await Promise.all([
      listEntries({ data: { limit: 30 } }),
      getEntryByDate({ data: { entryDate: today } }),
      listTasksByDate({ data: { entryDate: today } }),
      listGoals(),
    ])
    const cursor = entries.length > 0 ? entries[entries.length - 1]?.entryDate ?? null : null
    return { entries, todayEntry, todayTasks, goals, today, cursor }
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
  const router = useRouter()
  const { session } = Route.useRouteContext()
  const { entries, todayEntry, todayTasks, today, cursor } = Route.useLoaderData()
  const storeHydrate = useEntriesStore((s) => s.hydrate)
  const loadMore = useEntriesStore((s) => s.loadMore)
  const storeEntries = useEntriesStore((s) => s.entries)
  const storeTodayId = useEntriesStore((s) => s.todayEntryId)
  const cursorVal = useEntriesStore((s) => s.cursor)
  const loading = useEntriesStore((s) => s.loading)

  const taskHydrate = useTasksStore((s) => s.hydrate)
  const taskUpsert = useTasksStore((s) => s.upsert)
  const storeTasks = useTasksStore((s) => s.tasks)
  const goalsHydrate = useGoalsStore((s) => s.hydrate)
  const storeGoals = useGoalsStore((s) => s.goals)

  // Hydrate store from SSR loader on mount + loader data change
  const [hydrated, setHydrated] = useState(false)
  useEffect(() => {
    storeHydrate(entries, todayEntry?.id ?? null, cursor)
    taskHydrate(todayTasks)
    goalsHydrate(goals)
    setHydrated(true)
  }, [entries, todayEntry?.id, cursor, storeHydrate, todayTasks, taskHydrate, goals, goalsHydrate])

  const user = session.user
  const firstName = user.name?.split(' ')[0] || 'there'
  const username = firstName
  const streak = useStreak()
  const displayEntries = hydrated ? storeEntries : entries
  const displayTasks = hydrated ? storeTasks : todayTasks
  const displayGoals = hydrated ? storeGoals : goals
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

      {/* Today's plan — tick to complete. Plan new tasks in the Plan tab. */}
      <section aria-label="Today's plan" className="fade-in mb-8">
        <div
          className="panel p-5 sm:p-6"
          style={{
            background:
              'color-mix(in oklab, var(--primary) 4%, var(--bg))',
            borderColor:
              'color-mix(in oklab, var(--primary) 22%, var(--line))',
          }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span
                aria-hidden
                className="inline-block h-1.5 w-1.5 rounded-full"
                style={{ background: 'var(--accent)' }}
              />
              <h3 className="text-sm font-semibold text-[var(--ink)]">
                Today's plan
              </h3>
              {displayTasks.length > 0 ? (
                <span className="text-xs text-[var(--muted)]">
                  {displayTasks.filter((t) => t.done).length}/
                  {displayTasks.length} done
                  {(() => {
                    const mins = displayTasks
                      .filter((t) => t.done && typeof t.minutesSpent === 'number')
                      .reduce((s, t) => s + (t.minutesSpent ?? 0), 0)
                    return mins > 0 ? ` · ${mins} min` : ''
                  })()}
                </span>
              ) : null}
            </div>
            <Link
              to="/app/entries/new"
              search={{ date: today }}
              className="text-xs font-medium text-[var(--primary)] no-underline"
            >
              Plan →
            </Link>
          </div>

          {displayTasks.length === 0 ? (
            <p className="mt-3 text-sm text-[var(--muted)]">
              No tasks planned yet. Open{' '}
              <Link
                to="/app/entries/new"
                search={{ date: today }}
                className="font-medium text-[var(--primary)] no-underline"
              >
                Plan
              </Link>{' '}
              to add what you want to get done today.
            </p>
          ) : (
            (() => {
              // Group today's tasks by goal, then ungrouped; preserve order.
              const groups: { label: string; goalId: string | null }[] = []
              const grouped: Record<string, typeof displayTasks> = {}
              for (const t of displayTasks) {
                const key = t.goalId ?? ''
                if (!(key in grouped)) {
                  groups.push({
                    label: key
                      ? displayGoals.find((g) => g.id === key)?.title ?? 'Goal'
                      : 'Other',
                    goalId: t.goalId,
                  })
                  grouped[key] = []
                }
                grouped[key]!.push(t)
              }
              return (
                <div className="mt-3 space-y-4">
                  {groups.map((grp) => (
                    <div key={grp.goalId ?? 'other'}>
                      {grp.goalId ? (
                        <div className="mb-1 flex items-center justify-between">
                          <Link
                            to="/app/goals/$goalId"
                            params={{ goalId: grp.goalId }}
                            className="text-xs font-semibold text-[var(--primary)] no-underline"
                          >
                            {grp.label}
                          </Link>
                          <span className="text-[0.7rem] text-[var(--muted)]">
                            ends{' '}
                            {displayGoals.find((g) => g.id === grp.goalId)?.deadline}
                          </span>
                        </div>
                      ) : (
                        <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">
                          {grp.label}
                        </div>
                      )}
                      <ul className="space-y-1">
                        {grouped[grp.goalId ?? '']!.map((t) => (
                          <li
                            key={t.id}
                            className="flex items-center gap-2 rounded-[10px] px-2 py-2 hover:bg-[var(--surface)]"
                          >
                            <input
                              type="checkbox"
                              checked={t.done}
                              onChange={async () => {
                                const updated = await toggleTask({ data: { id: t.id } })
                                taskUpsert(updated)
                                await router.invalidate()
                              }}
                              className="h-4 w-4 cursor-pointer rounded border-[var(--line)] text-[var(--primary)] focus:ring-[var(--ring)]"
                              aria-label={`Mark ${t.title} as ${t.done ? 'not done' : 'done'}`}
                            />
                            <span
                              className={`flex-1 text-sm ${t.done ? 'text-[var(--muted)] line-through' : 'text-[var(--ink)]'}`}
                            >
                              {t.title}
                            </span>
                            {t.done ? (
                              <TaskMinutesInput
                                taskId={t.id}
                                minutes={t.minutesSpent}
                                onCommit={async (id, minutes) => {
                                  const updated = await updateTask({
                                    data: { id, minutesSpent: minutes },
                                  })
                                  taskUpsert(updated)
                                }}
                              />
                            ) : null}
                            <GoalTagSelect
                              goals={displayGoals}
                              value={t.goalId}
                              onChange={async (goalId) => {
                                const updated = await updateTask({
                                  data: { id: t.id, goalId },
                                })
                                taskUpsert(updated)
                              }}
                            />
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )
            })()
          )}
        </div>
      </section>

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
