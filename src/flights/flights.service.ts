import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateFlightReqDto } from './dto/create-flight-Request.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Flight } from './entities/flight.entity';
import { Repository } from 'typeorm';
import { UsersService } from 'src/users/users.service';
import { FlightsPricesProvider } from './flightsPrices.provider';

@Injectable()
export class FlightsService {
  constructor(
    @InjectRepository(Flight)
    private readonly flightRepository: Repository<Flight>,
    private readonly userService: UsersService,
    private readonly flightProvider:FlightsPricesProvider
  ) {}

  async create(createFlightDto: CreateFlightReqDto, userId: number) {
    const { origin, destination, travelDate } = createFlightDto;
    const user = await this.userService.getCurrentUser(userId);
    if(!user) throw new UnauthorizedException("You must register to search.");

    const FlightReq =  await this.flightRepository.save({
      origin,
      destination,
      travelDate,
      user,
    })
    const isThereRoute =  await this.flightProvider.searchFlights(FlightReq.origin,FlightReq.destination,FlightReq.travelDate)
    console.log(isThereRoute)
    if(isThereRoute){
     const result =  this.flightProvider.createPriceResponse(isThereRoute, FlightReq);
      return result;
    }
    
    throw isThereRoute;

    
  }

  findAll() {
    return `This action returns all flights`;
  }

  findOne(id: number) {
    return `This action returns a #${id} flight`;
  }

  remove(id: number) {
    return `This action removes a #${id} flight`;
  }
}
