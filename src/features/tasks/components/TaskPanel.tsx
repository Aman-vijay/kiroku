import type { TaskDTO } from '#/server/task'
import { TaskList } from './TaskList'

type TaskPanelProps = {
  tasks: TaskDTO[]
  onAdd: (title: string) => void | Promise<void>
  onToggle: (id: string) => void | Promise<void>
  onDelete: (id: string) => void | Promise<void>
  onMove: (id: string, direction: -1 | 1) => void | Promise<void>
  /** Optional date label shown beside "Plan your day". */
  dateLabel?: string
  defaultOpen?: boolean
}

/**
 * Optional, collapsible "Plan your day" section.
 * Defaults to open only when the user already has tasks for the day,
 * so the free-text log stays the primary, independent flow.
 */
export function TaskPanel({
  tasks,
  onAdd,
  onToggle,
  onDelete,
  onMove,
  dateLabel,
  defaultOpen,
}: TaskPanelProps) {
  const open = defaultOpen ?? tasks.length > 0
  const doneCount = tasks.filter((t) => t.done).length

  return (
    <details
      className="panel p-5 sm:p-6"
      open={open}
      style={{
        background: 'color-mix(in oklab, var(--primary) 4%, var(--bg))',
        borderColor: 'color-mix(in oklab, var(--primary) 22%, var(--line))',
      }}
    >
      <summary className="flex cursor-pointer list-none items-center justify-between gap-2">
        <span className="flex items-center gap-2 text-sm font-semibold text-[var(--ink)]">
          <span
            aria-hidden
            className="inline-block h-1.5 w-1.5 rounded-full"
            style={{ background: 'var(--accent)' }}
          />
          Plan your day
          {dateLabel ? (
            <span className="font-normal text-[var(--muted)]">· {dateLabel}</span>
          ) : (
            <span className="font-normal text-[var(--muted)]">· optional</span>
          )}
        </span>
        {tasks.length > 0 ? (
          <span className="text-xs text-[var(--muted)]">
            {doneCount}/{tasks.length} done
          </span>
        ) : null}
      </summary>
      <div className="mt-4">
        <TaskList
          tasks={tasks}
          onAdd={onAdd}
          onToggle={onToggle}
          onDelete={onDelete}
          onMove={onMove}
        />
      </div>
    </details>
  )
}