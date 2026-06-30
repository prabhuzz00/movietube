import axios from 'axios';
import cacheService, { CACHE_TTL } from './cache';

const API_KEY = '0570a9614366c6f8d8a56072901242d6';
const API_TOKEN = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIwNTcwYTk2MTQzNjZjNmY4ZDhhNTYwNzI5MDEyNDJkNiIsIm5iZiI6MTc4MjcxMzM1Mi42OTgsInN1YiI6IjZhNDIwYzA4NWNjMGY0YjZkM2QzMDcwMyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.z-EvRqTmpLh6p7BTbsD28DDZQBBd_XUaTmWtvJm2C8o';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

const tmdbApi = axios.create({
  baseURL: BASE_URL,
  headers: {
    Authorization: `Bearer ${API_TOKEN}`,
    'Content-Type': 'application/json',
  },
});

/**
 * Wrapper function for cached API calls
 */
const cachedRequest = async (cacheKey, ttl, requestFn) => {
  // Check cache first
  const cached = cacheService.get(cacheKey);
  if (cached) {
    console.log(`Cache hit: ${cacheKey}`);
    return cached;
  }

  // Make API request
  console.log(`Cache miss: ${cacheKey} - Fetching from API`);
  const data = await requestFn();
  
  // Store in cache
  cacheService.set(cacheKey, data, ttl);
  
  return data;
};

export const getImageUrl = (path, size = 'original') => {
  if (!path) return null;
  return `${IMAGE_BASE_URL}/${size}${path}`;
};

export const getTrending = async (mediaType = 'all', timeWindow = 'week', page = 1) => {
  const cacheKey = cacheService.generateKey(`/trending/${mediaType}/${timeWindow}`, { page });
  return cachedRequest(cacheKey, CACHE_TTL.LISTS, async () => {
    const response = await tmdbApi.get(`/trending/${mediaType}/${timeWindow}`, {
      params: { page }
    });
    return response.data;
  });
};

export const getPopular = async (mediaType = 'movie', page = 1) => {
  const cacheKey = cacheService.generateKey(`/${mediaType}/popular`, { page });
  return cachedRequest(cacheKey, CACHE_TTL.LISTS, async () => {
    const response = await tmdbApi.get(`/${mediaType}/popular`, {
      params: { page }
    });
    return response.data;
  });
};

export const getTopRated = async (mediaType = 'movie', page = 1) => {
  const cacheKey = cacheService.generateKey(`/${mediaType}/top_rated`, { page });
  return cachedRequest(cacheKey, CACHE_TTL.LISTS, async () => {
    const response = await tmdbApi.get(`/${mediaType}/top_rated`, {
      params: { page }
    });
    return response.data;
  });
};

export const getByGenre = async (genreId, mediaType = 'movie', page = 1) => {
  const cacheKey = cacheService.generateKey(`/discover/${mediaType}`, { with_genres: genreId, page });
  return cachedRequest(cacheKey, CACHE_TTL.LISTS, async () => {
    const response = await tmdbApi.get(`/discover/${mediaType}`, {
      params: {
        with_genres: genreId,
        page,
      },
    });
    return response.data;
  });
};

export const getByLanguage = async (languageCode, mediaType = 'movie', page = 1) => {
  const cacheKey = cacheService.generateKey(`/discover/${mediaType}`, { with_original_language: languageCode, page });
  return cachedRequest(cacheKey, CACHE_TTL.LISTS, async () => {
    const response = await tmdbApi.get(`/discover/${mediaType}`, {
      params: {
        with_original_language: languageCode,
        page,
        sort_by: 'popularity.desc',
      },
    });
    return response.data;
  });
};

export const getMovieDetails = async (movieId) => {
  const cacheKey = cacheService.generateKey(`/movie/${movieId}`, { append_to_response: 'videos,credits,similar' });
  return cachedRequest(cacheKey, CACHE_TTL.DETAILS, async () => {
    const response = await tmdbApi.get(`/movie/${movieId}`, {
      params: {
        append_to_response: 'videos,credits,similar',
      },
    });
    return response.data;
  });
};

export const getTVDetails = async (tvId) => {
  const cacheKey = cacheService.generateKey(`/tv/${tvId}`, { append_to_response: 'videos,credits,similar' });
  return cachedRequest(cacheKey, CACHE_TTL.DETAILS, async () => {
    const response = await tmdbApi.get(`/tv/${tvId}`, {
      params: {
        append_to_response: 'videos,credits,similar',
      },
    });
    return response.data;
  });
};

export const getSeasonDetails = async (tvId, seasonNumber) => {
  const cacheKey = cacheService.generateKey(`/tv/${tvId}/season/${seasonNumber}`);
  return cachedRequest(cacheKey, CACHE_TTL.SEASONS, async () => {
    const response = await tmdbApi.get(`/tv/${tvId}/season/${seasonNumber}`);
    return response.data;
  });
};

export const searchMulti = async (query) => {
  const cacheKey = cacheService.generateKey('/search/multi', { query });
  return cachedRequest(cacheKey, CACHE_TTL.SEARCH, async () => {
    const response = await tmdbApi.get('/search/multi', {
      params: {
        query,
      },
    });
    return response.data;
  });
};

export const getGenres = async (mediaType = 'movie') => {
  const cacheKey = cacheService.generateKey(`/genre/${mediaType}/list`);
  return cachedRequest(cacheKey, CACHE_TTL.GENRES, async () => {
    const response = await tmdbApi.get(`/genre/${mediaType}/list`);
    return response.data;
  });
};

export const GENRES = {
  ACTION: 28,
  ADVENTURE: 12,
  ANIMATION: 16,
  COMEDY: 35,
  CRIME: 80,
  DOCUMENTARY: 99,
  DRAMA: 18,
  FAMILY: 10751,
  FANTASY: 14,
  HISTORY: 36,
  HORROR: 27,
  MUSIC: 10402,
  MYSTERY: 9648,
  ROMANCE: 10749,
  SCIENCE_FICTION: 878,
  THRILLER: 53,
  WAR: 10752,
  WESTERN: 37,
};

// Export cache utilities for manual management
export const clearCache = () => cacheService.clear();
export const getCacheStats = () => cacheService.getStats();
export { cacheService };

export default tmdbApi;
