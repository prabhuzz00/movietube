/**
 * Cache utility for storing API responses
 * Uses localStorage for persistence across sessions
 */

const CACHE_PREFIX = 'tmdb_cache_';
const DEFAULT_TTL = 1000 * 60 * 30; // 30 minutes default

class CacheService {
  constructor() {
    this.memoryCache = new Map();
    this.cleanupOldEntries();
  }

  /**
   * Generate a cache key from URL and params
   */
  generateKey(url, params = {}) {
    const paramString = JSON.stringify(params);
    return `${CACHE_PREFIX}${url}_${paramString}`;
  }

  /**
   * Set data in cache with TTL
   */
  set(key, data, ttl = DEFAULT_TTL) {
    const cacheEntry = {
      data,
      timestamp: Date.now(),
      ttl,
      expiresAt: Date.now() + ttl
    };

    // Store in memory cache
    this.memoryCache.set(key, cacheEntry);

    // Store in localStorage
    try {
      localStorage.setItem(key, JSON.stringify(cacheEntry));
    } catch (error) {
      console.warn('Failed to store in localStorage:', error);
      // If localStorage is full, clear old entries
      this.cleanupOldEntries();
    }
  }

  /**
   * Get data from cache if not expired
   */
  get(key) {
    // Check memory cache first (faster)
    let cacheEntry = this.memoryCache.get(key);

    // If not in memory, check localStorage
    if (!cacheEntry) {
      try {
        const stored = localStorage.getItem(key);
        if (stored) {
          cacheEntry = JSON.parse(stored);
          // Restore to memory cache
          this.memoryCache.set(key, cacheEntry);
        }
      } catch (error) {
        console.warn('Failed to read from localStorage:', error);
        return null;
      }
    }

    if (!cacheEntry) {
      return null;
    }

    // Check if expired
    if (Date.now() > cacheEntry.expiresAt) {
      this.delete(key);
      return null;
    }

    return cacheEntry.data;
  }

  /**
   * Delete a specific cache entry
   */
  delete(key) {
    this.memoryCache.delete(key);
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.warn('Failed to remove from localStorage:', error);
    }
  }

  /**
   * Clear all cache entries
   */
  clear() {
    this.memoryCache.clear();
    try {
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith(CACHE_PREFIX)) {
          localStorage.removeItem(key);
        }
      });
    } catch (error) {
      console.warn('Failed to clear localStorage:', error);
    }
  }

  /**
   * Remove expired entries from localStorage
   */
  cleanupOldEntries() {
    try {
      const keys = Object.keys(localStorage);
      const now = Date.now();
      let removedCount = 0;

      keys.forEach(key => {
        if (key.startsWith(CACHE_PREFIX)) {
          try {
            const stored = localStorage.getItem(key);
            if (stored) {
              const entry = JSON.parse(stored);
              if (now > entry.expiresAt) {
                localStorage.removeItem(key);
                this.memoryCache.delete(key);
                removedCount++;
              }
            }
          } catch (error) {
            // If parsing fails, remove the corrupted entry
            localStorage.removeItem(key);
            removedCount++;
          }
        }
      });

      if (removedCount > 0) {
        console.log(`Cleaned up ${removedCount} expired cache entries`);
      }
    } catch (error) {
      console.warn('Failed to cleanup old entries:', error);
    }
  }

  /**
   * Get cache statistics
   */
  getStats() {
    const keys = Object.keys(localStorage).filter(key => key.startsWith(CACHE_PREFIX));
    const totalSize = keys.reduce((size, key) => {
      const item = localStorage.getItem(key);
      return size + (item ? item.length : 0);
    }, 0);

    return {
      entryCount: keys.length,
      memoryCount: this.memoryCache.size,
      totalSizeKB: (totalSize / 1024).toFixed(2)
    };
  }
}

// Create singleton instance
const cacheService = new CacheService();

// Cleanup expired entries every 5 minutes
setInterval(() => {
  cacheService.cleanupOldEntries();
}, 1000 * 60 * 5);

export default cacheService;

// Cache TTL configurations for different types of data
export const CACHE_TTL = {
  DETAILS: 1000 * 60 * 60 * 2,      // 2 hours for movie/TV details
  LISTS: 1000 * 60 * 30,             // 30 minutes for trending/popular lists
  SEARCH: 1000 * 60 * 10,            // 10 minutes for search results
  GENRES: 1000 * 60 * 60 * 24,       // 24 hours for genre list
  SEASONS: 1000 * 60 * 60 * 2,       // 2 hours for season details
  SIMILAR: 1000 * 60 * 60,           // 1 hour for similar content
  CREDITS: 1000 * 60 * 60 * 2,       // 2 hours for credits
};
