import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Request, Response } from 'express';

@Injectable()
export class ApiLoggerInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const httpContext = context.switchToHttp();
    const request = httpContext.getRequest<Request>();
    const response = httpContext.getResponse<Response>();

    const start = Date.now();

    response.on('finish', () => {
      const { method, originalUrl } = request;
      const { statusCode } = response;
      const contentLength = response.get('content-length');

      const timeTaken = Date.now() - start;
      request.ipAddr = request.ip.split(':').pop() || '';

      const logMsg = `[${
        request.ipAddr || 'UNKNOWN_IP'
      }] [${method}] ${originalUrl} ${statusCode} ${contentLength} ${timeTaken}ms`;

      if (statusCode >= 300) {
        Logger.error(logMsg);
      } else if (statusCode < 300 && statusCode >= 200) {
        Logger.warn(logMsg);
      } else {
        Logger.debug(logMsg);
      }
    });

    return next.handle();
  }
}
