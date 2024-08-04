import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as path from 'node:path';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as process from 'node:process';
import swagger from "./sawgger";

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.enableCors({
    origin: [
      process.env.FRONTEND_PORT_1,
      process.env.FRONTEND_PORT_2,
      //process.env.APP_HOST+':'+process.env.APP_PORT, // for swagger TODO: to remove
    ],
    credentials: true,
  });

  app.useStaticAssets(path.join(__dirname, '..', 'uploads'), {
    prefix: '/uploads',
  });
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));

  if(process.env.NODE_ENV !== 'PROD') swagger(app);
  await app.listen(process.env.APP_PORT || 3000);
}
bootstrap();

