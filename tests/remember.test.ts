import { RedisCache } from '../src/index';

const cacheManager = new RedisCache();

beforeEach(async () => {
  await cacheManager.flush();
});

beforeAll(async () => {
  await cacheManager.connect({
    url: process.env.REDIS_URL ?? 'redis://redis:6379',
  });
});

test('Redis REMEMBER', async () => {
  const result = await cacheManager.remember(
    'key',
    async () => {
      return 'updated_value';
    },
    100,
  );
  expect(result).toBe('updated_value');
});

test('Redis REMEMBER if key exists', async () => {
  await cacheManager.set('key', 'value');
  const result = await cacheManager.remember(
    'key',
    async () => {
      return 'updated_value';
    },
    100,
  );
  expect(result).toBe('value');
});

test('Redis REMEMBER if not key exists', async () => {
  await cacheManager.remember(
    'key',
    async () => {
      return 'updated_value';
    },
    100,
  );

  expect(await cacheManager.get('key')).toBe('updated_value');
});

afterAll(async () => {
  await cacheManager.disconnect();
});
