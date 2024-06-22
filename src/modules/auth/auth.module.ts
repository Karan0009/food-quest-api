import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { SmsModule } from 'src/services/sms/sms.module';

@Module({
  imports: [UserModule, SmsModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
