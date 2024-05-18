import { Controller, Get, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { Response } from 'express';
import { LoggerFactory } from './services/logger/logger';

@Controller()
export class AppController {
  logger = new LoggerFactory().getLogger('app-controller');
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(@Res() res: Response) {
    try {
      const someOtherData = { name: 'karan', age: '24' };
      this.logger.info('hello', { someOtherData });
      res.json({ data: 'hello' });
      // return this.appService.getHello();
    } catch (err) {
      // Logger.error('error in getHello', err);
      throw err;
    }
  }
}
