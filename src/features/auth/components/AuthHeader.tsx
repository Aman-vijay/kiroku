import { Link } from '@tanstack/react-router'
import { authClient } from '#/lib/auth-client'

export function AuthHeader() {
  const { data: session, isPending } = authClient.useSession()

  if (isPending) {
    return (
      <div
        className="h-9 w-20 animate-pulse rounded-full bg-[var(--chip-bg)]"
        aria-hidden
      />
    )
  }

  if (session?.user) {
    const initial =
      session.user.name?.charAt(0).toUpperCase() ||
      session.user.email?.charAt(0).toUpperCase() ||
      'U'

    return (
      <div className="flex items-center gap-2">
        {session.user.image ? (
          <img
            src={session.user.image}
            alt=""
            className="h-8 w-8 rounded-full object-cover"
          />
        ) : (
          <div className="flex h-8 w-8 items-center justify-center rounded-full border border-[var(--chip-line)] bg-[var(--chip-bg)]">
            <span className="text-xs font-semibold text-[var(--sea-ink)]">
              {initial}
            </span>
          </div>
        )}
        <button
          type="button"
          onClick={() => {
            void authClient.signOut()
          }}
          className="h-9 rounded-full border border-[var(--chip-line)] bg-[var(--chip-bg)] px-3 text-sm font-semibold text-[var(--sea-ink)] transition hover:bg-[var(--link-bg-hover)]"
        >
          Sign out
        </button>
      </div>
    )
  }

  return (
    <Link
      to="/login"
      className="inline-flex h-9 items-center rounded-full border border-[var(--chip-line)] bg-[var(--chip-bg)] px-4 text-sm font-semibold text-[var(--sea-ink)] no-underline transition hover:bg-[var(--link-bg-hover)]"
    >
      Sign in
    </Link>
  )
}
