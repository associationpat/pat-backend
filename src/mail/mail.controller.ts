import {Body, Controller, NotFoundException, Post} from '@nestjs/common';
import { MailService } from './mail.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { ApiTags } from '@nestjs/swagger';
import { ContactInfoDto } from './dto/contact-info.dto';
import {ResetPasswordDto} from "./dto/reset-password.dto";
import {UserService} from "../user/user.service";
@ApiTags('mail')
@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService, private readonly userService: UserService) {}
  @Post('send')
  async sendContactEmail(@Body() contactInfoDto: ContactInfoDto) {
    const success = await this.mailService.sendContactEmail(contactInfoDto);
    if (success) {
      return { message: 'Email sent successfully' };
    } else {
      return { message: 'Failed to send email' };
    }
  }

  @Post("reset-password")
  async sendResetPasswordEmail(@Body() resetPasswordDto: ResetPasswordDto) {
    const user = await this.userService.findOneByEmail(resetPasswordDto.email);
    if (!user) {
      throw new NotFoundException('User not found: no user with this email');
    }

    const success = await this.mailService.sendResetPasswordEmail(user);
    if (success) {
      return { message: 'Email sent successfully' };
    } else {
      return { message: 'Failed to send email' };
    }
  }

}
