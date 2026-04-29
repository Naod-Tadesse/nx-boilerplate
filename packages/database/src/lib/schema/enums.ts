import { pgEnum } from 'drizzle-orm/pg-core';

// ── Shared enums ──
export const userTypeEnum = pgEnum('user_type', ['STAFF', 'CUSTOMER']);

