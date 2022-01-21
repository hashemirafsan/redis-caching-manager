import { createClient } from 'redis';
import { ICache } from './interfaces/cache';
import { IRedisCacheConfig } from './interfaces/cache-config';

export class RedisCache implements ICache {
  protected redisClient: any = null;
  protected ttl: number = 600;

  async connect(config: IRedisCacheConfig): Promise<RedisCache> {
    const { url, ttl = 600 } = config;

    this.ttl = ttl;
    this.redisClient = createClient({ url });

    this.redisClient.on('error', (err: any) => {
      throw new Error(err);
    });

    await this.redisClient.connect();

    return this;
  }

  async disconnect() {
    return this.redisClient.disconnect();
  }

  async set(key: string, value: any, ttl: any = null) {
    try {
      return this.redisClient.set(key, JSON.stringify(value), {
        EX: ttl ?? this.ttl,
        NX: false,
      });
    } catch (err: any) {
      throw new Error(err);
    }
  }

  async get(key: string) {
    try {
      return JSON.parse(await this.redisClient.get(key));
    } catch (err: any) {
      throw new Error(err);
    }
  }

  async remember(key: string) {}

  async has(key: string): Promise<boolean> {
    const c = await this.redisClient.exists([key]);
    console.log(c);
    return false;
  }

  async destroy(key: string) {}
}
