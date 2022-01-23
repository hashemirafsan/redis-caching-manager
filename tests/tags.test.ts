import { RedisCache } from '../src/index';

const cacheManager = new RedisCache();

beforeAll(async () => {
  await cacheManager.connect({
    url: 'redis://redis:6379',
  });
});

test('Redis Destroy', async () => {
  expect(await cacheManager.tags(['something']).set('green', 'valueG')).toBe('OK');
});

test('Redis Destroy Test', async () => {
  await cacheManager.tags(['something']).flush();
  expect('something').toBe('something');
});

afterEach(async () => {
  await Promise.all([cacheManager.flush()]);
});

afterAll(async () => {
  await cacheManager.disconnect();
});
