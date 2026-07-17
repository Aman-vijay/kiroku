import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import * as schema from './schema'

function getDatabaseUrl() {
  const url = process.env.DATABASE_URL
  if (!url) {
    throw new Error(
      'DATABASE_URL is not set. Add your Neon connection string to .env.local',
    )
  }
  return url
}

const sql = neon(getDatabaseUrl())

/** Shared Drizzle client (Neon HTTP). Safe for serverless / TanStack Start. */
export const db = drizzle({ client: sql, schema })

export { schema }
