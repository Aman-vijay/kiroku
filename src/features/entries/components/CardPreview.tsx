import { useEffect, useState, useRef, type ReactNode } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import type { TemplateId } from '#/lib/templates'
import { CARD_W } from '#/lib/constants'
import { ShareCard } from './cards/ShareCard'

type CardPreviewProps = {
  templateId: string
  title: string | null
  body: string
  date: string
  username?: string
  /** Strip stage border/radius so a parent wrapper can own the chrome. */
  bare?: boolean
  children?: ReactNode
}

export function CardPreview({
  templateId,
  title,
  body,
  date,
  username,
  bare,
  children,
}: CardPreviewProps) {
  const stageRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(0.296)

  // ResizeObserver for CSS scale
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
      className={bare ? 'card-stage card-stage--bare' : 'card-stage'}
      style={{ ['--card-scale' as string]: String(scale) }}
    >
      <div className="card-canvas" id="share-card">
        <AnimatePresence mode="wait">
          <motion.div
            key={templateId}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            style={{ width: '100%', height: '100%' }}
          >
            <ShareCard
              templateId={templateId}
              title={title}
              body={body || 'Your day goes here…'}
              date={date}
              username={username}
            />
          </motion.div>
        </AnimatePresence>
      </div>
      {children}
    </div>
  )
}
