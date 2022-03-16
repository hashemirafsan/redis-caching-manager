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

test('Redis DESTROY', async () => {
  await cacheManager.set('key', 'value');
  expect(await cacheManager.destroy('key')).toBeTruthy();
});

test('Redis DESTROY if not exists', async () => {
  expect(await cacheManager.destroy('key')).toBeFalsy();
});

afterAll(async () => {
  await cacheManager.disconnect();
});
