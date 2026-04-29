import { Module, Global, DynamicModule, Logger } from '@nestjs/common';
import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import { DRIZZLE } from './drizzle.token';
import type { DatabaseModuleOptions } from './database.interfaces';
import * as schema from './schema';

@Global()
@Module({})
export class DatabaseModule {
  private static readonly logger = new Logger(DatabaseModule.name);

  static forRoot(options: DatabaseModuleOptions): DynamicModule {
    const drizzleProvider = {
      provide: DRIZZLE,
      useFactory: async () => {
        const pool = new Pool({ connectionString: options.connectionUrl });

        pool.on('error', (err) => {
          DatabaseModule.logger.error('Unexpected PG pool error', err);
        });

        try {
          const client = await pool.connect();
          client.release();
          DatabaseModule.logger.log('✅ PostgreSQL connection verified successfully');
        } catch (err) {
          DatabaseModule.logger.error('❌ PostgreSQL connection failed', (err as Error).message);
        }

        return drizzle(pool, { schema });
      },
    };

    return {
      module: DatabaseModule,
      providers: [drizzleProvider],
      exports: [DRIZZLE],
    };
  }
}
