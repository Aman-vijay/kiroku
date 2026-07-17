import {
  Link,
  createFileRoute,
  notFound,
  useNavigate,
  useRouter,
} from '@tanstack/react-router'
import {
  EntryForm,
  formatDisplayDate,
  parseTemplateId,
} from '#/features/entries'
import { deleteEntry, getEntryById, updateEntry } from '#/server/entries'

export const Route = createFileRoute('/app/entries/$entryId')({
  loader: async ({ params }) => {
    const item = await getEntryById({ data: { id: params.entryId } })
    if (!item) throw notFound()
    return { entry: item }
  },
  component: EditEntryPage,
})

function EditEntryPage() {
  const navigate = useNavigate()
  const router = useRouter()
  const { session } = Route.useRouteContext()
  const { entry } = Route.useLoaderData()
  const username = session.user.name?.split(' ')[0]

  return (
    <main className="page-wrap px-4 py-12 sm:py-14">
      <div className="fade-in mx-auto max-w-4xl">
        <p className="mb-1 text-sm font-medium text-[var(--muted)]">
          Edit entry
        </p>
        <h1 className="mb-1 text-2xl font-semibold tracking-tight text-[var(--ink)]">
          {formatDisplayDate(entry.entryDate)}
        </h1>
        <p className="mb-6 text-sm text-[var(--muted)]">{entry.entryDate}</p>

        <div className="panel p-5 sm:p-6">
          <EntryForm
            entryId={entry.id}
            entryDate={entry.entryDate}
            shareSlug={entry.shareSlug}
            username={username}
            initial={{
              title: entry.title ?? '',
              body: entry.body,
              templateId: parseTemplateId(entry.templateId),
            }}
            submitLabel="Save changes"
            onSubmit={async ({ title, body, templateId }) => {
              await updateEntry({
                data: {
                  id: entry.id,
                  title: title || null,
                  body,
                  templateId,
                },
              })
              await router.invalidate()
              await navigate({ to: '/app' })
            }}
            onDelete={async () => {
              await deleteEntry({ data: { id: entry.id } })
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
