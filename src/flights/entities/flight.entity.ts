import { Exclude } from 'class-transformer';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { FlightPrice } from './flightPrice.entity';
@Entity({ name: 'Flight_requests' })
export class Flight {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: '15' })
  origin: string;

  @Column({ type: 'varchar', length: '15' })
  destination: string;

  @Column({ type: 'timestamp' })
  travelDate: string;

  @Column({ type: 'timestamp',default: () => 'CURRENT_TIMESTAMP(6)' })
  createdAt: Date;

  @ManyToOne(()=> User ,(user)=>user.flights)
  user:User;

  @OneToOne(()=> FlightPrice, (flightprice)=>flightprice.req)
  req:FlightPrice
}
