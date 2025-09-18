import { Type } from 'class-transformer';
import { IsDate, IsDateString, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateFlightReqDto {
  @IsString()
  @MaxLength(15)
  @IsNotEmpty()
  origin: string;
  @IsString()
  @MaxLength(15)
  @IsNotEmpty()
  destination: string;

  @IsDateString()
  @IsNotEmpty()
  travelDate: string;
}
