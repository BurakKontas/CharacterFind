import { Module } from '@nestjs/common';
import { RedisService } from './redis.service';

@Module({
  providers: [],
  exports: [RedisService],
})
export class RedisModule {}
