import { describe, expect, it } from 'vitest'
import {
  DEFAULT_TEMPLATE_ID,
  isTemplateId,
  parseTemplateId,
  TEMPLATE_IDS,
} from './templates'

describe('templates', () => {
  it('has seven templates', () => {
    expect(TEMPLATE_IDS).toHaveLength(7)
  })

  it('parseTemplateId falls back to default', () => {
    expect(parseTemplateId(undefined)).toBe(DEFAULT_TEMPLATE_ID)
    expect(parseTemplateId('nope')).toBe(DEFAULT_TEMPLATE_ID)
    expect(parseTemplateId('pixel-quest')).toBe('pixel-quest')
  })

  it('isTemplateId guards', () => {
    expect(isTemplateId('minimal-ink')).toBe(true)
    expect(isTemplateId('x')).toBe(false)
  })
})
