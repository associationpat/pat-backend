import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  TableInheritance,
} from 'typeorm';
import { UserRoleEnum } from '../../Enums/user-role.enum';
import { TimestampEntity } from '../../shared/entities/timestamp.entity';
import { Action } from '../../action/entities/action.entity';
import { Article } from 'src/article/entities/article.entity';
import { Exclude } from 'class-transformer';

@Entity('user')
@TableInheritance({
  column: { type: 'varchar', name: 'role', enum: UserRoleEnum },
})
export class User extends TimestampEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Exclude()
  @Column()
  password: string;

  @Column({ nullable: true, length: 500 })
  photo: string;

  @Exclude()
  @Column()
  salt: string;

  @Column({ unique: true })
  phone: number;

  @Column({
    type: 'enum',
    enum: UserRoleEnum,
  })
  role: string;

  @OneToMany(() => Action, action => action.user)
  actions: Action

  @OneToMany(() => Article, article => article.user)
  articles: Article
}
