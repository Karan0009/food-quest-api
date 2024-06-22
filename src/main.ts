import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import * as compression from 'compression';
import { ApiLoggerInterceptor } from './services/logger/api-logger/api-logger/api-logger.interceptor';
import { LoggerFactory } from './services/logger/logger';
import { createNamespace } from 'cls-hooked';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './core/error/http-exception.filter';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const port = process.env.PORT || 3000;
  const app = await NestFactory.create(AppModule, {
    bufferLogs: false,
  });
  createNamespace(`${process.env.APP_NAME}-req-context`);
  app.setGlobalPrefix('/api');
  // app.use(new ContextMiddleware().use);
  app.useGlobalFilters(new HttpExceptionFilter());
  app.use(cookieParser());
  app.useLogger(new LoggerFactory().logger);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );
  app.useGlobalInterceptors(
    new ApiLoggerInterceptor(),
    new ClassSerializerInterceptor(app.get(Reflector), {
      exposeUnsetFields: false,
      excludeExtraneousValues: true,
    }),
  );
  app.use(compression());
  app.enableCors({
    origin: '*',
  });

  await app.listen(port);
}
bootstrap();
