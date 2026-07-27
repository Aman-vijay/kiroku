/**
 * Port of scripts/phase1-test.mjs + phase4-goal-test.mjs — schema / validation rules (no DB).
 */
import { describe, expect, it } from 'vitest'
import {
  createGoalSchema,
  goalStatusSchema,
  updateGoalSchema,
} from './goal'
import {
  createTaskSchema,
  listTasksByGoalSchema,
  updateTaskSchema,
} from './task'

describe('goal + task schemas (phase1/4)', () => {
  it('accepts active/done/abandoned statuses', () => {
    expect(goalStatusSchema.parse('active')).toBe('active')
    expect(goalStatusSchema.parse('done')).toBe('done')
    expect(goalStatusSchema.parse('abandoned')).toBe('abandoned')
    expect(() => goalStatusSchema.parse('wip')).toThrow()
  })

  it('createGoal clamps deadline within 28 days of start', () => {
    const ok = createGoalSchema.safeParse({
      title: 'Interview prep',
      startDate: '2026-07-01',
      deadline: '2026-07-29',
    })
    expect(ok.success).toBe(true)

    const tooLong = createGoalSchema.safeParse({
      title: 'Interview prep',
      startDate: '2026-07-01',
      deadline: '2026-08-01',
    })
    expect(tooLong.success).toBe(false)

    const beforeStart = createGoalSchema.safeParse({
      title: 'Interview prep',
      startDate: '2026-07-10',
      deadline: '2026-07-05',
    })
    expect(beforeStart.success).toBe(false)
  })

  it('updateGoal allows status-only patches', () => {
    const parsed = updateGoalSchema.parse({
      id: 'goal-1',
      status: 'done',
    })
    expect(parsed.status).toBe('done')
  })

  it('createTask accepts optional goalId (tagging)', () => {
    const parsed = createTaskSchema.parse({
      entryDate: '2026-07-20',
      title: 'Review resume',
      order: 0,
      goalId: 'goal-abc',
    })
    expect(parsed.goalId).toBe('goal-abc')
  })

  it('updateTask can clear goalId (set null after goal delete)', () => {
    const parsed = updateTaskSchema.parse({
      id: 'task-1',
      goalId: null,
    })
    expect(parsed.goalId).toBeNull()
  })

  it('listTasksByGoal requires goalId', () => {
    expect(
      listTasksByGoalSchema.parse({ goalId: 'goal-1' }).goalId,
    ).toBe('goal-1')
  })
})
