import {
  Link,
  createFileRoute,
  useNavigate,
  useRouter,
} from '@tanstack/react-router'
import { EntryForm, formatDisplayDate, todayLocalISO } from '#/features/entries'
import { upsertEntry } from '#/server/entries'

export const Route = createFileRoute('/app/entries/new')({
  validateSearch: (search: Record<string, unknown>) => {
    const date =
      typeof search.date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(search.date)
        ? search.date
        : undefined
    return { date }
  },
  component: NewEntryPage,
})

function NewEntryPage() {
  const navigate = useNavigate()
  const router = useRouter()
  const { session } = Route.useRouteContext()
  const { date } = Route.useSearch()
  const entryDate = date ?? todayLocalISO()
  const username = session.user.name?.split(' ')[0]

  return (
    <main className="page-wrap px-4 py-12 sm:py-14">
      <div className="fade-in mx-auto max-w-4xl">
        <p className="mb-1 text-sm font-medium text-[var(--muted)]">New entry</p>
        <h1 className="mb-1 text-2xl font-semibold tracking-tight text-[var(--ink)]">
          Log a day
        </h1>
        <p className="mb-6 text-sm text-[var(--muted)]">
          {formatDisplayDate(entryDate)} · write + pick a card
        </p>

        <div className="panel p-5 sm:p-6">
          <EntryForm
            entryDate={entryDate}
            username={username}
            submitLabel="Save entry"
            onSubmit={async ({ title, body, templateId }) => {
              await upsertEntry({
                data: {
                  entryDate,
                  title: title || undefined,
                  body,
                  templateId,
                },
              })
              await router.invalidate()
              await navigate({ to: '/app' })
            }}
          />
        </div>

        <p className="mt-6 text-sm">
          <Link
            to="/app"
            className="font-medium text-[var(--primary)] no-underline"
          >
            ← Back to dashboard
          </Link>
        </p>
      </div>
    </main>
  )
}
