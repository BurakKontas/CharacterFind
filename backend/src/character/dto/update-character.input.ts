import { CreateCharacterInput } from './create-character.input';
import { PartialType } from '@nestjs/mapped-types';

export class UpdateCharacterInput extends PartialType(CreateCharacterInput) {
  base64?: string;
  mal_id?: string;
}
