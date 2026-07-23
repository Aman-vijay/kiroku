import {
  PACE_STATUS_LABEL,
  type GoalPaceStatus,
} from '../lib/progress'

type StatusBadgeProps = {
  status: GoalPaceStatus
  className?: string
}

const STYLES: Record<
  GoalPaceStatus,
  { bg: string; color: string }
> = {
  on_track: {
    bg: 'color-mix(in oklab, var(--success) 14%, var(--bg))',
    color: 'var(--success)',
  },
  behind: {
    bg: 'color-mix(in oklab, var(--accent) 16%, var(--bg))',
    color: 'var(--accent)',
  },
  done: {
    bg: 'color-mix(in oklab, var(--primary) 14%, var(--bg))',
    color: 'var(--primary)',
  },
  overdue: {
    bg: 'var(--danger-bg)',
    color: 'var(--danger)',
  },
  abandoned: {
    bg: 'var(--surface)',
    color: 'var(--muted)',
  },
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const style = STYLES[status]
  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-medium ${className ?? ''}`}
      style={{ background: style.bg, color: style.color }}
    >
      {PACE_STATUS_LABEL[status]}
    </span>
  )
}
