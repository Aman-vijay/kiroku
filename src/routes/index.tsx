import { useState } from 'react'
import { Link, createFileRoute } from '@tanstack/react-router'
import { authClient } from '#/lib/auth-client'
import { SITE_DESCRIPTION, SITE_NAME, SITE_TAGLINE } from '#/lib/constants'
import { Spotlight } from '#/components/ui/spotlight-new'
import { Button as MovingBorderButton } from '#/components/ui/moving-border'
import { CardPreview, TemplatePicker } from '#/features/entries'
import type { TemplateId } from '#/lib/templates'

export const Route = createFileRoute('/')({
  head: () => ({
    meta: [
      { title: `${SITE_NAME} — ${SITE_TAGLINE}` },
      { property: 'og:image', content: '/logo512.png' },
    ],
  }),
  component: LandingPage,
})

/** Static sample date — avoids SSR/client hydration drift. */
const SAMPLE_DATE = '2026-07-17'

function LandingPage() {
  const { data: session } = authClient.useSession()
  const isAuthed = !!session?.user

  return (
    <main className="relative overflow-hidden">
      <Spotlight
        gradientFirst="radial-gradient(68.54% 68.72% at 55.02% 31.46%, hsla(285, 100%, 85%, .08) 0, hsla(285, 100%, 55%, .02) 50%, hsla(285, 100%, 45%, 0) 80%)"
        gradientSecond="radial-gradient(50% 50% at 50% 50%, hsla(285, 100%, 85%, .06) 0, hsla(285, 100%, 55%, .02) 80%, transparent 100%)"
        gradientThird="radial-gradient(50% 50% at 50% 50%, hsla(285, 100%, 85%, .04) 0, hsla(285, 100%, 45%, .02) 80%, transparent 100%)"
      />

      <div className="page-wrap px-4 pb-20 pt-12 sm:pt-16">
        {/* ─── Hero: copy + fanned real cards ─── */}
        <section className="grid items-center gap-10 lg:grid-cols-2 lg:gap-6">
          <div>
            <p className="mb-3 text-sm font-medium text-[var(--muted)]">
              {SITE_NAME}
            </p>
            <h1 className="mb-4 max-w-md text-[clamp(2rem,4.5vw,2.75rem)] font-semibold leading-[1.12] tracking-[-0.02em] text-[var(--ink)]">
              {SITE_TAGLINE}
            </h1>
            <p className="mb-8 max-w-md text-base leading-relaxed text-[var(--muted)] sm:text-lg">
              Write your day in plain text. Frame it on one of seven card
              templates — shounen, vigilante, cosmic, chibi, pixel, sakura,
              minimal — then share.
            </p>

            <div className="flex flex-wrap items-center gap-3">
              {isAuthed ? (
                <MovingBorderButton
                  as="a"
                  href="/app"
                  borderRadius="0.75rem"
                  className="border-[var(--line)] bg-[var(--bg)] px-6 py-3 text-sm font-semibold text-[var(--ink)]"
                >
                  Open dashboard
                </MovingBorderButton>
              ) : (
                <>
                  <Link to="/login" className="btn btn-primary">
                    Get started
                  </Link>
                  <a href="#try-it" className="btn btn-secondary">
                    Try it first
                  </a>
                </>
              )}
            </div>
          </div>

          <HeroCards />
        </section>

        {/* ─── Interactive demo: real editor, live card ─── */}
        <TryItDemo isAuthed={isAuthed} />

        {/* ─── Final CTA (unauthed only) ─── */}
        {!isAuthed ? (
          <section className="panel-muted mt-16 p-6 sm:p-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="max-w-md">
                <h2 className="mb-1 text-lg font-semibold text-[var(--ink)]">
                  Keep your days
                </h2>
                <p className="m-0 text-sm text-[var(--muted)]">
                  Sign in with email or Google. Entries stay private until you
                  choose to share one.
                </p>
              </div>
              <Link to="/login" className="btn btn-accent shrink-0">
                Sign in
              </Link>
            </div>
          </section>
        ) : null}
      </div>
    </main>
  )
}

