import { RedisCache } from '../src/index';

const cacheManager = new RedisCache();

beforeEach(async () => {
  await cacheManager.flush();
});

beforeAll(async () => {
  await cacheManager.connect({
    url: process.env.REDIS_URL ?? 'redis://redis:6379',
    prefix: 'dorik',
  });
});

test('Redis SET (string) if enable true', async () => {
    expect(await cacheManager.enable(true).set('key', 'value')).toBeTruthy();
});

test('Redis DESTROY if enable false', async () => {
  await cacheManager.enable(false).set('key', 'value');
  expect(await cacheManager.enable(false).destroy('key')).toBeFalsy();
});

test('Redis DESTROY if not exists', async () => {
  expect(await cacheManager.enable(false).destroy('key')).toBeFalsy();
});

afterAll(async () => {
  await cacheManager.disconnect();
});
