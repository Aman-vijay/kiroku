import { create } from 'zustand'
import type { TaskDTO } from '#/server/task'
import {
  createTask,
  deleteTask,
  listTasksByDate,
  updateTask,
} from '#/server/task'

type TasksState = {
  tasks: TaskDTO[]
  loading: boolean

  /** Seed from SSR loader data. */
  hydrate: (tasks: TaskDTO[]) => void
  /** Fetch tasks for a date. */
  loadByDate: (entryDate: string) => Promise<void>
  /** Optimistic insert or replace. */
  upsert: (task: TaskDTO) => void
  /** Optimistic remove. */
  remove: (id: string) => void
}

export const useTasksStore = create<TasksState>((set, get) => ({
  tasks: [],
  loading: false,

  hydrate(tasks) {
    set({ tasks })
  },

  async loadByDate(entryDate) {
    set({ loading: true })
    try {
      const tasks = await listTasksByDate({ data: { entryDate } })
      set({ tasks, loading: false })
    } catch {
      set({ loading: false })
    }
  },

  upsert(item) {
    const prev = get().tasks
    const idx = prev.findIndex((t) => t.id === item.id)
    if (idx >= 0) {
      set({ tasks: [...prev.slice(0, idx), item, ...prev.slice(idx + 1)] })
    } else {
      set({ tasks: [...prev, item].sort((a, b) => a.order - b.order || a.createdAt.localeCompare(b.createdAt)) })
    }
  },

  remove(id) {
    set((state) => ({ tasks: state.tasks.filter((t) => t.id !== id) }))
  },
}))

/** Derived: done count for the current tasks in the store. */
export function useDoneCount() {
  return useTasksStore((s) => s.tasks.filter((t) => t.done).length)
}

/** Derived: total minutes spent across done tasks in the store (for one day). */
export function useDayMinutes() {
  return useTasksStore((s) =>
    s.tasks
      .filter((t) => t.done && typeof t.minutesSpent === 'number')
      .reduce((sum, t) => sum + (t.minutesSpent ?? 0), 0),
  )
}
