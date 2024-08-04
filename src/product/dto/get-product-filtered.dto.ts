import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class GetProductFilteredDto {
  @ApiProperty({
    required: false,
    type: String,
    description: 'Filter by product title',
  })
  @IsOptional()
  @IsString()
  title: string;

  @ApiProperty({
    required: false,
    type: Number,
    description: 'Filter by product price',
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  price: number;

  @ApiProperty({
    required: false,
    type: Number,
    description: 'Filter by product discount',
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  discount: number;
}
