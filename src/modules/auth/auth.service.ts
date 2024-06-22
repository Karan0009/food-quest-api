import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Otp from 'src/models/otp.model';
import User, { USER_STATUS } from 'src/models/user.model';
import { ConstantsService } from 'src/services/constants/constants.service';
import { OtpOptions, UtilsService } from 'src/services/utils/utils.service';

@Injectable()
export class AuthService {
  constructor(
    private util: UtilsService,
    private constants: ConstantsService,
    private readonly config: ConfigService,
  ) {}

  async checkIfPhoneExists(countryCode, phone) {
    try {
      const user = await User.findOne({
        attributes: ['phone_number', 'id'],
        where: {
          phone_number: phone,
          country_code: countryCode,
          status: USER_STATUS.active,
        },
        raw: true,
      });

      return user;
    } catch (err) {
      throw err;
    }
  }
  async createNewOtp(options: OtpOptions) {
    try {
      const newOtp = await Otp.create<Otp>(
        {
          otp:
            options.setDefaultOtp && this.config.get('APP_ENV') == 'dev'
              ? this.constants.DEFAULT_PHONE_VERIFICATION_OTP
              : this.util.generateRandomOtp(options),
          time_to_live_in_sec: this.constants.TIME_IN_SECONDS.fifteen_min,
        },
        { raw: true },
      );
      return newOtp;
    } catch (err) {
      throw err;
    }
  }

  async verifyOtp(otpCode: string, otp: string) {
    try {
      const otpExists = await Otp.findOne({
        where: { otp: otp, id: otpCode, is_used: false },
      });
      if (!otpExists) throw new Error('invalid otp');

      const curDateTime = this.util.getDayJsObj();
      const otpExpiryDateTime = this.util
        .getDayJsObj(otpExists.created_at)
        .add(otpExists.time_to_live_in_sec, 's');
      if (curDateTime.isAfter(otpExpiryDateTime))
        throw new Error('invalid otp');
      return otpExists;
    } catch (err) {
      throw err;
    }
  }
}
