import { pgTable, text, uuid } from 'drizzle-orm/pg-core';

import type { TRequestStatus } from './types/status.types';

import { baseSchema } from '../base.schema';
import { users } from '../user/schema';

export const requests = pgTable('requests', {
  ...baseSchema,
  title: text('title').notNull(),
  body: text('body').notNull(),
  contactMail: text('contact_mail'),
  status: text('status').notNull().$type<TRequestStatus>(),
  responsibleUid: uuid('responsible_uid').references(() => users.uid)
});

export const responses = pgTable('responses', {
  ...baseSchema,
  title: text('title').notNull(),
  body: text('body').notNull(),
  requestUid: uuid('request_uid')
    .notNull()
    .references(() => requests.uid),
  authorUid: uuid('author_uid')
    .notNull()
    .references(() => users.uid)
});
