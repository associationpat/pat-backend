import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { ContactInfoDto } from './dto/contact-info.dto';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { CreateSuperAdminDto } from '../user/dto/create-superadmin.dto';
import {ResetPasswordDto} from "./dto/reset-password.dto";
import {UserService} from "../user/user.service";
import {User} from "../user/entities/user.entity";

@Injectable()
export class MailService {
  constructor(
      private readonly mailerService: MailerService,
      private readonly userService:UserService,
  ) {}

  private async sendMail(
    to: string,
    subject: string,
    content: string,
  ): Promise<boolean> {
    try {
      await this.mailerService.sendMail({
        to: to,
        from: '"PAT Contact" <no-reply@pat.org>',
        subject: subject,
        html: content,
      });
      return true;
    } catch (error) {
      console.error('Error sending email:', error);
      return false;
    }
  }
  async sendContactEmail(contactInfoDto: ContactInfoDto): Promise<boolean> {
    const subject = `Contact: ${contactInfoDto.sujet}`;
    const content = this.createContactMailContent(contactInfoDto);
    return this.sendMail(process.env.CONTACT_MAIL, subject, content)
  }

  createContactMailContent(contactInfoDto: ContactInfoDto) {
    const { nom, prenom, telephone, sujet, description } = contactInfoDto;
    return `
    <div style="font-family: Arial, sans-serif; max-width: 1000px;">
      <div style="font-size: 16px;">
        <p><strong>Nom :</strong> ${nom}</p>
        <p><strong>Prénom :</strong> ${prenom}</p>
        <p><strong>Téléphone :</strong> ${telephone}</p>
        <p><strong>Sujet :</strong> ${sujet}</p>
        <p>${description}</p>
      </div>
    </div>
  `;
  }

  async sendResetPasswordEmail(user: User) {
    const subject = `Réinitialisation de mot de passe`;
    const newPassword = await this.userService.resetPassword(user);
    const content = this.createResetPasswordMailContent(user, newPassword);

    return this.sendMail(user.email, subject, content);
  }

  async sendRegistrationEmail(
    user: CreateUserDto | CreateSuperAdminDto,
  ): Promise<boolean> {
    const subject = 'Bienvenue chez PAT';
    const content = this.createRegistrationMailContent(user);

    return this.sendMail(user.email, subject, content);
  }

  createRegistrationMailContent(user: CreateUserDto | CreateSuperAdminDto) {
    return `<p>Bonjour ${user.firstName} ${user.lastName},</p>
    <p>Bienvenue dans notre association PAT. Nous sommes ravis de vous compter parmi nous. Vous pouvez maintenant vous connecter à votre compte avec les identifiants suivants :</p>
    <p><strong>Email : ${user.email}</strong></p>
    <p><strong>Mot de passe : ${user.password}</strong></p>
    <p>Cordialement,</p>`;
  }

  createResetPasswordMailContent(user:User , newPassword: string) {
    return `<p>Bonjour ${user.firstName},</p>
    <p>Vous avez demandé la réinitialisation de votre mot de passe. Voici votre nouveau mot de passe :</p>
    <p><strong>${newPassword}</strong></p>
    <p>Vous pouvez maintenant vous connecter à votre compte avec ce nouveau mot de passe.</p>
    <p>Veillez à le changer dès votre première connexion.</p> 
    <p>Cordialement,</p>`;
  }


}
