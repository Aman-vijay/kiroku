import { describe, expect, it } from 'vitest'
import { addDaysISO, daysBetween, daysUntilDeadline, todayLocalISO } from './dates'
import { computeStreak } from './streak'

describe('computeStreak', () => {
  it('returns 0 for empty', () => {
    expect(computeStreak([])).toBe(0)
  })

  it('returns 1 for a single day', () => {
    expect(computeStreak(['2026-07-15'], '2026-07-15')).toBe(1)
  })

  it('counts consecutive days ending at most recent', () => {
    expect(
      computeStreak(['2026-07-17', '2026-07-16', '2026-07-15', '2026-07-10'], '2026-07-17'),
    ).toBe(3)
  })

  it('resets at a gap', () => {
    expect(computeStreak(['2026-07-15', '2026-07-13'], '2026-07-15')).toBe(1)
  })

  it('dedupes and sorts', () => {
    expect(
      computeStreak(['2026-07-15', '2026-07-17', '2026-07-17', '2026-07-16'], '2026-07-17'),
    ).toBe(3)
  })

  it('returns 0 when most recent entry is older than yesterday', () => {
    expect(computeStreak(['2026-07-10', '2026-07-09'], '2026-07-17')).toBe(0)
  })

  it('counts streak when most recent is yesterday', () => {
    expect(computeStreak(['2026-07-16', '2026-07-15'], '2026-07-17')).toBe(2)
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

  it('daysBetween counts whole days across months', () => {
    expect(daysBetween('2026-07-17', '2026-07-20')).toBe(3)
    expect(daysBetween('2026-07-31', '2026-08-02')).toBe(2)
    expect(daysBetween('2026-07-20', '2026-07-17')).toBe(-3)
  })

  it('daysUntilDeadline uses today as the origin', () => {
    const today = todayLocalISO()
    expect(daysUntilDeadline(today)).toBe(0)
    expect(daysUntilDeadline(addDaysISO(today, 5))).toBe(5)
    expect(daysUntilDeadline(addDaysISO(today, -2))).toBe(-2)
  })
})
