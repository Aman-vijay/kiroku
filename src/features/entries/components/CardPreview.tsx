import { useEffect, useRef, useState } from 'react'
import { CARD_W } from '#/lib/constants'
import { ShareCard } from './cards/ShareCard'

type CardPreviewProps = {
  templateId: string
  title: string | null
  body: string
  date: string
  username?: string
}

export function CardPreview({
  templateId,
  title,
  body,
  date,
  username,
}: CardPreviewProps) {
  const stageRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(0.296)

  useEffect(() => {
    const el = stageRef.current
    if (!el) return
    const ro = new ResizeObserver(([entry]) => {
      const w = entry?.contentRect.width ?? 0
      if (w > 0) setScale(w / CARD_W)
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  return (
    <div
      ref={stageRef}
      className="card-stage"
      style={{ ['--card-scale' as string]: String(scale) }}
    >
      <div className="card-canvas" id="share-card">
        <ShareCard
          templateId={templateId}
          title={title}
          body={body || 'Your day goes here…'}
          date={date}
          username={username}
        />
      </div>
    </div>
  )
}
