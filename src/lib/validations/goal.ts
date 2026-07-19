import { z } from 'zod'
import { entryDateSchema } from './entry'

export const goalStatusSchema = z.enum(['active', 'done', 'abandoned'])

export const createGoalSchema = z.object({
  title: z.string().trim().min(1).max(120),
  description: z.string().trim().max(500).optional(),
  startDate: entryDateSchema,
  deadline: entryDateSchema,
})
  .refine((data) => {
    const [sy, sm, sd] = data.startDate.split('-').map(Number)
    const [dy, dm, dd] = data.deadline.split('-').map(Number)
    const start = new Date(Date.UTC(sy, sm - 1, sd))
    const deadline = new Date(Date.UTC(dy, dm - 1, dd))
    const maxDeadline = new Date(Date.UTC(sy, sm - 1, sd))
    maxDeadline.setUTCDate(maxDeadline.getUTCDate() + 28)
    return deadline <= maxDeadline && deadline >= start
  }, {
    message: 'Deadline must be within 28 days of start date and not before it',
  })
  .refine((data) => {
    const [y, m, d] = data.startDate.split('-').map(Number)
    const start = new Date(Date.UTC(y, m - 1, d))
    const today = new Date(Date.UTC(
      new Date().getFullYear(),
      new Date().getMonth(),
      new Date().getDate(),
    ))
    return start <= today
  }, {
    message: 'Start date cannot be in the future',
  })

export const updateGoalSchema = z.object({
  id: z.string().min(1),
  title: z.string().trim().min(1).max(120).optional(),
  description: z.string().trim().max(500).optional().nullable(),
  status: goalStatusSchema.optional(),
})

export const goalIdSchema = z.object({
  id: z.string().min(1),
})

export type CreateGoalInput = z.infer<typeof createGoalSchema>
export type UpdateGoalInput = z.infer<typeof updateGoalSchema>
export type GoalStatus = z.infer<typeof goalStatusSchema>
