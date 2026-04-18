import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe, ValidationError } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { swaggerConfig } from '@shared/infra/docs/swagger.config';
import { NestExpressApplication } from '@nestjs/platform-express';
import { IncorrectValuesException } from '@shared/exceptions/incorrect-values-exception';
import { mapperClassValidationErrorToAppException } from '@shared/exceptions/mappers/exception.mapper';

async function bootstrap() {
  const logger = new Logger('Main');
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  swaggerConfig(app);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      stopAtFirstError: true,
      exceptionFactory(errors: ValidationError[]) {
        throw new IncorrectValuesException({
          fields: mapperClassValidationErrorToAppException(errors),
        });
      },
    }),
  );

  const config = app.get<ConfigService>(ConfigService);
  const port = config.get<number>('PORT') || 3000;

  await app.listen(port, () => logger.log(`Server running at: http://localhost:${port}`));
}

void bootstrap();
