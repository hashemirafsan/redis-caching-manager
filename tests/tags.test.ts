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

test('Redis TAG set', async () => {
  expect(await cacheManager.tags(['tag1']).set('key1', 'value1')).toBe('OK');
});

test('Redis TAG set if exists', async () => {
  await cacheManager.tags(['tag1']).set('key1', 'value1');
  expect(await cacheManager.tags(['tag1']).set('key1', 'value1')).toBeNull();
});

test('Redis TAG destroy', async () => {
  await cacheManager.tags(['tag1']).set('key1', 'value1');
  expect(await cacheManager.tags(['tag1']).destroy('key1')).toBeTruthy();
});

test('Redis TAG destroy if not exists', async () => {
  expect(await cacheManager.tags(['tag1']).destroy('key1')).toBeFalsy();
});

test('Redis TAG flush', async () => {
  await cacheManager.tags(['tag1']).set('key1', 'value1');
  expect(await cacheManager.tags(['tag1']).flush()).toBeTruthy();
});

test('Redis TAG flush if not exists', async () => {
  expect(await cacheManager.tags(['tag1']).flush()).toBeFalsy();
});

afterAll(async () => {
  await cacheManager.disconnect();
});
