import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { Repository } from 'typeorm';
import { OrderStatusEnum } from 'src/Enums/order-status.enum';
import { ProductService } from 'src/product/product.service';
import { GetPaginatedDto } from 'src/shared/pagination/get-paginated.dto';
import { GetOrderFilteredDto } from './dto/get-order-filtered.dto';
import {Product} from "../product/entities/product.entity";

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order) private orderRepository: Repository<Order>,
    @InjectRepository(Order) private productRepository: Repository<Product>,
    private productService: ProductService,
  ) {}

  async create(createOrderDto: CreateOrderDto) {
    const order = this.orderRepository.create(createOrderDto);
    // get price from product
    const product = (await this.productService.findOne(createOrderDto.product.id))[0];
    if (!product) {
      throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
    }
    if(product.getAvailableQuantity()<order.quantity){
      throw new HttpException('Not enough quantity in stock',406)
    }
    order.product = product;
    order.price = product.price * createOrderDto.quantity  * (1 - product.discount);
    return await this.orderRepository.save(order);
  }

  async findAll(getPaginatedDto: GetPaginatedDto) {
    const { page, nbPerPage } = getPaginatedDto;
    let realPage = page || 1;
    let realNbPerPage = nbPerPage || 10;
    const total = await this.orderRepository.count();
    // if page and nbPerPage are not provided, return all products
    if (!page && !nbPerPage) {
      realPage = 1;
      realNbPerPage = total;
    }
    const result = await this.orderRepository.find({
      skip: (realPage - 1) * realNbPerPage,
      take: realNbPerPage,
    });
    const nbPages = Math.ceil(total / realNbPerPage);
    return { result, total, nbPages };
  }

  async findAllFiltered(
    getPaginatedDto: GetPaginatedDto,
    getFilteredDto: GetOrderFilteredDto,
  ) {
    const { page, nbPerPage } = getPaginatedDto;
    if (!page && !nbPerPage) {
      return await this.orderRepository.find();
    }

    const realPage = page || 1;
    const realNbPerPage = nbPerPage || 10;
    // Filter out undefined values from getFilteredDto
    const where = {};
    for (const key in getFilteredDto) {
      if (getFilteredDto[key] !== undefined) {
        where[key] = getFilteredDto[key];
      }
    }

    const result = await this.orderRepository.find({
      where,
      skip: (realPage - 1) * realNbPerPage,
      take: realNbPerPage,
    });
    const total = await this.orderRepository.count({ where });
    const nbPages = Math.ceil(total / realNbPerPage);
    return { result, total, nbPages };
  }

  async findOne(id: number) {
    if (!(await this.orderRepository.findOne({ where: { id } }))) {
      throw new HttpException('Order not found', HttpStatus.NOT_FOUND);
    }
    return await this.orderRepository.find({ where: { id: id } });
  }

  async update(id: number, {status}: UpdateOrderDto) {
    const order = await this.orderRepository.findOne({ where: { id } });
    if (!order) {
      throw new HttpException('Order not found', HttpStatus.NOT_FOUND);
    }
    order.updateStatus(status)
    return await this.orderRepository.save(order);
  }

  async remove(id: number) {
    const order = await this.orderRepository.findOne({ where: { id } });
    if (!order){
      throw new HttpException('Order not found', HttpStatus.NOT_FOUND);
    }
    order.onDelete(this.productService)
    return await this.orderRepository.softDelete(id);
  }

  async restore(id: number) {
    const order = await this.orderRepository.findOne({
      where: { id },
      withDeleted: true,
    });
    if (!order) {
      throw new HttpException('Order not found', HttpStatus.NOT_FOUND);
    }
    if (!order.deletedAt) {
      throw new HttpException('Order is not deleted', HttpStatus.BAD_REQUEST);
    }
    order.onRestore(this.productService)
    return await this.orderRepository.restore(id);
  }
}
