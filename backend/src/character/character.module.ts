import { Module } from '@nestjs/common';
import { CharacterService } from './character.service';
import { AuthModule } from 'src/auth/auth.module';
import { WeaviateService } from '@weaviate/weaviate';

@Module({
  imports: [AuthModule],
  providers: [CharacterService, WeaviateService],
})
export class CharacterModule {}
