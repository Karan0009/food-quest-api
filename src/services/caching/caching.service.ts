import { Inject, Injectable } from '@nestjs/common';
import { RedisStore } from 'cache-manager-redis-yet';
import { CACHE_MANAGER } from 'src/core/constants';
import { LoggerFactory } from '../logger/logger';

@Injectable()
export class CachingService {
  logger = new LoggerFactory().getLogger();
  @Inject(CACHE_MANAGER) private cacheManager: RedisStore;

  getCacheManager() {
    return this.cacheManager;
  }

  set(key: string, data: unknown): Promise<void> {
    if (!this.cacheManager) return;
    return this.cacheManager.set(key, data);
  }

  get(key: string): Promise<unknown> {
    if (!this.cacheManager) return null;
    return this.cacheManager.get(key);
  }

  del(key: string): Promise<void> {
    if (!this.cacheManager) return;
    return this.cacheManager.del(key);
  }

  getKeysByPattern(pattern: string): Promise<string[]> {
    if (!this.cacheManager) return null;
    return this.cacheManager.keys(pattern);
  }

  getAllKeys(): Promise<string[]> {
    if (!this.cacheManager) return null;
    return this.cacheManager.keys('*');
  }

  getList(key: string, start: number, stop: number): Promise<string[] | null> {
    if (!this.cacheManager) return null;
    return this.cacheManager.client.lRange(key, start, stop);
  }

  setList(key: string, data: string[]): Promise<number | null> {
    if (!this.cacheManager) return null;
    return this.cacheManager.client.lPush(key, data);
  }

  getListLen(key: string): Promise<number | null> {
    if (!this.cacheManager) return null;
    return this.cacheManager.client.lLen(key);
  }

  // createCacheKey(request: Request): string {
  //   return (request?.user?.id ?? '') + ':' + request.originalUrl;
  // }

  // isKeyInRequest()

  // getCacheFromRequest(request: Request,key:string): Promise<unknown> {
  //   try {
  //     return this.get(key);
  //   } catch (err) {
  //     throw err;
  //   }
  // }

  // setCacheFromRequest(request: Request, data: unknown): Promise<void> {
  //   try {
  //     return this.set(this.createCacheKey(request), data);
  //   } catch (err) {
  //     throw err;
  //   }
  // }

  // async invalidateCache(request: Request): Promise<string[]> {
  //   try {
  //     console.log(request);
  //     //   const key = this.createCacheKey(request);
  //     const keys = await this.cacheManager.store.keys('*');
  //     return keys;
  //   } catch (err) {
  //     throw err;
  //   }
  // }
}
