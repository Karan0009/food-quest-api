import { Expose } from 'class-transformer';

interface IGetOtpEntity {
  phone?: string;
  country_code?: string;
  code?: string;
}

export class GetOtpEntity {
  @Expose()
  phone: string;
  @Expose()
  country_code: string;
  @Expose()
  code: string;

  constructor(data: IGetOtpEntity) {
    Object.assign(this, data);
  }
}
