import { date, pgTable, text, timestamp, uniqueIndex } from 'drizzle-orm/pg-core'
import { user } from './auth'

export const entry = pgTable(
  'entry',
  {
    id: text('id').primaryKey(),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    entryDate: date('entry_date').notNull(),
    title: text('title'),
    body: text('body').notNull(),
    visibility: text('visibility').notNull().default('private'),
    templateId: text('template_id').notNull().default('minimal-ink'),
    // ponytail: slug on entry, not entry_share table — one link per day is enough for v1
    shareSlug: text('share_slug'),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    uniqueIndex('entry_user_date_uidx').on(table.userId, table.entryDate),
    uniqueIndex('entry_share_slug_uidx').on(table.shareSlug),
  ],
)
