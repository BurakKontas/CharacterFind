import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ProxyService, QueueName } from './proxy/proxy.service';
import { AuthListen } from './auth/auth.listen';
import { UsersService } from './users/users.service';
import { JwtService } from '@nestjs/jwt';

import * as dotenv from 'dotenv';
dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
