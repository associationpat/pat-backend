import { Global, Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailController } from './mail.controller';
import { MailerModule } from '@nestjs-modules/mailer';
import { mailerConfig } from '../config/mailer.config';
import {UserModule} from "../user/user.module";
@Global()
@Module({
  controllers: [MailController],
  providers: [MailService],
  imports: [MailerModule.forRoot(mailerConfig), UserModule],
  exports: [MailerModule, MailService],
})
export class MailModule {}
