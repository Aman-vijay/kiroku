import { describe, expect, it } from 'vitest'
import { buildBurndownSeries, computeGoalProgress } from './progress'

describe('computeGoalProgress', () => {
  const base = {
    startDate: '2026-07-01',
    deadline: '2026-07-29', // 28 days span
    status: 'active',
  }

  it('marks done when status is done', () => {
    const p = computeGoalProgress({
      ...base,
      totalTasks: 10,
      doneCount: 3,
      status: 'done',
      today: '2026-07-10',
    })
    expect(p.paceStatus).toBe('done')
    expect(p.percent).toBe(30)
  })

  it('marks done when all planned tasks are complete', () => {
    const p = computeGoalProgress({
      ...base,
      totalTasks: 5,
      doneCount: 5,
      today: '2026-07-10',
    })
    expect(p.paceStatus).toBe('done')
    expect(p.percent).toBe(100)
  })

  it('marks overdue past deadline when not done', () => {
    const p = computeGoalProgress({
      ...base,
      totalTasks: 10,
      doneCount: 4,
      today: '2026-07-30',
    })
    expect(p.paceStatus).toBe('overdue')
  })

  it('is on track when pace meets required rate', () => {
    // 28-day span, 28 tasks → need 1/day. At day 7 elapsed with 7 done → on track.
    const p = computeGoalProgress({
      ...base,
      totalTasks: 28,
      doneCount: 7,
      today: '2026-07-08', // daysBetween start→today = 7
    })
    expect(p.paceStatus).toBe('on_track')
    expect(p.requiredRate).toBe(1)
    expect(p.actualRate).toBe(1)
  })

  it('is behind when pace misses required rate', () => {
    const p = computeGoalProgress({
      ...base,
      totalTasks: 28,
      doneCount: 2,
      today: '2026-07-08',
    })
    expect(p.paceStatus).toBe('behind')
  })

  it('is on track with zero tasks (nothing planned yet)', () => {
    const p = computeGoalProgress({
      ...base,
      totalTasks: 0,
      doneCount: 0,
      today: '2026-07-10',
    })
    expect(p.paceStatus).toBe('on_track')
    expect(p.percent).toBe(0)
  })

  it('marks abandoned when status is abandoned', () => {
    const p = computeGoalProgress({
      ...base,
      totalTasks: 10,
      doneCount: 1,
      status: 'abandoned',
      today: '2026-07-10',
    })
    expect(p.paceStatus).toBe('abandoned')
  })
})

describe('buildBurndownSeries', () => {
  it('ideal line goes from target to zero', () => {
    const { ideal } = buildBurndownSeries({
      startDate: '2026-07-01',
      deadline: '2026-07-05', // 4 days
      target: 8,
      doneDates: [],
      today: '2026-07-01',
    })
    expect(ideal[0]!.remaining).toBe(8)
    expect(ideal[ideal.length - 1]!.remaining).toBe(0)
  })

  it('actual remaining decreases with completions', () => {
    const { actual } = buildBurndownSeries({
      startDate: '2026-07-01',
      deadline: '2026-07-05',
      target: 4,
      doneDates: ['2026-07-01', '2026-07-02', '2026-07-02'],
      today: '2026-07-03',
    })
    // day 0: 1 done → remaining 3; day 1: +2 → remaining 1; day 2: 0 → remaining 1
    expect(actual[0]!.remaining).toBe(3)
    expect(actual[1]!.remaining).toBe(1)
    expect(actual[2]!.remaining).toBe(1)
  })
})
