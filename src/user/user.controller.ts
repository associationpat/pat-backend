import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UseGuards,
  Put,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConsumes,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { CurrentUser } from '../decorators/user.decorator';
import { User } from './entities/user.entity';
import { ChangePasswordDto } from './dto/change-password.dto';
import { createFileUploadInterceptor } from '../shared/interceptors/file-upload.interceptor';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('users')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiResponse({ status: 200, description: 'Users listed successfully' })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized user, only SuperAdmin can access',
  })
  @ApiBadRequestResponse({
    description: 'Bad Request, please check your request',
  })
  async findAllAdmins(@CurrentUser() user) {
    return await this.userService.findAllAdmins(user);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiResponse({ status: 200, description: 'user found successfully' })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized user, only SuperAdmin can access',
  })
  @ApiBadRequestResponse({
    description: 'Bad Request, please check your request',
  })
  async findOne(
    @CurrentUser() user: User,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return await this.userService.findOne(id, user);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiResponse({ status: 200, description: 'User updated successfully' })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized user, only SuperAdmin can access',
  })
  @ApiBadRequestResponse({
    description: 'Bad Request, please check your request',
  })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    createFileUploadInterceptor({
      fieldName: 'photo',
      destination: 'users',
      allowedFileTypes: /\.(jpg|jpeg|png)$/i,
      fileSizeLimit: 1048576,
    }),
  )
  async update(
    @CurrentUser() user: User,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return await this.userService.update(id, updateUserDto, user);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiResponse({ status: 200, description: 'User deleted successfully' })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized user, only SuperAdmin can access',
  })
  @ApiBadRequestResponse({
    description: 'Bad Request, please check your request',
  })
  async removeSoft(
    @CurrentUser() user: User,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return await this.userService.removeSoft(id, user);
  }

  @Get('restore/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiResponse({ status: 200, description: 'User restored successfully' })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized user, only SuperAdmin can access',
  })
  @ApiBadRequestResponse({
    description: 'Bad Request, please check your request',
  })
  async restoreUser(
    @CurrentUser() user: User,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return await this.userService.restoreUser(id, user);
  }

  @Put('change-password')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiResponse({ status: 200, description: 'Password changed successfully' })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized user, only SuperAdmin can access',
  })
  @ApiBadRequestResponse({
    description: 'Bad Request, please check your request',
  })
  async changePassword(
    @CurrentUser() user: User,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    return await this.userService.changePassword(user, changePasswordDto);
  }
}
