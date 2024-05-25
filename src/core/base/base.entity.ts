import { HttpStatus } from '@nestjs/common';
import { Expose } from 'class-transformer';

export class BaseEntity {
  @Expose()
  data: object | null;
  @Expose()
  error: object | null;
  @Expose()
  message?: string;
  @Expose()
  statusCode?: number;

  constructor(partial: Partial<BaseEntity>) {
    if (!partial.message) {
      partial.message = 'successful';
    }
    if (!partial.statusCode) {
      partial.statusCode = HttpStatus.OK;
    }
    Object.assign(this, partial);
  }
}
