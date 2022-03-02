import { RedisCache } from '../src/index';

const cacheManager = new RedisCache();

beforeEach(async () => {
  await cacheManager.flush();
});

beforeAll(async () => {
  await cacheManager.connect({
    prefix: 'prefix_',
    url: 'redis://redis:6379',
  });
});

test('Redis GET (string)', async () => {
  await cacheManager.set('key', 'value');
  expect(await cacheManager.get('key')).toEqual('value');
});

test('Redis GET (object)', async () => {
  const obj = { value: 1 };
  await cacheManager.set('key', obj);
  expect(await cacheManager.get('key')).toStrictEqual(obj);
});

test('Redis GET (number)', async () => {
  await cacheManager.set('key', 1);
  expect(await cacheManager.get('key')).toEqual(1);
});

test('Redis GET (boolean)', async () => {
  await cacheManager.set('key', false);
  expect(await cacheManager.get('key')).toEqual(false);
});

test('Redis GET if not exists', async () => {
  expect(await cacheManager.get('key')).toBeNull();
});

afterAll(async () => {
  await cacheManager.disconnect();
});