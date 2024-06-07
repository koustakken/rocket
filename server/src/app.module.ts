import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { LeadsModule } from './leads/leads.module';
import { CorsMiddleware } from './middlewares/cors.middleware';

@Module({
  imports: [LeadsModule],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CorsMiddleware).forRoutes('*');
  }
}
