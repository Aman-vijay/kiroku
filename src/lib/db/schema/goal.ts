import { date, pgTable, text, timestamp, index } from 'drizzle-orm/pg-core'
import { user } from './auth'

/**
 * A goal is a named container with a 4-week deadline.
 * Tasks can optionally be tagged to a goal across multiple days.
 */
export const goal = pgTable(
  'goal',
  {
    id: text('id').primaryKey(),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    title: text('title').notNull(),
    description: text('description'),
    startDate: date('start_date').notNull(),
    deadline: date('deadline').notNull(),
    status: text('status').notNull().default('active'),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [index('goal_user_id_idx').on(table.userId)],
)
