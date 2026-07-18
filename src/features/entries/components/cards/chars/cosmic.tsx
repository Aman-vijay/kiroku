// ponytail: original SVG — starfield + hero silhouette emerging from light
// Archetype-inspired, not a real copyrighted character

export function CosmicFrame() {
  return (
    <svg
      viewBox="0 0 400 300"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      style={{ width: '100%', maxHeight: 260 }}
    >
      {/* deep space */}
      <rect width="400" height="300" fill="url(#cosmic-grad)" />
      <defs>
        <linearGradient id="cosmic-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0a0520" />
          <stop offset="60%" stopColor="#1a1040" />
          <stop offset="100%" stopColor="#2a1a50" />
        </linearGradient>
        <radialGradient id="glow" cx="50%" cy="65%" r="40%">
          <stop offset="0%" stopColor="#a08cff" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#a08cff" stopOpacity="0" />
        </radialGradient>
      </defs>
      {/* stars */}
      {Array.from({ length: 30 }).map((_, i) => (
        <circle
          key={i}
          cx={Math.sin(i * 7.3) * 180 + 200}
          cy={Math.cos(i * 5.1) * 130 + 80}
          r={1.5 + (i % 3)}
          fill="white"
          opacity={0.3 + (i % 4) * 0.15}
        />
      ))}
      {/* nebula glow */}
      <ellipse cx="200" cy="210" rx="120" ry="70" fill="url(#glow)" />
      {/* titan figure */}
      <path
        d="M200 80 L185 150 L175 160 L180 210 L190 220 L200 200 L210 220 L220 210 L225 160 L215 150 Z"
        fill="#e8e0ff"
        opacity="0.8"
      />
      {/* chest emblem — diamond */}
      <polygon points="200,120 210,140 200,160 190,140" fill="#ffd66b" opacity="0.9" />
      {/* cape */}
      <path d="M185 150 L140 220 L180 200 L170 260 L195 180 Z" fill="#7a6fcf" opacity="0.6" />
      <path d="M215 150 L260 220 L220 200 L230 260 L205 180 Z" fill="#7a6fcf" opacity="0.6" />
    </svg>
  )
}
