import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateFlightReqDto } from './dto/create-flight-Request.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Flight } from './entities/flight.entity';
import { Repository } from 'typeorm';
import { UsersService } from 'src/users/users.service';
import { FlightsPricesProvider } from './flightsPrices.provider';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class FlightsService {
  constructor(
    @InjectRepository(Flight)
    private readonly flightRepository: Repository<Flight>,
    private readonly userService: UsersService,
    private readonly flightProvider: FlightsPricesProvider,
  ) {}

  async create(createFlightDto: CreateFlightReqDto, userId: number) {
    const { origin, destination, travelDate } = createFlightDto;
    const user = await this.userService.getCurrentUser(userId);
    if (!user) throw new UnauthorizedException('You must register to search.');

    const isThereRoute = await this.flightProvider.searchFlights(
      origin,
      destination,
      travelDate,
    );

    if (isThereRoute) {
      const FlightReq = await this.flightRepository.save({
        origin,
        destination,
        travelDate,
        user,
      });
      const flight = await this.flightProvider.createPriceResponse(
        isThereRoute,
        FlightReq,
      );
      return {
        airLine: flight.airLine,
        price: flight.price,
        currency: flight.currency,
        leaveTime: flight.leaveTime,
        arrivalTime: flight.arrivalTime,
        reqId: flight.req.id,
        id: flight.id,
        checkedAt: flight.checkedAt,
      };
    }

    throw new NotFoundException('Route not found!');
  }

  async findAllRequestsByUser(id: number) {
    const requests = await this.flightRepository.find({
      where: { user: { id } },
      relations: ['res'],
    });
    if (requests.length > 0) {
      return requests;
    } else {
      throw new NotFoundException('No Flights Found for this user');
    }
  }
}
