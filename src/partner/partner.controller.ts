import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UseInterceptors, UseGuards,
} from '@nestjs/common';
import { PartnerService } from './partner.service';
import { CreatePartnerDto } from './dto/create-partner.dto';
import { UpdatePartnerDto } from './dto/update-partner.dto';
import {
  ApiBadRequestResponse, ApiBearerAuth,
  ApiConsumes,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { createFileUploadInterceptor } from '../shared/interceptors/file-upload.interceptor';
import {JwtAuthGuard} from "../auth/guard/jwt-auth.guard";

@ApiTags('partner')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
@Controller('partner')
export class PartnerController {
  constructor(private readonly partnerService: PartnerService) {}

  @Post()
  @ApiResponse({ status: 200, description: 'Partner Added successfully' })
  @ApiBadRequestResponse({
    description: 'Bad Request, please check your request',
  })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    createFileUploadInterceptor({
      fieldName: 'photo',
      destination: 'partners',
      allowedFileTypes: /\.(jpg|jpeg|png)$/i,
      fileSizeLimit: 1048576,
      defaultPhotoPath: 'uploads/defaults/defaultPartnerImage.jpeg',
    }),
  )
  async create(@Body() createPartnerDto: CreatePartnerDto) {
    return await this.partnerService.create(createPartnerDto);
  }

  @Get('all')
  @ApiResponse({ status: 200, description: 'Partners listed successfully' })
  @ApiBadRequestResponse({
    description: 'Bad Request, please check your request',
  })
  async findAll() {
    return await this.partnerService.findAll();
  }

  @Get(':id')
  @ApiResponse({ status: 200, description: 'Partner found successfully' })
  @ApiBadRequestResponse({
    description: 'Bad Request, please check your request',
  })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.partnerService.findOne(id);
  }

  @Patch(':id')
  @ApiResponse({ status: 200, description: 'Partner updated successfully' })
  @ApiBadRequestResponse({
    description: 'Bad Request, please check your request',
  })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    createFileUploadInterceptor({
      fieldName: 'photo',
      destination: 'partners',
      allowedFileTypes: /\.(jpg|jpeg|png)$/i,
      fileSizeLimit: 1048576,
    }),
  )
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePartnerDto: UpdatePartnerDto,
  ) {
    return await this.partnerService.update(id, updatePartnerDto);
  }

  @Delete(':id')
  @ApiResponse({ status: 200, description: 'Partner deleted successfully' })
  @ApiBadRequestResponse({
    description: 'Bad Request, please check your request',
  })
  async delete(@Param('id', ParseIntPipe) id: number) {
    return await this.partnerService.removeSoft(id);
  }

  @Patch('restore/:id')
  @ApiResponse({ status: 200, description: 'Partner restored successfully' })
  @ApiBadRequestResponse({
    description: 'Bad Request, please check your request',
  })
  async restore(@Param('id', ParseIntPipe) id: number) {
    return await this.partnerService.restore(id);
  }
}
