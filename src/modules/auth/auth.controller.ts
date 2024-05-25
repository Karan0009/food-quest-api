import { Controller, Post, Body, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { GetOtpDto } from './dto/get-otp.dto';
import { GetOtpEntity } from './entities/get-otp.entity';
import { BaseEntity } from 'src/core/base/base.entity';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('get-otp')
  async getOtp(@Body() body: GetOtpDto) {
    try {
      const newOtp = await this.authService.createNewOtp();
      // req.res.statusCode = 200;

      return new BaseEntity({
        data: new GetOtpEntity({ phone: '23232' }),
        statusCode: HttpStatus.CREATED,
        message: 'otp created successfully',
      });
    } catch (err) {
      throw err;
    }
  }
}
