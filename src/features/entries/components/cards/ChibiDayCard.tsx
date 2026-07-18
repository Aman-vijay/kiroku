import { SITE_NAME } from '#/lib/constants'
import type { CardProps } from './types'

export function ChibiDayCard({ title, body, date, username }: CardProps) {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        boxSizing: 'border-box',
        padding: '72px',
        display: 'flex',
        flexDirection: 'column',
        background: 'linear-gradient(165deg, #fff5f7 0%, #f3f0ff 55%, #eef8ff 100%)',
        color: '#2b2340',
        fontFamily: '"DM Sans", ui-sans-serif, system-ui, sans-serif',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <span
          style={{
            fontSize: 26,
            fontWeight: 700,
            color: '#e05a3c',
            letterSpacing: '0.04em',
          }}
        >
          ★ {date}
        </span>
        <span style={{ fontSize: 42, lineHeight: 1 }} aria-hidden>
          (◕‿◕)
        </span>
      </div>

      <div
        style={{
          marginTop: 40,
          flex: 1,
          borderRadius: 40,
          background: 'rgba(255,255,255,0.78)',
          border: '4px solid #ffd6e0',
          boxShadow: '0 12px 0 #ffc4d4',
          padding: '56px 48px',
          display: 'flex',
          flexDirection: 'column',
          minHeight: 0,
        }}
      >
        <h1
          style={{
            margin: 0,
            fontSize: 56,
            fontWeight: 700,
            letterSpacing: '-0.02em',
            lineHeight: 1.2,
            color: '#4f46a8',
          }}
        >
          {title || 'Cute day ✓'}
        </h1>
        <p
          style={{
            margin: '32px 0 0',
            flex: 1,
            fontSize: 34,
            lineHeight: 1.55,
            color: '#3a3350',
            whiteSpace: 'pre-wrap',
            overflow: 'hidden',
          }}
        >
          {body}
        </p>
      </div>

      <div
        style={{
          marginTop: 36,
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: 26,
          fontWeight: 600,
          color: '#7a6f96',
        }}
      >
        <span>{SITE_NAME}</span>
        <span>{username || 'you did great'}</span>
      </div>
    </div>
  )
}
