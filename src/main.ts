import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as compression from 'compression';
import { LoggerFactory } from './utils/logger/logger';
import { ApiLoggerInterceptor } from './utils/logger/api-logger/api-logger/api-logger.interceptor';

async function bootstrap() {
  const port = process.env.PORT || 3000;
  const app = await NestFactory.create(AppModule, {
    bufferLogs: false,
  });
  app.useLogger(LoggerFactory.logger);
  app.useGlobalInterceptors(new ApiLoggerInterceptor());
  app.use(compression());
  app.enableCors({
    origin: '*',
  });

  await app.listen(port);
}
bootstrap();
