import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { OrderStatusEnum } from 'src/Enums/order-status.enum';
import { Product } from 'src/product/entities/product.entity';

export class UpdateOrderDto {

  @IsOptional()
  @IsEnum(OrderStatusEnum)
  status: OrderStatusEnum;

  
}
