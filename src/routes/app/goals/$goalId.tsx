import { useState } from 'react'
import {
  Link,
  createFileRoute,
  notFound,
  useRouter,
} from '@tanstack/react-router'
import {
  BurndownChart,
  GoalForm,
  ProgressRing,
  StatusBadge,
} from '#/features/goals'
import { computeGoalProgress } from '#/features/goals/lib/progress'
import { computeStreak, formatDisplayDate } from '#/features/entries'
import { deleteGoal, getGoalById, updateGoal } from '#/server/goal'
import { listTasksByGoal } from '#/server/task'
import type { TaskDTO } from '#/server/task'
import { useGoalsStore } from '#/stores'

export const Route = createFileRoute('/app/goals/$goalId')({
  loader: async ({ params }) => {
    const goal = await getGoalById({ data: { id: params.goalId } })
    if (!goal) throw notFound()
    const tasks = await listTasksByGoal({ data: { goalId: params.goalId } })
    return { goal, tasks }
  },
  component: GoalPage,
})

function GoalPage() {
  const router = useRouter()
  const { goal: loaderGoal, tasks: loaderTasks } = Route.useLoaderData()
  const goalsUpsert = useGoalsStore((s) => s.upsert)
  const goalsRemove = useGoalsStore((s) => s.remove)
  const [tasks] = useState<TaskDTO[]>(loaderTasks)
  const [statusPending, setStatusPending] = useState(false)
  const [statusError, setStatusError] = useState<string | null>(null)

  // Group tasks by entryDate descending
  const byDate = tasks.reduce<Record<string, TaskDTO[]>>((acc, t) => {
    ;(acc[t.entryDate] ??= []).push(t)
    return acc
  }, {})
  const dates = Object.keys(byDate).sort((a, b) => (a < b ? 1 : a > b ? -1 : 0))

  const doneCount = tasks.filter((t) => t.done).length
  const total = tasks.length
  const progress = computeGoalProgress({
    status: loaderGoal.status,
    startDate: loaderGoal.startDate,
    deadline: loaderGoal.deadline,
    totalTasks: total,
    doneCount,
  })

  const doneDates = tasks.filter((t) => t.done).map((t) => t.entryDate)
  const goalStreak = computeStreak(doneDates)

  const isActive = loaderGoal.status === 'active'

  async function setStatus(next: 'done' | 'abandoned' | 'active') {
    setStatusError(null)
    setStatusPending(true)
    try {
      const updated = await updateGoal({
        data: { id: loaderGoal.id, status: next },
      })
      goalsUpsert(updated)
      await router.invalidate()
    } catch (err) {
      setStatusError(err instanceof Error ? err.message : 'Could not update status')
    } finally {
      setStatusPending(false)
    }
  }

  return (
    <main className="page-wrap px-4 py-12 sm:py-14">
      <div className="fade-in mx-auto max-w-4xl">
        <p className="mb-1 text-sm font-medium text-[var(--muted)]">Goal</p>

        <div className="mb-6 flex flex-wrap items-start gap-5">
          <ProgressRing
            percent={progress.percent}
            size={88}
            strokeWidth={7}
            label={`${loaderGoal.title}: ${progress.percent}% complete`}
          />
          <div className="min-w-0 flex-1">
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-semibold tracking-tight text-[var(--ink)]">
                {loaderGoal.title}
              </h1>
              <StatusBadge status={progress.paceStatus} />
            </div>
            <p className="mb-1 text-sm text-[var(--muted)]">
              {formatDisplayDate(loaderGoal.startDate)} →{' '}
              {formatDisplayDate(loaderGoal.deadline)}
            </p>
            {loaderGoal.description ? (
              <p className="mb-2 text-sm text-[var(--muted)]">
                {loaderGoal.description}
              </p>
            ) : null}
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-[var(--muted)]">
              <span>
                {doneCount}/{total} tasks done
              </span>
              {goalStreak > 0 ? (
                <span>
                  {goalStreak}-day streak on this goal
                </span>
              ) : (
                <span>No active streak on this goal</span>
              )}
              {progress.daysRemaining >= 0 && isActive ? (
                <span>
                  {progress.daysRemaining === 0
                    ? 'Ends today'
                    : `${progress.daysRemaining}d left`}
                </span>
              ) : null}
            </div>
          </div>
        </div>

        {isActive || loaderGoal.status === 'done' || loaderGoal.status === 'abandoned' ? (
          <div className="mb-6 flex flex-wrap items-center gap-3">
            {isActive ? (
              <>
                <button
                  type="button"
                  className="btn btn-primary"
                  disabled={statusPending}
                  onClick={() => void setStatus('done')}
                >
                  {statusPending ? 'Updating…' : 'Mark done'}
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  disabled={statusPending}
                  onClick={() => {
                    if (
                      window.confirm(
                        'Abandon this goal? You can still view it later.',
                      )
                    ) {
                      void setStatus('abandoned')
                    }
                  }}
                >
                  Abandon
                </button>
              </>
            ) : (
              <button
                type="button"
                className="btn btn-secondary"
                disabled={statusPending}
                onClick={() => void setStatus('active')}
              >
                Reopen as active
              </button>
            )}
            {statusError ? (
              <p role="alert" className="text-sm text-[var(--danger)]">
                {statusError}
              </p>
            ) : null}
          </div>
        ) : null}

        {total > 0 ? (
          <div className="panel mb-8 p-5 sm:p-6">
            <h2 className="mb-1 text-sm font-semibold text-[var(--ink)]">
              Burndown
            </h2>
            <p className="mb-3 text-xs text-[var(--muted)]">
              Tasks remaining vs days elapsed (dashed = ideal pace).
            </p>
            <BurndownChart
              startDate={loaderGoal.startDate}
              deadline={loaderGoal.deadline}
              target={total}
              doneDates={doneDates}
              width={320}
              height={130}
            />
          </div>
        ) : (
          <p className="mb-6 text-xs text-[var(--muted)]">
            Tag tasks to this goal from the dashboard to track progress here.
          </p>
        )}

        <div className="panel mb-8 p-5 sm:p-6">
          <h2 className="mb-4 text-sm font-semibold text-[var(--ink)]">
            Edit goal
          </h2>
          <GoalForm
            initial={{
              id: loaderGoal.id,
              title: loaderGoal.title,
              description: loaderGoal.description,
              startDate: loaderGoal.startDate,
              deadline: loaderGoal.deadline,
            }}
            submitLabel="Save changes"
            onSubmit={async (values) => {
              const updated = await updateGoal({
                data: {
                  id: loaderGoal.id,
                  title: values.title,
                  description: values.description,
                  status: loaderGoal.status as 'active' | 'done' | 'abandoned',
                },
              })
              goalsUpsert(updated)
              await router.invalidate()
            }}
            onDelete={async () => {
              await deleteGoal({ data: { id: loaderGoal.id } })
              goalsRemove(loaderGoal.id)
              await router.invalidate()
            }}
          />
        </div>

        {dates.length > 0 ? (
          <section aria-label="Tasks for this goal">
            <h2 className="mb-3 text-sm font-semibold text-[var(--ink)]">
              Tasks
            </h2>
            <div className="space-y-5">
              {dates.map((date) => (
                <div key={date}>
                  <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">
                    {formatDisplayDate(date)}
                  </h3>
                  <ul className="panel divide-y divide-[var(--line)]">
                    {byDate[date]!.map((t) => (
                      <li
                        key={t.id}
                        className="flex items-center gap-3 px-4 py-3"
                      >
                        <span
                          aria-hidden
                          className="inline-block h-3 w-3 rounded-full"
                          style={{
                            background: t.done ? 'var(--success)' : 'var(--line)',
                          }}
                        />
                        <span
                          className={`flex-1 text-sm ${t.done ? 'text-[var(--muted)] line-through' : 'text-[var(--ink)]'}`}
                        >
                          {t.title}
                        </span>
                        {t.minutesSpent != null ? (
                          <span className="text-xs text-[var(--muted)]">
                            {t.minutesSpent} min
                          </span>
                        ) : null}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        ) : null}

        <p className="mt-6 text-sm">
          <Link
            to="/app/goals"
            className="font-medium text-[var(--primary)] no-underline"
          >
            ← Back to goals
          </Link>
        </p>
      </div>
    </main>
  )
}
