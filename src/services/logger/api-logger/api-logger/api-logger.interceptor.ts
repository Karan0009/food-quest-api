import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Request, Response } from 'express';

import { defaultConfig } from 'src/config/env';

@Injectable()
export class ApiLoggerInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const httpContext = context.switchToHttp();
    const request = httpContext.getRequest<Request>();
    const response = httpContext.getResponse<Response>();

    request.ipAddr = request.ip.split(':').pop() || '';
    // const reqContext = getNamespace(`${defaultConfig.APP_NAME}-req-context`)
    // reqContext.run(() => {

    //   reqContext.set('req-context', value);
    // });

    const start = Date.now();

    const { method, originalUrl, requestId, ipAddr, body, params, query } =
      request;

    const logMsg = {
      ipAddr: ipAddr || 'UNKNOWN_IP',
      method,
      originalUrl,
      body: body,
      params: params,
      message: 'REQ::START',
      query: query,
      requestId: requestId,
    };

    Logger.log(logMsg, defaultConfig.APP_NAME);

    response.on('finish', () => {
      const { statusCode } = response;
      const contentLength = response.get('content-length');

      const timeTaken = Date.now() - start;
      const logMsg = {
        ipAddr: ipAddr || 'UNKNOWN_IP',
        method,
        originalUrl,
        statusCode,
        contentLength,
        message: 'REQ::END',
        timeTaken: `${timeTaken}ms`,
        requestId: requestId,
        // response: json.arguments[0][0],
      };

      if (statusCode < 400) {
        Logger.log(logMsg, defaultConfig.APP_NAME);
      } else {
        Logger.error(logMsg, defaultConfig.APP_NAME);
      }
    });

    return next.handle();
  }
}
