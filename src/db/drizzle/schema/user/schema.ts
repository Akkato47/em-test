import { pgTable, text, unique } from 'drizzle-orm/pg-core';

import type { RoleType } from './types/role.type';

import { baseSchema } from '../base.schema';

export const users = pgTable(
  'users',
  {
    ...baseSchema,
    mail: text('email').notNull().unique(),
    password: text('password'),
    role: text('role').$type<RoleType>().default('ADMIN').notNull()
  },
  (table) => {
    return {
      usersMailUnique: unique('users_mail_unique').on(table.mail)
    };
  }
);

export type InsertUser = typeof users.$inferInsert;
export type SelectUser = typeof users.$inferSelect;
