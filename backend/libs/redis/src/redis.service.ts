import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService {
  private static instance: RedisService;
  private client: Redis;

  private constructor() {
    // Redis bağlantısını başlat
    this.client = new Redis({
      host: 'localhost',
      port: 6380,
    });
  }

  public static getInstance(): RedisService {
    if (!RedisService.instance) {
      RedisService.instance = new RedisService();
    }
    return RedisService.instance;
  }

  public async set(key: string, value: string, ttl: number = 43200) {
    try {
      await this.client.setex(key, ttl, value);
    } catch (error) {
      console.error('Redis set işlemi başarısız:', error);
    }
  }

  public async setWithoutTTL(key: string, value: string) {
    try {
      await this.client.set(key, value);
    } catch (error) {
      console.error('Redis set işlemi başarısız:', error);
    }
  }

  public async get(key: string) {
    try {
      let result = await this.client.get(key);
      return result;
    } catch (error) {
      console.error('Redis get işlemi başarısız:', error);
    }
  }

  public async delete(key: string) {
    try {
      await this.client.del(key);
    } catch (error) {
      console.error('Redis delete işlemi başarısız:', error);
    }
  }
}
