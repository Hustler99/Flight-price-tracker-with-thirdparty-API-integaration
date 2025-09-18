// airLine: segment.carrierCode,
import { IsDate, IsNotEmpty, IsString } from 'class-validator';


export class CreateFlightResDto {
  @IsString()
  @IsNotEmpty()
  airLine: string;

  @IsString()
  @IsNotEmpty()
  price: string;

  @IsString()
  @IsNotEmpty()
  currency: string;

  @IsDate()
  @IsNotEmpty()
  leaveTime: Date;
  @IsDate()
  @IsNotEmpty()
  arrivalTime: Date;
}
