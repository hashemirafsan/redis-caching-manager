import { RedisCache } from '../src/index';

const cacheManager = new RedisCache();

beforeAll(async () => {
  await cacheManager.connect({
    url: 'redis://redis:6379',
  });
});

test('Redis SET (string)', async () => {
  expect(await cacheManager.set('key', 'value')).toBe('OK');
});

test('Redis SET (object)', async () => {
  expect(await cacheManager.set('key', { value: true })).toBe('OK');
});

afterAll(async () => {
  await cacheManager.disconnect();
});
