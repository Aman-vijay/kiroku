import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const DRAFT_KEY = 'kiroku-task-draft'

type DraftTask = { id: string; title: string }

type TaskDraftState = {
  /** Today's date this draft is for. Planning is today-only. */
  entryDate: string | null
  items: DraftTask[]
  /** Hydrate from persisted store only if the date matches today. */
  initForDate: (date: string) => void
  add: (title: string) => void
  remove: (id: string) => void
  rename: (id: string, title: string) => void
  move: (id: string, direction: -1 | 1) => void
  clear: () => void
  setItems: (items: DraftTask[]) => void
}

function uid() {
  return `dt-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

export const useTaskDraftStore = create<TaskDraftState>()(
  persist(
    (set, get) => ({
      entryDate: null,
      items: [],

      initForDate(date) {
        if (get().entryDate !== date) {
          set({ entryDate: date, items: [] })
        }
      },

      add(title) {
        const trimmed = title.trim()
        if (!trimmed) return
        set((s) => ({ items: [...s.items, { id: uid(), title: trimmed }] }))
      },

      remove(id) {
        set((s) => ({ items: s.items.filter((t) => t.id !== id) }))
      },

      rename(id, title) {
        set((s) => ({
          items: s.items.map((t) => (t.id === id ? { ...t, title } : t)),
        }))
      },

      move(id, direction) {
        const items = [...get().items]
        const idx = items.findIndex((t) => t.id === id)
        if (idx < 0) return
        const swapIdx = idx + direction
        if (swapIdx < 0 || swapIdx >= items.length) return
        ;[items[idx], items[swapIdx]] = [items[swapIdx]!, items[idx]!]
        set({ items })
      },

      clear() {
        set({ items: [] })
      },

      setItems(items) {
        set({ items })
      },
    }),
    { name: DRAFT_KEY },
  ),
)