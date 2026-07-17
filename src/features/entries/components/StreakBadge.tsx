type StreakBadgeProps = {
  streak: number
  compact?: boolean
}

export function StreakBadge({ streak, compact }: StreakBadgeProps) {
  if (compact) {
    return (
      <div
        className="inline-flex items-center gap-2 rounded-[10px] border border-[var(--line)] bg-[var(--surface)] px-3 py-2"
        title="Consecutive days with an entry"
      >
        <span className="text-xs font-medium text-[var(--muted)]">Streak</span>
        <span className="text-base font-semibold tabular-nums text-[var(--ink)]">
          {streak}
        </span>
      </div>
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
