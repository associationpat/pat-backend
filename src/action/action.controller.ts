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
  HttpException, HttpStatus, UploadedFile, Query,
  UseGuards
} from '@nestjs/common';
import { ActionService } from './action.service';
import { CreateActionDto } from './dto/create-action.dto';
import { UpdateActionDto } from './dto/update-action.dto';
import {ApiBearerAuth, ApiConsumes, ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";
import {FileInterceptor} from "@nestjs/platform-express";
import {diskStorage} from "multer";
import {GetPaginatedDto} from "../shared/pagination/get-paginated.dto";
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { CurrentUser } from 'src/Decorators/user.decorator';
import { User } from 'src/user/entities/user.entity';
import {createFileUploadInterceptor} from "../shared/interceptors/file-upload.interceptor";



@ApiTags('action')
@Controller('action')
export class ActionController {
  constructor(private readonly actionService: ActionService) {}

  @Post()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
      createFileUploadInterceptor({
        fieldName: 'photo',
        destination: 'actions',
        allowedFileTypes: /\.(png|jpeg|jpg)$/i,
        fileSizeLimit: 1000000,
        defaultPhotoPath: 'uploads/defaults/defaultActionImage.jpeg',
      }),
  )
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  create(
    @Body() createActionDto: CreateActionDto,
    @CurrentUser() user: User
  ) {
    return this.actionService.create(createActionDto, user);
  }


  @Get()
  findAll(@Query() queryParams: GetPaginatedDto) {
    return this.actionService.findAll(queryParams);
  }


  @Get(':id')
  findOne(@Param('id',ParseIntPipe) id: number) {
    return this.actionService.findOne(id);
  }


  @Patch(':id')
  @ApiConsumes('multipart/form-data')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
    @UseInterceptors(
        createFileUploadInterceptor({
            fieldName: 'photo',
            destination: 'action',
            allowedFileTypes: /\.(png|jpeg|jpg)$/i,
            fileSizeLimit: 1000000,
        }),
    )
  update(
      @Param('id',ParseIntPipe) id: number,
      @Body() updateActionDto: UpdateActionDto,
      @UploadedFile() image) {
    return this.actionService.update(id, updateActionDto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @Delete(':id')
  remove(@Param('id',ParseIntPipe) id: number) {
    return this.actionService.remove(id);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @Patch('restore/:id')
  restore(@Param('id',ParseIntPipe) id: number) {
      return this.actionService.restore(id);
  }
}
