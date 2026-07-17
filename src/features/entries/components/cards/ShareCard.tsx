import type { ComponentType } from 'react'
import { parseTemplateId, type TemplateId } from '#/lib/templates'
import { ChibiDayCard } from './ChibiDayCard'
import { MinimalInkCard } from './MinimalInkCard'
import { PixelQuestCard } from './PixelQuestCard'
import type { CardProps } from './types'

const MAP = {
  'minimal-ink': MinimalInkCard,
  'chibi-day': ChibiDayCard,
  'pixel-quest': PixelQuestCard,
} as const satisfies Record<TemplateId, ComponentType<CardProps>>

type ShareCardProps = CardProps & {
  templateId: string
}

export function ShareCard({ templateId, ...props }: ShareCardProps) {
  const id = parseTemplateId(templateId)
  const Card = MAP[id]
  return <Card {...props} />
}
