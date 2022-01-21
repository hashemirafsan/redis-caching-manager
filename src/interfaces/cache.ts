export interface ICache {
  set(key: string, value: any, ttl: any): any;
  get(key: string): any;
  remember(key: string): any;
  has(key: string): Promise<boolean>;
  destroy(key: string): any;
}
