import { Injectable } from '@nestjs/common';

@Injectable()
export class ConstantsService {
  USER_STATUS = { active: 'active', inactive: 'inactive', deleted: 'deleted' };

  COUNTRY_CODES = {
    IN: '+91',
  };

  getOtpSmsTemplate = (otpCode, appHash) =>
    `Your otp for fabnest is ${otpCode} ${appHash}`;

  TIME_IN_SECONDS = {
    fifteen_min: 54000,
  };

  VALID_ENVS = { dev: 'dev', testing: 'testing', production: 'production' };
  DEFAULT_PHONE_VERIFICATION_OTP = '111111';
}
