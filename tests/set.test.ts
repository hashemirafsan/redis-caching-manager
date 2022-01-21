import { RedisCache } from '../src/index';

const cacheManager = new RedisCache();

beforeAll(async () => {
  await cacheManager.connect({
    url: 'redis://redis:6379',
  });
});

test('Redis SET', async () => {
  await cacheManager.set('key', 'value');
  expect(await cacheManager.get('key')).toBe('value');
});

afterAll(async () => {
  await cacheManager.disconnect();
});
