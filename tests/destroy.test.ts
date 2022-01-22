import { RedisCache } from '../src/index';

const cacheManager = new RedisCache();

beforeAll(async () => {
  await cacheManager.connect({
    url: 'redis://redis:6379',
  });
});

test('Redis Destroy', async () => {
  await cacheManager.set('something', 1);
  expect(await cacheManager.destroy('something')).toBeTruthy();
});

test('Redis Destroy not exist', async () => {
  expect(await cacheManager.destroy('something')).toBeFalsy();
});

afterAll(async () => {
  await cacheManager.disconnect();
});
