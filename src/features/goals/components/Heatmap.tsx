import { useMemo } from 'react'
import {
  buildHeatmapGrid,
  monthLabelsForGrid,
  type DailyAggregate,
  type HeatmapMetric,
  HEATMAP_WEEKS,
} from '../lib/heatmap'

const WEEKDAY_LABELS = ['', 'Mon', '', 'Wed', '', 'Fri', ''] as const

const LEVEL_COLORS: Record<0 | 1 | 2 | 3 | 4, string> = {
  0: 'var(--surface)',
  1: 'color-mix(in oklab, var(--primary) 25%, var(--surface))',
  2: 'color-mix(in oklab, var(--primary) 45%, var(--surface))',
  3: 'color-mix(in oklab, var(--primary) 70%, var(--surface))',
  4: 'var(--primary)',
}

type HeatmapProps = {
  aggregates: DailyAggregate[]
  metric: HeatmapMetric
  endDate?: string
  weeks?: number
}

export function Heatmap({
  aggregates,
  metric,
  endDate,
  weeks = HEATMAP_WEEKS,
}: HeatmapProps) {
  const grid = useMemo(
    () => buildHeatmapGrid(aggregates, { weeks, endDate, metric }),
    [aggregates, weeks, endDate, metric],
  )
  const months = useMemo(() => monthLabelsForGrid(grid.cells), [grid.cells])

  const cell = 11
  const gap = 3
  const labelW = 28
  const monthH = 16
  const cols = grid.weeks
  const width = labelW + cols * (cell + gap)
  const height = monthH + 7 * (cell + gap)

  return (
    <div className="overflow-x-auto">
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        role="img"
        aria-label={`Contribution heatmap for the last ${weeks} weeks, colored by ${metric === 'minutes' ? 'minutes spent' : 'tasks done'}`}
      >
        {months.map((m) => (
          <text
            key={`${m.weekIndex}-${m.label}`}
            x={labelW + m.weekIndex * (cell + gap)}
            y={11}
            fill="var(--muted)"
            fontSize={10}
          >
            {m.label}
          </text>
        ))}

        {WEEKDAY_LABELS.map((label, i) =>
          label ? (
            <text
              key={label + i}
              x={0}
              y={monthH + i * (cell + gap) + cell - 1}
              fill="var(--muted)"
              fontSize={9}
            >
              {label}
            </text>
          ) : null,
        )}

        {grid.cells.map((col, wi) =>
          col.map((c, di) => {
            const x = labelW + wi * (cell + gap)
            const y = monthH + di * (cell + gap)
            if (c.empty) {
              return (
                <rect
                  key={c.date}
                  x={x}
                  y={y}
                  width={cell}
                  height={cell}
                  rx={2}
                  fill="transparent"
                />
              )
            }
            const level = c.level ?? 0
            const title =
              metric === 'minutes'
                ? `${c.date}: ${c.minutes} min`
                : `${c.date}: ${c.tasksDone} task${c.tasksDone === 1 ? '' : 's'} done`
            return (
              <rect
                key={c.date}
                x={x}
                y={y}
                width={cell}
                height={cell}
                rx={2}
                fill={LEVEL_COLORS[level]}
                stroke="var(--line)"
                strokeWidth={0.5}
              >
                <title>{title}</title>
              </rect>
            )
          }),
        )}
      </svg>

      <div className="mt-3 flex items-center gap-1.5 text-[0.7rem] text-[var(--muted)]">
        <span>Less</span>
        {([0, 1, 2, 3, 4] as const).map((lvl) => (
          <span
            key={lvl}
            className="inline-block h-2.5 w-2.5 rounded-sm border border-[var(--line)]"
            style={{ background: LEVEL_COLORS[lvl] }}
            aria-hidden
          />
        ))}
        <span>More</span>
      </div>
    </div>
  )
}
