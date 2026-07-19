import { useEffect, useRef, useState } from 'react'
import { useTaskDraftStore } from '#/stores/task-draft-store'
import {
  createTask,
  deleteTask,
  listTasksByDate,
  toggleTask,
} from '#/server/task'
import type { TaskDTO } from '#/server/task'
import { TaskCard } from './TaskCard'
import { CARD_W } from '#/lib/constants'
import { formatDisplayDate, todayLocalISO } from '#/features/entries/lib/dates'

export function TaskPlanEditor() {
  const today = todayLocalISO()
  const draft = useTaskDraftStore()
  const [input, setInput] = useState('')
  const [saving, setSaving] = useState(false)
  const [savedTasks, setSavedTasks] = useState<TaskDTO[]>([])
  const [loadedSaved, setLoadedSaved] = useState(false)
  const stageRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(0.296)

  // Keep the draft scoped to today.
  useEffect(() => {
    draft.initForDate(today)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [today])

  // Load any already-saved tasks for today (so toggling works after save).
  async function loadSaved() {
    try {
      const rows = await listTasksByDate({ data: { entryDate: today } })
      setSavedTasks(rows)
    } catch {
      /* ignore */
    }
  }

  useEffect(() => {
    void loadSaved()
    setLoadedSaved(true)
  }, [])

  // Live preview scale
  useEffect(() => {
    const el = stageRef.current
    if (!el) return
    const ro = new ResizeObserver(([entry]) => {
      const w = entry?.contentRect.width ?? 0
      if (w > 0) setScale(w / CARD_W)
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  function handleAdd(event: React.FormEvent) {
    event.preventDefault()
    const trimmed = input.trim()
    if (!trimmed) return
    draft.add(trimmed)
    setInput('')
  }

  async function handleSave() {
    if (draft.items.length === 0 || saving) return
    setSaving(true)
    try {
      // Persist every drafted task in one batch.
      await Promise.all(
        draft.items.map((item, i) =>
          createTask({ data: { entryDate: today, title: item.title, order: i } }),
        ),
      )
      draft.clear()
      await loadSaved()
    } finally {
      setSaving(false)
    }
  }

  const previewTasks =
    loadedSaved && savedTasks.length > 0
      ? savedTasks.map((t) => ({ title: t.title, done: t.done }))
      : draft.items.map((t) => ({ title: t.title, done: false }))

  const isSavedState = loadedSaved && savedTasks.length > 0

  return (
    <div className="grid gap-8 lg:grid-cols-2 lg:items-start">
      {/* Editor */}
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold text-[var(--ink)]">
            Plan your day
          </h2>
          <p className="mt-1 text-sm text-[var(--muted)]">
            {formatDisplayDate(today)} · tasks are for today only
          </p>
        </div>

        <form onSubmit={handleAdd} className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Add a task (saved when you press Save plan)"
            className="field-input flex-1"
            maxLength={200}
            aria-label="New task"
          />
          <button
            type="submit"
            disabled={!input.trim()}
            className="btn btn-secondary shrink-0"
          >
            Add
          </button>
        </form>

        {draft.items.length === 0 && !isSavedState ? (
          <p className="text-sm text-[var(--muted)]">
            No tasks yet. Add a few things you want to get done today, then
            save to lock them in and generate your plan card.
          </p>
        ) : draft.items.length > 0 ? (
          <ul className="space-y-1">
            {draft.items.map((item, idx) => (
              <li
                key={item.id}
                className="flex items-center gap-2 rounded-[10px] px-2 py-2 hover:bg-[var(--surface)]"
              >
                <span
                  aria-hidden
                  className="text-sm font-semibold text-[var(--muted)]"
                >
                  {idx + 1}.
                </span>
                <span className="flex-1 text-sm text-[var(--ink)]">
                  {item.title}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => draft.move(item.id, -1)}
                    disabled={idx === 0}
                    className="btn btn-ghost px-2 py-1 text-xs"
                    aria-label={`Move ${item.title} up`}
                    title="Move up"
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    onClick={() => draft.move(item.id, 1)}
                    disabled={idx === draft.items.length - 1}
                    className="btn btn-ghost px-2 py-1 text-xs"
                    aria-label={`Move ${item.title} down`}
                    title="Move down"
                  >
                    ↓
                  </button>
                  <button
                    type="button"
                    onClick={() => draft.remove(item.id)}
                    className="btn btn-ghost px-2 py-1 text-xs text-[var(--danger)]"
                    aria-label={`Remove ${item.title}`}
                    title="Remove"
                  >
                    ×
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : null}

        {/* Saved tasks (after Save) — toggle them as you complete them */}
        {isSavedState ? (
          <div className="space-y-2 border-t border-[var(--line)] pt-4">
            <h3 className="text-sm font-semibold text-[var(--ink)]">
              Saved tasks · tick as you finish
            </h3>
            <ul className="space-y-1">
              {savedTasks.map((t) => (
                <li
                  key={t.id}
                  className="flex items-center gap-2 rounded-[10px] px-2 py-2 hover:bg-[var(--surface)]"
                >
                  <input
                    type="checkbox"
                    checked={t.done}
                    disabled={saving}
                    onChange={async () => {
                      try {
                        const updated = await toggleTask({ data: { id: t.id } })
                        setSavedTasks((prev) =>
                          prev.map((x) => (x.id === t.id ? updated : x)),
                        )
                      } catch {
                        /* ignore */
                      }
                    }}
                    className="h-4 w-4 cursor-pointer rounded border-[var(--line)] text-[var(--primary)] focus:ring-[var(--ring)]"
                  />
                  <span
                    className={`flex-1 text-sm ${t.done ? 'text-[var(--muted)] line-through' : 'text-[var(--ink)]'}`}
                  >
                    {t.title}
                  </span>
                  <button
                    type="button"
                    onClick={async () => {
                      try {
                        await deleteTask({ data: { id: t.id } })
                        setSavedTasks((prev) => prev.filter((x) => x.id !== t.id))
                      } catch {
                        /* ignore */
                      }
                    }}
                    className="btn btn-ghost px-2 py-1 text-xs text-[var(--danger)]"
                    aria-label={`Remove ${t.title}`}
                  >
                    ×
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {draft.items.length > 0 ? (
          <button
            type="button"
            onClick={() => void handleSave()}
            disabled={saving}
            className="btn btn-primary"
          >
            {saving ? 'Saving…' : 'Save plan'}
          </button>
        ) : null}
      </div>

      {/* Live plan card preview */}
      <div>
        <p className="field-label mb-2">Plan card</p>
        <div
          ref={stageRef}
          className="card-stage"
          style={{ ['--card-scale' as string]: String(scale) }}
        >
          <div className="card-canvas" id="share-card">
            <TaskCard
              date={today}
              tasks={previewTasks}
              title={isSavedState ? "Today's Plan" : 'Draft plan'}
            />
          </div>
        </div>
      </div>
    </div>
  )
}