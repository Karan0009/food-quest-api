import { PartialType } from '@nestjs/mapped-types';
import { GetOtpDto } from './get-otp.dto';

export class UpdateAuthDto extends PartialType(GetOtpDto) {}
