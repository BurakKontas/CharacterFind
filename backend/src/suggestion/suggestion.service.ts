import { Injectable } from '@nestjs/common';
import { CreateSuggestionInput } from './dto/create-suggestion.input';
import { UpdateSuggestionInput } from './dto/update-suggestion.input';

@Injectable()
export class SuggestionService {
  create(createSuggestionInput: CreateSuggestionInput) {
    return 'This action adds a new suggestion';
  }

  findAll() {
    return `This action returns all suggestion`;
  }

  findOne(id: number) {
    return `This action returns a #${id} suggestion`;
  }

  findWithFilter(filter: any) {
    return `This action returns a filtered [${filter}] suggestion`;
  }

  update(id: number, updateSuggestionInput: UpdateSuggestionInput) {
    return `This action updates a #${id} suggestion`;
  }

  remove(id: number) {
    return `This action removes a #${id} suggestion`;
  }
}
