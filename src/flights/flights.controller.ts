import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { FlightsService } from './flights.service';
import { CreateFlightReqDto } from './dto/create-flight-Request.dto';
import { CurrentUser } from 'src/users/decorators/current-user.decorators';
import { AuthGuard } from 'src/users/guards/auth.guard';
import { JwtPayload } from 'jsonwebtoken';
import type { JWTPayloadType } from 'src/utils/types';

@Controller('/api/flights')
@UseGuards(AuthGuard)
export class FlightsController {
  constructor(private readonly flightsService: FlightsService) {}

  @Post()
  async create(
    @Body() createFlightDto: CreateFlightReqDto,
    @CurrentUser() payLoad: JWTPayloadType,
  ) {
    return await this.flightsService.create(createFlightDto, payLoad.id);
  }

  @Get()
  async findAll(@CurrentUser() payLoad: JWTPayloadType) {
    return await this.flightsService.findAllRequestsByUser(payLoad.id);
  }
}
