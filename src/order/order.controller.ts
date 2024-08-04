import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { GetPaginatedDto } from 'src/shared/pagination/get-paginated.dto';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';

@ApiTags('order')
@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  @ApiResponse({ status: 201, description: 'Order created successfully' })
  @ApiBadRequestResponse({
    status: 400,
    description: 'Order creation failed, please check the request body',
  })
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.orderService.create(createOrderDto);
  }

  @Get()
  @ApiResponse({ status: 200, description: 'Orders retrieved successfully' })
  @ApiBadRequestResponse({
    status: 400,
    description: 'Orders retrieval failed',
  })
  // auth guard
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  findAll(@Query() queryParams: GetPaginatedDto) {
    return this.orderService.findAll(queryParams);
  }

  @Get(':id')
  @ApiResponse({ status: 200, description: 'Order retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Order not found' })
  // auth guard
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.orderService.findOne(id);
  }

  @Patch(':id')
  @ApiResponse({ status: 200, description: 'Order updated successfully' })
  @ApiResponse({ status: 404, description: 'Order not found' })
  @ApiBadRequestResponse({
    status: 400,
    description: 'Order update failed, please check the request body',
  })
  // auth guard
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateOrderDto: UpdateOrderDto,
  ) {
    return this.orderService.update(id, updateOrderDto);
  }

  @Delete(':id')
  @ApiResponse({ status: 200, description: 'Order deleted successfully' })
  @ApiResponse({ status: 404, description: 'Order not found' })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.orderService.remove(id);
  }

  @Patch(':id/restore')
  @ApiResponse({ status: 200, description: 'Order restored successfully' })
  @ApiResponse({ status: 404, description: 'Order not found' })
  // auth guard
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  restore(@Param('id', ParseIntPipe) id: number) {
    return this.orderService.restore(id);
  }
}
