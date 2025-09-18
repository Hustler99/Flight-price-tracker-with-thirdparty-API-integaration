import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @Length(5, 30)
  @IsNotEmpty()
  fullName: string;

  @IsEmail()
  @MaxLength(256)
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @MinLength(6)
  @IsString()
  password: string;
}
