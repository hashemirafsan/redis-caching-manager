export interface ICache {
  set(key: string, value: any, ttl: number): Promise<boolean>;
  get(key: string): any;
  forever(key: string, value: any): Promise<boolean>;
  remember(key: string, cb: () => Promise<any>, ttl: number): Promise<any>;
  has(key: string): Promise<boolean>;
  destroy(key: string): Promise<boolean>;
  flush(): Promise<boolean>;
  put(key: string, value: any, ttl: number): Promise<boolean>;
  pull(key: string): any;
}
