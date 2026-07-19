import {
  boolean,
  date,
  integer,
  pgTable,
  text,
  timestamp,
  index,
} from 'drizzle-orm/pg-core'
import { user } from './auth'
import { goal } from './goal'

/**
 * Tasks are per-day todos. Marking one done can auto-sync into the day's entry body.
 * A task may optionally belong to a goal.
 */
export const task = pgTable(
  'task',
  {
    id: text('id').primaryKey(),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    entryDate: date('entry_date').notNull(),
    title: text('title').notNull(),
    done: boolean('done').notNull().default(false),
    minutesSpent: integer('minutes_spent'),
    goalId: text('goal_id').references(() => goal.id, {
      onDelete: 'set null',
    }),
    order: integer('order').notNull().default(0),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
    completedAt: timestamp('completed_at', { withTimezone: true }),
  },
  (table) => [
    index('task_user_date_idx').on(table.userId, table.entryDate),
    index('task_user_goal_idx').on(table.userId, table.goalId),
  ],
)
