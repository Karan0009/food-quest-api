import { IsString, IsNotEmpty, IsInt } from 'class-validator';

export class GenerateHashDto {
  @IsNotEmpty()
  @IsString()
  stringToHash: string;

  @IsInt()
  saltRounds?: number;
}
