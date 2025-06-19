import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { LoggingInterceptor } from './logger/logging.interceptor';
import { LoggerService } from './logger/logger.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Enable CORS so the Next.js client can call the API from a different port
  app.enableCors();
  app.setGlobalPrefix('api/v1');
  const logger = app.get(LoggerService);
  app.useGlobalInterceptors(new LoggingInterceptor(logger));
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
