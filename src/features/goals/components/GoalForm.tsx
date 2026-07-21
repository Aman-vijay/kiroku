import { useState } from 'react'
import type { GoalDTO } from '#/server/goal'
import { todayLocalISO, addDaysISO } from '#/features/entries/lib/dates'

type GoalFormProps = {
  initial?: Partial<Pick<GoalDTO, 'id' | 'title' | 'description' | 'startDate' | 'deadline'>>
  submitLabel?: string
  onSubmit: (values: {
    title: string
    description: string
    startDate: string
    deadline: string
  }) => Promise<void>
  onDelete?: () => Promise<void>
}

export function GoalForm({
  initial,
  submitLabel = 'Create goal',
  onSubmit,
  onDelete,
}: GoalFormProps) {
  const today = todayLocalISO()
  const maxDeadline = addDaysISO(today, 28)
  const [title, setTitle] = useState(initial?.title ?? '')
  const [description, setDescription] = useState(initial?.description ?? '')
  const [startDate, setStartDate] = useState(initial?.startDate ?? today)
  const [deadline, setDeadline] = useState(
    initial?.deadline ?? addDaysISO(today, 7),
  )
  const [error, setError] = useState<string | null>(null)
  const [pending, setPending] = useState(false)
  const [deleting, setDeleting] = useState(false)

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    setError(null)
    if (!title.trim()) {
      setError('Give your goal a title.')
      return
    }
    if (deadline < startDate) {
      setError('Deadline cannot be before the start date.')
      return
    }
    if (deadline > maxDeadline) {
      setError('Deadline must be within 4 weeks of today.')
      return
    }
    setPending(true)
    try {
      await onSubmit({
        title: title.trim(),
        description: description.trim(),
        startDate,
        deadline,
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save goal')
    } finally {
      setPending(false)
    }
  }

  async function handleDelete() {
    if (!onDelete) return
    if (!window.confirm('Delete this goal? Tasks tagged to it will keep their text but lose the link.')) return
    setError(null)
    setDeleting(true)
    try {
      await onDelete()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not delete')
      setDeleting(false)
    }
  }

  return (
    <form className="space-y-4" onSubmit={(e) => void handleSubmit(e)} aria-busy={pending || deleting}>
      <label className="block">
        <span className="field-label">Title</span>
        <input
          type="text"
          required
          maxLength={120}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="field-input"
          placeholder="e.g. Interview prep"
          autoComplete="off"
        />
      </label>

      <label className="block">
        <span className="field-label">Description (optional)</span>
        <textarea
          rows={3}
          maxLength={500}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="field-input resize-y"
          placeholder="What does done look like?"
        />
      </label>

      <div className="flex flex-wrap gap-4">
        <label className="block">
          <span className="field-label">Start date</span>
          <input
            type="date"
            value={startDate}
            max={today}
            onChange={(e) => setStartDate(e.target.value)}
            className="field-input w-auto"
          />
        </label>
        <label className="block">
          <span className="field-label">Deadline (≤ 4 weeks)</span>
          <input
            type="date"
            value={deadline}
            min={startDate}
            max={maxDeadline}
            onChange={(e) => setDeadline(e.target.value)}
            className="field-input w-auto"
          />
        </label>
      </div>

      {error ? (
        <p role="alert" className="field-error">{error}</p>
      ) : null}

      <div className="flex flex-wrap items-center gap-3">
        <button type="submit" disabled={pending || deleting} className="btn btn-primary">
          {pending ? 'Saving…' : submitLabel}
        </button>
        {onDelete ? (
          <button
            type="button"
            disabled={pending || deleting}
            onClick={() => void handleDelete()}
            className="btn btn-secondary text-[var(--danger)]"
          >
            {deleting ? 'Deleting…' : 'Delete'}
          </button>
        ) : null}
      </div>
    </form>
  )
}