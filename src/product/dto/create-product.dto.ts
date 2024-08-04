import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min} from 'class-validator';

export class CreateProductDto {
  @ApiProperty({
    description: 'Product title',
    type: String,
    required: true,
  })
  @IsNotEmpty({ message: 'Title is required' })
  @IsString()
  title: string;

  @ApiProperty({
    description: 'Product description',
    type: String,
    required: true,
  })
  @IsNotEmpty({ message: 'Description is required' })
  @IsString()
  description: string;

  @ApiProperty({
    description: 'Product price',
    type: Number,
    required: true,
  })
  @IsNotEmpty({ message: 'Price is required' })
  @Type(() => Number)
  @IsNumber()
  price: number;

  @ApiProperty({
    description: 'Product discount',
    type: Number,
    required: true,
  })
  @IsNotEmpty({ message: 'Discount is required' })
  @Type(() => Number)
  @Min(0)
  @Max(1)
  @IsNumber()
  discount: number;

  @IsOptional()
  @ApiProperty({ type: 'string', format: 'binary', required: false })
  photo: string;

  @ApiProperty(({ type: Number, required: true,minimum: 0}))
  @IsNotEmpty({ message: 'Quantity is required' })
  @Type(() => Number)
  @Min(0, { message: 'Quantity must be a positive number' })
  @IsNumber()
  quantity: number;

}
