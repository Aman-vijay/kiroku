import { Link } from '@tanstack/react-router'
import { formatDisplayDate } from '#/features/entries'
import { ProgressRing } from './ProgressRing'
import { StatusBadge } from './StatusBadge'
import {
  computeGoalProgress,
  type GoalPaceStatus,
} from '../lib/progress'

export type GoalMiniCardData = {
  id: string
  title: string
  startDate: string
  deadline: string
  status: string
  totalTasks: number
  doneCount: number
}

type GoalMiniCardProps = {
  goal: GoalMiniCardData
}

export function GoalMiniCard({ goal }: GoalMiniCardProps) {
  const progress = computeGoalProgress({
    status: goal.status,
    startDate: goal.startDate,
    deadline: goal.deadline,
    totalTasks: goal.totalTasks,
    doneCount: goal.doneCount,
  })

  return (
    <Link
      to="/app/goals/$goalId"
      params={{ goalId: goal.id }}
      className="panel flex items-center gap-4 p-4 no-underline transition-colors hover:bg-[var(--surface)]"
    >
      <ProgressRing
        percent={progress.percent}
        size={56}
        strokeWidth={5}
        label={`${goal.title}: ${progress.percent}%`}
      />
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="truncate text-sm font-semibold text-[var(--ink)]">
            {goal.title}
          </h3>
          <StatusBadge status={progress.paceStatus as GoalPaceStatus} />
        </div>
        <p className="mt-1 text-xs text-[var(--muted)]">
          {progress.doneCount}/{progress.target || 0} tasks ·{' '}
          {formatDisplayDate(goal.deadline)}
        </p>
      </div>
    </Link>
  )
}
