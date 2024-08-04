import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  // Max,
  // Min
} from 'class-validator';

export class CreateSuperAdminDto {
  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({ example: 'example@test.com' })
  email: string;

  @IsNotEmpty()
  @ApiProperty({ example: 'John' })
  firstName: string;

  @IsNotEmpty()
  @ApiProperty({ example: 'Samet' })
  lastName: string;

  @IsNotEmpty()
  @ApiProperty({ example: 12345678 })
  phone: number;

  @IsNotEmpty()
  @ApiProperty({ example: '12345678' })
  password: string;

  @IsOptional()
  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'Photo of the user',
    required: false,
  })
  photo: string;

  @IsNotEmpty()
  @ApiProperty({ example: '!569@pat1345' })
  license: string;
}
