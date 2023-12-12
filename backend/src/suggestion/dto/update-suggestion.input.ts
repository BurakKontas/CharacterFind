import { CreateSuggestionInput } from './create-suggestion.input';
import { PartialType } from '@nestjs/mapped-types';

export class UpdateSuggestionInput extends PartialType(CreateSuggestionInput) {
  id: number;
}
