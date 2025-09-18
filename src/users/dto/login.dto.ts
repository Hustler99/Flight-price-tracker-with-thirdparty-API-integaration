import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class LoginUserDto {
  @IsEmail()
  @MaxLength(256)
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @MinLength(6)
  @IsString()
  password: string;
}
