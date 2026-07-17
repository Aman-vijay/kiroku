import { Link } from '@tanstack/react-router'
import type { EntryDTO } from '#/server/entries'
import { formatDisplayDate } from '../lib/dates'

function snippet(body: string, max = 100) {
  const oneLine = body.replace(/\s+/g, ' ').trim()
  if (oneLine.length <= max) return oneLine
  return `${oneLine.slice(0, max).trimEnd()}…`
}

type EntryListProps = {
  entries: EntryDTO[]
}

export function EntryList({ entries }: EntryListProps) {
  if (entries.length === 0) return null

  return (
    <ul className="m-0 list-none divide-y divide-[var(--line)] p-0">
      {entries.map((item) => (
        <li key={item.id}>
          <Link
            to="/app/entries/$entryId"
            params={{ entryId: item.id }}
            className="block px-0 py-3.5 no-underline transition-colors hover:bg-[var(--surface)]"
          >
            <div className="flex items-baseline justify-between gap-3">
              <time
                dateTime={item.entryDate}
                className="text-sm font-medium text-[var(--ink)]"
              >
                {formatDisplayDate(item.entryDate)}
              </time>
              <span className="text-xs text-[var(--muted)]">{item.entryDate}</span>
            </div>
            {item.title ? (
              <p className="mt-0.5 mb-0 text-sm font-medium text-[var(--ink)]">
                {item.title}
              </p>
            ) : null}
            <p className="mt-0.5 mb-0 text-sm text-[var(--muted)]">
              {snippet(item.body)}
            </p>
          </Link>
        </li>
      ))}
    </ul>
  )
}
