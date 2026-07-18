import { SITE_NAME } from '#/lib/constants'
import type { CardProps } from './types'
import { CosmicFrame } from './chars/cosmic'

export function CosmicTitanCard({ title, body, date, username }: CardProps) {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        boxSizing: 'border-box',
        padding: '52px 48px',
        display: 'flex',
        flexDirection: 'column',
        background: 'linear-gradient(180deg, #0a0520 0%, #1a1040 50%, #2a1a50 100%)',
        color: '#e8e0ff',
        fontFamily: '"DM Sans", ui-sans-serif, system-ui, sans-serif',
      }}
    >
      <div style={{ position: 'relative', height: 200, marginBottom: 16 }}>
        <div style={{ position: 'absolute', inset: 0, borderRadius: 24, overflow: 'hidden' }}>
          <CosmicFrame />
        </div>
      </div>
      <div style={{ fontSize: 26, fontWeight: 700, letterSpacing: '0.08em', color: '#a08cff' }}>
        {date}
      </div>
      <h1 style={{ margin: '16px 0 0', fontSize: 48, fontWeight: 650, lineHeight: 1.15 }}>
        {title || 'Titan log'}
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
        <span>{username || 'cosmic entry'}</span>
      </div>
    </div>
  )
}
