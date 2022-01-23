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
  });
})();
```

**List of API:**

- [set](#set)
- [get](get)
- [has](has)
- [remember](remember)
- [put](put)
- [pull](pull)
- [destroy](destroy)
- [forever](forever)
- [tags](tags)
- [flush](flush)

### `set(key, value, ttl = null)`

**example:**

```javascript
const { RedisCache } = require('redis-caching-manager');

const cacheManager = new RedisCache();

// connect redis

await cacheManager.set('key', 'value', 100);
```

That's it.

## Convention

- Your `*Filter` class should have methods in `apply*Property` format. Where the `*` will be replaced by the StudlyCase Property names. So, if your field name is `first_name`, then the method name should be `applyFirstNameProperty()`.
- If you're passing an extra data to the Model's filter scope like `Model::filter($filter, ['id' => 4])`, then the provided array will take precedence over the request's data.

## Caveat

If your **request** & **provided array** to the `filter` scope cannot find any suitable method, then it'll return the whole table data as `select * from your_table`. Be aware of this issue.

## Contributing

Pull requests are welcome. For any changes, please open an issue first to discuss what you would like to change.
