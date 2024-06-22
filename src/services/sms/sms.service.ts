import { Injectable } from '@nestjs/common';
import { LoggerFactory } from '../logger/logger';

@Injectable()
export class SmsService {
  private logger = new LoggerFactory().getLogger('sms-service');

  async sendSms(body: string) {
    try {
      this.logger.info('sending sms with body', { body });
    } catch (err) {
      this.logger.error('error in sending sms', err);
      throw err;
    }
  }
}
