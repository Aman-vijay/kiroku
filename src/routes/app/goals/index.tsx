import { useEffect, useState } from 'react'
import { Link, createFileRoute, useRouter } from '@tanstack/react-router'
import { GoalForm } from '#/features/goals'
import { formatDisplayDate } from '#/features/entries'
import { listGoals } from '#/server/goal'
import { createGoal } from '#/server/goal'
import { useGoalsStore } from '#/stores'

export const Route = createFileRoute('/app/goals/')({
  loader: async () => {
    const goals = await listGoals()
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

  useEffect(() => {
    goalsHydrate(loaderGoals)
    setHydrated(true)
  }, [loaderGoals, goalsHydrate])

  const displayGoals = hydrated ? storeGoals : loaderGoals

  return (
    <main className="page-wrap px-4 py-12 sm:py-14">
      <div className="fade-in mx-auto max-w-4xl">
        <p className="mb-1 text-sm font-medium text-[var(--muted)]">Goals</p>
        <h1 className="mb-6 text-2xl font-semibold tracking-tight text-[var(--ink)]">
          Your goals
        </h1>

        <div className="panel p-5 sm:p-6 mb-8">
          <h2 className="mb-4 text-sm font-semibold text-[var(--ink)]">
            Create a new goal
          </h2>
          <GoalForm
            submitLabel="Create goal"
            onSubmit={async (values) => {
              const created = await createGoal({ data: values })
              goalsUpsert(created)
              await router.invalidate()
            }}
          />
        </div>

        {displayGoals.length === 0 ? (
          <p className="text-sm text-[var(--muted)]">
            No goals yet. Create one above — a goal links your daily tasks
            toward a deadline (up to 4 weeks out).
          </p>
        ) : (
          <ul className="space-y-3">
            {displayGoals.map((g) => {
              const isActive = g.status === 'active'
              return (
                <li key={g.id}>
                  <Link
                    to="/app/goals/$goalId"
                    params={{ goalId: g.id }}
                    className="panel block p-5 no-underline transition-colors hover:bg-[var(--surface)]"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="text-base font-semibold text-[var(--ink)]">
                          {g.title}
                        </h3>
                        {g.description ? (
                          <p className="mt-1 text-sm text-[var(--muted)]">
                            {g.description}
                          </p>
                        ) : null}
                        <p className="mt-2 text-xs text-[var(--muted)]">
                          {formatDisplayDate(g.startDate)} → {formatDisplayDate(g.deadline)}
                        </p>
                      </div>
                      <span
                        className="shrink-0 rounded-full px-3 py-1 text-xs font-medium"
                        style={{
                          background: isActive
                            ? 'color-mix(in oklab, var(--success) 14%, var(--bg))'
                            : 'var(--surface)',
                          color: isActive ? 'var(--success)' : 'var(--muted)',
                        }}
                      >
                        {g.status}
                      </span>
                    </div>
                  </Link>
                </li>
              )
            })}
          </ul>
        )}

        <p className="mt-6 text-sm">
          <Link
            to="/app"
            className="font-medium text-[var(--primary)] no-underline"
          >
            ← Back to dashboard
          </Link>
        </p>
      </div>
    </main>
  )
}