import { RedisCache } from '../src/index';

const cacheManager = new RedisCache();

beforeEach(async () => {
  await cacheManager.flush();
});

beforeAll(async () => {
  await cacheManager.connect({
    url: 'redis://redis:6379',
  });
});

test('Redis PUT', async () => {
  await cacheManager.set('key', 'value');
  expect(await cacheManager.put('key', 'updated_value')).toBe('OK');
});

test('Redis PUT if not exists', async () => {
  expect(await cacheManager.put('key', 'updated_value')).toBe('OK');
});

afterAll(async () => {
  await cacheManager.disconnect();
});
