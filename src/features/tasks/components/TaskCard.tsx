import { SITE_NAME } from '#/lib/constants'

type TaskCardProps = {
  date: string
  username?: string
  title?: string | null
  tasks: { title: string; done?: boolean }[]
}

/**
 * Dedicated "plan" card — visually distinct from the free-text log cards.
 * Renders a checklist of the day's planned tasks.
 */
export function TaskCard({ date, username, title, tasks }: TaskCardProps) {
  const doneCount = tasks.filter((t) => t.done).length
  const total = tasks.length
  const pct = total > 0 ? Math.round((doneCount / total) * 100) : 0

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
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: 26,
          fontWeight: 600,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          color: '#5c586e',
        }}
      >
        <span>{date}</span>
        <span
          style={{
            color: '#fff',
            background: '#4f46a8',
            borderRadius: 999,
            padding: '6px 18px',
            fontSize: 22,
            letterSpacing: '0.04em',
          }}
        >
          {pct}%
        </span>
      </div>

      <div
        style={{
          marginTop: 28,
          width: 56,
          height: 4,
          background: '#c2410c',
          borderRadius: 2,
        }}
      />

      <h1
        style={{
          margin: '40px 0 0',
          fontSize: title ? 60 : 50,
          fontWeight: 650,
          letterSpacing: '-0.03em',
          lineHeight: 1.1,
        }}
      >
        {title || "Today's Plan"}
      </h1>

      <p
        style={{
          margin: '12px 0 0',
          fontSize: 26,
          color: '#6d6786',
        }}
      >
        {doneCount} of {total} done
      </p>

      <ul
        style={{
          margin: '44px 0 0',
          padding: 0,
          listStyle: 'none',
          flex: 1,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          gap: 26,
        }}
      >
        {tasks.length === 0 ? (
          <li style={{ fontSize: 30, color: '#8a85a0' }}>Add tasks to plan your day…</li>
        ) : (
          tasks.map((t, i) => (
            <li
              key={i}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 22,
              }}
            >
              <span
                style={{
                  flexShrink: 0,
                  width: 40,
                  height: 40,
                  borderRadius: 12,
                  border: t.done ? '0' : '3px solid #c9c4d8',
                  background: t.done ? '#4f46a8' : 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  fontSize: 22,
                  fontWeight: 700,
                }}
              >
                {t.done ? '✓' : ''}
              </span>
              <span
                style={{
                  fontSize: 34,
                  lineHeight: 1.35,
                  fontWeight: 500,
                  color: t.done ? '#8a85a0' : '#2a2738',
                  textDecoration: t.done ? 'line-through' : 'none',
                }}
              >
                {t.title}
              </span>
            </li>
          ))
        )}
      </ul>

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
        <span>{username || 'daily plan'}</span>
      </div>
    </div>
  )
}