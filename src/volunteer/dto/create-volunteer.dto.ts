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

export class CreateVolunteerDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ type: String, description: 'First Name', example: 'John', required: true})
  firstName: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'Doe', description: 'Last Name', type: String, required: true})
  lastName: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'john@doe.com', description: 'Email', type: String, required: true})
  email: string;

  @IsNotEmpty()
  //@IsPhoneNumber()
  @IsString()
  @ApiProperty({ example: '1234567890', description: 'Phone', type: String, required: true})
  phone: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'I wil be a volunteer because...', description: 'Description of the volunteer', required: true })
  description?: string;

  @IsOptional()
  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'Photo of the volunteer',
    required: false,
  })
  photo: string;
}