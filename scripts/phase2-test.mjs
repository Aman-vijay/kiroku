import { config } from 'dotenv'
import { resolve } from 'path'
import { and, eq } from 'drizzle-orm'
import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import * as schema from '../src/lib/db/schema/index.js'

config({ path: resolve(process.cwd(), '.env.local') })

const sql = neon(process.env.DATABASE_URL)
const db = drizzle({ client: sql, schema })

// Inline mirror of src/server/task.ts auto-sync + upsertEntryRow.
// (Server module can't be imported under tsx due to import.meta.env.SSR.)
function taskLine(title) {
  return `- [x] ${title}`
}

async function upsertEntryRow(userId, entryDate, body, existing) {
  const now = new Date()
  const id = existing?.id ?? `ent-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
  await db
    .insert(schema.entry)
    .values({
      id,
      userId,
      entryDate,
      title: existing?.title ?? null,
      body,
      visibility: existing?.visibility ?? 'private',
      templateId: existing?.templateId ?? 'minimal-ink',
      createdAt: now,
      updatedAt: now,
    })
    .onConflictDoUpdate({
      target: [schema.entry.userId, schema.entry.entryDate],
      set: {
        title: existing?.title ?? null,
        body,
        visibility: existing?.visibility ?? 'private',
        templateId: existing?.templateId ?? 'minimal-ink',
        updatedAt: now,
      },
    })
}

async function syncTaskToEntry(userId, entryDate, title, done) {
  const [existing] = await db
    .select()
    .from(schema.entry)
    .where(and(eq(schema.entry.userId, userId), eq(schema.entry.entryDate, entryDate)))
    .limit(1)
  const line = taskLine(title)
  const body = existing?.body ?? ''
  if (done) {
    if (body.includes(line)) return
    const nextBody = body ? `${body}\n${line}` : line
    await upsertEntryRow(userId, entryDate, nextBody, existing)
  } else {
    const lines = body.split('\n')
    const idx = lines.findIndex((l) => l.trim() === line)
    if (idx === -1) return
    const nextBody = [...lines.slice(0, idx), ...lines.slice(idx + 1)].join('\n').trim()
    await upsertEntryRow(userId, entryDate, nextBody, existing)
  }
}

async function readEntry(userId, entryDate) {
  const [row] = await db
    .select()
    .from(schema.entry)
    .where(and(eq(schema.entry.userId, userId), eq(schema.entry.entryDate, entryDate)))
    .limit(1)
  return row
}

const testId = `test-${Date.now()}`
const userId = `user-${testId}`
const entryDate = '2026-07-26'

async function main() {
  // Seed a test user (required by FKs)
  await db.insert(schema.user).values({
    id: userId,
    name: 'Test User',
    email: `${testId}@example.com`,
    emailVerified: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  })
  // Ensure no entry exists
  await db
    .delete(schema.entry)
    .where(and(eq(schema.entry.userId, userId), eq(schema.entry.entryDate, entryDate)))

  // 1. Tick a task -> entry auto-created with the line
  await syncTaskToEntry(userId, entryDate, 'Review resume', true)
  const created = await readEntry(userId, entryDate)
  if (!created) throw new Error('Entry was not auto-created')
  if (!created.body.includes(taskLine('Review resume'))) {
    throw new Error(`Auto-create body mismatch: ${created.body}`)
  }
  console.log('Auto-create body:', created.body)

  // 2. Tick a second task -> line appended
  await syncTaskToEntry(userId, entryDate, 'Mock interview', true)
  const appended = await readEntry(userId, entryDate)
  if (!appended) throw new Error('Entry missing after append')
  if (!appended.body.includes(taskLine('Review resume'))) throw new Error('First line lost')
  if (!appended.body.includes(taskLine('Mock interview'))) throw new Error('Second line not appended')
  console.log('Append body:', appended.body)

  // 3. Untick first task -> its line removed
  await syncTaskToEntry(userId, entryDate, 'Review resume', false)
  const removed = await readEntry(userId, entryDate)
  if (!removed) throw new Error('Entry missing after remove')
  if (removed.body.includes(taskLine('Review resume'))) throw new Error('First line still present')
  if (!removed.body.includes(taskLine('Mock interview'))) throw new Error('Second line lost')
  console.log('Remove body:', removed.body)

  // 4. Idempotent tick (no duplicate line)
  await syncTaskToEntry(userId, entryDate, 'Mock interview', true)
  const idem = await readEntry(userId, entryDate)
  const count = (idem.body.match(new RegExp(taskLine('Mock interview').replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) || []).length
  if (count !== 1) throw new Error(`Idempotency broken: ${count} occurrences`)

  // Cleanup
  await db
    .delete(schema.entry)
    .where(and(eq(schema.entry.userId, userId), eq(schema.entry.entryDate, entryDate)))
  await db.delete(schema.user).where(eq(schema.user.id, userId))

  console.log('PHASE2_OK')
}

main().catch((e) => {
  console.error('PHASE2_FAIL', e)
  process.exit(1)
})