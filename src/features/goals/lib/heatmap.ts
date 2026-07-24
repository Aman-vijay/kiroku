import { addDaysISO, todayLocalISO } from '#/features/entries/lib/dates'

/** GitHub-style year grid: 52 weeks × 7 days = 364 days (plus padding to week start). */
export const HEATMAP_WEEKS = 52

export type DailyAggregate = {
  entryDate: string
  minutes: number
  tasksDone: number
}

export type HeatmapCell = {
  date: string
  minutes: number
  tasksDone: number
  /** null = padding outside the active range */
  level: 0 | 1 | 2 | 3 | 4 | null
  /** true when the cell is outside the fetched range (empty pad) */
  empty: boolean
}

export type HeatmapMetric = 'minutes' | 'tasks'

/**
 * Build a column-major grid (weeks left→right, Sun→Sat top→bottom)
 * covering the last `weeks` full weeks ending on the week of `endDate`.
 */
export function buildHeatmapGrid(
  aggregates: DailyAggregate[],
  opts?: {
    weeks?: number
    endDate?: string
    metric?: HeatmapMetric
  },
): {
  cells: HeatmapCell[][]
  weeks: number
  startDate: string
  endDate: string
  maxValue: number
} {
  const weeks = opts?.weeks ?? HEATMAP_WEEKS
  const endDate = opts?.endDate ?? todayLocalISO()
  const metric = opts?.metric ?? 'minutes'

  // Align end to Saturday of its week (Sun=0 … Sat=6), GitHub-style columns.
  const endDow = weekdaySun0(endDate)
  const gridEnd = addDaysISO(endDate, 6 - endDow)
  const totalDays = weeks * 7
  const gridStart = addDaysISO(gridEnd, -(totalDays - 1))

  const byDate = new Map(
    aggregates.map((a) => [a.entryDate, a] as const),
  )

  let maxValue = 0
  for (const a of aggregates) {
    const v = metric === 'minutes' ? a.minutes : a.tasksDone
    if (v > maxValue) maxValue = v
  }

  const cells: HeatmapCell[][] = []
  for (let w = 0; w < weeks; w++) {
    const col: HeatmapCell[] = []
    for (let d = 0; d < 7; d++) {
      const date = addDaysISO(gridStart, w * 7 + d)
      const empty = date > endDate
      const agg = byDate.get(date)
      const minutes = agg?.minutes ?? 0
      const tasksDone = agg?.tasksDone ?? 0
      const value = metric === 'minutes' ? minutes : tasksDone
      const level = empty ? null : intensityLevel(value, maxValue)
      col.push({ date, minutes, tasksDone, level, empty })
    }
    cells.push(col)
  }

  return {
    cells,
    weeks,
    startDate: gridStart,
    endDate: gridEnd,
    maxValue,
  }
}

/** Map a value to GitHub-like 0–4 intensity. */
export function intensityLevel(
  value: number,
  max: number,
): 0 | 1 | 2 | 3 | 4 {
  if (value <= 0 || max <= 0) return 0
  const ratio = value / max
  if (ratio <= 0.25) return 1
  if (ratio <= 0.5) return 2
  if (ratio <= 0.75) return 3
  return 4
}

/** Sunday = 0 … Saturday = 6 for a YYYY-MM-DD (UTC calendar). */
export function weekdaySun0(iso: string): number {
  const [y, m, d] = iso.split('-').map(Number)
  const dt = new Date(Date.UTC(y!, m! - 1, d!))
  return dt.getUTCDay()
}

export function monthLabelsForGrid(
  cells: HeatmapCell[][],
): { weekIndex: number; label: string }[] {
  const labels: { weekIndex: number; label: string }[] = []
  let lastMonth = -1
  for (let w = 0; w < cells.length; w++) {
    const first = cells[w]?.[0]
    if (!first) continue
    const [y, m] = first.date.split('-').map(Number)
    if (m === lastMonth) continue
    // Skip first week if the month already started mid-column looks tight
    lastMonth = m!
    const label = new Date(Date.UTC(y!, m! - 1, 1)).toLocaleString(undefined, {
      month: 'short',
      timeZone: 'UTC',
    })
    labels.push({ weekIndex: w, label })
  }
  return labels
}
