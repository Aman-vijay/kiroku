import { describe, expect, it } from 'vitest'
import {
  buildHeatmapGrid,
  HEATMAP_WEEKS,
  intensityLevel,
  weekdaySun0,
} from './heatmap'

describe('intensityLevel', () => {
  it('returns 0 for empty', () => {
    expect(intensityLevel(0, 100)).toBe(0)
    expect(intensityLevel(5, 0)).toBe(0)
  })

  it('buckets by quartile of max', () => {
    expect(intensityLevel(10, 100)).toBe(1)
    expect(intensityLevel(30, 100)).toBe(2)
    expect(intensityLevel(60, 100)).toBe(3)
    expect(intensityLevel(100, 100)).toBe(4)
  })
})

describe('weekdaySun0', () => {
  it('maps known dates', () => {
    // 2026-07-26 is a Sunday
    expect(weekdaySun0('2026-07-26')).toBe(0)
    // 2026-07-27 is Monday
    expect(weekdaySun0('2026-07-27')).toBe(1)
  })
})

describe('buildHeatmapGrid', () => {
  it('builds 52 weeks × 7 days by default', () => {
    const { cells, weeks } = buildHeatmapGrid([], {
      endDate: '2026-07-27',
    })
    expect(weeks).toBe(HEATMAP_WEEKS)
    expect(cells).toHaveLength(52)
    expect(cells[0]).toHaveLength(7)
  })

  it('fills aggregates into matching dates', () => {
    const { cells } = buildHeatmapGrid(
      [{ entryDate: '2026-07-27', minutes: 40, tasksDone: 2 }],
      { endDate: '2026-07-27', metric: 'minutes', weeks: 2 },
    )
    const flat = cells.flat()
    const hit = flat.find((c) => c.date === '2026-07-27')
    expect(hit?.minutes).toBe(40)
    expect(hit?.level).toBeGreaterThan(0)
  })
})
