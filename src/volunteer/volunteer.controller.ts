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
import { VolunteerService } from './volunteer.service';
import { CreateVolunteerDto } from './dto/create-volunteer.dto';
import { UpdateVolunteerDto } from './dto/update-volunteer.dto';
import {ApiBearerAuth, ApiConsumes, ApiOperation, ApiTags} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { createFileUploadInterceptor } from '../shared/interceptors/file-upload.interceptor';

@ApiTags('volunteer')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
@Controller('volunteer')
/*@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')*/
export class VolunteerController {
  constructor(private readonly volunteerService: VolunteerService) {}

  @Post()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    createFileUploadInterceptor({
      fieldName: 'photo',
      destination: 'volunteers',
      allowedFileTypes: /\.(png|jpeg|jpg)$/i,
      fileSizeLimit: 1000000,
      defaultPhotoPath: 'uploads/defaults/defaultVolunteerImage.jpeg',
    }),
  )
  create(@Body() createVolunteerDto: CreateVolunteerDto) {
    return this.volunteerService.create(createVolunteerDto);
  }

  @Get()
  findAll(/*@Query() queryParams: GetPaginatedDto*/) {
    return this.volunteerService.findAll(/*queryParams*/);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.volunteerService.findOne(id);
  }

  @Patch(':id')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    createFileUploadInterceptor({
      fieldName: 'photo',
      destination: 'volunteers',
      allowedFileTypes: /\.(png|jpeg|jpg)$/i,
      fileSizeLimit: 1000000,
    }),
  )
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateVolunteerDto: UpdateVolunteerDto,
  ) {
    return this.volunteerService.update(id, updateVolunteerDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.volunteerService.remove(id);
  }

  @Patch('restore/:id')
  restore(@Param('id', ParseIntPipe) id: number) {
    return this.volunteerService.restore(id);
  }
}