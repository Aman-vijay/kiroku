import { getRequestHeaders } from '@tanstack/react-start/server'
import { auth } from '#/lib/auth'

export type AppSession = NonNullable<
  Awaited<ReturnType<typeof auth.api.getSession>>
>

/** Throws if unauthenticated. Use inside createServerFn handlers. */
export async function requireSession(): Promise<AppSession> {
  const headers = getRequestHeaders()
  const session = await auth.api.getSession({ headers })
  if (!session) {
    throw new Error('Unauthorized')
  }
  return session
}
