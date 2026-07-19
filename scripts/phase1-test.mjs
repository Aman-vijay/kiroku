import { config } from 'dotenv'
import { resolve } from 'path'
import { neon } from '@neondatabase/serverless'

config({ path: resolve(process.cwd(), '.env.local') })

const url = process.env.DATABASE_URL
if (!url) {
  console.error('FAIL: DATABASE_URL missing')
  process.exit(1)
}

const sql = neon(url)

async function main() {
  // 1. Verify tables exist
  const tables = await sql`
    SELECT table_name
    FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name IN ('goal', 'task')
  `
  console.log('Found tables:', tables.map((t) => t.table_name))

  // 2. Verify columns
  const goalCols = await sql`
    SELECT column_name FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'goal'
  `
  const taskCols = await sql`
    SELECT column_name FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'task'
  `
  console.log('goal columns:', goalCols.map((c) => c.column_name).join(', '))
  console.log('task columns:', taskCols.map((c) => c.column_name).join(', '))

  // 3. Verify foreign keys
  const fks = await sql`
    SELECT
      tc.table_name,
      kcu.column_name,
      ccu.table_name AS foreign_table_name,
      ccu.column_name AS foreign_column_name
    FROM information_schema.table_constraints AS tc
    JOIN information_schema.key_column_usage AS kcu
      ON tc.constraint_name = kcu.constraint_name
    JOIN information_schema.constraint_column_usage AS ccu
      ON ccu.constraint_name = tc.constraint_name
    WHERE tc.constraint_type = 'FOREIGN KEY'
      AND tc.table_name IN ('goal', 'task')
  `
  console.log('FKs:', fks)

  // 4. Show any drizzle migration tracking tables
  const drizzleTables = await sql`
    SELECT table_name
    FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name ILIKE '%drizzle%'
  `
  console.log('Drizzle tracking tables:', drizzleTables.map((t) => t.table_name))

  // 5. Verify existing entry table is still intact
  const entryTables = await sql`
    SELECT table_name
    FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'entry'
  `
  console.log('Entry table exists:', entryTables.length === 1)

  console.log('PHASE1_OK')
}

main().catch((e) => {
  console.error('PHASE1_FAIL', e instanceof Error ? e.message : e)
  process.exit(1)
})
