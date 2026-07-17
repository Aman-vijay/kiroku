import { Link } from '@tanstack/react-router'
import type { EntryDTO } from '#/server/entries'
import { CardPreview } from './CardPreview'
import { formatDisplayDate } from '../lib/dates'

type EntryCardGridProps = {
  entries: EntryDTO[]
  username?: string
}

export function EntryCardGrid({ entries, username }: EntryCardGridProps) {
  if (entries.length === 0) return null

  return (
    <ul className="m-0 grid list-none grid-cols-1 gap-5 p-0 sm:grid-cols-2 lg:grid-cols-3">
      {entries.map((item) => (
        <li key={item.id}>
          <Link
            to="/app/entries/$entryId"
            params={{ entryId: item.id }}
            className="group block no-underline outline-none"
            aria-label={`Open entry ${formatDisplayDate(item.entryDate)}`}
          >
            <div className="overflow-hidden rounded-[14px] border border-[var(--line)] bg-[var(--bg)] transition-[border-color,box-shadow] duration-150 group-hover:border-[var(--primary)] group-focus-visible:outline group-focus-visible:outline-2 group-focus-visible:outline-offset-2 group-focus-visible:outline-[var(--ring)]">
              <div className="border-b border-[var(--line)] bg-[var(--surface)] px-3 py-2">
                <time
                  dateTime={item.entryDate}
                  className="text-xs font-semibold text-[var(--ink)]"
                >
                  {formatDisplayDate(item.entryDate)}
                </time>
                {item.title ? (
                  <p className="m-0 mt-0.5 truncate text-sm text-[var(--muted)]">
                    {item.title}
                  </p>
                ) : null}
              </div>
              <div className="p-3">
                <CardPreview
                  templateId={item.templateId}
                  title={item.title}
                  body={item.body}
                  date={item.entryDate}
                  username={username}
                />
              </div>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  )
}
