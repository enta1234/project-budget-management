import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { LoggingInterceptor } from './logger/logging.interceptor';
import { LoggerService } from './logger/logger.service';
import * as path from 'path';
import { config } from 'dotenv';

const envFile = path.join(__dirname, '../env', `${process.env.NODE_ENV || 'local'}.env`);
config({ path: envFile });

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
