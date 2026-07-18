import { SITE_NAME } from '#/lib/constants'
import type { CardProps } from './types'
import { VigilanteFrame } from './chars/vigilante'

export function VigilanteNoirCard({ title, body, date, username }: CardProps) {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        boxSizing: 'border-box',
        padding: '52px 48px',
        display: 'flex',
        flexDirection: 'column',
        background: 'linear-gradient(180deg, #0d1220 0%, #141829 60%, #1a1e32 100%)',
        color: '#e8e2ff',
        fontFamily: '"DM Sans", ui-sans-serif, system-ui, sans-serif',
      }}
    >
      <div style={{ position: 'relative', height: 200, marginBottom: 16 }}>
        <div style={{ position: 'absolute', inset: 0, borderRadius: 24, overflow: 'hidden' }}>
          <VigilanteFrame />
        </div>
      </div>
      <div style={{ fontSize: 26, fontWeight: 700, letterSpacing: '0.06em', color: '#ffd66b' }}>
        {date}
      </div>
      <h1 style={{ margin: '16px 0 0', fontSize: 48, fontWeight: 650, lineHeight: 1.15 }}>
        {title || 'Night patrol'}
      </h1>
      <p
        style={{
          margin: '24px 0 0',
          flex: 1,
          fontSize: 30,
          lineHeight: 1.5,
          color: '#c4bcf0',
          whiteSpace: 'pre-wrap',
          overflow: 'hidden',
        }}
      >
        {body}
      </p>
      <div style={{ marginTop: 28, display: 'flex', justifyContent: 'space-between', fontSize: 24, fontWeight: 600, color: '#8a7fb8' }}>
        <span>{SITE_NAME}</span>
        <span>{username || 'night log'}</span>
      </div>
    </div>
  )
}
