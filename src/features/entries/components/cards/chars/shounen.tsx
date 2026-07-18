// ponytail: original SVG — spiky-haired hero silhouette + action lines
// Archetype-inspired, not a real copyrighted character

export function ShounenFrame() {
  return (
    <svg
      viewBox="0 0 400 300"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      style={{ width: '100%', maxHeight: 260 }}
    >
      {/* background */}
      <rect width="400" height="300" fill="url(#shounen-grad)" />
      <defs>
        <linearGradient id="shounen-grad" x1="0" y1="0" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1a0a2e" />
          <stop offset="50%" stopColor="#3d1a5c" />
          <stop offset="100%" stopColor="#ff6b4a" stopOpacity="0.3" />
        </linearGradient>
      </defs>
      {/* action lines */}
      {Array.from({ length: 8 }).map((_, i) => (
        <line
          key={i}
          x1={50 + i * 40}
          y1={280}
          x2={90 + i * 30}
          y2={20}
          stroke="white"
          strokeWidth="1"
          opacity={0.08 + i * 0.02}
        />
      ))}
      {/* spiky hair */}
      <path d="M180 90 L195 40 L210 90" fill="#ffcc00" />
      <path d="M175 85 L172 30 L190 85" fill="#ffcc00" />
      <path d="M195 85 L208 35 L225 85" fill="#ffcc00" />
      <path d="M182 80 L185 25 L200 80" fill="#ffdd33" />
      {/* head */}
      <ellipse cx="200" cy="90" rx="22" ry="24" fill="#fdd" />
      {/* eyes — big anime style */}
      <ellipse cx="192" cy="88" rx="6" ry="7" fill="#1a0a2e" />
      <ellipse cx="208" cy="88" rx="6" ry="7" fill="#1a0a2e" />
      <circle cx="190" cy="86" r="2" fill="white" opacity="0.8" />
      <circle cx="206" cy="86" r="2" fill="white" opacity="0.8" />
      {/* mouth — grin */}
      <path d="M194 96 Q200 102 206 96" stroke="#1a0a2e" strokeWidth="2" fill="none" />
      {/* body — action pose */}
      <path d="M200 114 L190 180 L175 250 L200 230 L225 250 L210 180 Z" fill="#2a1548" />
      {/* fist raised */}
      <circle cx="175" cy="160" r="10" fill="#fdd" />
      <circle cx="225" cy="150" r="10" fill="#fdd" />
    </svg>
  )
}
