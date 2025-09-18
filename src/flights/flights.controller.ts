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
export class FlightsController {
  constructor(private readonly flightsService: FlightsService) {}

  @Post()
  @UseGuards(AuthGuard)
  async create(
    @Body() createFlightDto: CreateFlightReqDto,
    @CurrentUser() payLoad: JWTPayloadType,
  ) {
    return await this.flightsService.create(createFlightDto, payLoad.id);
  }

  @Get()
  findAll() {
    return this.flightsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.flightsService.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.flightsService.remove(+id);
  }
}
