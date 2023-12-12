import { CreateMetadatumInput } from './create-metadatum.input';
import { PartialType } from '@nestjs/mapped-types';

export class UpdateMetadatumInput extends PartialType(CreateMetadatumInput) {
  id: number;
}
