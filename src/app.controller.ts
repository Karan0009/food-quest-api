import { Controller, Get, Logger, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { Response } from 'express';

@Controller()
export class AppController {
  logger = new Logger('app-controller');
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(@Res() res: Response) {
    try {
      this.logger.log('hello');
      res.json({ data: 'hello' });
      // return this.appService.getHello();
    } catch (err) {
      // Logger.error('error in getHello', err);
      throw err;
    }
  }
}
