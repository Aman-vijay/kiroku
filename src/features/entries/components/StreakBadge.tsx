import { IconFlame } from '@tabler/icons-react'

type StreakBadgeProps = {
  streak: number
  compact?: boolean
}

export function StreakBadge({ streak, compact }: StreakBadgeProps) {
  if (compact) {
    if (streak === 0) return null
    return (
      <span
        className="inline-flex items-center gap-1.5 rounded-full border border-[var(--line)] bg-[var(--surface)] px-3 py-1.5 text-sm font-medium text-[var(--ink)]"
        title="Consecutive days with an entry"
      >
        <IconFlame size={15} stroke={2} className="text-[var(--accent)]" aria-hidden />
        <span className="tabular-nums">{streak}</span>
        <span className="text-xs text-[var(--muted)]">
          {streak === 1 ? 'day' : 'days'}
        </span>
      </span>
    )
  }

  return (
    <article className="panel-muted p-5">
      <h2 className="mb-1 text-sm font-semibold text-[var(--ink)]">Streak</h2>
      <p className="m-0 text-3xl font-semibold tabular-nums tracking-tight text-[var(--ink)]">
        {streak}
      </p>
      <p className="mt-1 text-sm text-[var(--muted)]">
        {streak === 1
          ? 'day with an entry'
          : 'consecutive days with an entry'}
      </p>
    </article>
  )
}
