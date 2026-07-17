import { Link } from '@tanstack/react-router'
import { authClient } from '#/lib/auth-client'

export function AuthHeader() {
  const { data: session, isPending } = authClient.useSession()

  if (isPending) {
    return (
      <div
        className="h-9 w-20 animate-pulse rounded-[10px] bg-[var(--surface)]"
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
            className="h-8 w-8 rounded-full object-cover ring-1 ring-[var(--line)]"
          />
        ) : (
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--surface)] text-xs font-semibold text-[var(--ink)] ring-1 ring-[var(--line)]">
            {initial}
          </div>
        )}
        <button
          type="button"
          onClick={() => {
            void authClient.signOut()
          }}
          className="btn btn-ghost !py-1.5 !px-3 text-xs"
        >
          Sign out
        </button>
      </div>
    )
  }

  return (
    <Link to="/login" className="btn btn-primary !py-1.5 !px-3.5 text-xs">
      Sign in
    </Link>
  )
}
