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
  UseGuards,
} from '@nestjs/common';
import { AnimalService } from './animal.service';
import { CreateAnimalDto } from './dto/create-animal.dto';
import { UpdateAnimalDto } from './dto/update-animal.dto';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { createFileUploadInterceptor } from '../shared/interceptors/file-upload.interceptor';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { CurrentUser } from '../Decorators/user.decorator';
import { User } from '../user/entities/user.entity';

@ApiTags('animal')
@Controller('animal')
export class AnimalController {
  constructor(private readonly animalService: AnimalService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    createFileUploadInterceptor({
      fieldName: 'photo',
      destination: 'animals',
      allowedFileTypes: /\.(png|jpeg|jpg)$/i,
      fileSizeLimit: 1000000,
      defaultPhotoPath: 'uploads/defaults/defaultAnimalImage.png',
    }),
  )
  async create(
    @Body() createAnimalDto: CreateAnimalDto,
    @CurrentUser() user: User,
  ) {
    return await this.animalService.create(createAnimalDto, user);
  }

  @Get()
  async findAll() {
    return await this.animalService.findAll();
  }
  @Get('genders')
  getGenders() {
    return this.animalService.getGenders();
  }
  @Get('breeds')
  async getBreed() {
    return await this.animalService.getBreed();
  }
  @Get('species')
  async getSpecies() {
    return await this.animalService.getSpecies();
  }
  @Get('status')
  async getStatus() {
    return await this.animalService.getStatus();
  }
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.animalService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    createFileUploadInterceptor({
      fieldName: 'photo',
      destination: 'animals',
      allowedFileTypes: /\.(png|jpeg|jpg)$/i,
      fileSizeLimit: 1000000,
    }),
  )
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateAnimalDto: UpdateAnimalDto,
    @CurrentUser() user: User,
  ) {
    return await this.animalService.update(id, updateAnimalDto, user);
  }

  @Delete(':id/adopt')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: User,
  ) {
    return await this.animalService.remove(id, user);
  }
  @Patch(':id/restore')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  async restore(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: User,
  ) {
    return await this.animalService.restore(id, user);
  }
}
