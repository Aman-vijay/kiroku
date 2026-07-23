import { createServerFn } from '@tanstack/react-start'
import { and, count, desc, eq, sql } from 'drizzle-orm'
import { db } from '#/lib/db'
import { goal, task } from '#/lib/db/schema'
import {
  createGoalSchema,
  goalIdSchema,
  updateGoalSchema,
} from '#/lib/validations/goal'
import { requireSession } from './session'

export type GoalDTO = {
  id: string
  title: string
  description: string | null
  startDate: string
  deadline: string
  status: string
  createdAt: string
  updatedAt: string
}

export type GoalWithStatsDTO = GoalDTO & {
  totalTasks: number
  doneCount: number
}

function toDTO(row: typeof goal.$inferSelect): GoalDTO {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    startDate: String(row.startDate),
    deadline: String(row.deadline),
    status: row.status,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  }
}

export const listGoals = createServerFn({ method: 'GET' }).handler(async () => {
  const session = await requireSession()
  const rows = await db
    .select()
    .from(goal)
    .where(eq(goal.userId, session.user.id))
    .orderBy(desc(goal.createdAt))

  return rows.map(toDTO)
})

/** Goals with total/done task counts for progress rings and badges. */
export const listGoalsWithStats = createServerFn({ method: 'GET' }).handler(
  async () => {
    const session = await requireSession()
    const rows = await db
      .select({
        id: goal.id,
        title: goal.title,
        description: goal.description,
        startDate: goal.startDate,
        deadline: goal.deadline,
        status: goal.status,
        createdAt: goal.createdAt,
        updatedAt: goal.updatedAt,
        totalTasks: count(task.id),
        doneCount: sql<number>`coalesce(sum(case when ${task.done} then 1 else 0 end), 0)::int`,
      })
      .from(goal)
      .leftJoin(
        task,
        and(eq(task.goalId, goal.id), eq(task.userId, session.user.id)),
      )
      .where(eq(goal.userId, session.user.id))
      .groupBy(goal.id)
      .orderBy(desc(goal.createdAt))

    return rows.map((row) => ({
      id: row.id,
      title: row.title,
      description: row.description,
      startDate: String(row.startDate),
      deadline: String(row.deadline),
      status: row.status,
      createdAt: row.createdAt.toISOString(),
      updatedAt: row.updatedAt.toISOString(),
      totalTasks: Number(row.totalTasks) || 0,
      doneCount: Number(row.doneCount) || 0,
    })) satisfies GoalWithStatsDTO[]
  },
)

export const getGoalById = createServerFn({ method: 'GET' })
  .inputValidator((data: unknown) => goalIdSchema.parse(data))
  .handler(async ({ data }) => {
    const session = await requireSession()
    const [row] = await db
      .select()
      .from(goal)
      .where(and(eq(goal.id, data.id), eq(goal.userId, session.user.id)))
      .limit(1)

    return row ? toDTO(row) : null
  })

export const createGoal = createServerFn({ method: 'POST' })
  .inputValidator((data: unknown) => createGoalSchema.parse(data))
  .handler(async ({ data }) => {
    const session = await requireSession()
    const now = new Date()
    const id = crypto.randomUUID()

    const [row] = await db
      .insert(goal)
      .values({
        id,
        userId: session.user.id,
        title: data.title,
        description: data.description ?? null,
        startDate: data.startDate,
        deadline: data.deadline,
        status: 'active',
        createdAt: now,
        updatedAt: now,
      })
      .returning()

    if (!row) throw new Error('Failed to create goal')
    return toDTO(row)
  })

export const updateGoal = createServerFn({ method: 'POST' })
  .inputValidator((data: unknown) => updateGoalSchema.parse(data))
  .handler(async ({ data }) => {
    const session = await requireSession()
    const patch: Partial<typeof goal.$inferInsert> = {
      updatedAt: new Date(),
    }
    if (data.title !== undefined) patch.title = data.title
    if (data.description !== undefined) patch.description = data.description
    if (data.status !== undefined) patch.status = data.status

    const [row] = await db
      .update(goal)
      .set(patch)
      .where(and(eq(goal.id, data.id), eq(goal.userId, session.user.id)))
      .returning()

    if (!row) throw new Error('Goal not found')
    return toDTO(row)
  })

export const deleteGoal = createServerFn({ method: 'POST' })
  .inputValidator((data: unknown) => goalIdSchema.parse(data))
  .handler(async ({ data }) => {
    const session = await requireSession()
    const [row] = await db
      .delete(goal)
      .where(and(eq(goal.id, data.id), eq(goal.userId, session.user.id)))
      .returning({ id: goal.id })

    if (!row) throw new Error('Goal not found')
    return { ok: true as const }
  })
