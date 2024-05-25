import { IsNotEmpty, IsNumberString, Length } from 'class-validator';

export class GetOtpDto {
  @IsNotEmpty()
  country_code: string;

  //   @IsNumberString({
  //     no_symbols: true,
  //   })
  //   @Length(10, 10, {
  //     message: 'phone must be equal to 10 characters',
  //   })
  //   @Validate(IntNumberStringOrIntNumber, [10, 10], {})
  @IsNotEmpty()
  @IsNumberString()
  @Length(10, 10, {
    message: 'phone must be of 10 characters',
  })
  phone: string;
}
