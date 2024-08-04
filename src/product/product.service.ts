import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import { GetPaginatedDto } from 'src/shared/pagination/get-paginated.dto';
import { GetProductFilteredDto } from './dto/get-product-filtered.dto';
import { User } from 'src/user/entities/user.entity';
import { UserRoleEnum } from 'src/Enums/user-role.enum';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product) private productRepository: Repository<Product>,
  ) {}

  async create(createProductDto: CreateProductDto, currentUser: User) {
    return await this.productRepository.save(createProductDto);
  }

  async findAll(getPaginatedDto: GetPaginatedDto) {
    const { page, nbPerPage } = getPaginatedDto;
    const total = await this.productRepository.count();
    // default: page = 1, nbPerPage = 10
    let realPage = page || 1;
    let realNbPerPage = nbPerPage || 10;

    // if page and nbPerPage are not provided, return all products
    if (!page && !nbPerPage) {
      realPage = 1;
      realNbPerPage = total;
    }

    const result = await this.productRepository.find({
      skip: (realPage - 1) * realNbPerPage,
      take: realNbPerPage,
    });
    const nbPages = Math.ceil(total / realNbPerPage);
    return { result, total, nbPages };
  }

  async findAllFiltered(
    getPaginatedDto: GetPaginatedDto,
    getFilteredDto: GetProductFilteredDto,
  ) {
    const { page, nbPerPage } = getPaginatedDto;
    let realPage = page || 1;
    let realNbPerPage = nbPerPage || 10;
    // Filter out undefined values from getFilteredDto
    const where = {};
    for (const key in getFilteredDto) {
      if (getFilteredDto[key] !== undefined) {
        where[key] = getFilteredDto[key];
      }
    }
    const total = await this.productRepository.count({ where });
    if (!page && !nbPerPage) {
      realPage = 1;
      realNbPerPage = total;
    }
    const result = await this.productRepository.find({
      where,
      skip: (realPage - 1) * realNbPerPage,
      take: realNbPerPage,
    });
    const nbPages = Math.ceil(total / realNbPerPage);
    return { result, total, nbPages };
  }

  async findOne(id: number) {
    if (!(await this.productRepository.findOne({ where: { id } }))) {
      throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
    }
    return await this.productRepository.find({ where: { id } });
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    if (!(await this.productRepository.findOne({ where: { id } }))) {
      throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
    }
    return await this.productRepository.update(id, updateProductDto);
  }

  async remove(id: number) {
    if (!(await this.productRepository.findOne({ where: { id } }))) {
      throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
    }
    return await this.productRepository.softDelete(id);
  }

  async restore(id: number) {
    if (!(await this.productRepository.findOne({ where: { id } }))) {
      throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
    }
    return await this.productRepository.restore(id);
  }

  async updateQuantity(id: number , {quantity,reservedQuantity}:{quantity:number,reservedQuantity:number}) {
    const product =  await this.productRepository.findOne({ where: { id } });
    if(!product) return;
    if(quantity) product.quantity=quantity;
    if(reservedQuantity) product.reservedQuantity=reservedQuantity;
    return await this.productRepository.save(product);
  }
}
