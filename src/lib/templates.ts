export const TEMPLATE_IDS = [
  'minimal-ink',
  'chibi-day',
  'pixel-quest',
] as const

export type TemplateId = (typeof TEMPLATE_IDS)[number]

export const DEFAULT_TEMPLATE_ID: TemplateId = 'minimal-ink'

export const TEMPLATES: {
  id: TemplateId
  name: string
  blurb: string
}[] = [
  { id: 'minimal-ink', name: 'Minimal', blurb: 'Clean type, quiet frame' },
  { id: 'chibi-day', name: 'Chibi', blurb: 'Soft pastels, cute frame' },
  { id: 'pixel-quest', name: 'Pixel', blurb: 'Quest-log, pixel vibe' },
]

export function isTemplateId(value: string): value is TemplateId {
  return (TEMPLATE_IDS as readonly string[]).includes(value)
}

export function parseTemplateId(value: string | null | undefined): TemplateId {
  return value && isTemplateId(value) ? value : DEFAULT_TEMPLATE_ID
}
