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
}
