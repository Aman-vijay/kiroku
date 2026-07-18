import { addDaysISO, todayLocalISO } from './dates'

/**
 * Consecutive days with an entry ending on the most recent entry date.
 * Skipped day → streak resets at the gap. Empty → 0.
 * Only counts if the most recent entry is today or yesterday
 * (ponytail: a streak that ended last week isn't "current").
 */
export function computeStreak(entryDates: string[], refDate?: string): number {
  if (entryDates.length === 0) return 0

  const today = refDate ?? todayLocalISO()
  const yesterday = addDaysISO(today, -1)

  const unique = [...new Set(entryDates)].sort((a, b) =>
    a < b ? 1 : a > b ? -1 : 0,
  )

  const mostRecent = unique[0]!
  if (mostRecent !== today && mostRecent !== yesterday) return 0

  let streak = 1
  let cursor = mostRecent

  for (let i = 1; i < unique.length; i++) {
    if (unique[i] === addDaysISO(cursor, -1)) {
      streak += 1
      cursor = unique[i]!
    } else {
      break
    }
  }

  return streak
}
