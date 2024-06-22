import { Controller, Post, Body, HttpStatus, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { GetOtpDto } from './dto/get-otp.dto';
import { GetOtpEntity } from './entities/get-otp.entity';
import BaseEntity from 'src/core/base/base.entity';
import Otp from 'src/models/otp.model';
import { JwtService } from 'src/services/jwt/jwt.service';
import { UserService } from '../user/user.service';
import { SmsService } from 'src/services/sms/sms.service';
import { ConstantsService } from 'src/services/constants/constants.service';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { LoggerFactory } from 'src/services/logger/logger';
import { Request } from 'express';
import { PublicEndpoint } from 'src/lib/decorators/public-endpoint.decorator';
import { UtilsService } from 'src/services/utils/utils.service';

@Controller('v1/auth')
export class AuthController {
  logger = new LoggerFactory().getLogger('auth-controller');
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly smsService: SmsService,
    private readonly constantsService: ConstantsService,
    private readonly util: UtilsService,
  ) {}

  @PublicEndpoint()
  @Post('otps')
  async getOtp(@Body() body: GetOtpDto) {
    try {
      const isUserFound = await this.authService.checkIfPhoneExists(
        body.country_code,
        body.phone,
      );

      if (!isUserFound) {
        await this.userService.create({
          phone_number: body.phone,
          country_code: body.country_code,
        });
      }
      const newOtp = await this.authService.createNewOtp({
        length: 6,
        setDefaultOtp: true,
      });
      const otpSmsMsg = this.constantsService.getOtpSmsTemplate(newOtp.otp, '');
      await this.smsService.sendSms(otpSmsMsg);
      // req.res.statusCode = 200;

      return new BaseEntity({
        data: new GetOtpEntity({
          phone: body.phone,
          country_code: body.country_code,
          code: newOtp.toJSON<Otp>().id,
        }),
        statusCode: HttpStatus.CREATED,
        message: 'otp created successfully',
      });
    } catch (err) {
      throw err;
    }
  }

  @PublicEndpoint()
  @Post('otps/verify')
  async verifyOtp(@Body() body: VerifyOtpDto, @Req() req: Request) {
    try {
      const isUserFound = await this.authService.checkIfPhoneExists(
        body.country_code,
        body.phone,
      );
      if (!isUserFound) {
        this.logger.error('user not found when verify otp');
        throw new Error('user not found when verify otp');
      }
      const validOtp = await this.authService.verifyOtp(body.otpCode, body.otp);
      await validOtp.expireNow();

      // const newRefreshToken = await this.jwtService.generateRefreshToken({
      //   payload: {
      //     id: isUserFound.id,
      //     country_code: isUserFound.country_code,
      //     phone_number: isUserFound.phone_number,
      //     profile_picture: isUserFound.profile_picture,
      //   },
      //   userId: isUserFound.id,
      // });
      const newAccessToken = await this.jwtService.generateAccessToken({
        payload: {
          id: isUserFound.id,
          country_code: isUserFound.country_code,
          phone_number: isUserFound.phone_number,
          profile_picture: isUserFound.profile_picture,
        },
        userId: isUserFound.id,
        expiresIn: '30d',
      });
      const accessToken = `Bearer ${newAccessToken}`;
      req.res.cookie('access-token', accessToken, {
        httpOnly: true,
        secure: false, // this.config.get('NODE_ENV') !== this.constantsService.VALID_ENVS.dev,
        encode: (val) => this.util.encodeToBase64(val),
      });
      return new BaseEntity({
        data: {
          phone: body.phone,
          country_code: body.country_code,
        },
        statusCode: HttpStatus.CREATED,
        message: 'otp verified successfully',
      });
    } catch (err) {
      throw err;
    }
  }

  @PublicEndpoint()
  @Post('otps/resend')
  async resendOtp(@Body() body: GetOtpDto) {
    try {
      const isUserFound = await this.authService.checkIfPhoneExists(
        body.country_code,
        body.phone,
      );

      if (!isUserFound) {
        await this.userService.create({
          phone_number: body.phone,
          country_code: body.country_code,
        });
      }
      const newOtp = await this.authService.createNewOtp({ length: 6 });
      const otpSmsMsg = this.constantsService.getOtpSmsTemplate(newOtp.otp, '');
      await this.smsService.sendSms(otpSmsMsg);

      return new BaseEntity({
        data: new GetOtpEntity({
          phone: body.phone,
          country_code: body.country_code,
          code: newOtp.toJSON<Otp>().id,
        }),
        statusCode: HttpStatus.CREATED,
        message: 'otp created successfully',
      });
    } catch (err) {
      throw err;
    }
  }
}
