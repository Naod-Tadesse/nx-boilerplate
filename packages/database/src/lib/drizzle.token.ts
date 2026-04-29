import { NodePgDatabase } from 'drizzle-orm/node-postgres';

export const DRIZZLE = Symbol('DRIZZLE');

export type DrizzleDB = NodePgDatabase;
