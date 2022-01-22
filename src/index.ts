import { createClient } from 'redis';
import { ICache } from './interfaces/cache';
import { IRedisCacheConfig } from './interfaces/cache-config';

export class RedisCache implements ICache {
  protected redisClient: any = null;
  protected ttl: number = 600;

  async connect(config: IRedisCacheConfig): Promise<RedisCache> {
    const { url, ttl = 600 } = config;

    this.ttl = ttl;

    if (this.redisClient?.ping() === 'PONG') return this;

    this.redisClient = createClient({ url });
    // const client = createClient({ url });
    // client.flushDb()

    this.redisClient.on('error', (err: any) => {
      throw new Error(err);
    });

    await this.redisClient.connect();

    return this;
  }

  async disconnect() {
    return this.redisClient.disconnect();
  }

  async set(key: string, value: any, ttl: any = null): Promise<string> {
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

  async remember(key: string, cb: () => any, ttl: any = null) {
    try {
      const oldValue = await this.get(key);

      if (!oldValue) {
        const newValue = await cb();
        await this.set(key, newValue, ttl);

        return newValue;
      }

      return oldValue;
    } catch (err: any) {
      throw new Error(err);
    }
  }

  async has(key: string): Promise<boolean> {
    try {
      return Boolean(await this.redisClient.exists(key));
    } catch (error) {
      return false;
    }
  }

  async destroy(key: string): Promise<boolean> {
    return Boolean(await this.redisClient.del(key));
  }

  async flush(): Promise<boolean> {
    return Boolean(await this.redisClient.flushDb());
  }
}
