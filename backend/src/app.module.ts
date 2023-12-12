import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { MetadataModule } from './metadata/metadata.module';
import { MetadataService } from './metadata/metadata.service';

import { CharacterModule } from './character/character.module';
import { CharacterService } from './character/character.service';

import { UsersService } from './users/users.service';
import { UsersModule } from './users/users.module';

import { AuthModule } from './auth/auth.module';
import { AuthService } from './auth/auth.service';

import { SuggestionModule } from './suggestion/suggestion.module';

import { ProxyModule } from './proxy/proxy.module';

import { WeaviateModule, WeaviateService } from '@weaviate/weaviate';

@Module({
  imports: [MetadataModule, CharacterModule, SuggestionModule, ProxyModule, UsersModule, WeaviateModule, AuthModule],
  controllers: [AppController],
  providers: [AppService, MetadataService, CharacterService, WeaviateService, UsersService, AuthService],
})
export class AppModule {}
