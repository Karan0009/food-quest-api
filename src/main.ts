import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as compression from 'compression';
import { ApiLoggerInterceptor } from './services/logger/api-logger/api-logger/api-logger.interceptor';
import { LoggerFactory } from './services/logger/logger';
import { createNamespace } from 'cls-hooked';

async function bootstrap() {
  const port = process.env.PORT || 3000;
  const app = await NestFactory.create(AppModule, {
    bufferLogs: false,
  });
  createNamespace(`${process.env.APP_NAME}-req-context`);
  // app.use(new ContextMiddleware().use);
  app.useLogger(new LoggerFactory().logger);
  app.useGlobalInterceptors(new ApiLoggerInterceptor());
  app.use(compression());
  app.enableCors({
    origin: '*',
  });

  await app.listen(port);
}
bootstrap();
