import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import BaseEntity from '../base/base.entity';
import { LoggerFactory } from 'src/services/logger/logger';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  logger = new LoggerFactory().getLogger('http-exception-filter');
  catch(
    ex: HttpException,
    host: ArgumentsHost,
  ): Response<BaseEntity, Record<string, BaseEntity>> {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    try {
      const status = ex.getStatus ? ex.getStatus() : 500;
      const message = ex.message;
      const errRes = ex.getResponse ? ex.getResponse() : { message };

      return response.status(status).json(
        new BaseEntity({
          data: null,
          error: {
            url: request.url,
            error: errRes,
          },
          message: message,
          statusCode: status,
        }),
      );
    } catch (err) {
      this.logger.error(err);
    }
  }
}
