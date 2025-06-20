import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { LoggingInterceptor } from './logger/logging.interceptor';
import { LoggerService } from './logger/logger.service';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as path from 'path';
import { config } from 'dotenv';

// When compiled the entry point lives in dist/src so we need to go two levels up
// to reach the original env directory.
const envFile = path.join(
  __dirname,
  '..',
  '..',
  'env',
  `${process.env.NODE_ENV || 'local'}.env`,
);
config({ path: envFile });

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Enable CORS so the Next.js client can call the API from a different port
  app.enableCors();
  app.setGlobalPrefix('api/v1');
  const logger = app.get(LoggerService);
  app.useGlobalInterceptors(new LoggingInterceptor(logger));
  if (process.env.NODE_ENV !== 'production') {
    const swaggerConfig = new DocumentBuilder()
      .setTitle('Budget Management API')
      .setVersion('1.0')
      .build();
    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('api-docs', app, document);
  }
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
