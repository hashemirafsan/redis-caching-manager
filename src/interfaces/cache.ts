export interface ICache {
  set(key: string, value: any, ttl: any): void;
  get(key: string): any;
  remember(key: string, cb: () => Promise<any>, ttl: any): any;
  has(key: string): Promise<boolean>;
  destroy(key: string): any;
}
