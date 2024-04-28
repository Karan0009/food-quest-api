import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Request, Response } from 'express';
import { v1 as uuidv1 } from 'uuid';

@Injectable()
export class ApiLoggerInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const httpContext = context.switchToHttp();
    const request = httpContext.getRequest<Request>();
    const response = httpContext.getResponse<Response>();

    request.requestId = uuidv1();
    const start = Date.now();

    response.on('finish', () => {
      const { method, originalUrl } = request;
      const { statusCode } = response;
      const contentLength = response.get('content-length');

      const timeTaken = Date.now() - start;
      request.ipAddr = request.ip.split(':').pop() || '';

      // const logMsg = `[${
      //   request.ipAddr || 'UNKNOWN_IP'
      // }] [${method}] ${originalUrl} ${statusCode} ${contentLength} ${timeTaken}ms`;
      const logMsg = {
        ipAddr: request.ipAddr || 'UNKNOWN_IP',
        method,
        originalUrl,
        statusCode,
        contentLength,
        timeTaken: `${timeTaken}ms`,
        requestId: request.requestId,
      };

      if (statusCode < 400) {
        Logger.log(logMsg);
      } else {
        Logger.error(logMsg);
      }
    });

    return next.handle();
  }
}
