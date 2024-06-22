import { IsNotEmpty, IsNumberString, Length, IsString } from 'class-validator';

export class VerifyOtpDto {
  @IsNotEmpty()
  country_code: string;

  @IsNotEmpty()
  @IsNumberString()
  @Length(10, 10, {
    message: 'phone must be of 10 characters',
  })
  phone: string;

  @IsNotEmpty()
  @IsString()
  otpCode: string;

  @IsNotEmpty()
  @IsNumberString()
  otp: string;
}
