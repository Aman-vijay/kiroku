import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import { getRequiredEnv } from '#/lib/env'
import * as schema from './schema'

const isServerRuntime = typeof window === 'undefined' || Boolean((import.meta as ImportMeta & { env?: { SSR?: boolean } }).env?.SSR)

const dbClient = isServerRuntime
  ? drizzle({
      client: neon(getRequiredEnv('DATABASE_URL')),
      schema,
    })
  : undefined

/** Shared Drizzle client (Neon HTTP). Safe for serverless / TanStack Start. */
export const db = dbClient as any

export { schema }
