import { Expose } from 'class-transformer';

interface IVerifyOtpEntity {
  phone?: string;
  country_code?: string;
  code?: string;
}

export class VerifyOtpEntity {
  @Expose()
  phone: string;
  @Expose()
  country_code: string;
  @Expose()
  code: string;

  constructor(data: IVerifyOtpEntity) {
    Object.assign(this, data);
  }
}
