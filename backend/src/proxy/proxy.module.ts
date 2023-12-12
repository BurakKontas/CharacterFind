import { Module } from '@nestjs/common';
import { ProxyService } from './proxy.service';
import { ProxyController } from './proxy.controller';
import { JwtService } from '@nestjs/jwt';
import { CharacterService } from 'src/character/character.service';
import { AuthService } from 'src/auth/auth.service';
import { UsersService } from 'src/users/users.service';
import { WeaviateService } from '@weaviate/weaviate';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  providers: [ProxyService, JwtService, CharacterService, UsersService, WeaviateService],
  exports: [ProxyService],
  controllers: [ProxyController],
  imports: [AuthModule],
})
export class ProxyModule {}
