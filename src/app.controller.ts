import { Controller, Get, HttpStatus, Param, Req } from '@nestjs/common';
import { AppService } from './app.service';
import { Request } from 'express';
import { LoggerFactory } from './services/logger/logger';
import BaseEntity from './core/base/base.entity';

@Controller('v1')
export class AppController {
  logger = new LoggerFactory().getLogger('app-controller');
  constructor(private readonly appService: AppService) {}

  @Get('/ping')
  getHello(@Req() req: Request) {
    try {
      req.res.statusCode = HttpStatus.OK;
      return new BaseEntity({
        data: { data: 'pong' },
        statusCode: HttpStatus.OK,
        message: `here's your pong`,
      });
    } catch (err) {
      throw err;
    }
  }
}
