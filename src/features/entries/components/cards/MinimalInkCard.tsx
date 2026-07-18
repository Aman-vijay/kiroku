import { SITE_NAME } from '#/lib/constants'
import type { CardProps } from './types'

export function MinimalInkCard({ title, body, date, username }: CardProps) {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        boxSizing: 'border-box',
        padding: '96px 88px',
        display: 'flex',
        flexDirection: 'column',
        background: '#ffffff',
        color: '#14121f',
        fontFamily: '"DM Sans", ui-sans-serif, system-ui, sans-serif',
      }}
    >
      <div
        style={{
          fontSize: 28,
          fontWeight: 600,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          color: '#5c586e',
        }}
      >
        {date}
      </div>
      <div
        style={{
          marginTop: 28,
          width: 56,
          height: 4,
          background: '#4f46a8',
          borderRadius: 2,
        }}
      />
      <h1
        style={{
          margin: '40px 0 0',
          fontSize: title ? 64 : 48,
          fontWeight: 650,
          letterSpacing: '-0.03em',
          lineHeight: 1.15,
        }}
      >
        {title || 'Today'}
      </h1>
      <p
        style={{
          margin: '40px 0 0',
          flex: 1,
          fontSize: 36,
          lineHeight: 1.5,
          color: '#2a2738',
          whiteSpace: 'pre-wrap',
          overflow: 'hidden',
        }}
      >
        {body}
      </p>
      <div
        style={{
          marginTop: 48,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: 26,
          color: '#5c586e',
        }}
      >
        <span style={{ fontWeight: 600 }}>{SITE_NAME}</span>
        <span>{username || 'daily log'}</span>
      </div>
    </div>
  )
}
