import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { tanstackStartCookies } from 'better-auth/tanstack-start'
import { db } from '#/lib/db'
import { getRequiredEnv } from '#/lib/env'
import * as schema from '#/lib/db/schema'

const isServerRuntime = typeof window === 'undefined' || Boolean((import.meta as ImportMeta & { env?: { SSR?: boolean } }).env?.SSR)

export const auth = isServerRuntime
  ? betterAuth({
      baseURL: process.env.BETTER_AUTH_URL,
      secret: process.env.BETTER_AUTH_SECRET,
      database: drizzleAdapter(db, {
        provider: 'pg',
        schema,
      }),
      emailAndPassword: {
        enabled: true,
      },
      socialProviders: {
        google: {
          clientId: getRequiredEnv('GOOGLE_CLIENT_ID'),
          clientSecret: getRequiredEnv('GOOGLE_CLIENT_SECRET'),
        },
      },
      // Must be last — sets cookies correctly for TanStack Start
      plugins: [tanstackStartCookies()],
    })
  : undefined
