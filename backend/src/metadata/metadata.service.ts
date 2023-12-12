import { Injectable } from '@nestjs/common';
import { CreateMetadatumInput } from './dto/create-metadatum.input';
import { UpdateMetadatumInput } from './dto/update-metadatum.input';

@Injectable()
export class MetadataService {
  create(createMetadatumInput: CreateMetadatumInput) {
    return 'This action adds a new metadatum';
  }

  findAll() {
    return `This action returns all metadata`;
  }

  findOne(id: number) {
    return `This action returns a #${id} metadatum`;
  }

  findWithFilter(filter: any) {
    return `This action returns a filtered [${filter}] metadatum`;
  }

  update(id: number, updateMetadatumInput: UpdateMetadatumInput) {
    return `This action updates a #${id} metadatum`;
  }

  remove(id: number) {
    return `This action removes a #${id} metadatum`;
  }
}
