import { describe, expect, it } from 'vitest'
import { addDaysISO, todayLocalISO } from './dates'
import { computeStreak } from './streak'

describe('computeStreak', () => {
  it('returns 0 for empty', () => {
    expect(computeStreak([])).toBe(0)
  })

  it('returns 1 for a single day', () => {
    expect(computeStreak(['2026-07-15'])).toBe(1)
  })

  it('counts consecutive days ending at most recent', () => {
    expect(
      computeStreak(['2026-07-15', '2026-07-14', '2026-07-13', '2026-07-10']),
    ).toBe(3)
  })

  it('resets at a gap', () => {
    expect(computeStreak(['2026-07-15', '2026-07-13'])).toBe(1)
  })

  it('dedupes and sorts', () => {
    expect(
      computeStreak(['2026-07-13', '2026-07-15', '2026-07-15', '2026-07-14']),
    ).toBe(3)
  })
})

describe('dates', () => {
  it('formats today as YYYY-MM-DD', () => {
    expect(todayLocalISO(new Date(2026, 6, 17))).toBe('2026-07-17')
  })

  it('addDaysISO shifts calendar days', () => {
    expect(addDaysISO('2026-07-17', -1)).toBe('2026-07-16')
    expect(addDaysISO('2026-03-01', -1)).toBe('2026-02-28')
  })
})
