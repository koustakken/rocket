import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { LeadsModule } from './leads/leads.module';
import { CorsMiddleware } from './middlewares/cors.middleware';

import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '..', 'client/dist'),
    }),
    LeadsModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CorsMiddleware).forRoutes('*');
  }
}
