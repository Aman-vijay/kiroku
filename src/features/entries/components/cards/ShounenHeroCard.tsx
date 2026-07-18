import { SITE_NAME } from '#/lib/constants'
import type { CardProps } from './types'
import { ShounenFrame } from './chars/shounen'

export function ShounenHeroCard({ title, body, date, username }: CardProps) {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        boxSizing: 'border-box',
        padding: '52px 48px',
        display: 'flex',
        flexDirection: 'column',
        background: 'linear-gradient(180deg, #1a0a2e 0%, #3d1a5c 50%, #ff6b4a 150%)',
        color: '#fff',
        fontFamily: '"DM Sans", ui-sans-serif, system-ui, sans-serif',
      }}
    >
      <div style={{ position: 'relative', height: 200, marginBottom: 16 }}>
        <div style={{ position: 'absolute', inset: 0, borderRadius: 24, overflow: 'hidden' }}>
          <ShounenFrame />
        </div>
      </div>
      <div style={{ fontSize: 26, fontWeight: 700, letterSpacing: '0.08em', color: '#ffcc00' }}>
        {date}
      </div>
      <h1 style={{ margin: '16px 0 0', fontSize: 48, fontWeight: 700, lineHeight: 1.15 }}>
        {title || 'Plus ultra!'}
      </h1>
      <p
        style={{
          margin: '24px 0 0',
          flex: 1,
          fontSize: 30,
          lineHeight: 1.5,
          color: '#f0e0ff',
          whiteSpace: 'pre-wrap',
          overflow: 'hidden',
        }}
      >
        {body}
      </p>
      <div style={{ marginTop: 28, display: 'flex', justifyContent: 'space-between', fontSize: 24, fontWeight: 600, color: '#ffb899' }}>
        <span>{SITE_NAME}</span>
        <span>{username || 'hero log'}</span>
      </div>
    </div>
  )
}
