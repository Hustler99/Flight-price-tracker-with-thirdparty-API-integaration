import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Amadeus from 'amadeus';
import { FlightPrice } from './entities/flightPrice.entity';
import { Repository } from 'typeorm';
import { CreateFlightResDto } from './dto/create-flightPrice.dto';
import { CreateFlightReqDto } from './dto/create-flight-Request.dto';
import { CreateUserDto } from 'src/users/dto/register.dto';
import { Flight } from './entities/flight.entity';

@Injectable()
export class FlightsPricesProvider {
  constructor(
    @Inject('AMADEUS_CLIENT') private readonly amadeus: Amadeus,
    @InjectRepository(FlightPrice)
    private readonly FlightPriceRepository: Repository<FlightPrice>,
  ) {}

  async searchFlights(origin: string, destination: string, date: string) {
    try {
      const response = await this.amadeus.shopping.flightOffersSearch.get({
        originLocationCode: origin.toUpperCase(),
        destinationLocationCode: destination.toUpperCase(),
        departureDate: date,
        adults: '1',
        currencyCode: 'EGP',
        max: 1,
        nonStop: true,
      });

      const firstOffer = response.data?.[0];
      if (!firstOffer) {
        throw new NotFoundException('This Route has no upcoming flights!');
      }

      const itinerary = firstOffer.itineraries[0];
      const segment = itinerary.segments[0];

      return {
        airLine: segment.carrierCode,
        price: firstOffer.price.total,
        currency: firstOffer.price.currency,
        leaveTime: segment.departure.at,
        arrivalTime: segment.arrival.at,
      };
    } catch (error: any) {
      if (error.code === 'ClientError' && error.response?.statusCode === 400) {
        throw new BadRequestException('Invalid Origin or Destination');
      }
      throw error;
    }
  }

  async createPriceResponse(
    priceResponse: CreateFlightResDto,
    request: Flight,
  ) {
    const { airLine, arrivalTime, leaveTime, price, currency } = priceResponse;
    return await this.FlightPriceRepository.save({
      airLine,
      price,
      currency,
      leaveTime,
      arrivalTime,
      req: request,
    });
  }
}
