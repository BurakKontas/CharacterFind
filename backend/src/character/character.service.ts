import { Injectable, UseGuards } from '@nestjs/common';
import { CreateCharacterInput } from './dto/create-character.input';
import { UpdateCharacterInput } from './dto/update-character.input';
import { WeaviateService } from '@weaviate/weaviate';
import { AuthGuard } from 'src/auth/auth.guard';
import { Roles } from 'src/auth/roles.decorator';
import AuthRoles from 'src/Enums/authRoles';

@Injectable()
export class CharacterService {
  constructor(private readonly weaviateService: WeaviateService) {}

  @UseGuards(AuthGuard)
  @Roles(AuthRoles.admin, AuthRoles.moderator)
  async create(createCharacterInput: CreateCharacterInput) {
    const { base64, mal_id } = createCharacterInput;
    let result = await this.weaviateService.addImage(base64, mal_id);
    return result;
  }

  async findOne(base64: string) {
    let result = await this.weaviateService.search(base64);
    return result;
  }

  // async findWithFilter(filter: any) {
  //   return `This action returns a filtered [${filter}] character`;
  // }

  // update(id: number, updateCharacterInput: UpdateCharacterInput) {
  //   return `This action updates a #${id} character`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} character`;
  // }
}
