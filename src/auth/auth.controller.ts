import {
  Body,
  Controller,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConsumes,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { Admin } from '../user/entities/admin.entity';
import { LoginCredentialsDto } from './dto/login-credentials.dto';
import { JwtAuthGuard } from './guard/jwt-auth.guard';
import { CurrentUser } from '../Decorators/user.decorator';
import { createFileUploadInterceptor } from '../shared/interceptors/file-upload.interceptor';
import { SuperAdmin } from '../user/entities/superAdmin.entity';
import { CreateSuperAdminDto } from '../user/dto/create-superadmin.dto';
import {User} from "../user/entities/user.entity";

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('create/admin')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiResponse({ status: 200, description: 'Admin created successfully' })
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
      defaultPhotoPath: 'uploads/defaults/defaultUserImage.jpeg',
    }),
  )
  async createAdmin(
    @CurrentUser() user: User,
    @Body() createUserDto: CreateUserDto,
  ): Promise<Partial<Admin>> {
    return await this.authService.createAdmin(createUserDto, user);
  }

  @Post('create/superadmin')
  @ApiConsumes('multipart/form-data')
  @ApiResponse({ status: 200, description: 'SuperAdmin created successfully' })
  @ApiBadRequestResponse({
    description: 'Bad Request, please check your request',
  })
  @UseInterceptors(
    createFileUploadInterceptor({
      fieldName: 'photo',
      destination: 'users',
      allowedFileTypes: /\.(jpg|jpeg|png)$/i,
      fileSizeLimit: 1048576,
      defaultPhotoPath: 'uploads/defaults/defaultUserImage.jpeg',
    }),
  )
  async createSuperAdmin(
    @Body() createSuperAdminDto: CreateSuperAdminDto,
  ): Promise<Partial<SuperAdmin>> {
    return await this.authService.createSuperAdmin(createSuperAdminDto);
  }
  @Post('login')
  @ApiResponse({ status: 200, description: 'User logged in successfully' })
  @ApiBadRequestResponse({
    description: 'Bad Request, please check your request',
  })
  async login(@Body() loginCredentialsDto: LoginCredentialsDto) {
    return await this.authService.login(loginCredentialsDto);
  }
}
