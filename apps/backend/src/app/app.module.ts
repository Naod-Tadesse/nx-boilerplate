import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from '@org/database';

@Module({
  imports: [
      DatabaseModule.forRoot({
      connectionUrl: process.env['DATABASE_URL'] || 'postgresql://ekos:ekos@localhost:5432/ekos_db',
    }),
  ],
  controllers: [
    AppController,
   
  ],
  providers: [
    AppService,
  ],
})
export class AppModule {}
