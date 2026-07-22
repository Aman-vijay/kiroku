import type { GoalDTO } from '#/server/goal'

type GoalTagSelectProps = {
  goals: GoalDTO[]
  value: string | null
  onChange: (goalId: string | null) => void
  disabled?: boolean
  className?: string
}

/** Native select for tagging a task to an active goal. */
export function GoalTagSelect({
  goals,
  value,
  onChange,
  disabled,
  className,
}: GoalTagSelectProps) {
  const active = goals.filter((g) => g.status === 'active')
  // No active goals → goals are purely optional, don't render a control.
  if (active.length === 0) return null

  return (
    <select
      value={value ?? ''}
      disabled={disabled}
      onChange={(e) => onChange(e.target.value === '' ? null : e.target.value)}
      aria-label="Tag to goal"
      className={`rounded-[8px] border border-[var(--line)] bg-[var(--bg)] px-2 py-1 text-xs text-[var(--ink)] focus:border-[var(--ring)] focus:outline-none disabled:opacity-50 ${className ?? ''}`}
    >
      <option value="">No goal</option>
      {active.map((g) => (
        <option key={g.id} value={g.id}>
          {g.title} · ends {g.deadline}
        </option>
      ))}
    </select>
  )
}