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

    // request.ipAddr = request.ip.split(':').pop() || '';
    request.ipAddr = request.ip;
    const start = Date.now();

    const { method, ipAddr, body, params, query } = request;

    const logMsg = {
      ip_addr: ipAddr || 'UNKNOWN_IP',
      method,
      body: body,
      params: params,
      message: 'REQ::START',
      query: query,
    };

    Logger.log(logMsg, process.env.APP_NAME);

    response.on('finish', () => {
      const { statusCode } = response;
      const contentLength = response.get('content-length');

      const timeTaken = Date.now() - start;
      const logMsg = {
        ip_addr: ipAddr || 'UNKNOWN_IP',
        method,
        status_code: statusCode,
        content_length: contentLength,
        message: 'REQ::END',
        time_taken: `${timeTaken}ms`,
        // response: json.arguments[0][0],
      };

      if (statusCode < 400) {
        Logger.log(logMsg, process.env.APP_NAME);
      } else {
        Logger.error(logMsg, process.env.APP_NAME);
      }
    });

    return next.handle();
  }
}
