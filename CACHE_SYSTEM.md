# TMDB API Caching System

## Overview
The application now includes a comprehensive caching system to reduce repetitive API calls to TMDB and improve performance. The cache uses both in-memory storage and localStorage for persistence across sessions.

## Features

### 🎯 Automatic Caching
All TMDB API requests are automatically cached with appropriate TTL (Time To Live) values:

- **Movie/TV Show Details**: 2 hours
- **Lists (Trending/Popular/Top Rated)**: 30 minutes
- **Search Results**: 10 minutes
- **Genre Lists**: 24 hours
- **Season Details**: 2 hours
- **Similar Content**: 1 hour
- **Credits**: 2 hours

### 💾 Storage Strategy
- **Memory Cache**: Fast in-memory cache for immediate access
- **LocalStorage**: Persistent cache that survives page reloads
- **Automatic Cleanup**: Expired entries are automatically removed every 5 minutes

### 🔍 Cache Key Generation
Cache keys are generated based on:
- API endpoint URL
- Query parameters
- Request configuration

This ensures that different requests (e.g., different movie IDs, different genres) are cached separately.

## Usage

### For Developers

#### View Cache Statistics
Open the browser console and type:
```javascript
window.tmdbCache.stats()
```

This will show:
- Number of cached entries
- Memory cache size
- Total localStorage size in KB

#### Clear Cache
To manually clear all cached data:
```javascript
window.tmdbCache.clear()
```

#### Get Help
```javascript
window.tmdbCache.help()
```

### For Production

The cache works automatically in the background. No manual intervention is needed. Users will experience:
- Faster page loads on repeat visits
- Reduced data usage
- Better offline resilience (cached data persists)

## Benefits

### 1. Performance
- **Instant Loading**: Cached data loads instantly without network delay
- **Reduced Bandwidth**: Significantly less data transfer
- **Better UX**: Smoother navigation and faster response times

### 2. API Rate Limiting
- Protects against TMDB API rate limits
- Reduces unnecessary API calls
- More sustainable API usage

### 3. Offline Support
- Previously viewed content can be accessed offline
- Cached data persists across browser sessions
- Better resilience to network issues

## Implementation Details

### Cache Service (`src/services/cache.js`)
The cache service provides:
- `get(key)`: Retrieve cached data
- `set(key, data, ttl)`: Store data with expiration
- `delete(key)`: Remove specific entry
- `clear()`: Remove all cached data
- `cleanupOldEntries()`: Remove expired entries
- `getStats()`: Get cache statistics

### TMDB Service (`src/services/tmdb.js`)
All API functions now use the `cachedRequest` wrapper that:
1. Checks cache for existing data
2. Returns cached data if valid
3. Makes API request if cache miss
4. Stores response in cache
5. Returns the data

## Console Logging

In development mode, you'll see console logs:
- `Cache hit: <key>` - Data was retrieved from cache
- `Cache miss: <key>` - Data was fetched from API
- `Cleaned up X expired cache entries` - Automatic cleanup occurred

## Storage Limits

LocalStorage has a limit of approximately 5-10MB depending on the browser. The cache service handles this gracefully:
- Automatically cleans up expired entries when storage is full
- Prioritizes newer data over older data
- Memory cache continues to work even if localStorage is full

## Future Enhancements

Possible improvements:
- Cache size limits and LRU (Least Recently Used) eviction
- Configurable TTL values per user preference
- Cache preloading for predicted user navigation
- Service Worker integration for true offline support
- Cache compression for better storage efficiency

## Troubleshooting

### Cache not working?
1. Check browser console for errors
2. Verify localStorage is enabled in browser
3. Check if storage quota is exceeded
4. Try `window.tmdbCache.clear()` and reload

### Data seems stale?
1. Check console logs for cache hits
2. Clear cache manually: `window.tmdbCache.clear()`
3. Hard refresh the page (Ctrl+Shift+R or Cmd+Shift+R)

### Storage quota exceeded?
The system will automatically cleanup old entries. If issues persist:
1. Clear cache: `window.tmdbCache.clear()`
2. Check other apps using localStorage
3. Consider browser storage limits

## API Reference

### Window Object (Development Mode)

```javascript
window.tmdbCache = {
  // View cache statistics
  stats: () => { entryCount, memoryCount, totalSizeKB }
  
  // Clear all cached data
  clear: () => void
  
  // Access cache service directly
  service: CacheService
  
  // Display help information
  help: () => void
}
```

### Programmatic Access

```javascript
import { clearCache, getCacheStats, cacheService } from './services/tmdb';

// Clear cache
clearCache();

// Get stats
const stats = getCacheStats();

// Direct access to cache service
cacheService.get('key');
cacheService.set('key', data, ttl);
```

## License
Part of MovieWeb application - follows the same license as the main project.
