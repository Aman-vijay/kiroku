import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { TemplateId } from '#/lib/templates'
import { DEFAULT_TEMPLATE_ID, parseTemplateId } from '#/lib/templates'

const DRAFT_KEY = 'kiroku-draft'

type DraftState = {
  title: string
  body: string
  templateId: TemplateId
  /** entryDate this draft is for, so reloading the right day recovers it */
  entryDate: string | null
  shareSlug: string | null

  setField: (field: 'title' | 'body', value: string) => void
  setTemplateId: (id: TemplateId) => void
  setEntryDate: (date: string) => void
  setShareSlug: (slug: string | null) => void
  clear: () => void
  hasContent: () => boolean
}

export const useDraftStore = create<DraftState>()(
  persist(
    (set, get) => ({
      title: '',
      body: '',
      templateId: DEFAULT_TEMPLATE_ID,
      entryDate: null,
      shareSlug: null,

      setField(field, value) {
        set({ [field]: value })
      },
      setTemplateId(id) {
        set({ templateId: id })
      },
      setEntryDate(date) {
        set({ entryDate: date })
      },
      setShareSlug(slug) {
        set({ shareSlug: slug })
      },
      clear() {
        set({ title: '', body: '', templateId: DEFAULT_TEMPLATE_ID, entryDate: null, shareSlug: null })
      },
      hasContent() {
        const { title, body } = get()
        return title.trim().length > 0 || body.trim().length > 0
      },
    }),
    { name: DRAFT_KEY },
  ),
)
