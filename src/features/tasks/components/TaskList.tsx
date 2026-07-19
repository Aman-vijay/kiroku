import { useState } from 'react'
import type { TaskDTO } from '#/server/task'

export type TaskInputProps = {
  onSubmit: (title: string) => void | Promise<void>
  disabled?: boolean
}

export function TaskInput({ onSubmit, disabled }: TaskInputProps) {
  const [title, setTitle] = useState('')
  const [pending, setPending] = useState(false)

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    const trimmed = title.trim()
    if (!trimmed || pending || disabled) return
    setPending(true)
    try {
      await onSubmit(trimmed)
      setTitle('')
    } finally {
      setPending(false)
    }
  }

  return (
    <form onSubmit={(e) => void handleSubmit(e)} className="flex gap-2">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Add a task for today"
        className="field-input flex-1"
        disabled={disabled || pending}
        maxLength={200}
        aria-label="New task"
      />
      <button
        type="submit"
        disabled={disabled || pending || !title.trim()}
        className="btn btn-secondary shrink-0"
      >
        {pending ? 'Adding…' : 'Add'}
      </button>
    </form>
  )
}

export type TaskItemProps = {
  task: TaskDTO
  onToggle: (id: string) => void | Promise<void>
  onDelete: (id: string) => void | Promise<void>
  onMove: (id: string, direction: -1 | 1) => void | Promise<void>
  disabled?: boolean
}

export function TaskItem({
  task,
  onToggle,
  onDelete,
  onMove,
  disabled,
}: TaskItemProps) {
  const [pending, setPending] = useState(false)

  async function run(fn: (id: string) => void | Promise<void>) {
    if (pending || disabled) return
    setPending(true)
    try {
      await fn(task.id)
    } finally {
      setPending(false)
    }
  }

  return (
    <li
      className="flex items-center gap-2 rounded-[10px] border border-transparent px-2 py-2 hover:border-[var(--line)]"
      style={{ opacity: pending ? 0.6 : undefined }}
    >
      <input
        type="checkbox"
        checked={task.done}
        onChange={() => void run(onToggle)}
        disabled={disabled || pending}
        aria-label={`Mark ${task.title} as ${task.done ? 'not done' : 'done'}`}
        className="h-4 w-4 cursor-pointer rounded border-[var(--line)] text-[var(--primary)] focus:ring-[var(--ring)]"
      />
      <span
        className={`flex-1 text-sm ${task.done ? 'text-[var(--muted)] line-through' : 'text-[var(--ink)]'}`}
      >
        {task.title}
      </span>
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => void run((id) => onMove(id, -1))}
          disabled={disabled || pending}
          className="btn btn-ghost px-2 py-1 text-xs"
          aria-label="Move task up"
          title="Move up"
        >
          ↑
        </button>
        <button
          type="button"
          onClick={() => void run((id) => onMove(id, 1))}
          disabled={disabled || pending}
          className="btn btn-ghost px-2 py-1 text-xs"
          aria-label="Move task down"
          title="Move down"
        >
          ↓
        </button>
        <button
          type="button"
          onClick={() => void run(onDelete)}
          disabled={disabled || pending}
          className="btn btn-ghost px-2 py-1 text-xs text-[var(--danger)]"
          aria-label={`Delete ${task.title}`}
        >
          ×
        </button>
      </div>
    </li>
  )
}

export type TaskListProps = {
  tasks: TaskDTO[]
  onToggle: (id: string) => void | Promise<void>
  onDelete: (id: string) => void | Promise<void>
  onMove: (id: string, direction: -1 | 1) => void | Promise<void>
  onAdd: (title: string) => void | Promise<void>
  disabled?: boolean
}

export function TaskList({
  tasks,
  onToggle,
  onDelete,
  onMove,
  onAdd,
  disabled,
}: TaskListProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-[var(--ink)]">Tasks</h3>
        <span className="text-xs text-[var(--muted)]">
          {tasks.filter((t) => t.done).length}/{tasks.length} done
        </span>
      </div>
      <TaskInput onSubmit={onAdd} disabled={disabled} />
      {tasks.length === 0 ? (
        <p className="text-sm text-[var(--muted)]">
          No tasks yet. Add one above and check it off when done — it will
          appear on the card.
        </p>
      ) : (
        <ul className="space-y-1">
          {tasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onToggle={onToggle}
              onDelete={onDelete}
              onMove={onMove}
              disabled={disabled}
            />
          ))}
        </ul>
      )}
    </div>
  )
}
