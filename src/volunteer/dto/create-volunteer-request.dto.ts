import { Column, PrimaryGeneratedColumn } from 'typeorm';
import { GenderEnum } from '../../Enums/gender.enum';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CreateVolunteerDto } from './create-volunteer.dto';

export class CreateVolunteerRequestDto extends CreateVolunteerDto {}