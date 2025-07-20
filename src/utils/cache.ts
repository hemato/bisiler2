// Cache management utilities
export interface CacheItem<T> {
  data: T;
  timestamp: number;
  ttl: number;
  key: string;
}

export interface CacheOptions {
  ttl: number; // Time to live in milliseconds
  maxSize?: number; // Maximum number of items
  storage?: 'memory' | 'localStorage' | 'sessionStorage';
}

// Default cache configuration
export const DEFAULT_CACHE_OPTIONS: CacheOptions = {
  ttl: 5 * 60 * 1000, // 5 minutes
  maxSize: 100,
  storage: 'memory'
};

// Memory cache implementation
class MemoryCache<T> {
  private cache = new Map<string, CacheItem<T>>();
  private maxSize: number;

  constructor(maxSize: number = 100) {
    this.maxSize = maxSize;
  }

  set(key: string, data: T, ttl: number): void {
    // Remove oldest items if at max capacity
    if (this.cache.size >= this.maxSize) {
      const oldestKey = this.cache.keys().next().value;
      if (oldestKey) {
        this.cache.delete(oldestKey);
      }
    }

    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
      key
    });
  }

  get(key: string): T | null {
    const item = this.cache.get(key);
    
    if (!item) {
      return null;
    }

    // Check if item has expired
    if (Date.now() - item.timestamp > item.ttl) {
      this.cache.delete(key);
      return null;
    }

    return item.data;
  }

  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  size(): number {
    return this.cache.size;
  }

  keys(): string[] {
    return Array.from(this.cache.keys());
  }

  // Clean expired items
  cleanup(): void {
    const now = Date.now();
    for (const [key, item] of this.cache.entries()) {
      if (now - item.timestamp > item.ttl) {
        this.cache.delete(key);
      }
    }
  }
}

// Storage cache implementation (localStorage/sessionStorage)
class StorageCache<T> {
  private storage: Storage;
  private prefix: string;
  private maxSize: number;

  constructor(storageType: 'localStorage' | 'sessionStorage', maxSize: number = 100) {
    if (typeof window === 'undefined') {
      throw new Error('Storage cache can only be used in browser environment');
    }
    
    this.storage = storageType === 'localStorage' ? localStorage : sessionStorage;
    this.prefix = `cache_${storageType}_`;
    this.maxSize = maxSize;
  }

  set(key: string, data: T, ttl: number): void {
    try {
      const item: CacheItem<T> = {
        data,
        timestamp: Date.now(),
        ttl,
        key
      };

      const storageKey = this.prefix + key;
      this.storage.setItem(storageKey, JSON.stringify(item));

      // Check storage size and cleanup if necessary
      this.cleanup();
    } catch (error) {
      console.warn('Failed to set cache item:', error);
      // Storage might be full, try cleanup and retry
      this.cleanup();
      try {
        const storageKey = this.prefix + key;
        this.storage.setItem(storageKey, JSON.stringify({ data, timestamp: Date.now(), ttl, key }));
      } catch (retryError) {
        console.error('Cache storage failed after cleanup:', retryError);
      }
    }
  }

  get(key: string): T | null {
    try {
      const storageKey = this.prefix + key;
      const itemStr = this.storage.getItem(storageKey);
      
      if (!itemStr) {
        return null;
      }

      const item: CacheItem<T> = JSON.parse(itemStr);

      // Check if item has expired
      if (Date.now() - item.timestamp > item.ttl) {
        this.storage.removeItem(storageKey);
        return null;
      }

      return item.data;
    } catch (error) {
      console.warn('Failed to get cache item:', error);
      return null;
    }
  }

  delete(key: string): boolean {
    try {
      const storageKey = this.prefix + key;
      this.storage.removeItem(storageKey);
      return true;
    } catch (error) {
      console.warn('Failed to delete cache item:', error);
      return false;
    }
  }

  clear(): void {
    try {
      const keys = this.keys();
      keys.forEach(key => {
        const storageKey = this.prefix + key;
        this.storage.removeItem(storageKey);
      });
    } catch (error) {
      console.warn('Failed to clear cache:', error);
    }
  }

