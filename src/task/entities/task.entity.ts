import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { TimestampEntity } from '../../shared/entities/timestamp.entity';

@Entity('task')
export class Task extends TimestampEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  deadline: Date;

  @Column({ default: false })
  starred: boolean;

  @Column({ default: false })
  done: boolean;

}
