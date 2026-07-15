import { config } from 'dotenv'
import { resolve } from 'path'
import { neon } from '@neondatabase/serverless'

config({ path: resolve(process.cwd(), '.env.local') })

const url = process.env.DATABASE_URL
if (!url) {
  console.error('FAIL: DATABASE_URL is missing from .env.local')
  process.exit(1)
}

const host = url.replace(/:[^:@/]+@/, ':****@').split('@')[1]?.split('/')[0]
console.log('Connecting to Neon host:', host)

const sql = neon(url)

try {
  const rows = await sql`select 1 as ok, current_database() as db, now() as ts`
  console.log('NEON_OK', rows)
  process.exit(0)
} catch (error) {
  console.error('NEON_FAIL', error instanceof Error ? error.message : error)
  process.exit(1)
}
