// src/flights/flights.module.ts
import { Module } from '@nestjs/common';
import { FlightsService } from './flights.service';
import { FlightsController } from './flights.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Flight } from './entities/flight.entity';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService, ConfigModule } from '@nestjs/config';
import Amadeus from 'amadeus';
import { FlightsPricesProvider } from './flightsPrices.provider';
import { FlightPrice } from './entities/flightPrice.entity';

@Module({
  imports: [
    ConfigModule, // make sure ConfigService is available
    TypeOrmModule.forFeature([Flight, FlightPrice]),
    UsersModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        global: true,
        secret: config.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: config.get<string>('JWT_EXPIRES_IN') },
      }),
    }),
  ],
  controllers: [FlightsController],
  providers: [
    FlightsPricesProvider,
    FlightsService,
    {
      provide: 'AMADEUS_CLIENT',
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return new Amadeus({
          clientId: config.get<string>('AMADEUS_CLIENT_ID'),
          clientSecret: config.get<string>('AMADEUS_CLIENT_SECRET'),
        });
      },
    },
  ],
  exports: ['AMADEUS_CLIENT'],
})
export class FlightsModule {}
