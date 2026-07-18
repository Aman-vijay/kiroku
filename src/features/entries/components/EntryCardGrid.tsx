import { Link } from '@tanstack/react-router'
import type { EntryDTO } from '#/server/entries'
import { CardPreview } from './CardPreview'
import { formatDisplayDate } from '../lib/dates'

type EntryCardGridProps = {
  entries: EntryDTO[]
  username?: string
  todayId?: string | null
}

export function EntryCardGrid({ entries, username, todayId }: EntryCardGridProps) {
  if (entries.length === 0) return null

  return (
    <ul className="m-0 grid list-none grid-cols-2 gap-4 p-0 sm:gap-5 lg:grid-cols-3">
      {entries.map((item) => {
        const isToday = item.id === todayId
        return (
          <li key={item.id}>
            <Link
              to="/app/entries/$entryId"
              params={{ entryId: item.id }}
              className="group block rounded-[14px] outline-none"
              aria-label={`Open entry ${formatDisplayDate(item.entryDate)}`}
            >
              <div
                className={[
                  'relative overflow-hidden rounded-[14px] border bg-[var(--bg)]',
                  'transition-[transform,border-color,box-shadow] duration-150 ease-out',
                  'group-hover:-translate-y-0.5 group-hover:shadow-[0_2px_8px_oklch(0.2_0.02_285/0.08)]',
                  'group-focus-visible:-translate-y-0.5',
                  isToday
                    ? 'border-[var(--primary)]'
                    : 'border-[var(--line)] group-hover:border-[var(--primary)]',
                ].join(' ')}
              >
                {isToday ? (
                  <span className="absolute left-3 top-3 z-10 rounded-full bg-[var(--ink)] px-2.5 py-1 text-[0.65rem] font-semibold uppercase tracking-wide text-[var(--bg)]">
                    Today
                  </span>
                ) : null}
                <CardPreview
                  templateId={item.templateId}
                  title={item.title}
                  body={item.body}
                  date={item.entryDate}
                  username={username}
                />
              </div>
            </Link>
          </li>
        )
      })}
    </ul>
  )
}
