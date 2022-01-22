import { RedisCache } from '../src/index';

const cacheManager = new RedisCache();

beforeAll(async () => {
  await cacheManager.connect({
    url: 'redis://redis:6379',
  });
});

test('Redis Remember (string)', async () => {
  const result = await cacheManager.remember(
    'newKey',
    async () => {
      return 'newValue';
    },
    100,
  );
  expect(result).toBe('newValue');
});

afterAll(async () => {
  await cacheManager.disconnect();
});
