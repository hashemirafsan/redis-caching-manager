import { RedisCache } from '../src/index';

const cacheManager = new RedisCache();

beforeAll(async () => {
  await cacheManager.connect({
    url: 'redis://redis:6379',
  });
});

test('Redis HAS (string)', async () => {
  await cacheManager.set('newValue', 'okFine');
  expect(await cacheManager.has('newValue')).toBeTruthy();
});

test('Redis HAS not exists (string)', async () => {
  expect(await cacheManager.has('unknownKey')).toBeFalsy();
});

afterAll(async () => {
  await cacheManager.disconnect();
});