/** Three real template cards fanned out with sample entries. */
function HeroCards() {
  return (
    <div
      className="relative mx-auto w-full max-w-md sm:h-[460px]"
      aria-hidden
    >
      <div className="absolute left-0 top-16 hidden w-[46%] -rotate-6 overflow-hidden rounded-[14px] border border-[var(--line)] bg-[var(--bg)] shadow-[0_2px_8px_oklch(0.2_0.02_285/0.08)] sm:block">
        <CardPreview
          bare
          templateId="chibi-day"
          title="Study day"
          body="Finished chapter 4 of statistics. The practice problems actually made sense today."
          date={SAMPLE_DATE}
          username="you"
        />
      </div>
      <div className="absolute right-0 top-16 hidden w-[46%] rotate-6 overflow-hidden rounded-[14px] border border-[var(--line)] bg-[var(--bg)] shadow-[0_2px_8px_oklch(0.2_0.02_285/0.08)] sm:block">
        <CardPreview
          bare
          templateId="vigilante-noir"
          title="Ship week"
          body="Deployed the new auth flow. Zero rollback. Felt like a win."
          date={SAMPLE_DATE}
          username="you"
        />
      </div>
      <div className="relative z-10 mx-auto w-[70%] overflow-hidden rounded-[14px] border border-[var(--line)] bg-[var(--bg)] shadow-[0_8px_24px_oklch(0.2_0.02_285/0.12)] sm:absolute sm:left-1/2 sm:top-0 sm:w-[54%] sm:-translate-x-1/2">
        <CardPreview
          bare
          templateId="shounen-hero"
          title="First 5K run"
          body="Ran the full loop without stopping. Legs are dead. Worth it."
          date={SAMPLE_DATE}
          username="you"
        />
      </div>
    </div>
  )
}

/** Live demo: type + pick a template, card updates instantly. */
function TryItDemo({ isAuthed }: { isAuthed: boolean }) {
  const [title, setTitle] = useState('')
  const [body, setBody] = useState(
    'Wrote the first draft of my newsletter, hit the gym before work, and finally fixed that flaky test. Good day.',
  )
  const [templateId, setTemplateId] = useState<TemplateId>('shounen-hero')

  return (
    <section id="try-it" className="mt-20 border-t border-[var(--line)] pt-12">
      <div className="mb-8 max-w-xl">
        <p className="mb-1 text-sm font-medium text-[var(--primary)]">Try it</p>
        <h2 className="mb-2 text-2xl font-semibold tracking-tight text-[var(--ink)]">
          See your day as a card
        </h2>
        <p className="m-0 text-sm leading-relaxed text-[var(--muted)]">
          This is the same editor you get after signing in. Type below and the
          card updates live — no account needed.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2 lg:items-start">
        <div className="space-y-4">
          <label className="block">
            <span className="field-label">Title (optional)</span>
            <input
              type="text"
              maxLength={120}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="field-input"
              placeholder="A short label for the day"
            />
          </label>

          <label className="block">
            <span className="field-label">What did you do?</span>
            <textarea
              rows={5}
              maxLength={10_000}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className="field-input resize-y"
              placeholder="Wins, notes, whatever mattered today."
            />
          </label>

          <div>
            <span className="field-label">Template</span>
            <TemplatePicker value={templateId} onChange={setTemplateId} />
          </div>

          <p className="text-sm text-[var(--muted)]">
            {isAuthed ? (
              <>
                Like it?{' '}
                <Link
                  to="/app/entries/new"
                  className="font-medium text-[var(--primary)]"
                >
                  Log today for real →
                </Link>
              </>
            ) : (
              <>
                Like it?{' '}
                <Link to="/login" className="font-medium text-[var(--primary)]">
                  Sign in to save today's card →
                </Link>
              </>
            )}
          </p>
        </div>

        <div className="mx-auto w-full max-w-sm">
          <CardPreview
            templateId={templateId}
            title={title.trim() || null}
            body={body}
            date={SAMPLE_DATE}
            username="you"
          />
        </div>
      </div>
    </section>
  )
}
