import { Injectable } from '@nestjs/common';

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
      const numbers = '0123456789';
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
      let charsetToUse = numbers;
      if (!options.onlyNumbers) {
        charsetToUse += chars;
      }
      let otp = '';

      for (let i = 0; i < options.length; i++) {
        const randomIndex = Math.floor(Math.random() * charsetToUse.length);
        otp += charsetToUse[randomIndex];
      }

      return otp;
    } catch (err) {
      throw err;
    }
  }
}

export interface OtpOptions {
  length: number;
  onlyNumbers: boolean;
}
