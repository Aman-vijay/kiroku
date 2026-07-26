import { useState } from 'react'
import { Link, createFileRoute } from '@tanstack/react-router'
import { GoalMiniCard, Heatmap } from '#/features/goals'
import { addDaysISO, todayLocalISO } from '#/features/entries/lib/dates'
import { HEATMAP_WEEKS } from '#/features/goals/lib/heatmap'
import type { HeatmapMetric } from '#/features/goals/lib/heatmap'
import { listGoalsWithStats } from '#/server/goal'
import { getDailyAggregates } from '#/server/task'

export const Route = createFileRoute('/app/progress')({
  loader: async () => {
    const today = todayLocalISO()
    // ~52 weeks + a few days of pad so the grid can align to week boundaries
    const from = addDaysISO(today, -(HEATMAP_WEEKS * 7 + 6))
    const [aggregates, goals] = await Promise.all([
      getDailyAggregates({ data: { from, to: today } }),
      listGoalsWithStats(),
    ])
    return { aggregates, goals, today }
  },
  component: ProgressPage,
})

function ProgressPage() {
  const { aggregates, goals, today } = Route.useLoaderData()
  const [metric, setMetric] = useState<HeatmapMetric>('minutes')

  const activeGoals = goals.filter((g) => g.status === 'active')
  const otherGoals = goals.filter((g) => g.status !== 'active')

  return (
    <main className="page-wrap px-4 py-12 sm:py-14">
      <div className="fade-in mx-auto max-w-4xl">
        <div className="mb-2 flex items-center justify-between gap-4">
          <div>
            <p className="mb-1 text-sm font-medium text-[var(--muted)]">
              Progress
            </p>
            <h1 className="text-2xl font-semibold tracking-tight text-[var(--ink)]">
              Year at a glance
            </h1>
          </div>
          <Link
            to="/app"
            className="text-sm font-medium text-[var(--primary)] no-underline"
          >
            ← Dashboard
          </Link>
        </div>
        <p className="mb-6 max-w-xl text-sm text-[var(--muted)]">
          Last {HEATMAP_WEEKS} weeks of daily work — minutes logged and tasks
          finished. Toggle the metric to recolor the grid.
        </p>

        <section className="panel mb-10 p-5 sm:p-6" aria-label="Activity heatmap">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-sm font-semibold text-[var(--ink)]">
              Activity
            </h2>
            <div className="segmented" role="group" aria-label="Heatmap metric">
              <button
                type="button"
                className="segmented-item"
                data-active={metric === 'minutes' ? 'true' : 'false'}
                onClick={() => setMetric('minutes')}
              >
                Minutes
              </button>
              <button
                type="button"
                className="segmented-item"
                data-active={metric === 'tasks' ? 'true' : 'false'}
                onClick={() => setMetric('tasks')}
              >
                Tasks done
              </button>
            </div>
          </div>
          <Heatmap aggregates={aggregates} metric={metric} endDate={today} />
        </section>

        <section aria-label="Goals progress">
          <div className="mb-3 flex items-center justify-between gap-3">
            <h2 className="text-sm font-semibold text-[var(--ink)]">Goals</h2>
            <Link
              to="/app/goals"
              className="text-xs font-medium text-[var(--primary)] no-underline"
            >
              Manage goals
            </Link>
          </div>

          {goals.length === 0 ? (
            <div
              className="panel-muted p-6 text-center"
              style={{ background: 'var(--surface)' }}
            >
              <p className="text-sm text-[var(--muted)]">
                No goals yet.{' '}
                <Link to="/app/goals" className="font-medium">
                  Create one
                </Link>{' '}
                to see mini progress cards here.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {activeGoals.map((g) => (
                <GoalMiniCard key={g.id} goal={g} />
              ))}
              {otherGoals.length > 0 ? (
                <>
                  <p className="pt-2 text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">
                    Closed
                  </p>
                  {otherGoals.map((g) => (
                    <GoalMiniCard key={g.id} goal={g} />
                  ))}
                </>
              ) : null}
            </div>
          )}
        </section>
      </div>
    </main>
  )
}
