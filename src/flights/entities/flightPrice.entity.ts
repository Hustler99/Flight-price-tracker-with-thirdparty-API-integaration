import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Flight } from './flight.entity';
@Entity({ name: 'FlightReq_prices' })
export class FlightPrice {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  airLine: string;

  @Column()
  price: string;

  @Column()
  currency: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP(6)' })
  checkedAt: Date;
  @Column({ type: 'timestamp' })
  leaveTime: Date;
  @Column({ type: 'timestamp' })
  arrivalTime: Date;

  @OneToOne(() => Flight, (flightreq) => flightreq.req)
  @JoinColumn()
  req: Flight;
}
