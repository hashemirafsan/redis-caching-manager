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

test('Redis HAS', async () => {
  await cacheManager.set('key', 'value');
  expect(await cacheManager.has('key')).toBeTruthy();
});

test('Redis HAS if not exists', async () => {
  expect(await cacheManager.has('key')).toBeFalsy();
});

afterAll(async () => {
  await cacheManager.disconnect();
});
