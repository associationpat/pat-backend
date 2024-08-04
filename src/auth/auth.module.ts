import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { Admin } from '../user/entities/admin.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import * as dotenv from 'dotenv';
import * as process from 'process';
import { User } from '../user/entities/user.entity';
import { JwtStrategy } from './strategy/passport-jwt.strategy';
import { SuperAdmin } from '../user/entities/superAdmin.entity';

dotenv.config();
@Module({
  imports: [
    TypeOrmModule.forFeature([Admin, User, SuperAdmin]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.SECRET_KEY,
      signOptions: {
        expiresIn: '1d',
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}
