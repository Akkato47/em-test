import { relations } from 'drizzle-orm';

import { requests, responses } from '../requests/schema';
import { users } from './schema';

export const userRelations = relations(users, ({ many }) => ({
  responsesRelation: many(responses),
  requestsRelation: many(requests)
}));
