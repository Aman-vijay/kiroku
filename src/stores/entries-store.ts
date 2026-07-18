import { create } from 'zustand'
import type { EntryDTO } from '#/server/entries'
import { listEntries } from '#/server/entries'
import { computeStreak } from '#/features/entries/lib/streak'

type EntriesState = {
  entries: EntryDTO[]
  /** Cursor for next page (last entryDate from current list). null = no more or not loaded. */
  cursor: string | null
  todayEntryId: string | null
  loading: boolean

  /** Seed the store from SSR loader data. */
  hydrate: (entries: EntryDTO[], todayId: string | null, nextCursor: string | null) => void
  /** Append older entries. Returns false if no more. */
  loadMore: () => Promise<boolean>
  /** Optimistic: insert or replace an entry. */
  upsert: (entry: EntryDTO) => void
  /** Optimistic: remove by id. */
  remove: (id: string) => void
}

export const useEntriesStore = create<EntriesState>((set, get) => ({
  entries: [],
  cursor: null,
  todayEntryId: null,
  loading: false,

  hydrate(entries, todayId, nextCursor) {
    set({ entries, todayEntryId: todayId, cursor: nextCursor })
  },

  async loadMore() {
    const { cursor, entries } = get()
    if (!cursor) return false
    set({ loading: true })
    try {
      const more = await listEntries({ data: { limit: 30, cursor } })
      if (more.length === 0) {
        set({ cursor: null, loading: false })
        return false
      }
      const nextCursor = more[more.length - 1]?.entryDate ?? null
      set({ entries: [...entries, ...more], cursor: nextCursor, loading: false })
      return true
    } catch {
      set({ loading: false })
      return false
    }
  },

  upsert(item) {
    const prev = get().entries
    const idx = prev.findIndex((e) => e.id === item.id)
    if (idx >= 0) {
      set({ entries: [...prev.slice(0, idx), item, ...prev.slice(idx + 1)] })
    } else {
      set({ entries: [item, ...prev] })
    }
  },

  remove(id) {
    set((state) => ({ entries: state.entries.filter((e) => e.id !== id) }))
  },
}))

/** Derived: streak from current store entries. */
export function useStreak() {
  return useEntriesStore((s) => computeStreak(s.entries.map((e) => e.entryDate)))
}
