import { IsNotEmpty } from 'class-validator';

export class GenerateTokenDto {
  @IsNotEmpty()
  payload: string | Buffer | object;

  userId?: string;
  expiresIn?: string;
}

export class GenerateRefreshTokenDto {
  @IsNotEmpty()
  payload: string | Buffer | object;

  userId?: string;
  meta?: object;
}
