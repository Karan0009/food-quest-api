import { Injectable } from '@nestjs/common';
import { randomInt } from 'node:crypto';
import * as dayjs from 'dayjs';
import * as utc from 'dayjs/plugin/utc';
import * as timezone from 'dayjs/plugin/timezone';

@Injectable()
export class UtilsService {
  async wait(timeInMs: number) {
    return new Promise<void>((res) => {
      setTimeout(() => {
        res();
      }, timeInMs);
    });
  }

  generateRandomOtp(options: OtpOptions): string {
    try {
      const minLimit = parseInt(Array(options.length).fill(0).join(''));
      const maxLimit = parseInt(Array(options.length).fill(9).join(''));

      const otp = randomInt(minLimit, maxLimit).toString();

      return otp;
    } catch (err) {
      throw err;
    }
  }

  getDayJsObj(datetime?: string | number | dayjs.Dayjs | Date, tz = 'utc') {
    try {
      dayjs.extend(utc);
      dayjs.extend(timezone);
      return datetime ? dayjs(datetime).tz(tz) : dayjs().tz(tz);
    } catch (err) {
      throw err;
    }
  }

  encodeToBase64(val) {
    return Buffer.from(val).toString('base64');
  }

  decodeFromBase64(base64Str) {
    try {
      return Buffer.from(base64Str, 'base64').toString('ascii');
    } catch (err) {
      return null;
    }
  }
}

export interface OtpOptions {
  length: number;
  setDefaultOtp?: boolean;
}
