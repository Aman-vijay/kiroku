// ponytail: original SVG silhouette — dark city rooftop vigilante with cape and moon
// Archetype-inspired, not a real copyrighted character

export function VigilanteFrame() {
  return (
    <svg
      viewBox="0 0 400 300"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      style={{ width: '100%', maxHeight: 260 }}
    >
      {/* moon */}
      <circle cx="320" cy="50" r="32" fill="#ffeaa7" opacity="0.9" />
      {/* buildings */}
      <rect x="30" y="180" width="60" height="120" fill="#1a1428" />
      <rect x="90" y="140" width="50" height="160" fill="#1f1832" />
      <rect x="140" y="200" width="70" height="100" fill="#1a1428" />
      <rect x="210" y="160" width="45" height="140" fill="#1f1832" />
      <rect x="260" y="190" width="55" height="110" fill="#1a1428" />
      <rect x="320" y="170" width="50" height="130" fill="#1f1832" />
      {/* windows */}
      {[0, 1, 2].flatMap((row) =>
        [0, 1].map((col) => (
          <rect key={`w-${row}-${col}`} x={55 + col * 20} y={200 + row * 30} width="10" height="12" rx="1" fill="#ffd66b" opacity={0.6} />
        )),
      )}
      {/* vigilante silhouette — cape + cowl */}
      <path d="M190 220 L200 100 L210 220" fill="#0f0c18" />
      <path d="M180 230 L200 105 L220 230" fill="#0f0c18" />
      {/* head */}
      <ellipse cx="200" cy="98" rx="14" ry="16" fill="#0f0c18" />
      {/* pointy ears / horns */}
      <polygon points="188,85 194,98 190,98" fill="#0f0c18" />
      <polygon points="212,85 210,98 206,98" fill="#0f0c18" />
      {/* cape sweep */}
      <path d="M180 230 L160 290 L200 250 L240 290 L220 230" fill="#0f0c18" opacity="0.9" />
    </svg>
  )
}
