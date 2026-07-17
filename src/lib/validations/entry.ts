import { z } from 'zod'
import { TEMPLATE_IDS } from '#/lib/templates'

const dateRegex = /^\d{4}-\d{2}-\d{2}$/

function isRealDate(value: string) {
  const [y, m, d] = value.split('-').map(Number)
  if (!y || !m || !d) return false
  const dt = new Date(Date.UTC(y, m - 1, d))
  return (
    dt.getUTCFullYear() === y &&
    dt.getUTCMonth() === m - 1 &&
    dt.getUTCDate() === d
  )
}

export const entryDateSchema = z
  .string()
  .regex(dateRegex, 'Date must be YYYY-MM-DD')
  .refine(isRealDate, 'Invalid calendar date')

export const entryVisibilitySchema = z.enum(['private', 'unlisted'])

export const templateIdSchema = z.enum(TEMPLATE_IDS)

export const createEntrySchema = z.object({
  entryDate: entryDateSchema,
  title: z
    .string()
    .trim()
    .max(120, 'Title must be 120 characters or less')
    .optional()
    .transform((v) => (v && v.length > 0 ? v : undefined)),
  body: z
    .string()
    .trim()
    .min(1, 'Body is required')
    .max(10_000, 'Body must be 10,000 characters or less'),
  visibility: entryVisibilitySchema.optional().default('private'),
  templateId: templateIdSchema.optional().default('minimal-ink'),
})

export const updateEntrySchema = z.object({
  id: z.string().min(1),
  title: z
    .string()
    .trim()
    .max(120, 'Title must be 120 characters or less')
    .optional()
    .nullable()
    .transform((v) => (v && v.length > 0 ? v : null)),
  body: z
    .string()
    .trim()
    .min(1, 'Body is required')
    .max(10_000, 'Body must be 10,000 characters or less')
    .optional(),
  visibility: entryVisibilitySchema.optional(),
  templateId: templateIdSchema.optional(),
})

export const listEntriesQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(100).optional().default(30),
  cursor: entryDateSchema.optional(),
})

export const entryIdSchema = z.object({
  id: z.string().min(1),
})

export const entryByDateSchema = z.object({
  entryDate: entryDateSchema,
})

export type CreateEntryInput = z.infer<typeof createEntrySchema>
export type UpdateEntryInput = z.infer<typeof updateEntrySchema>
export type ListEntriesQuery = z.infer<typeof listEntriesQuerySchema>
