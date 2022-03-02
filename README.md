# Redis Caching Manager

Redis caching manager is a simple NPM package for redis cache. It will help to use redis with some easy api.

## Installation

You can start it from npm. Go to your terminal and run this command from your project root directory.

```javascript
npm install redis-caching-manager
```

After installation, you need to connect redis

```javascript
const { RedisCache } = require('redis-caching-manager');

const cacheManager = new RedisCache();

(async () => {
  await cacheManager.connect({
    url: 'redis://redis:6379',
    ttl: 300,
    prefix: 'dorik_', //optional
    enable: false, //(optional) If enable false then all command will stop to execute
  });
})();
```

**List of API:**

- [set](#setkey-value-ttl--null)
- [get](#getkey)
- [has](#haskey)
- [remember](#rememberkey-cb-ttl--null)
- [put](#putkey-value-ttl--null)
- [pull](#pullkey)
- [destroy](#destroykey)
- [forever](#foreverkey-value)
- [tags](#tagskeys-string)
- [flush](#flush)

### `set(key, value, ttl = null)`

**example:**

```javascript
const { RedisCache } = require('redis-caching-manager');

const cacheManager = new RedisCache();

// connect redis

await cacheManager.set('key', 'value', 100); // result = OK
```

### `get(key)`

**example:**

```javascript
const { RedisCache } = require('redis-caching-manager');

const cacheManager = new RedisCache();

// connect redis

const result = await cacheManager.get('key'); // result = value
```

### `has(key)`

**example:**

```javascript
const { RedisCache } = require('redis-caching-manager');

const cacheManager = new RedisCache();

// connect redis

const result = await cacheManager.has('key'); // result = true/false
```

### `remember(key, cb, ttl = null)`

**example:**

```javascript
const { RedisCache } = require('redis-caching-manager');

const cacheManager = new RedisCache();

// connect redis

const result = await cacheManager.remember(
  'key',
  async () => {
    return 'updated_value';
  },
  100,
); // result = updated_value
```

### `put(key, value, ttl = null)`

**example:**

```javascript
const { RedisCache } = require('redis-caching-manager');

const cacheManager = new RedisCache();

// connect redis

const result = await cacheManager.put('key', 'value', 100); // result = OK
```

### `pull(key)`

**example:**

```javascript
const { RedisCache } = require('redis-caching-manager');

const cacheManager = new RedisCache();

// connect redis

await cacheManager.pull('key'); // result = value
```

### `destroy(key)`

**example:**

```javascript
const { RedisCache } = require('redis-caching-manager');

const cacheManager = new RedisCache();

// connect redis

const result = await cacheManager.destroy('key'); // result = true/false
```

### `forever(key, value)`

**example:**

```javascript
const { RedisCache } = require('redis-caching-manager');

const cacheManager = new RedisCache();

// connect redis

const result = await cacheManager.forever('key', 'value'); // result = true/false
```

### `tags(keys: string[])`

**example:**

```javascript
const { RedisCache } = require('redis-caching-manager');

const cacheManager = new RedisCache();

// connect redis

// set with tags
const result = await cacheManager.tags(['tag1', 'tag2']).set('key', 'value'); // result = OK

// destroy with tags
const result = await cacheManager.tags(['tag1', 'tag2']).destroy('key'); // result = true/false

// flush with tags
const result = await cacheManager.tags(['tag1', 'tag2']).flush(); // result = true/false
```

### `flush()`

**example:**

```javascript
const { RedisCache } = require('redis-caching-manager');

const cacheManager = new RedisCache();

// connect redis

const result = await cacheManager.flush(); // result = true/false
```

That's it.

## Contributing

Pull requests are welcome. For any changes, please open an issue first to discuss what you would like to change.
