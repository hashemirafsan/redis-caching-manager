export interface IRedisCacheConfig {
  enable?: boolean;
  prefix?: string;
  url: string;
  ttl?: number;
}
