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

test('Redis PULL', async () => {
  await cacheManager.set('key', 'value');
  expect(await cacheManager.pull('key')).toEqual('value');
});

test('Redis PULL if not exists', async () => {
  expect(await cacheManager.pull('key')).toBeNull();
});

test('Redis PULL if get', async () => {
  await cacheManager.set('key', 'value');
  const pullResult = await cacheManager.pull('key');
  const getResult = await cacheManager.get('key');

  expect(pullResult).toEqual('value');
  expect(getResult).toBeNull();
});

afterAll(async () => {
  await cacheManager.disconnect();
});
