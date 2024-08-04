import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { IsNull, Repository } from 'typeorm';
import { UserRoleEnum } from '../Enums/user-role.enum';
import * as bcrypt from 'bcrypt';
import { ChangePasswordDto } from './dto/change-password.dto';
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findAllAdmins(currentUser: User) {
    if (currentUser.role == UserRoleEnum.SUPER_ADMIN) {
      const users = await this.userRepository.find();
      return users.map((user) => {
        return {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          photo: user.photo,
          role: user.role,
          phone : user.phone,
        };
      });
    }
    throw new UnauthorizedException('Unauthorized');
  }

  async findOne(id: number, currentUser: User) {
    if (currentUser.role == UserRoleEnum.ADMIN) {
      id = currentUser.id;
    }
    const user = await this.userRepository.findOneBy({
      id,
      deletedAt: IsNull(),
    });
    if (!user) {
      throw new ConflictException('User not found');
    }
    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      photo: user.photo,
      role: user.role,
      phone: user.phone,
    };
  }

  async update(id: number, updateUserDto: UpdateUserDto, currentUser: User) {
    // eliminate password update
    if (updateUserDto.password) {
      throw new UnauthorizedException('Unauthorized');
    }
    if (currentUser.id == id || currentUser.role == UserRoleEnum.SUPER_ADMIN) {
      return await this.userRepository.update(id, updateUserDto);
    }
    throw new UnauthorizedException('Unauthorized');
  }

  async removeSoft(id: number, currentUser: User) {
    if (currentUser.role == UserRoleEnum.SUPER_ADMIN) {
      return await this.userRepository.softDelete(id);
    }
    throw new UnauthorizedException('Unauthorized');
  }

  async restoreUser(id: number, currentUser: User) {
    if (currentUser.role == UserRoleEnum.SUPER_ADMIN) {
      return await this.userRepository.restore(id);
    }
    throw new UnauthorizedException('Unauthorized');
  }

  async changePassword(user: User, changePasswordDto: ChangePasswordDto) {
    const { oldPassword, newPassword } = changePasswordDto;
    const userData = await this.userRepository.findOneBy({ id: user.id });
    const isPasswordValid = await bcrypt.compare(
      oldPassword,
      userData.password,
    );
    if (!isPasswordValid) {
      throw new NotFoundException('Invalid Old password');
    }
    const salt = await bcrypt.genSalt();
    user.password = await bcrypt.hash(newPassword, salt);
    user.salt = salt;
    await this.userRepository.save(user);
    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      phone: user.phone,
    };
  }
  async findOneByEmail(email: string) {
    return await this.userRepository.findOneBy({ email });
  }

  async resetPassword(user: User) {
    const newPassword = Math.random().toString(36).slice(-8);
    const salt = await bcrypt.genSalt();
    user.password = await bcrypt.hash(newPassword, salt);
    user.salt = salt;
    await this.userRepository.save(user);
    return newPassword;
  }
}
