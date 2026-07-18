// ponytail: original SVG — cherry blossom branch, falling petals, soft pink
// Archetype-inspired, not a real copyrighted character

export function SakuraFrame() {
  return (
    <svg
      viewBox="0 0 400 300"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      style={{ width: '100%', maxHeight: 260 }}
    >
      {/* background */}
      <rect width="400" height="300" fill="url(#sakura-grad)" />
      <defs>
        <linearGradient id="sakura-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fff0f5" />
          <stop offset="50%" stopColor="#ffe8f0" />
          <stop offset="100%" stopColor="#ffd6e8" />
        </linearGradient>
      </defs>
      {/* branch */}
      <path
        d="M-10 140 Q80 120 160 100 Q200 90 260 60 Q300 40 340 30"
        stroke="#8a5a44"
        strokeWidth="6"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M160 100 Q170 140 180 200"
        stroke="#8a5a44"
        strokeWidth="4"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M260 60 Q280 90 310 110"
        stroke="#8a5a44"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
      />
      {/* blossoms */}
      {[
        [160, 95], [120, 105], [200, 85], [240, 65], [280, 55],
        [310, 42], [340, 35], [180, 130], [150, 155], [170, 180],
        [280, 100], [310, 104], [190, 70], [100, 112],
      ].map(([cx, cy], i) => (
        <g key={i}>
          {[0, 72, 144, 216, 288].map((angle) => {
            const rad = (angle * Math.PI) / 180
            const px = cx + Math.cos(rad) * 6
            const py = cy + Math.sin(rad) * 6
            return (
              <ellipse
                key={angle}
                cx={px}
                cy={py}
                rx="5"
                ry="3"
                fill="#ff9fbb"
                opacity="0.75"
                transform={`rotate(${angle}, ${px}, ${py})`}
              />
            )
          })}
          <circle cx={cx} cy={cy} r="2.5" fill="#ffcc00" opacity="0.8" />
        </g>
      ))}
      {/* falling petals */}
      {[
        [300, 200], [340, 170], [120, 250], [200, 260], [80, 220],
        [350, 140], [150, 220], [260, 240], [100, 180], [220, 280],
      ].map(([cx, cy], i) => (
        <ellipse
          key={`fall-${i}`}
          cx={cx}
          cy={cy}
          rx="4"
          ry="2.5"
          fill="#ffb3cc"
          opacity={0.3 + (i % 3) * 0.15}
          transform={`rotate(${i * 37}, ${cx}, ${cy})`}
        />
      ))}
    </svg>
  )
}
