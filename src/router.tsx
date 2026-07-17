import { createRouter as createTanStackRouter } from '@tanstack/react-router'
import {
  RouteError,
  RouteNotFound,
  RoutePending,
} from '#/components/RouteFallback'
import { routeTree } from './routeTree.gen'

export function getRouter() {
  const router = createTanStackRouter({
    routeTree,
    scrollRestoration: true,
    defaultPreload: 'intent',
    defaultPreloadStaleTime: 0,
    defaultPendingComponent: RoutePending,
    defaultNotFoundComponent: RouteNotFound,
    defaultErrorComponent: ({ error }) => (
      <RouteError error={error instanceof Error ? error : new Error(String(error))} />
    ),
  })

  return router
}

declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof getRouter>
  }
}
