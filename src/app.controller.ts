import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello() {
    try {
      return this.appService.getHello();
    } catch (err) {
      // Logger.error('error in getHello', err);
      throw err;
    }
  }
}
