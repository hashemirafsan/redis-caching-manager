import { RedisCache } from '../src/index';

const cacheManager = new RedisCache();

beforeAll(async () => {
  await cacheManager.connect({
    url: 'redis://redis:6379',
  });
});

test('Redis GET (string)', async () => {
  await cacheManager.set('key', 'value');
  expect(await cacheManager.get('key')).toBe('value');
});

test('Redis GET (object)', async () => {
  const objKey = 'objKey';
  const result = { result: true };
  await cacheManager.set(objKey, result);
  expect(await cacheManager.get(objKey)).toEqual(result);
});

afterAll(async () => {
  await cacheManager.disconnect();
});
