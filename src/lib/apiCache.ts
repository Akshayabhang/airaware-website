interface CacheEntry {
  data: any;
  expiresAt: number;
}

const cache = new Map<string, CacheEntry>();

const CLEANUP_THRESHOLD_MS = 5 * 60 * 1000; // 5 minutes

// Periodically clean up expired cache entries to avoid memory leaks
if (typeof global !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of cache.entries()) {
      if (now > entry.expiresAt) {
        cache.delete(key);
      }
    }
  }, CLEANUP_THRESHOLD_MS);
}

export const apiCache = {
  /**
   * Retrieves data from the cache if it exists and has not expired.
   */
  get<T>(key: string): T | null {
    const entry = cache.get(key);
    if (!entry) return null;

    if (Date.now() > entry.expiresAt) {
      cache.delete(key);
      return null;
    }

    return entry.data as T;
  },

  /**
   * Sets data in the cache with a specified Time To Live (TTL) in seconds.
   */
  set(key: string, data: any, ttlSeconds: number = 300): void {
    cache.set(key, {
      data,
      expiresAt: Date.now() + ttlSeconds * 1000,
    });
  },
};
