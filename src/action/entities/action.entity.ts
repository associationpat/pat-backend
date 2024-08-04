import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {TimestampEntity} from "../../shared/entities/timestamp.entity";
import {ApiProperty} from "@nestjs/swagger";
import { User } from "src/user/entities/user.entity";

@Entity("action")
export class Action extends TimestampEntity{
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column({
        type: 'mediumtext',
    })
    description: string;

    @Column()
    address: string;

    @Column()
    startDate: Date;

    @Column()
    endDate: Date;

    @Column()
    photo: string;

    @ManyToOne(() => User, user => user.actions)
    user: User;
}
