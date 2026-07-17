import { Link, createFileRoute, notFound } from '@tanstack/react-router'
import { CardPreview } from '#/features/entries'
import { SITE_NAME } from '#/lib/constants'
import { getPublicEntry } from '#/server/entries'

export const Route = createFileRoute('/s/$slug')({
  loader: async ({ params }) => {
    const item = await getPublicEntry({ data: { slug: params.slug } })
    if (!item) throw notFound()
    return { entry: item }
  },
  head: ({ loaderData }) => {
    const e = loaderData?.entry
    if (!e) {
      return { meta: [{ title: `Not found · ${SITE_NAME}` }] }
    }
    const title = e.title
      ? `${e.title} · ${SITE_NAME}`
      : `${e.entryDate} · ${SITE_NAME}`
    const description =
      e.body.length > 160 ? `${e.body.slice(0, 157)}…` : e.body
    return {
      meta: [
        { title },
        { name: 'description', content: description },
        { property: 'og:title', content: title },
        { property: 'og:description', content: description },
        { property: 'og:type', content: 'article' },
        { name: 'twitter:card', content: 'summary' },
        { name: 'twitter:title', content: title },
        { name: 'twitter:description', content: description },
        { name: 'robots', content: 'noindex' },
      ],
    }
  },
  component: PublicSharePage,
  notFoundComponent: PublicNotFound,
})

function PublicSharePage() {
  const { entry } = Route.useLoaderData()

  return (
    <main className="page-wrap px-4 py-12 sm:py-16">
      <div className="fade-in mx-auto max-w-md text-center">
        <p className="mb-1 text-sm font-medium text-[var(--muted)]">
          Shared day
        </p>
        <h1 className="mb-6 text-xl font-semibold tracking-tight text-[var(--ink)]">
          {entry.title || entry.entryDate}
        </h1>
        <CardPreview
          templateId={entry.templateId}
          title={entry.title}
          body={entry.body}
          date={entry.entryDate}
          username={entry.username ?? undefined}
        />
        <p className="mt-8 text-sm text-[var(--muted)]">
          Made with{' '}
          <Link to="/" className="font-medium text-[var(--primary)]">
            {SITE_NAME}
          </Link>
        </p>
      </div>
    </main>
  )
}

function PublicNotFound() {
  return (
    <main className="page-wrap px-4 py-20 text-center">
      <h1 className="text-xl font-semibold text-[var(--ink)]">Link not found</h1>
      <p className="mt-2 text-sm text-[var(--muted)]">
        This share may have been disabled or never existed.
      </p>
      <p className="mt-6">
        <Link to="/" className="btn btn-primary">
          Go home
        </Link>
      </p>
    </main>
  )
}
