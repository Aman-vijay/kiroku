import { createServerFn } from '@tanstack/react-start'
import { and, desc, eq, lt } from 'drizzle-orm'
import { db } from '#/lib/db'
import { entry, user } from '#/lib/db/schema'
import {
  createEntrySchema,
  entryByDateSchema,
  entryIdSchema,
  listEntriesQuerySchema,
  updateEntrySchema,
} from '#/lib/validations/entry'
import { requireSession } from './session'

export type EntryDTO = {
  id: string
  entryDate: string
  title: string | null
  body: string
  visibility: string
  templateId: string
  shareSlug: string | null
  createdAt: string
  updatedAt: string
}

export type PublicEntryDTO = {
  entryDate: string
  title: string | null
  body: string
  templateId: string
  username: string | null
}

function toDTO(row: typeof entry.$inferSelect): EntryDTO {
  return {
    id: row.id,
    entryDate: String(row.entryDate),
    title: row.title,
    body: row.body,
    visibility: row.visibility,
    templateId: row.templateId,
    shareSlug: row.shareSlug,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  }
}

function newSlug() {
  return crypto.randomUUID().replace(/-/g, '').slice(0, 12)
}

export const listEntries = createServerFn({ method: 'GET' })
  .inputValidator((data: unknown) => listEntriesQuerySchema.parse(data ?? {}))
  .handler(async ({ data }) => {
    const session = await requireSession()
    const conditions = [eq(entry.userId, session.user.id)]
    if (data.cursor) {
      conditions.push(lt(entry.entryDate, data.cursor))
    }

    const rows = await db
      .select()
      .from(entry)
      .where(and(...conditions))
      .orderBy(desc(entry.entryDate))
      .limit(data.limit)

    return rows.map(toDTO)
  })

export const getEntryById = createServerFn({ method: 'GET' })
  .inputValidator((data: unknown) => entryIdSchema.parse(data))
  .handler(async ({ data }) => {
    const session = await requireSession()
    const [row] = await db
      .select()
      .from(entry)
      .where(and(eq(entry.id, data.id), eq(entry.userId, session.user.id)))
      .limit(1)

    return row ? toDTO(row) : null
  })

export const getEntryByDate = createServerFn({ method: 'GET' })
  .inputValidator((data: unknown) => entryByDateSchema.parse(data))
  .handler(async ({ data }) => {
    const session = await requireSession()
    const [row] = await db
      .select()
      .from(entry)
      .where(
        and(
          eq(entry.userId, session.user.id),
          eq(entry.entryDate, data.entryDate),
        ),
      )
      .limit(1)

    return row ? toDTO(row) : null
  })

export const upsertEntry = createServerFn({ method: 'POST' })
  .inputValidator((data: unknown) => createEntrySchema.parse(data))
  .handler(async ({ data }) => {
    const session = await requireSession()
    const now = new Date()
    const id = crypto.randomUUID()

    const [row] = await db
      .insert(entry)
      .values({
        id,
        userId: session.user.id,
        entryDate: data.entryDate,
        title: data.title ?? null,
        body: data.body,
        visibility: data.visibility,
        templateId: data.templateId,
        createdAt: now,
        updatedAt: now,
      })
      .onConflictDoUpdate({
        target: [entry.userId, entry.entryDate],
        set: {
          title: data.title ?? null,
          body: data.body,
          visibility: data.visibility,
          templateId: data.templateId,
          updatedAt: now,
        },
      })
      .returning()

    if (!row) throw new Error('Failed to save entry')
    return toDTO(row)
  })

export const updateEntry = createServerFn({ method: 'POST' })
  .inputValidator((data: unknown) => updateEntrySchema.parse(data))
  .handler(async ({ data }) => {
    const session = await requireSession()
    const patch: Partial<typeof entry.$inferInsert> = {
      updatedAt: new Date(),
    }
    if (data.title !== undefined) patch.title = data.title
    if (data.body !== undefined) patch.body = data.body
    if (data.visibility !== undefined) patch.visibility = data.visibility
    if (data.templateId !== undefined) patch.templateId = data.templateId

    const [row] = await db
      .update(entry)
      .set(patch)
      .where(and(eq(entry.id, data.id), eq(entry.userId, session.user.id)))
      .returning()

    if (!row) throw new Error('Entry not found')
    return toDTO(row)
  })

export const deleteEntry = createServerFn({ method: 'POST' })
  .inputValidator((data: unknown) => entryIdSchema.parse(data))
  .handler(async ({ data }) => {
    const session = await requireSession()
    const [row] = await db
      .delete(entry)
      .where(and(eq(entry.id, data.id), eq(entry.userId, session.user.id)))
      .returning({ id: entry.id })

    if (!row) throw new Error('Entry not found')
    return { ok: true as const }
  })

export const enableEntryShare = createServerFn({ method: 'POST' })
  .inputValidator((data: unknown) => entryIdSchema.parse(data))
  .handler(async ({ data }) => {
    const session = await requireSession()
    const [existing] = await db
      .select()
      .from(entry)
      .where(and(eq(entry.id, data.id), eq(entry.userId, session.user.id)))
      .limit(1)

    if (!existing) throw new Error('Entry not found')

    const shareSlug = existing.shareSlug ?? newSlug()
    const [row] = await db
      .update(entry)
      .set({
        shareSlug,
        visibility: 'unlisted',
        updatedAt: new Date(),
      })
      .where(and(eq(entry.id, data.id), eq(entry.userId, session.user.id)))
      .returning()

    if (!row) throw new Error('Failed to enable share')
    return { shareSlug: row.shareSlug! }
  })

export const disableEntryShare = createServerFn({ method: 'POST' })
  .inputValidator((data: unknown) => entryIdSchema.parse(data))
  .handler(async ({ data }) => {
    const session = await requireSession()
    const [row] = await db
      .update(entry)
      .set({
        shareSlug: null,
        visibility: 'private',
        updatedAt: new Date(),
      })
      .where(and(eq(entry.id, data.id), eq(entry.userId, session.user.id)))
      .returning({ id: entry.id })

    if (!row) throw new Error('Entry not found')
    return { ok: true as const }
  })

/** Public, no auth — only unlisted entries with a slug. */
export const getPublicEntry = createServerFn({ method: 'GET' })
  .inputValidator((data: unknown) => {
    const slug =
      typeof data === 'object' && data && 'slug' in data
        ? String((data as { slug: unknown }).slug)
        : ''
    if (!slug || slug.length < 6 || slug.length > 64) {
      throw new Error('Invalid slug')
    }
    return { slug }
  })
  .handler(async ({ data }): Promise<PublicEntryDTO | null> => {
    const [row] = await db
      .select({
        entryDate: entry.entryDate,
        title: entry.title,
        body: entry.body,
        templateId: entry.templateId,
        visibility: entry.visibility,
        username: user.name,
      })
      .from(entry)
      .innerJoin(user, eq(entry.userId, user.id))
      .where(eq(entry.shareSlug, data.slug))
      .limit(1)

    if (!row || row.visibility !== 'unlisted') return null

    return {
      entryDate: String(row.entryDate),
      title: row.title,
      body: row.body,
      templateId: row.templateId,
      username: row.username?.split(' ')[0] ?? null,
    }
  })
