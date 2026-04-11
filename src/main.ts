import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { swaggerConfig } from '@shared/infra/docs/swagger.config';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const logger = new Logger('Main');
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const config = app.get<ConfigService>(ConfigService);
  const port = config.get<number>('PORT') || 3000;

  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  swaggerConfig(app);
  await app.listen(port, () => logger.log(`Server running at: http://localhost:${port}`));
}

void bootstrap();
