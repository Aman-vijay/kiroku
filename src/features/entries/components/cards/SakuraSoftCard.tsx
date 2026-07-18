import { SITE_NAME } from '#/lib/constants'
import type { CardProps } from './types'
import { SakuraFrame } from './chars/sakura'

export function SakuraSoftCard({ title, body, date, username }: CardProps) {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        boxSizing: 'border-box',
        padding: '52px 48px',
        display: 'flex',
        flexDirection: 'column',
        background: 'linear-gradient(180deg, #fff0f5 0%, #ffe8f0 60%, #ffd6e8 100%)',
        color: '#5c3a4a',
        fontFamily: '"DM Sans", ui-sans-serif, system-ui, sans-serif',
      }}
    >
      <div style={{ position: 'relative', height: 200, marginBottom: 16 }}>
        <div style={{ position: 'absolute', inset: 0, borderRadius: 24, overflow: 'hidden', background: '#fff0f5' }}>
          <SakuraFrame />
        </div>
      </div>
      <div style={{ fontSize: 26, fontWeight: 700, letterSpacing: '0.04em', color: '#d4788c' }}>
        {date}
      </div>
      <h1 style={{ margin: '16px 0 0', fontSize: 48, fontWeight: 650, lineHeight: 1.15 }}>
        {title || 'Gentle day'}
      </h1>
      <p
        style={{
          margin: '24px 0 0',
          flex: 1,
          fontSize: 30,
          lineHeight: 1.55,
          color: '#5c3a4a',
          whiteSpace: 'pre-wrap',
          overflow: 'hidden',
        }}
      >
        {body}
      </p>
      <div style={{ marginTop: 28, display: 'flex', justifyContent: 'space-between', fontSize: 24, fontWeight: 600, color: '#d4788c' }}>
        <span>{SITE_NAME}</span>
        <span>{username || 'soft log'}</span>
      </div>
    </div>
  )
}
