import { IsString, IsNotEmpty } from 'class-validator';

export class GenerateTokenDto {
  @IsNotEmpty()
  payload: string | Buffer | object;

  @IsNotEmpty()
  @IsString()
  expiresIn: string;
}
