import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAnimalDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ type: String, description: 'Name', example: 'Buddy' })
  name: string;
  @IsOptional()
  @IsString()
  @ApiProperty({
    type: 'file',
    format: 'binary',
    description: 'Photo',
    required: false,
  })
  photo: string;
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  @ApiProperty({ type: Number, description: 'Age', example: 2 })
  age: number;
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Breed',
    example: 'Golden Retriever',
  })
  breed: string;
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ type: String, description: 'Species', example: 'Dog' })
  species: string;
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ type: String, description: 'Status', example: 'sterilized' })
  status: string;
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ type: String, description: 'Gender', example: 'Male' })
  gender: string;
}
