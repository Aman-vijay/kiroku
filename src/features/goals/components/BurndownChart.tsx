import { buildBurndownSeries } from '../lib/progress'

type BurndownChartProps = {
  startDate: string
  deadline: string
  target: number
  doneDates: string[]
  today?: string
  width?: number
  height?: number
  className?: string
}

/**
 * Small SVG burndown: ideal linear remaining vs actual remaining over days.
 */
export function BurndownChart({
  startDate,
  deadline,
  target,
  doneDates,
  today,
  width = 280,
  height = 120,
  className,
}: BurndownChartProps) {
  const pad = { t: 8, r: 8, b: 20, l: 28 }
  const innerW = width - pad.l - pad.r
  const innerH = height - pad.t - pad.b

  const { ideal, actual } = buildBurndownSeries({
    startDate,
    deadline,
    target,
    doneDates,
    today,
  })

  const maxDay = Math.max(1, ideal[ideal.length - 1]?.day ?? 1)
  const maxY = Math.max(1, target, ...ideal.map((p) => p.remaining))

  function x(day: number) {
    return pad.l + (day / maxDay) * innerW
  }
  function y(remaining: number) {
    return pad.t + (1 - remaining / maxY) * innerH
  }

  function toPath(points: { day: number; remaining: number }[]) {
    if (points.length === 0) return ''
    return points
      .map((p, i) => `${i === 0 ? 'M' : 'L'} ${x(p.day).toFixed(1)} ${y(p.remaining).toFixed(1)}`)
      .join(' ')
  }

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className={className}
      role="img"
      aria-label="Burndown chart: tasks remaining over time"
    >
      {/* axes */}
      <line
        x1={pad.l}
        y1={pad.t}
        x2={pad.l}
        y2={pad.t + innerH}
        stroke="var(--line)"
        strokeWidth={1}
      />
      <line
        x1={pad.l}
        y1={pad.t + innerH}
        x2={pad.l + innerW}
        y2={pad.t + innerH}
        stroke="var(--line)"
        strokeWidth={1}
      />
      <text
        x={pad.l - 4}
        y={pad.t + 4}
        textAnchor="end"
        fill="var(--muted)"
        fontSize={9}
      >
        {maxY}
      </text>
      <text
        x={pad.l - 4}
        y={pad.t + innerH}
        textAnchor="end"
        fill="var(--muted)"
        fontSize={9}
      >
        0
      </text>
      <text
        x={pad.l}
        y={height - 4}
        fill="var(--muted)"
        fontSize={9}
      >
        start
      </text>
      <text
        x={pad.l + innerW}
        y={height - 4}
        textAnchor="end"
        fill="var(--muted)"
        fontSize={9}
      >
        deadline
      </text>

      {/* ideal (dashed) */}
      <path
        d={toPath(ideal)}
        fill="none"
        stroke="var(--muted)"
        strokeWidth={1.5}
        strokeDasharray="4 3"
        opacity={0.7}
      />
      {/* actual */}
      {actual.length > 0 ? (
        <path
          d={toPath(actual)}
          fill="none"
          stroke="var(--primary)"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ) : null}
    </svg>
  )
}
