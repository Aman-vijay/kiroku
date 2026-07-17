import { createAuthClient } from 'better-auth/react'

/** Same-origin by default (TanStack Start serves /api/auth/*). */
export const authClient = createAuthClient()
