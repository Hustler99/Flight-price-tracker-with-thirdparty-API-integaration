import { Exclude } from 'class-transformer';
import { Flight } from 'src/flights/entities/flight.entity';
import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'Users' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 30 })
  fullName: string;

  @Column({ type: 'varchar', length: 256, unique: true })
  email: string;

  @Column()
  @Exclude()
  password: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP(6)' })
  createdAt: Date;
  @OneToMany(() => Flight, (flight) => flight.user)
  flights: Flight;
}
