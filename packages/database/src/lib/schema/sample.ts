import { pgTable, uuid, text, boolean, timestamp } from 'drizzle-orm/pg-core';

export const disbursementsTable = pgTable('disbursements', {
  id: uuid('id').primaryKey().defaultRandom(),
  initiatedAt: timestamp('initiated_at', { withTimezone: true }),
  approvedAt: timestamp('approved_at', { withTimezone: true }),
  remark: text('remark'),
  isDeleted: boolean('is_deleted').notNull().default(false),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});
