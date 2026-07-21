import { config } from 'dotenv'
import { resolve } from 'path'
import { and, eq } from 'drizzle-orm'
import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import * as schema from '../src/lib/db/schema/index.js'

config({ path: resolve(process.cwd(), '.env.local') })

const sql = neon(process.env.DATABASE_URL)
const db = drizzle({ client: sql, schema })

const testId = `gt-${Date.now()}`
const userId = `user-${testId}`
const goalId = `goal-${testId}`
const taskId = `task-${testId}`
const entryDate = '2026-07-20'

async function main() {
  // Seed user
  await db.insert(schema.user).values({
    id: userId,
    name: 'Goal Test',
    email: `${testId}@example.com`,
    emailVerified: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  })

  // Create a goal directly (mirror of createGoal server fn)
  await db.insert(schema.goal).values({
    id: goalId,
    userId,
    title: 'Interview prep',
    description: 'Crack the Aug interview',
    startDate: entryDate,
    deadline: '2026-08-10',
    status: 'active',
    createdAt: new Date(),
    updatedAt: new Date(),
  })
  const [g] = await db.select().from(schema.goal).where(eq(schema.goal.id, goalId)).limit(1)
  if (!g || g.title !== 'Interview prep') throw new Error('Goal not created')
  console.log('Goal created:', g.title, '→', g.deadline)

  // Create a task tagged to the goal
  await db.insert(schema.task).values({
    id: taskId,
    userId,
    entryDate,
    title: 'Review resume',
    done: false,
    minutesSpent: null,
    goalId,
    order: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
    completedAt: null,
  })
  const [t] = await db.select().from(schema.task).where(eq(schema.task.id, taskId)).limit(1)
  if (!t || t.goalId !== goalId) throw new Error('Task not tagged to goal')
  console.log('Task tagged to goal:', t.title, '→ goalId', t.goalId)

  // List tasks by goal (mirror of listTasksByGoal)
  const rows = await db
    .select()
    .from(schema.task)
    .where(and(eq(schema.task.userId, userId), eq(schema.task.goalId, goalId)))
  if (rows.length !== 1) throw new Error(`Expected 1 task for goal, got ${rows.length}`)

  // Deleting the goal should set task.goalId to null (ON DELETE SET NULL)
  await db.delete(schema.goal).where(eq(schema.goal.id, goalId))
  const [tAfter] = await db.select().from(schema.task).where(eq(schema.task.id, taskId)).limit(1)
  if (!tAfter) throw new Error('Task deleted with goal')
  if (tAfter.goalId !== null) throw new Error(`Expected goalId null after goal delete, got ${tAfter.goalId}`)
  console.log('Goal deleted; task.goalId now null ✓')

  // Cleanup
  await db.delete(schema.task).where(eq(schema.task.id, taskId))
  await db.delete(schema.user).where(eq(schema.user.id, userId))

  console.log('PHASE4_GOAL_OK')
}

main().catch((e) => {
  console.error('PHASE4_GOAL_FAIL', e)
  process.exit(1)
})