import { useEffect, useState } from 'react'
import { Link, createFileRoute, useRouter } from '@tanstack/react-router'
import { GoalForm, ProgressRing, StatusBadge } from '#/features/goals'
import { formatDisplayDate, daysUntilDeadline } from '#/features/entries'
import { computeGoalProgress } from '#/features/goals/lib/progress'
import { createGoal, listGoalsWithStats } from '#/server/goal'
import { useGoalsStore } from '#/stores'

export const Route = createFileRoute('/app/goals/')({
  loader: async () => {
    const goals = await listGoalsWithStats()
    return { goals }
  },
  component: GoalsPage,
})

function GoalsPage() {
  const router = useRouter()
  const { goals: loaderGoals } = Route.useLoaderData()
  const goalsHydrate = useGoalsStore((s) => s.hydrate)
  const goalsUpsert = useGoalsStore((s) => s.upsert)
  const storeGoals = useGoalsStore((s) => s.goals)
  const [hydrated, setHydrated] = useState(false)
  // Stats live on loader data; keep a local map for progress after create
  const [stats, setStats] = useState(
    () =>
      new Map(
        loaderGoals.map((g) => [
          g.id,
          { totalTasks: g.totalTasks, doneCount: g.doneCount },
        ]),
      ),
  )

  useEffect(() => {
    goalsHydrate(loaderGoals)
    setStats(
      new Map(
        loaderGoals.map((g) => [
          g.id,
          { totalTasks: g.totalTasks, doneCount: g.doneCount },
        ]),
      ),
    )
    setHydrated(true)
  }, [loaderGoals, goalsHydrate])

  const displayGoals = hydrated
    ? storeGoals.map((g) => {
        const s = stats.get(g.id)
        return {
          ...g,
          totalTasks: s?.totalTasks ?? 0,
          doneCount: s?.doneCount ?? 0,
        }
      })
    : loaderGoals

  return (
    <main className="page-wrap px-4 py-12 sm:py-14">
      <div className="fade-in mx-auto max-w-4xl">
        <div className="mb-2 flex items-center justify-between gap-4">
          <div>
            <p className="mb-1 text-sm font-medium text-[var(--muted)]">Goals</p>
            <h1 className="text-2xl font-semibold tracking-tight text-[var(--ink)]">
              Your goals
            </h1>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Link
              to="/app/progress"
              className="font-medium text-[var(--primary)] no-underline"
            >
              Progress
            </Link>
            <Link to="/app" className="font-medium text-[var(--primary)] no-underline">
              ← Dashboard
            </Link>
          </div>
        </div>
        <p className="mb-6 max-w-xl text-sm text-[var(--muted)]">
          Optional — tag tasks to a goal to track them under one deadline.
          Logging and planning never require a goal.
        </p>

        <div className="panel mb-8 p-5 sm:p-6">
          <h2 className="mb-4 text-sm font-semibold text-[var(--ink)]">
            Create a new goal
          </h2>
          <GoalForm
            submitLabel="Create goal"
            onSubmit={async (values) => {
              const created = await createGoal({ data: values })
              goalsUpsert(created)
              setStats((prev) => {
                const next = new Map(prev)
                next.set(created.id, { totalTasks: 0, doneCount: 0 })
                return next
              })
              await router.invalidate()
            }}
          />
        </div>

        {displayGoals.length === 0 ? (
          <div
            className="panel-muted p-6 text-center"
            style={{ background: 'var(--surface)' }}
          >
            <p className="text-sm text-[var(--muted)]">
              No goals yet — that&apos;s fine. Create one above when you have a
              deadline (like an interview or launch) and want to thread daily
              tasks under it.
            </p>
          </div>
        ) : (
          <ul className="space-y-3">
            {displayGoals.map((g) => {
              const isActive = g.status === 'active'
              const remaining = isActive ? daysUntilDeadline(g.deadline) : null
              const progress = computeGoalProgress({
                status: g.status,
                startDate: g.startDate,
                deadline: g.deadline,
                totalTasks: g.totalTasks,
                doneCount: g.doneCount,
              })
              return (
                <li key={g.id}>
                  <Link
                    to="/app/goals/$goalId"
                    params={{ goalId: g.id }}
                    className="panel flex items-center gap-4 p-5 no-underline transition-colors hover:bg-[var(--surface)]"
                  >
                    <ProgressRing
                      percent={progress.percent}
                      size={56}
                      strokeWidth={5}
                      label={`${g.title}: ${progress.percent}%`}
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-base font-semibold text-[var(--ink)]">
                          {g.title}
                        </h3>
                        <StatusBadge status={progress.paceStatus} />
                      </div>
                      {g.description ? (
                        <p className="mt-1 line-clamp-2 text-sm text-[var(--muted)]">
                          {g.description}
                        </p>
                      ) : null}
                      <p className="mt-2 text-xs text-[var(--muted)]">
                        {formatDisplayDate(g.startDate)} →{' '}
                        {formatDisplayDate(g.deadline)}
                        {g.totalTasks > 0
                          ? ` · ${g.doneCount}/${g.totalTasks} tasks`
                          : null}
                        {remaining != null
                          ? remaining < 0
                            ? ' · overdue'
                            : remaining === 0
                              ? ' · ends today'
                              : ` · ${remaining}d left`
                          : null}
                      </p>
                    </div>
                  </Link>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </main>
  )
}
