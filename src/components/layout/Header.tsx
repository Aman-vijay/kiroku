import { Link } from '@tanstack/react-router'
import { SITE_NAME } from '#/lib/constants'
import { AuthHeader } from './AuthHeader'
import { ThemeToggle } from './ThemeToggle'

export function Header() {
  return (
    <header className="sticky top-0 z-[var(--z-sticky)] border-b border-[var(--line)] bg-[var(--header-bg)] px-4 backdrop-blur-md">
      <nav className="page-wrap flex flex-wrap items-center gap-x-4 gap-y-2 py-3">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm font-semibold tracking-tight text-[var(--ink)] no-underline"
        >
          <span
            className="inline-flex h-7 w-7 items-center justify-center rounded-[8px] bg-[var(--primary)] text-[0.72rem] font-bold text-[var(--primary-fg)]"
            aria-hidden
          >
            記
          </span>
          {SITE_NAME}
        </Link>

        <div className="order-3 flex w-full items-center gap-4 pb-0.5 sm:order-2 sm:w-auto sm:pb-0">
          <Link
            to="/"
            className="nav-link"
            activeProps={{ className: 'nav-link is-active' }}
            activeOptions={{ exact: true }}
          >
            Home
          </Link>
          <Link
            to="/app"
            className="nav-link"
            activeProps={{ className: 'nav-link is-active' }}
          >
            Dashboard
          </Link>
        </div>

        <div className="ml-auto flex items-center gap-2">
          <AuthHeader />
          <ThemeToggle />
        </div>
      </nav>
    </header>
  )
}
