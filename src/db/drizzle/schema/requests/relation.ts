import { relations } from 'drizzle-orm';

import { users } from '../user/schema';
import { requests, responses } from './schema';

export const requestsRelations = relations(requests, ({ one }) => ({
  requestsRelation: one(users, {
    fields: [requests.responsibleUid],
    references: [users.uid]
  }),
  responsesRelation: one(responses)
}));

export const responsesRelations = relations(responses, ({ one }) => ({
  responsesRelation: one(users, {
    fields: [responses.authorUid],
    references: [users.uid]
  }),
  requestsRelation: one(requests, {
    fields: [responses.requestUid],
    references: [requests.uid]
  })
}));
