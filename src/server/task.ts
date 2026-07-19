import { createServerFn } from '@tanstack/react-start'
import { and, asc, desc, eq } from 'drizzle-orm'
import { db } from '#/lib/db'
import { entry, task } from '#/lib/db/schema'
import {
  createTaskSchema,
  listTasksByDateSchema,
  listTasksByGoalSchema,
  taskIdSchema,
  updateTaskSchema,
} from '#/lib/validations/task'
import { upsertEntryRow } from './entries'
import { requireSession } from './session'

/** Line shape for a completed task inside the entry body. */
export function taskLine(title: string) {
  return `- [x] ${title}`
}

/** Append or remove a task line from today's entry body. */
export async function syncTaskToEntry(
  userId: string,
  entryDate: string,
  title: string,
  done: boolean,
) {
  const [existing] = await db
    .select()
    .from(entry)
    .where(and(eq(entry.userId, userId), eq(entry.entryDate, entryDate)))
    .limit(1)

  const line = taskLine(title)
  const body = existing?.body ?? ''

  if (done) {
    if (body.includes(line)) return
    const nextBody = body ? `${body}\n${line}` : line
    await upsertEntryRow(userId, {
      entryDate,
      title: existing?.title ?? null,
      body: nextBody,
      visibility: (existing?.visibility as 'private' | 'unlisted') ?? 'private',
      templateId: existing?.templateId ?? 'minimal-ink',
    })
  } else {
    const lines = body.split('\n')
    const idx = lines.findIndex((l) => l.trim() === line)
    if (idx === -1) return
    const nextBody = [...lines.slice(0, idx), ...lines.slice(idx + 1)]
      .join('\n')
      .trim()
    await upsertEntryRow(userId, {
      entryDate,
      title: existing?.title ?? null,
      body: nextBody,
      visibility: (existing?.visibility as 'private' | 'unlisted') ?? 'private',
      templateId: existing?.templateId ?? 'minimal-ink',
    })
  }
}

export type TaskDTO = {
  id: string
  entryDate: string
  title: string
  done: boolean
  minutesSpent: number | null
  goalId: string | null
  order: number
  createdAt: string
  updatedAt: string
  completedAt: string | null
}

function toDTO(row: typeof task.$inferSelect): TaskDTO {
  return {
    id: row.id,
    entryDate: String(row.entryDate),
    title: row.title,
    done: row.done,
    minutesSpent: row.minutesSpent ?? null,
    goalId: row.goalId ?? null,
    order: row.order,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
    completedAt: row.completedAt?.toISOString() ?? null,
  }
}

export const listTasksByDate = createServerFn({ method: 'GET' })
  .inputValidator((data: unknown) => listTasksByDateSchema.parse(data))
  .handler(async ({ data }) => {
    const session = await requireSession()
    const rows = await db
      .select()
      .from(task)
      .where(and(eq(task.userId, session.user.id), eq(task.entryDate, data.entryDate)))
      .orderBy(asc(task.order), asc(task.createdAt))

    return rows.map(toDTO)
  })

export const listTasksByGoal = createServerFn({ method: 'GET' })
  .inputValidator((data: unknown) => listTasksByGoalSchema.parse(data))
  .handler(async ({ data }) => {
    const session = await requireSession()
    const rows = await db
      .select()
      .from(task)
      .where(and(eq(task.userId, session.user.id), eq(task.goalId, data.goalId)))
      .orderBy(desc(task.entryDate), asc(task.order))

    return rows.map(toDTO)
  })

export const getTaskById = createServerFn({ method: 'GET' })
  .inputValidator((data: unknown) => taskIdSchema.parse(data))
  .handler(async ({ data }) => {
    const session = await requireSession()
    const [row] = await db
      .select()
      .from(task)
      .where(and(eq(task.id, data.id), eq(task.userId, session.user.id)))
      .limit(1)

    return row ? toDTO(row) : null
  })

export const createTask = createServerFn({ method: 'POST' })
  .inputValidator((data: unknown) => createTaskSchema.parse(data))
  .handler(async ({ data }) => {
    const session = await requireSession()
    const now = new Date()
    const id = crypto.randomUUID()

    const [row] = await db
      .insert(task)
      .values({
        id,
        userId: session.user.id,
        entryDate: data.entryDate,
        title: data.title,
        done: false,
        minutesSpent: null,
        goalId: data.goalId ?? null,
        order: data.order,
        createdAt: now,
        updatedAt: now,
        completedAt: null,
      })
      .returning()

    if (!row) throw new Error('Failed to create task')
    return toDTO(row)
  })

export const updateTask = createServerFn({ method: 'POST' })
  .inputValidator((data: unknown) => updateTaskSchema.parse(data))
  .handler(async ({ data }) => {
    const session = await requireSession()
    const patch: Partial<typeof task.$inferInsert> = {
      updatedAt: new Date(),
    }
    if (data.title !== undefined) patch.title = data.title
    if (data.done !== undefined) {
      patch.done = data.done
      patch.completedAt = data.done ? new Date() : null
    }
    if (data.minutesSpent !== undefined) {
      patch.minutesSpent = data.minutesSpent === null ? null : data.minutesSpent
    }
    if (data.goalId !== undefined) patch.goalId = data.goalId
    if (data.order !== undefined) patch.order = data.order

    const [row] = await db
      .update(task)
      .set(patch)
      .where(and(eq(task.id, data.id), eq(task.userId, session.user.id)))
      .returning()

    if (!row) throw new Error('Task not found')
    return toDTO(row)
  })

export const toggleTask = createServerFn({ method: 'POST' })
  .inputValidator((data: unknown) => taskIdSchema.parse(data))
  .handler(async ({ data }) => {
    const session = await requireSession()
    const now = new Date()

    const [existing] = await db
      .select()
      .from(task)
      .where(and(eq(task.id, data.id), eq(task.userId, session.user.id)))
      .limit(1)
    if (!existing) throw new Error('Task not found')

    const nextDone = !existing.done
    const [row] = await db
      .update(task)
      .set({
        done: nextDone,
        completedAt: nextDone ? now : null,
        updatedAt: now,
      })
      .where(and(eq(task.id, data.id), eq(task.userId, session.user.id)))
      .returning()

    if (!row) throw new Error('Task not found')

    // Auto-sync completed tasks into the day's entry body.
    // ponytail: best-effort line matching; if user edits the body shape,
    // un-tick may leave the line. A structured parser is deferred.
    await syncTaskToEntry(session.user.id, row.entryDate, row.title, nextDone)

    return toDTO(row)
  })

export const deleteTask = createServerFn({ method: 'POST' })
  .inputValidator((data: unknown) => taskIdSchema.parse(data))
  .handler(async ({ data }) => {
    const session = await requireSession()
    const [row] = await db
      .delete(task)
      .where(and(eq(task.id, data.id), eq(task.userId, session.user.id)))
      .returning({ id: task.id })

    if (!row) throw new Error('Task not found')
    return { ok: true as const }
  })
