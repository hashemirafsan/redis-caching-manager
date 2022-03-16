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

test('Redis PUT', async () => {
  await cacheManager.set('key', 'value');
  expect(await cacheManager.put('key', 'updated_value')).toBeTruthy();
});

test('Redis PUT if not exists', async () => {
  expect(await cacheManager.put('key', 'updated_value')).toBeTruthy();
});

afterAll(async () => {
  await cacheManager.disconnect();
});
