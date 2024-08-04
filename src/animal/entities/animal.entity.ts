import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { TimestampEntity } from '../../shared/entities/timestamp.entity';

@Entity('animal')
export class Animal extends TimestampEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  name: string;
  @Column({ nullable: true, length: 500 })
  photo: string;
  @Column()
  age: number;
  @Column()
  breed: string;
  @Column()
  species: string;
  @Column()
  gender: string;
  @Column()
  status: string;
}
