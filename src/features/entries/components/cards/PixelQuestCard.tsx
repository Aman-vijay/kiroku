import type { CardProps } from './types'

export function PixelQuestCard({ title, body, date, username }: CardProps) {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        boxSizing: 'border-box',
        padding: '64px',
        display: 'flex',
        flexDirection: 'column',
        background: '#1a1428',
        color: '#e8e2ff',
        fontFamily:
          'ui-monospace, "Cascadia Code", "Segoe UI Mono", Menlo, monospace',
        imageRendering: 'pixelated',
      }}
    >
      <div
        style={{
          border: '4px solid #7c6cff',
          background: '#0f0c18',
          padding: '20px 24px',
          fontSize: 24,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color: '#a89bff',
        }}
      >
        QUEST LOG · {date}
      </div>

      <div
        style={{
          marginTop: 28,
          flex: 1,
          border: '4px solid #3d3558',
          background: '#12101c',
          padding: '48px 40px',
          display: 'flex',
          flexDirection: 'column',
          minHeight: 0,
          boxShadow: 'inset 0 0 0 4px #252038',
        }}
      >
        <div
          style={{
            fontSize: 22,
            color: '#6dffb0',
            letterSpacing: '0.08em',
            marginBottom: 20,
          }}
        >
          [ CLEAR ]
        </div>
        <h1
          style={{
            margin: 0,
            fontSize: 44,
            fontWeight: 700,
            lineHeight: 1.25,
            color: '#fff6a8',
            textTransform: 'uppercase',
          }}
        >
          {title || 'Daily quest'}
        </h1>
        <p
          style={{
            margin: '36px 0 0',
            flex: 1,
            fontSize: 30,
            lineHeight: 1.55,
            color: '#d4ccef',
            whiteSpace: 'pre-wrap',
            overflow: 'hidden',
          }}
        >
          {body}
        </p>
      </div>

      <div
        style={{
          marginTop: 28,
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: 22,
          letterSpacing: '0.06em',
          color: '#8a7fb8',
        }}
      >
        <span>KIROKU</span>
        <span>@{username || 'player1'}</span>
      </div>
    </div>
  )
}
