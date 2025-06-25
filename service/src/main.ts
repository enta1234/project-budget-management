import './load-env';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { LoggingInterceptor } from './logger/logging.interceptor';
import { LoggerService } from './logger/logger.service';
import { ActivityLogsService } from './activity-logs/activity-logs.service';
import { ActivityLogsInterceptor } from './activity-logs/activity-logs.interceptor';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe, BadRequestException } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Enable CORS so the Next.js client can call the API from a different port
  app.enableCors();
  app.setGlobalPrefix('api/v1');
  const logger = app.get(LoggerService);
  const activityLogs = app.get(ActivityLogsService);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      exceptionFactory: () => new BadRequestException('missing invalid'),
    }),
  );
  app.useGlobalInterceptors(
    new LoggingInterceptor(logger),
    new ActivityLogsInterceptor(activityLogs),
  );
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
