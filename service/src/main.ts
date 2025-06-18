import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Enable CORS so the Next.js client can call the API from a different port
  app.enableCors();
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
