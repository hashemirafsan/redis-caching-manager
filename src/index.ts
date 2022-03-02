import { createClient } from 'redis';
import { ICache } from './interfaces/cache';
import { IRedisCacheConfig } from './interfaces/cache-config';

export class RedisCache implements ICache {
  /* This is a flag that is used to determine if the cache is enabled. */
  private _enable: boolean = false;
  /* The above code is creating a new instance of the redis client. */
  private redisClient: any = null;
  /* The above code is setting the ttl value to 600. */
  private _ttl: number = 600;
  /* Creating a variable called prefix and setting it to an empty string. */
  private _prefix: string = '';
  /* Creating an array of strings. */
  private _tags: string[] = [];

  /**
   * If the cache is enabled, connect to the Redis server
   * @param {IRedisCacheConfig} config - IRedisCacheConfig
   * @returns The RedisCache instance.
   */
  async connect(config: IRedisCacheConfig): Promise<RedisCache> {
    const { url, ttl = 600, prefix = '', enable = false } = config;
    this._enable = enable;
    this._ttl = ttl;
    this._prefix = prefix;

    if (this.redisClient?.ping() === 'PONG') return this;
    this.redisClient = createClient({ url });

    this.redisClient.on('error', (err: any) => {
      throw new Error(err);
    });

    await this.redisClient.connect();

    return this;
  }

  /**
   * It disconnects from the redis server.
   * @returns The promise of a RedisClient.
   */
  async disconnect() {
    return this.redisClient.disconnect();
  }

  /**
   * It sets the tags for the cache.
   * @param {string[]} keys - A list of keys to be used as tags.
   * @returns Nothing.
   */
  public tags(keys: string[]): RedisCache {
    this._tags = keys;
    return this;
  }

  
  /**
   * If the key is not already in the cache, set it to the value and set the expiration time
   * @param {string} key - The key to set.
   * @param {any} value - The value to be stored in the cache.
   * @param {number} ttl - The time-to-live in milliseconds for the key.
   * @returns The return value is a boolean indicating whether the operation was successful.
   */
  async set(key: string, value: any, ttl: number = this._ttl): Promise<boolean> {
    if (! this._enable) return false;

    try {
      key = this._setKeyPrefix(key);
      const result = await this.redisClient.set(key, JSON.stringify(value), {
        EX: ttl,
        NX: true,
      });

      if(result !== 'OK') return false

      if (this._tags.length) {
        await this._addTags(key);
        await this._reset();
      }

      return true;
    } catch (err: any) {
      throw new Error(err);
    }
  }

  /**
   * Get the value of a key from the Redis store.
   * @param {string} key - The key to get the value for.
   * @returns A promise.
   */
  async get(key: string) {
    try {
      key = this._setKeyPrefix(key);
      return JSON.parse(await this.redisClient.get(key));
    } catch (err: any) {
      throw new Error(err);
    }
  }

  
  /**
   * Set the value of the key if it doesn't exist, and keep it forever.
   * @param {string} key - The key to set.
   * @param {any} value - The value to be stored in the cache.
   * @returns A promise.
   */
  async forever(key: string, value: any): Promise<boolean> {
    return this.set(key, value, 0);
  }

  /**
   * If the key exists, return the value. If the key does not exist, run the callback and save the
   * value.
   * @param {string} key - The key to remember.
   * @param cb - A function that returns the value to be stored in the cache.
   * @param {any} [ttl=null] - The time-to-live in milliseconds for the key. If not set, the key will
   * be stored indefinitely.
   * @returns The value that was set.
   */
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

  /**
   * Check if a key exists in the cache.
   * @param {string} key - The key to check for in the cache.
   * @returns A boolean value.
   */
  async has(key: string): Promise<boolean> {
    try {
      return Boolean(await this.redisClient.exists(this._setKeyPrefix(key)));
    } catch (error) {
      return false;
    }
  }

  /**
   * Cannot generate summary
   * @param {string} key - The key to be deleted.
   * @returns The result of the `del` command.
   */
  async destroy(key: string): Promise<boolean> {
    key = this._setKeyPrefix(key);
    const destroyPromises = [this.redisClient.del(key)];

    if (this._tags.length) {
      this._tags.forEach((tag) => {
        destroyPromises.push(this.redisClient.sRem(tag, key));
      });
      destroyPromises.push(this._reset());
    }

    const [delKeyResult] = await Promise.all(destroyPromises);

    return Boolean(delKeyResult);
  }

  /**
   * If there are any tags, delete all the keys that have any of the tags. If there are no tags, delete
   * all the keys.
   * @returns The return value is a boolean indicating whether the flush operation was successful.
   */
  async flush(): Promise<boolean> {
    if (this._tags.length) {
      const keys = await this.redisClient.sUnion(this._tags);
      if (!keys.length) return false;

      const [delResult] = await Promise.all([this.redisClient.del(keys), this._reset()]);
      return Boolean(delResult);
    }

    return Boolean(await this.redisClient.flushDb());
  }

  /**
   * Pull a value from the cache and delete it.
   * @param {string} key - The key to pull from the cache.
   * @returns The value of the key.
   */
  async pull(key: string) {
    try {
      const result = await this.get(key);
      await this.destroy(key);
      return result;
    } catch (err: any) {
      throw new Error(err);
    }
  }

  /**
   * Cannot generate summary
   * @param {string} key - The key to store the value under.
   * @param {any} value - The value to be stored in the cache.
   * @param {any} [ttl=null] - The time-to-live (TTL) in milliseconds for the key. If it's not set, the
   * key will live forever.
   * @returns A string.
   */
  async put(key: string, value: any, ttl: any = null): Promise<string> {
    try {
      await this.destroy(key);
      const result = await this.set(key, value, ttl);

      return result;
    } catch (err: any) {
      throw new Error(err);
    }
  }

  /**
   * For each tag, if the key is not a member of the tag, add the key to the tag.
   * @param {string} key - The key to add to the set.
   * @returns Nothing.
   */
  private async _addTags(key: string) {
    const tagPromises = this._tags
      .filter(async (tag) => {
        const members = await this.redisClient.sMembers(tag);
        return !members.includes(key);
      })
      .map((tag) => {
        return this.redisClient.sAdd(tag, key);
      });

    return Promise.all(tagPromises);
  }

  /**
   * Reset the tags array.
   */
  private async _reset() {
    this._tags = [];
  }

  /**
   * Set the key prefix to be used in the Redis store.
   * @param {string} key - The key to set.
   * @returns The key with the prefix added to it.
   */
  private _setKeyPrefix(key: string) {
    return `${this._prefix}:${key}`;
  }
}

connect([
  {
    name: 'default',
    url: '/something',
    ttl: 'something'
  },
  {
    name: 'queue',
    url: '/something',
    ttl: 'something'
  },
])
cacheManager.name('queue').set('something', 'value')