import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { OrderStatusEnum } from 'src/Enums/order-status.enum';

export class GetOrderFilteredDto {
  @ApiProperty({
    required: false,
    type: String,
    description: 'Filter by customer name',
  })
  @IsOptional()
  @IsString()
  customerName: string;

  @ApiProperty({
    required: false,
    type: String,
    description: 'Filter by customer phone',
  })
  @IsOptional()
  @IsString()
  customerPhone: string;

  @ApiProperty({
    required: false,
    enum: OrderStatusEnum,
    description: 'Filter by order status',
  })
  @IsOptional()
  @IsEnum(OrderStatusEnum)
  status: OrderStatusEnum;

  @ApiProperty({
    required: false,
    type: Number,
    description: 'Filter by order quantity',
  })
  @IsOptional()
  @Type(() => Number)
  quantity: number;

  @ApiProperty({
    required: false,
    type: Number,
    description: 'Filter by order price',
  })
  @IsOptional()
  @Type(() => Number)
  price: number;
}
