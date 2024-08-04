import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { TimestampEntity } from '../../shared/entities/timestamp.entity';
import { User } from 'src/user/entities/user.entity';

@Entity('article')
export class Article extends TimestampEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({
    type: 'mediumtext',
  })
  content: string;

  @Column({ nullable: true, length: 500 })
  photo: string;

  @ManyToOne(() => User, (user) => user.articles)
  user: User
}
