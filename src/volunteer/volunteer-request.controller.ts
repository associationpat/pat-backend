import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UseInterceptors,
  HttpException,
  HttpStatus,
  UploadedFile,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CreateVolunteerDto } from './dto/create-volunteer.dto';
import { UpdateVolunteerDto } from './dto/update-volunteer.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { GetPaginatedDto } from '../shared/pagination/get-paginated.dto';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { CreateVolunteerRequestDto } from './dto/create-volunteer-request.dto';
import { VolunteerRequestService } from './volunteer-request.service';
import {createFileUploadInterceptor} from "../shared/interceptors/file-upload.interceptor";

@ApiTags('volunteer-request')
@Controller('volunteer-request')
export class VolunteerRequestController {
  constructor(
    private readonly volunteerRequestService: VolunteerRequestService,
  ) {}

  @Post()
  @UseInterceptors(
      createFileUploadInterceptor({
        fieldName: 'photo',
        destination: 'volunteers',
        allowedFileTypes: /\.(png|jpeg|jpg)$/i,
        fileSizeLimit: 1000000,
        defaultPhotoPath: 'uploads/defaults/defaultVolunteerImage.jpeg',
      }),
  )
  create(
    @Body() createVolunteerRequestDto: CreateVolunteerRequestDto) {
    return this.volunteerRequestService.create(createVolunteerRequestDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  findAll() {
    return this.volunteerRequestService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.volunteerRequestService.findOne(id);
  }

  @Post('accept/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  acceptRequest(@Param('id', ParseIntPipe) id: number) {
    return this.volunteerRequestService.acceptRequest(id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.volunteerRequestService.remove(id);
  }

  @Patch('restore/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  restore(@Param('id', ParseIntPipe) id: number) {
    return this.volunteerRequestService.restore(id);
  }
}