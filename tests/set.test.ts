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

test('Redis SET (string)', async () => {
  expect(await cacheManager.set('key', 'value')).toBeTruthy();
});

test('Redis SET (object)', async () => {
  expect(await cacheManager.set('key', { value: true })).toBeTruthy;
});

test('Redis SET (number)', async () => {
  expect(await cacheManager.set('key', 1)).toBeTruthy();
});

test('Redis SET (boolean)', async () => {
  expect(await cacheManager.set('key', true)).toBeTruthy();
});

test('Redis SET if exists', async () => {
  await cacheManager.set('key', 'value');
  expect(await cacheManager.set('key', 'value1')).toBeFalsy();
});

afterAll(async () => {
  await cacheManager.disconnect();
});
