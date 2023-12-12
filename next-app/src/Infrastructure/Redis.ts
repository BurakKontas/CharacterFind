import Redis from "ioredis";

class RedisClient {
  private static instance: RedisClient;
  private client: Redis;

  private constructor() {
    // Redis bağlantısını başlat
    this.client = new Redis({
      host: "localhost",
      port: 6380,
    });
  }

  public static getInstance(): RedisClient {
    if (!RedisClient.instance) {
      RedisClient.instance = new RedisClient();
    }
    return RedisClient.instance;
  }

  public async set(key: string, value: string, ttl: number = 43200) {
    try {
      await this.client.setex(key, ttl, value);
    } catch (error) {
      console.error("Redis set işlemi başarısız:", error);
    }
  }

  public async setWithoutTTL(key: string, value: string) {
    try {
      await this.client.set(key, value);
    } catch (error) {
      console.error("Redis set işlemi başarısız:", error);
    }
  }

  public async get(key: string) {
    try {
      let result = await this.client.get(key);
      return result;
    } catch (error) {
      console.error("Redis get işlemi başarısız:", error);
    }
  }

  public async delete(key: string) {
    try {
      await this.client.del(key);
    } catch (error) {
      console.error("Redis delete işlemi başarısız:", error);
    }
  }
}

export default RedisClient;
