import { IsNumber, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class GetPaginatedDto {
  @ApiProperty({
    required: false,
    type: Number,
    description: 'Page number',
  })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  page: number;

  @ApiProperty({
    required: false,
    type: Number,
    description: 'Number of items per page',
  })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  nbPerPage: number;
}
