type ProgressRingProps = {
  /** 0–100 */
  percent: number
  size?: number
  strokeWidth?: number
  label?: string
  className?: string
}

/**
 * Circular progress indicator using strokeDasharray.
 * Accessible: exposes percent via aria-valuenow.
 */
export function ProgressRing({
  percent,
  size = 72,
  strokeWidth = 6,
  label,
  className,
}: ProgressRingProps) {
  const clamped = Math.max(0, Math.min(100, percent))
  const r = (size - strokeWidth) / 2
  const c = 2 * Math.PI * r
  const offset = c - (clamped / 100) * c

  return (
    <div
      className={className}
      role="progressbar"
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label ?? `${clamped}% complete`}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        aria-hidden
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="var(--line)"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="var(--primary)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          style={{ transition: 'stroke-dashoffset 200ms ease-out' }}
        />
        <text
          x="50%"
          y="50%"
          dominantBaseline="central"
          textAnchor="middle"
          fill="var(--ink)"
          fontSize={size * 0.22}
          fontWeight={600}
        >
          {clamped}%
        </text>
      </svg>
    </div>
  )
}
