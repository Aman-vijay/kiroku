import { z } from 'zod'
import { entryDateSchema } from './entry'

export const createTaskSchema = z.object({
  entryDate: entryDateSchema,
  title: z.string().trim().min(1).max(200),
  goalId: z.string().min(1).optional(),
  order: z.coerce.number().int().min(0).optional().default(0),
})

export const updateTaskSchema = z.object({
  id: z.string().min(1),
  title: z.string().trim().min(1).max(200).optional(),
  done: z.boolean().optional(),
  minutesSpent: z.coerce.number().int().min(0).max(1440).optional().nullable(),
  goalId: z.string().min(1).optional().nullable(),
  order: z.coerce.number().int().min(0).optional(),
})

export const taskIdSchema = z.object({
  id: z.string().min(1),
})

export const listTasksByDateSchema = z.object({
  entryDate: entryDateSchema,
})

export const listTasksByGoalSchema = z.object({
  goalId: z.string().min(1),
})

export type CreateTaskInput = z.infer<typeof createTaskSchema>
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>
