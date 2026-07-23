import { daysBetween, todayLocalISO } from '#/features/entries/lib/dates'

/**
 * Gamified pace status for a goal.
 * Target = total tasks ever created under the goal (derived; no targetTasks column).
 */
export type GoalPaceStatus = 'on_track' | 'behind' | 'done' | 'overdue' | 'abandoned'

export type GoalProgressInput = {
  /** DB status: active | done | abandoned */
  status: string
  startDate: string
  deadline: string
  /** Tasks ever created under this goal. */
  totalTasks: number
  doneCount: number
  /** YYYY-MM-DD; defaults to today. */
  today?: string
}

export type GoalProgress = {
  target: number
  doneCount: number
  percent: number
  paceStatus: GoalPaceStatus
  requiredRate: number
  actualRate: number
  daysTotal: number
  daysElapsed: number
  daysRemaining: number
}

/**
 * Compute % complete and on-track / behind / done / overdue from task counts.
 *
 * - target = totalTasksCreatedUnderGoal (inflates as you add tasks — intentional for v1)
 * - requiredRate = target / daysBetween(start, deadline)  (clamped ≥ 1 day)
 * - actualRate = doneCount / max(1, daysBetween(start, today))
 * - Done if status is done OR doneCount >= target (and target > 0)
 * - Overdue if today > deadline && not done
 * - On track if actualRate >= requiredRate, else Behind
 */
export function computeGoalProgress(input: GoalProgressInput): GoalProgress {
  const today = input.today ?? todayLocalISO()
  const target = Math.max(0, input.totalTasks)
  const doneCount = Math.max(0, Math.min(input.doneCount, target || input.doneCount))

  const span = daysBetween(input.startDate, input.deadline)
  const daysTotal = Math.max(1, span)
  const elapsedRaw = daysBetween(input.startDate, today)
  const daysElapsed = Math.max(1, elapsedRaw)
  const daysRemaining = daysBetween(today, input.deadline)

  const requiredRate = target / daysTotal
  const actualRate = doneCount / daysElapsed

  const percent =
    target > 0 ? Math.min(100, Math.round((doneCount / target) * 100)) : 0

  let paceStatus: GoalPaceStatus

  if (input.status === 'abandoned') {
    paceStatus = 'abandoned'
  } else if (input.status === 'done' || (target > 0 && doneCount >= target)) {
    paceStatus = 'done'
  } else if (today > input.deadline) {
    paceStatus = 'overdue'
  } else if (target === 0) {
    // No tasks yet — not behind until work is planned.
    paceStatus = 'on_track'
  } else if (actualRate + 1e-9 >= requiredRate) {
    paceStatus = 'on_track'
  } else {
    paceStatus = 'behind'
  }

  return {
    target,
    doneCount,
    percent,
    paceStatus,
    requiredRate,
    actualRate,
    daysTotal,
    daysElapsed,
    daysRemaining,
  }
}

export const PACE_STATUS_LABEL: Record<GoalPaceStatus, string> = {
  on_track: 'On track',
  behind: 'Behind',
  done: 'Done',
  overdue: 'Overdue',
  abandoned: 'Abandoned',
}

/** Build cumulative remaining series for a burndown chart. */
export function buildBurndownSeries(opts: {
  startDate: string
  deadline: string
  target: number
  /** Done tasks with their entryDate (YYYY-MM-DD). */
  doneDates: string[]
  today?: string
}): {
  ideal: { day: number; remaining: number }[]
  actual: { day: number; remaining: number }[]
} {
  const today = opts.today ?? todayLocalISO()
  const daysTotal = Math.max(1, daysBetween(opts.startDate, opts.deadline))
  const endDay = Math.min(
    daysTotal,
    Math.max(0, daysBetween(opts.startDate, today)),
  )

  const ideal: { day: number; remaining: number }[] = []
  for (let d = 0; d <= daysTotal; d++) {
    const remaining =
      opts.target <= 0
        ? 0
        : Math.max(0, opts.target - (opts.target * d) / daysTotal)
    ideal.push({ day: d, remaining })
  }

  // Count completions per day offset from start
  const byDay = new Map<number, number>()
  for (const date of opts.doneDates) {
    const offset = daysBetween(opts.startDate, date)
    if (offset < 0) continue
    byDay.set(offset, (byDay.get(offset) ?? 0) + 1)
  }

  const actual: { day: number; remaining: number }[] = []
  let doneSoFar = 0
  for (let d = 0; d <= endDay; d++) {
    doneSoFar += byDay.get(d) ?? 0
    actual.push({
      day: d,
      remaining: Math.max(0, opts.target - doneSoFar),
    })
  }

  return { ideal, actual }
}
