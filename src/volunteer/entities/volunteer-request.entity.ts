import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { GenderEnum } from '../../Enums/gender.enum';
import { TimestampEntity } from '../../shared/entities/timestamp.entity';
import { Volunteer } from './volunteer.entity';

@Entity('volunteer-request')
export class VolunteerRequest extends Volunteer {}