  size(): number {
    return this.keys().length;
  }

  keys(): string[] {
    const keys: string[] = [];
    try {
      for (let i = 0; i < this.storage.length; i++) {
        const key = this.storage.key(i);
        if (key && key.startsWith(this.prefix)) {
          keys.push(key.replace(this.prefix, ''));
        }
      }
    } catch (error) {
      console.warn('Failed to get cache keys:', error);
    }
    return keys;
  }

  cleanup(): void {
    try {
      const now = Date.now();
      const keys = this.keys();
      
      // Remove expired items
      for (const key of keys) {
        const storageKey = this.prefix + key;
        const itemStr = this.storage.getItem(storageKey);
        
        if (itemStr) {
          try {
            const item: CacheItem<T> = JSON.parse(itemStr);
            if (now - item.timestamp > item.ttl) {
              this.storage.removeItem(storageKey);
            }
          } catch (parseError) {
            // Remove invalid items
            this.storage.removeItem(storageKey);
          }
        }
      }

      // Remove oldest items if over max size
      const remainingKeys = this.keys();
      if (remainingKeys.length > this.maxSize) {
        const itemsWithTimestamp = remainingKeys.map(key => {
          const storageKey = this.prefix + key;
          const itemStr = this.storage.getItem(storageKey);
          try {
            const item = JSON.parse(itemStr || '{}');
            return { key, timestamp: item.timestamp || 0 };
          } catch {
            return { key, timestamp: 0 };
          }
        });

        // Sort by timestamp and remove oldest
        itemsWithTimestamp
          .sort((a, b) => a.timestamp - b.timestamp)
          .slice(0, remainingKeys.length - this.maxSize)
          .forEach(({ key }) => {
            const storageKey = this.prefix + key;
            this.storage.removeItem(storageKey);
          });
      }
    } catch (error) {
      console.warn('Failed to cleanup cache:', error);
    }
  }
}

// Main cache manager
export class CacheManager<T> {
  private cache: MemoryCache<T> | StorageCache<T>;
  private options: CacheOptions;

  constructor(options: Partial<CacheOptions> = {}) {
    this.options = { ...DEFAULT_CACHE_OPTIONS, ...options };
    
    if (this.options.storage === 'memory') {
      this.cache = new MemoryCache<T>(this.options.maxSize);
    } else {
      this.cache = new StorageCache<T>(this.options.storage!, this.options.maxSize);
    }

    // Setup periodic cleanup
    if (typeof window !== 'undefined') {
      setInterval(() => this.cache.cleanup(), 60000); // Cleanup every minute
    }
  }

  // Get item from cache
  get(key: string): T | null {
    return this.cache.get(key);
  }

  // Set item in cache
  set(key: string, data: T, customTtl?: number): void {
    const ttl = customTtl || this.options.ttl;
    this.cache.set(key, data, ttl);
  }

  // Get or set (fetch if not exists)
  async getOrSet(
    key: string, 
    fetchFn: () => Promise<T>, 
    customTtl?: number
  ): Promise<T> {
    const cached = this.get(key);
    if (cached !== null) {
      return cached;
    }

    const data = await fetchFn();
    this.set(key, data, customTtl);
    return data;
  }

  // Delete item from cache
  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  // Clear all cache
  clear(): void {
    this.cache.clear();
  }

  // Get cache statistics
  getStats(): { size: number; keys: string[] } {
    return {
      size: this.cache.size(),
      keys: this.cache.keys()
    };
  }

  // Manual cleanup
  cleanup(): void {
    this.cache.cleanup();
  }
}

// Pre-configured cache instances
export const apiCache = new CacheManager<any>({
  ttl: 5 * 60 * 1000, // 5 minutes
  maxSize: 50,
  storage: 'memory'
});

export const strapiCache = new CacheManager<any>({
  ttl: 10 * 60 * 1000, // 10 minutes
  maxSize: 100,
  storage: typeof window !== 'undefined' ? 'localStorage' : 'memory'
});

