import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString, IsEmail } from 'class-validator';
import { OrderStatusEnum } from 'src/Enums/order-status.enum';
import { Product } from 'src/product/entities/product.entity';

export class CreateOrderDto {
  @ApiProperty({
    required: true,
    type: String,
    description: 'Customer last name',
    example: 'Ben Ghorbel',
  })
  @IsNotEmpty({ message: 'Last name is required' })
  @IsString()
  lastName: string;


  @ApiProperty({
    required: true,
    type: String,
    description: 'Customer first name',
    example: 'Aziz',
  })
  @IsNotEmpty({ message: 'First name is required' })
  @IsString()
  firstName: string;



  @ApiProperty({
    required: true,
    type: String,
    description: 'Customer phone',
    example: '12345678',
  })
  @IsNotEmpty({ message: 'Phone is required' })
  @IsString()
  phone: string;

  @ApiProperty({
    required: true,
    type: String,
    description: 'Customer email',
    example: 'benghorbelaziz@gmail.com',
  })
  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: 'Invalid email format' })
  email: string;

  @ApiProperty({
    required: true,
    type: String,
    description: 'Customer address',
    example: 'insat',
  })
  @IsNotEmpty({ message: 'Address is required' })
  @IsString()
  address: string;

  @ApiProperty({
    required: true,
    type: String,
    description: 'City',
    example: 'tunis',
  })
  @IsNotEmpty({ message: 'City is required' })
  @IsString()
  city: string;

  @ApiProperty({
    required: true,
    type: String,
    description: 'Postal code',
    example: '1000',
  })
  @IsNotEmpty({ message: 'Postal code is required' })
  @IsString()
  postalCode: string;

  @ApiProperty({
    required: true,
    type: Number,
    description: 'Quantity',
    example: 5,
  })
  @IsNotEmpty({ message: 'Quantity is required' })
  @Type(() => Number)
  quantity: number;

  @ApiProperty({
    required: true,
    type: Product,
    description: 'Product',
    example: { id: 1 },
  })
  @IsNotEmpty({ message: 'Product is required' })
  @Type(() => Product)
  product: Product;

  price: number;
  status: OrderStatusEnum;
}
