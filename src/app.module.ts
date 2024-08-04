import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { AnimalModule } from './animal/animal.module';
import { PartnerModule } from './partner/partner.module';
import { ArticleModule } from './article/article.module';
import { ActionModule } from './action/action.module';
import { TaskModule } from './task/task.module';
import { ProductModule } from './product/product.module';
import { OrderModule } from './order/order.module';
import { Admin } from './user/entities/admin.entity';
import { User } from './user/entities/user.entity';
import { MailModule } from './mail/mail.module';
import {VolunteerModule} from "./volunteer/volunteer.module";

dotenv.config();
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      autoLoadEntities: true,
      entities: ['dist/**/*.entity{.ts,.js}'],
      synchronize: true, //TODO: to change to false in production
    }),
    AuthModule,
    UserModule,
    AnimalModule,
    //PartnerModule,
    ArticleModule,
    ActionModule,
    TaskModule,
    ProductModule,
    OrderModule,
    TypeOrmModule.forFeature([User, Admin]),
    MailModule,
    VolunteerModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
