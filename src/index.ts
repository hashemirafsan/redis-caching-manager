import { createClient } from 'redis';
import { ICache } from './interfaces/cache';
import { IRedisCacheConfig } from './interfaces/cache-config';

export class RedisCache implements ICache {
  private redisClient: any = null;
  private ttl: number = 600;
  private prefix: string = '';
  private _tags: Array<string> = [];

  async connect(config: IRedisCacheConfig): Promise<RedisCache> {
    const { url, ttl = 600 } = config;

    this.ttl = ttl;

    if (this.redisClient?.ping() === 'PONG') return this;

    this.redisClient = createClient({ url });
    // const client = createClient({ url });
    // client.sMembers()

    this.redisClient.on('error', (err: any) => {
      throw new Error(err);
    });

    await this.redisClient.connect();

    return this;
  }

  async disconnect() {
    return this.redisClient.disconnect();
  }

  tags(keys: Array<string>): RedisCache {
    this._tags = keys;
    return this;
  }

  async set(key: string, value: any, ttl: any = null): Promise<string> {
    try {
      const result = await this.redisClient.set(key, JSON.stringify(value), {
        EX: ttl ?? this.ttl,
        NX: true,
      });

      if (this._tags.length) {
        await this.addTags(key);
        await this.reset();
      }

      return result;
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

  async forever(key: string, value: any): Promise<string> {
    return this.set(key, value, 0);
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
    const destroyPromises = [this.redisClient.del(key)];

    if (this._tags.length) {
      this._tags.forEach((tag) => {
        destroyPromises.push(this.redisClient.sRem(tag, key));
      });
      destroyPromises.push(this.reset());
    }

    const [delKeyResult] = await Promise.all(destroyPromises);

    return Boolean(delKeyResult);
  }

  async flush(): Promise<boolean> {
    if (this._tags.length) {
      const keys = await this.redisClient.sUnion(this._tags);
      if (!keys.length) return false;

      const [delResult] = await Promise.all([this.redisClient.del(keys), this.reset()]);
      return Boolean(delResult);
    }

    return Boolean(await this.redisClient.flushDb());
  }

  async pull(key: string) {
    try {
      const result = await this.get(key);
      await this.destroy(key);
      return result;
    } catch (err: any) {
      throw new Error(err);
    }
  }

  async put(key: string, value: any, ttl: any = null): Promise<string> {
    try {
      await this.destroy(key);
      const result = await this.set(key, value, ttl);

      if (this._tags.length) {
        await this.addTags(key);
        await this.reset();
      }

      return result;
    } catch (err: any) {
      throw new Error(err);
    }
  }

  private async addTags(key: string) {
    const tagPromises = this._tags
      .filter(async (tag) => {
        const members = await this.redisClient.sMembers(tag);
        return !members.find(key);
      })
      .map((tag) => {
        return this.redisClient.sAdd(tag, key);
      });

    return Promise.all(tagPromises);
  }

  private async reset() {
    this._tags = [];
  }
}