export const userPreferencesCache = new CacheManager<any>({
  ttl: 24 * 60 * 60 * 1000, // 24 hours
  maxSize: 20,
  storage: typeof window !== 'undefined' ? 'localStorage' : 'memory'
});

// Cache decorators for functions
export function cached<T>(
  cacheManager: CacheManager<T>,
  keyGenerator: (...args: any[]) => string,
  ttl?: number
) {
  return function (target: any, propertyName: string, descriptor: PropertyDescriptor) {
    const method = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const cacheKey = keyGenerator(...args);
      
      return cacheManager.getOrSet(
        cacheKey,
        () => method.apply(this, args),
        ttl
      );
    };
  };
}

// Cache invalidation utilities
export const cacheInvalidation = {
  // Invalidate by pattern
  invalidatePattern(cacheManager: CacheManager<any>, pattern: RegExp): void {
    const stats = cacheManager.getStats();
    stats.keys
      .filter(key => pattern.test(key))
      .forEach(key => cacheManager.delete(key));
  },

  // Invalidate by prefix
  invalidateByPrefix(cacheManager: CacheManager<any>, prefix: string): void {
    const stats = cacheManager.getStats();
    stats.keys
      .filter(key => key.startsWith(prefix))
      .forEach(key => cacheManager.delete(key));
  },

  // Time-based invalidation
  scheduleInvalidation(cacheManager: CacheManager<any>, key: string, delay: number): void {
    setTimeout(() => {
      cacheManager.delete(key);
    }, delay);
  }
};

// HTTP cache utilities for API calls
export class HttpCache {
  private cache: CacheManager<any>;

  constructor(options?: Partial<CacheOptions>) {
    this.cache = new CacheManager(options);
  }

  // Cached fetch
  async fetch(url: string, options?: RequestInit, ttl?: number): Promise<Response> {
    const cacheKey = this.generateKey(url, options);
    
    // For GET requests, try cache first
    if (!options?.method || options.method.toUpperCase() === 'GET') {
      const cached = this.cache.get(cacheKey);
      if (cached) {
        return new Response(JSON.stringify(cached.body), {
          status: cached.status,
          statusText: cached.statusText,
          headers: cached.headers
        });
      }
    }

    // Make actual request
    const response = await fetch(url, options);
    
    // Cache successful GET responses
    if (response.ok && (!options?.method || options.method.toUpperCase() === 'GET')) {
      const responseClone = response.clone();
      const body = await responseClone.text();
      
      const cacheData = {
        body: body,
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries())
      };
      
      this.cache.set(cacheKey, cacheData, ttl);
    }

    return response;
  }

  private generateKey(url: string, options?: RequestInit): string {
    const method = options?.method || 'GET';
    const headers = JSON.stringify(options?.headers || {});
    const body = options?.body || '';
    
    return `${method}:${url}:${headers}:${body}`;
  }

  // Clear cache for specific URL pattern
  invalidate(urlPattern: RegExp): void {
    cacheInvalidation.invalidatePattern(this.cache, urlPattern);
  }
}

// Global HTTP cache instance
export const httpCache = new HttpCache({
  ttl: 5 * 60 * 1000, // 5 minutes
  maxSize: 50,
  storage: 'memory'
});

// Service Worker cache utilities (if service worker is available)
export const swCache = {
  async cacheResources(cacheName: string, resources: string[]): Promise<void> {
    if ('serviceWorker' in navigator && 'caches' in window) {
      try {
        const cache = await caches.open(cacheName);
        await cache.addAll(resources);
      } catch (error) {
        console.warn('Failed to cache resources:', error);
      }
    }
  },

  async getCachedResponse(request: string | Request): Promise<Response | undefined> {
    if ('caches' in window) {
      try {
        return await caches.match(request);
      } catch (error) {
        console.warn('Failed to get cached response:', error);
      }
    }
  },

  async deleteCacheByName(cacheName: string): Promise<boolean> {
    if ('caches' in window) {
      try {
        return await caches.delete(cacheName);
      } catch (error) {
        console.warn('Failed to delete cache:', error);
        return false;
      }
    }
    return false;
  }
};
