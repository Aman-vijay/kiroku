import { Link } from '@tanstack/react-router'

export function EntryEmptyState() {
  return (
    <div className="rounded-[10px] border border-dashed border-[var(--line)] bg-[var(--surface)] px-4 py-10 text-center">
      <p className="m-0 text-sm font-medium text-[var(--ink)]">
        Write your first day.
      </p>
      <p className="mt-1 mb-4 text-sm text-[var(--muted)]">
        Free text, one entry per calendar day.
      </p>
      <Link to="/app/entries/new" className="btn btn-primary inline-flex">
        Log today
      </Link>
    </div>
  )
}
