import { useState } from 'react'
import {
  DEFAULT_TEMPLATE_ID,
  parseTemplateId,
  type TemplateId,
} from '#/lib/templates'
import { CardPreview } from './CardPreview'
import { ShareActions } from './ShareActions'
import { TemplatePicker } from './TemplatePicker'

export type EntryFormValues = {
  title: string
  body: string
  templateId: TemplateId
}

type EntryFormProps = {
  initial?: Partial<EntryFormValues>
  entryId?: string
  entryDate: string
  shareSlug?: string | null
  username?: string
  submitLabel?: string
  onSubmit: (values: EntryFormValues) => Promise<void>
  onDelete?: () => Promise<void>
}

export function EntryForm({
  initial,
  entryId,
  entryDate,
  shareSlug,
  username,
  submitLabel = 'Save',
  onSubmit,
  onDelete,
}: EntryFormProps) {
  const [title, setTitle] = useState(initial?.title ?? '')
  const [body, setBody] = useState(initial?.body ?? '')
  const [templateId, setTemplateId] = useState<TemplateId>(
    parseTemplateId(initial?.templateId ?? DEFAULT_TEMPLATE_ID),
  )
  const [error, setError] = useState<string | null>(null)
  const [pending, setPending] = useState(false)
  const [deleting, setDeleting] = useState(false)

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    setError(null)
    const trimmed = body.trim()
    if (!trimmed) {
      setError('Write something for the day.')
      return
    }
    setPending(true)
    try {
      await onSubmit({
        title: title.trim(),
        body: trimmed,
        templateId,
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save')
    } finally {
      setPending(false)
    }
  }

  async function handleDelete() {
    if (!onDelete) return
    if (!window.confirm('Delete this entry? This cannot be undone.')) return
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
    <div className="grid gap-8 lg:grid-cols-2 lg:items-start">
      <form
        className="space-y-4"
        onSubmit={(e) => void handleSubmit(e)}
        aria-busy={pending || deleting}
      >
        <p className="text-sm text-[var(--muted)]">
          Date{' '}
          <time dateTime={entryDate} className="font-medium text-[var(--ink)]">
            {entryDate}
          </time>
        </p>

        <label className="block">
          <span className="field-label" id="entry-title-label">
            Title (optional)
          </span>
          <input
            type="text"
            maxLength={120}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="field-input"
            placeholder="A short label for the day"
            aria-labelledby="entry-title-label"
            autoComplete="off"
          />
        </label>

        <label className="block">
          <span className="field-label" id="entry-body-label">
            What did you do?
          </span>
          <textarea
            required
            rows={8}
            maxLength={10_000}
            value={body}
            onChange={(e) => setBody(e.target.value)}
            className="field-input min-h-[10rem] resize-y"
            placeholder="Free text — wins, notes, whatever mattered today."
            aria-labelledby="entry-body-label"
            aria-required="true"
          />
        </label>

        <div>
          <span className="field-label">Card template</span>
          <TemplatePicker value={templateId} onChange={setTemplateId} />
        </div>

        {error ? (
          <p role="alert" className="field-error">
            {error}
          </p>
        ) : null}

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="submit"
            disabled={pending || deleting}
            className="btn btn-primary"
          >
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

      <div>
        <p className="field-label mb-2">Live preview</p>
        <CardPreview
          templateId={templateId}
          title={title.trim() || null}
          body={body}
          date={entryDate}
          username={username}
        />
        <ShareActions
          entryId={entryId}
          entryDate={entryDate}
          shareSlug={shareSlug}
        />
      </div>
    </div>
  )
}
