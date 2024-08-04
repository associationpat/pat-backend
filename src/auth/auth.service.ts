import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { Admin } from '../user/entities/admin.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { LoginCredentialsDto } from './dto/login-credentials.dto';
import { User } from '../user/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { UserRoleEnum } from '../Enums/user-role.enum';
import { MailService } from '../mail/mail.service';
import { SuperAdmin } from '../user/entities/superAdmin.entity';
import { CreateSuperAdminDto } from '../user/dto/create-superadmin.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Admin)
    private adminRepository: Repository<Admin>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(SuperAdmin)
    private superAdminRepository: Repository<SuperAdmin>,
    private jwtService: JwtService,
    private readonly mailService: MailService,
  ) {}

  // function for SuperAdmin to create a new Admin
  async createAdmin(
    userData: CreateUserDto,
    currentUser: User,
  ): Promise<Partial<Admin>> {
    if (currentUser.role !== UserRoleEnum.SUPER_ADMIN) {
      throw new UnauthorizedException('Unauthorized');
    }
    const user = this.adminRepository.create({
      ...userData,
    });
    user.role = this.adminRepository.metadata.targetName;
    // a default password is created for the Admin to be sent to their email
    user.password = user.firstName + user.phone;
    userData.password = user.password;
    user.salt = await bcrypt.genSalt();
    user.password = await bcrypt.hash(user.password, user.salt);
    try {
      await this.adminRepository.save(user);
    } catch (e) {
      throw new ConflictException(`Email or Phone already exists`);
    }
    await this.mailService.sendRegistrationEmail(userData);
    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
    };
  }

  async createSuperAdmin(
    userData: CreateSuperAdminDto,
  ): Promise<Partial<Admin>> {
    if (userData.license === process.env.LICENSE) {
      const user = this.superAdminRepository.create({
        ...userData,
      });
      user.role = this.superAdminRepository.metadata.targetName;
      user.salt = await bcrypt.genSalt();
      user.password = await bcrypt.hash(user.password, user.salt);
      try {
        await this.superAdminRepository.save(user);
      } catch (e) {
        throw new ConflictException(`Email or Phone already exists`);
      }
      await this.mailService.sendRegistrationEmail(userData);
      return {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      };
    } else {
      throw new UnauthorizedException('Unauthorized');
    }
  }

  // function for Users to login
  async login(credentials: LoginCredentialsDto) {
    const { email, password } = credentials;
    const user = await this.userRepository
      .createQueryBuilder('user')
      .where('user.email = :email', { email })
      .getOne();
    if (!user) {
      throw new NotFoundException('User or password incorrect');
    }
    const hashedPassword = await bcrypt.hash(password, user.salt);
    if (user.password !== hashedPassword) {
      throw new NotFoundException('Password incorrect');
    }
    const payload = {
      id: user.id,
      email: user.email,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
    };
    const jwt = this.jwtService.sign(payload);
    return {
      accessToken: jwt,
    };
  }
}
