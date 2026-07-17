import { Link, createFileRoute } from '@tanstack/react-router'
import { SITE_DESCRIPTION, SITE_NAME, SITE_TAGLINE } from '#/lib/constants'

export const Route = createFileRoute('/')({ component: LandingPage })

const steps = [
  {
    title: 'Write your day',
    body: 'A free-text note for today — no rigid forms, no checklist tax.',
  },
  {
    title: 'Shape a card',
    body: 'Chibi, pixel, or minimal templates turn the note into a shareable frame.',
  },
  {
    title: 'Share once',
    body: 'Export a 1080×1350 portrait PNG or pass an unlisted link.',
  },
] as const

function LandingPage() {
  return (
    <main className="page-wrap px-4 pb-16 pt-12 sm:pt-16">
      <section className="fade-in max-w-2xl">
        <p className="mb-3 text-sm font-medium text-[var(--muted)]">
          {SITE_NAME}
        </p>
        <h1 className="mb-4 text-[clamp(2rem,4.5vw,2.75rem)] font-semibold leading-[1.12] tracking-[-0.02em] text-[var(--ink)]">
          {SITE_TAGLINE}
        </h1>
        <p className="mb-8 max-w-[42rem] text-base leading-relaxed text-[var(--muted)] sm:text-lg">
          {SITE_DESCRIPTION} Built for the end of the day — write, frame, share.
        </p>

        <div className="flex flex-wrap gap-3">
          <Link to="/login" className="btn btn-primary">
            Get started
          </Link>
          <Link to="/app" className="btn btn-secondary">
            Open dashboard
          </Link>
        </div>
      </section>

      <section className="mt-14 border-t border-[var(--line)] pt-10">
        <h2 className="mb-6 text-sm font-semibold tracking-tight text-[var(--ink)]">
          How it works
        </h2>
        <ol className="m-0 grid list-none gap-8 p-0 sm:grid-cols-3 sm:gap-6">
          {steps.map((step, index) => (
            <li key={step.title} className="fade-in min-w-0">
              <p className="mb-2 text-xs font-semibold tabular-nums text-[var(--primary)]">
                {String(index + 1).padStart(2, '0')}
              </p>
              <h3 className="mb-1.5 text-base font-semibold text-[var(--ink)]">
                {step.title}
              </h3>
              <p className="m-0 text-sm leading-relaxed text-[var(--muted)]">
                {step.body}
              </p>
            </li>
          ))}
        </ol>
      </section>

      <section className="panel-muted mt-14 p-6 sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="max-w-md">
            <h2 className="mb-1 text-lg font-semibold text-[var(--ink)]">
              Ready for today’s note?
            </h2>
            <p className="m-0 text-sm text-[var(--muted)]">
              Sign in with email or Google. Your entries stay private until you
              choose to share.
            </p>
          </div>
          <Link to="/login" className="btn btn-accent shrink-0">
            Sign in
          </Link>
        </div>
      </section>
    </main>
  )
}
