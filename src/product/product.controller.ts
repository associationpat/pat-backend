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
  UseInterceptors,
  HttpException,
  HttpStatus,
  UploadedFile,
  UseGuards,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { GetPaginatedDto } from 'src/shared/pagination/get-paginated.dto';
import { GetProductFilteredDto } from './dto/get-product-filtered.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { ApiConsumes } from '@nestjs/swagger';
import { CurrentUser } from 'src/Decorators/user.decorator';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import {createFileUploadInterceptor} from "../shared/interceptors/file-upload.interceptor";

@ApiTags('product')
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  // Swagger decorators for documentati

  @ApiResponse({ status: 201, description: 'Product created successfully' })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized, you need to login and be an admin',
  })
  @ApiBadRequestResponse({
    status: 400,
    description: 'Product creation failed, please check the request body',
  })
  
  // auth guard
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @Post()
  @UseInterceptors(
      createFileUploadInterceptor({
        fieldName: 'photo',
        destination: 'products',
        allowedFileTypes: /\.(png|jpeg|jpg)$/i,
        fileSizeLimit: 1000000,
        defaultPhotoPath: 'uploads/defaults/defaultProductImage.jpeg',
      }),
  )
  create(
    @Body() createProductDto: CreateProductDto,
    @CurrentUser() user,
  ) {
    return this.productService.create(createProductDto, user);
  }

  @ApiResponse({ status: 200, description: 'Products retrieved successfully' })
  @Get()
  findAll(@Query() queryParams: GetPaginatedDto) {
    return this.productService.findAll(queryParams);
  }

  /*
  @ApiResponse({
    status: 200,
    description: 'Products filtered retrieved successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Products filtered retrieval failed',
  })
  @Get('filter')
  findAllFiltered(
    @Query() queryParams: GetPaginatedDto,
    @Query() getFilteredDto: GetProductFilteredDto,
  ) {
    return this.productService.findAllFiltered(queryParams, getFilteredDto);
  }
*/
  @ApiResponse({ status: 200, description: 'Product retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productService.findOne(id);
  }



  @ApiResponse({ status: 200, description: 'Product updated successfully' })
  @ApiBadRequestResponse({
    status: 400,
    description: 'Product update failed, please check the request body',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized, you need to login and be an admin',
  })

  @ApiResponse({ status: 404, description: 'Product not found' })
  //@ApiConsumes('multipart/form-data')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @UseInterceptors(
      createFileUploadInterceptor({
        fieldName: 'photo',
        destination: 'products',
        allowedFileTypes: /\.(png|jpeg|jpg)$/i,
        fileSizeLimit: 1000000,
      }),
  )
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.productService.update(id, updateProductDto);
  }

  @ApiResponse({ status: 200, description: 'Product deleted successfully' })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized, you need to login and be an admin',
  })
  @ApiResponse({ status: 404, description: 'Product not found' })
  // auth guard
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.productService.remove(id);
  }

  @ApiResponse({ status: 200, description: 'Product restored successfully' })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized, you need to login and be an admin',
  })
  @ApiResponse({ status: 404, description: 'Product not found' })
  // auth guard
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @Patch('restore/:id')
  restore(@Param('id', ParseIntPipe) id: number) {
    return this.productService.restore(id);
  }
}
