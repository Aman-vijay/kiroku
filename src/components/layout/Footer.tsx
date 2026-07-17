import { SITE_NAME, SITE_TAGLINE } from '#/lib/constants'

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="mt-16 border-t border-[var(--line)] px-4 py-10 text-[var(--muted)]">
      <div className="page-wrap flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
        <p className="m-0 text-sm">
          &copy; {year} {SITE_NAME}
        </p>
        <p className="m-0 text-sm text-[var(--muted)]">{SITE_TAGLINE}</p>
      </div>
    </footer>
  )
}
