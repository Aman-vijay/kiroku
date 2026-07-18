import type { ComponentType } from 'react'
import { parseTemplateId, type TemplateId } from '#/lib/templates'
import { ChibiDayCard } from './ChibiDayCard'
import { CosmicTitanCard } from './CosmicTitanCard'
import { MinimalInkCard } from './MinimalInkCard'
import { PixelQuestCard } from './PixelQuestCard'
import { SakuraSoftCard } from './SakuraSoftCard'
import { ShounenHeroCard } from './ShounenHeroCard'
import { VigilanteNoirCard } from './VigilanteNoirCard'
import type { CardProps } from './types'

const MAP = {
  'minimal-ink': MinimalInkCard,
  'chibi-day': ChibiDayCard,
  'pixel-quest': PixelQuestCard,
  'vigilante-noir': VigilanteNoirCard,
  'cosmic-titan': CosmicTitanCard,
  'shounen-hero': ShounenHeroCard,
  'sakura-soft': SakuraSoftCard,
} as const satisfies Record<TemplateId, ComponentType<CardProps>>

type ShareCardProps = CardProps & {
  templateId: string
}

export function ShareCard({ templateId, ...props }: ShareCardProps) {
  const id = parseTemplateId(templateId)
  const Card = MAP[id]
  return <Card {...props} />
}
