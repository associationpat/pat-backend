import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { GenderEnum } from '../../Enums/gender.enum';
import { TimestampEntity } from '../../shared/entities/timestamp.entity';

@Entity('volunteer')
export class Volunteer extends TimestampEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  email: string;

  @Column()
  phone: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column()
  photo: string;
}