import type { TRequestStatus } from '@/db/drizzle/schema/requests/types/status.types';

export type TRequestFilter = 'All' | TRequestStatus;
