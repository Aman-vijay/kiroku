import { create } from 'zustand'
import type { GoalDTO } from '#/server/goal'
import {
  createGoal,
  deleteGoal,
  listGoals,
  updateGoal,
} from '#/server/goal'

type GoalsState = {
  goals: GoalDTO[]

  /** Seed from SSR loader data. */
  hydrate: (goals: GoalDTO[]) => void
  /** Fetch all goals. */
  load: () => Promise<void>
  /** Optimistic insert or replace. */
  upsert: (goal: GoalDTO) => void
  /** Optimistic remove. */
  remove: (id: string) => void
}

export const useGoalsStore = create<GoalsState>((set, get) => ({
  goals: [],

  hydrate(goals) {
    set({ goals })
  },

  async load() {
    try {
      const goals = await listGoals()
      set({ goals })
    } catch {
      /* ignore */
    }
  },

  upsert(item) {
    const prev = get().goals
    const idx = prev.findIndex((g) => g.id === item.id)
    if (idx >= 0) {
      set({ goals: [...prev.slice(0, idx), item, ...prev.slice(idx + 1)] })
    } else {
      set({ goals: [item, ...prev] })
    }
  },

  remove(id) {
    set((state) => ({ goals: state.goals.filter((g) => g.id !== id) }))
  },
}))

export { createGoal, deleteGoal, updateGoal } from '#/server/goal'