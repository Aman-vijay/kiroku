import { useEffect, useState } from 'react'
import {
  Link,
  createFileRoute,
  notFound,
  useRouter,
} from '@tanstack/react-router'
import { GoalForm } from '#/features/goals'
import { formatDisplayDate } from '#/features/entries'
import { deleteGoal, getGoalById, updateGoal } from '#/server/goal'
import { listTasksByGoal } from '#/server/task'
import type { GoalDTO } from '#/server/goal'
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
  const [tasks, setTasks] = useState<TaskDTO[]>(loaderTasks)

  // Group tasks by entryDate descending
  const byDate = tasks.reduce<Record<string, TaskDTO[]>>((acc, t) => {
    ;(acc[t.entryDate] ??= []).push(t)
    return acc
  }, {})
  const dates = Object.keys(byDate).sort((a, b) => (a < b ? 1 : a > b ? -1 : 0))

  const doneCount = tasks.filter((t) => t.done).length
  const total = tasks.length

  return (
    <main className="page-wrap px-4 py-12 sm:py-14">
      <div className="fade-in mx-auto max-w-4xl">
        <p className="mb-1 text-sm font-medium text-[var(--muted)]">Goal</p>
        <h1 className="mb-2 text-2xl font-semibold tracking-tight text-[var(--ink)]">
          {loaderGoal.title}
        </h1>
        <p className="mb-1 text-sm text-[var(--muted)]">
          {formatDisplayDate(loaderGoal.startDate)} → {formatDisplayDate(loaderGoal.deadline)}
        </p>
        {loaderGoal.description ? (
          <p className="mb-2 text-sm text-[var(--muted)]">{loaderGoal.description}</p>
        ) : null}
        {total > 0 ? (
          <p className="mb-6 text-xs text-[var(--muted)]">
            {doneCount}/{total} tasks done
          </p>
        ) : (
          <p className="mb-6 text-xs text-[var(--muted)]">
            Tag tasks to this goal from the dashboard to track them here.
          </p>
        )}

        <div className="panel p-5 sm:p-6 mb-8">
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