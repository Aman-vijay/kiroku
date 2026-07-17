import { Outlet, createFileRoute, redirect } from '@tanstack/react-router'
import { getSession } from '#/server/auth'

export const Route = createFileRoute('/app')({
  beforeLoad: async () => {
    const session = await getSession()
    if (!session) {
      throw redirect({ to: '/login' })
    }
    return { session }
  },
  component: AppLayout,
})

function AppLayout() {
  return <Outlet />
}
