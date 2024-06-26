import { IsEmail, IsNumberString, IsOptional, MinLength } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';

export class SignInDto {
  @ApiProperty({ example: 'admin@gmail.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '123456' })
  @MinLength(6)
  password: string;

  @IsOptional()
  @IsNumberString()
  tfaCode?: string;
}
