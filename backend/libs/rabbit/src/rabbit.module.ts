import { Module } from '@nestjs/common';
import { RabbitService } from './rabbit.service';

@Module({
  providers: [],
  exports: [RabbitService],
})
export class RabbitModule {}
