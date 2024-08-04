import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  // Max,
  // Min,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
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

  @IsOptional()
  password: string;

  @IsOptional()
  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'Photo of the user',
    required: false,
  })
  photo: string;
}
