/**
 * 2Embed API Service
 * Documentation: https://www.2embed.cc
 * Supports both TMDB and IMDB IDs
 */

const BASE_EMBED_URL = 'https://www.2embed.cc';
const BASE_API_URL = 'https://api.2embed.cc';

/**
 * Generate 2Embed embed URL for movies
 * @param {string|number} id - TMDB ID or IMDB ID (tt...)
 * @returns {string} 2Embed movie embed URL
 */
export const getMovieEmbedUrl = (id) => {
  return `${BASE_EMBED_URL}/embed/${id}`;
};

/**
 * Generate 2Embed embed URL for TV show episodes
 * @param {string|number} id - TMDB ID or IMDB ID (tt...)
 * @param {number} season - Season number
 * @param {number} episode - Episode number
 * @returns {string} 2Embed TV episode embed URL
 */
export const getEpisodeEmbedUrl = (id, season, episode) => {
  return `${BASE_EMBED_URL}/embedtv/${id}&s=${season}&e=${episode}`;
};

/**
 * Generate 2Embed embed URL for complete TV seasons
 * @param {string|number} id - TMDB ID or IMDB ID (tt...)
 * @returns {string} 2Embed full TV season embed URL
 */
export const getTVShowEmbedUrl = (id) => {
  return `${BASE_EMBED_URL}/embedtvfull/${id}`;
};

/**
 * Generate 2Embed embed URL for a specific TV season
 * @param {string|number} id - TMDB ID or IMDB ID (tt...)
 * @param {number} season - Season number (optional, defaults to full series)
 * @returns {string} 2Embed TV season embed URL
 */
export const getSeasonEmbedUrl = (id, season = null) => {
  if (season) {
    // For specific season with first episode
    return `${BASE_EMBED_URL}/embedtv/${id}&s=${season}&e=1`;
  }
  return getTVShowEmbedUrl(id);
};

// ============================================
// JSON API Functions
// ============================================

/**
 * Fetch movie details from 2Embed API
 * @param {string} imdbId - IMDB ID (tt...)
 * @returns {Promise<Object>} Movie details
 */
export const getMovieDetails = async (imdbId) => {
  const response = await fetch(`${BASE_API_URL}/movie?imdb_id=${imdbId}`);
  return response.json();
};

/**
 * Fetch trending movies from 2Embed API
 * @param {string} timeWindow - Time window: 'day', 'week', or 'month'
 * @param {number} page - Page number (default: 1)
 * @returns {Promise<Object>} Trending movies data
 */
export const getTrendingMovies = async (timeWindow = 'week', page = 1) => {
  const response = await fetch(
    `${BASE_API_URL}/trending?time_window=${timeWindow}&page=${page}`
  );
  return response.json();
};

/**
 * Search movies on 2Embed API
 * @param {string} query - Search keyword
 * @param {number} page - Page number (default: 1)
 * @returns {Promise<Object>} Search results
 */
export const searchMovies = async (query, page = 1) => {
  const response = await fetch(
    `${BASE_API_URL}/search?q=${encodeURIComponent(query)}&page=${page}`
  );
  return response.json();
};

/**
 * Get similar movies from 2Embed API
 * @param {string} imdbId - IMDB ID (tt...)
 * @param {number} page - Page number (default: 1)
 * @returns {Promise<Object>} Similar movies data
 */
export const getSimilarMovies = async (imdbId, page = 1) => {
  const response = await fetch(
    `${BASE_API_URL}/similar?imdb_id=${imdbId}&page=${page}`
  );
  return response.json();
};

/**
 * Fetch TV show details from 2Embed API
 * @param {string} imdbId - IMDB ID (tt...)
 * @returns {Promise<Object>} TV show details
 */
export const getTVDetails = async (imdbId) => {
  const response = await fetch(`${BASE_API_URL}/tv?imdb_id=${imdbId}`);
  return response.json();
};

/**
 * Fetch trending TV shows from 2Embed API
 * @param {string} timeWindow - Time window: 'day', 'week', or 'month'
 * @param {number} page - Page number (default: 1)
 * @returns {Promise<Object>} Trending TV shows data
 */
export const getTrendingTVShows = async (timeWindow = 'week', page = 1) => {
  const response = await fetch(
    `${BASE_API_URL}/trendingtv?time_window=${timeWindow}&page=${page}`
  );
  return response.json();
};

/**
 * Search TV shows on 2Embed API
 * @param {string} query - Search keyword
 * @param {number} page - Page number (default: 1)
 * @returns {Promise<Object>} Search results
 */
export const searchTVShows = async (query, page = 1) => {
  const response = await fetch(
    `${BASE_API_URL}/searchtv?q=${encodeURIComponent(query)}&page=${page}`
  );
  return response.json();
};

/**
 * Get similar TV shows from 2Embed API
 * @param {string} imdbId - IMDB ID (tt...)
 * @param {number} page - Page number (default: 1)
 * @returns {Promise<Object>} Similar TV shows data
 */
export const getSimilarTVShows = async (imdbId, page = 1) => {
  const response = await fetch(
    `${BASE_API_URL}/similartv?imdb_id=${imdbId}&page=${page}`
  );
  return response.json();
};

/**
 * Get season details from 2Embed API
 * @param {string} imdbId - IMDB ID (tt...)
 * @param {number} season - Season number
 * @returns {Promise<Object>} Season details
 */
export const getSeasonDetails = async (imdbId, season) => {
  const response = await fetch(
    `${BASE_API_URL}/season?imdb_id=${imdbId}&season=${season}`
  );
  return response.json();
};

/**
 * Example usage:
 * 
 * // Embed Movies
 * const movieUrl = getMovieEmbedUrl(609681); // TMDB ID
 * // Result: https://www.2embed.cc/embed/609681
 * 
 * const movieUrlImdb = getMovieEmbedUrl('tt10676048'); // IMDB ID
 * // Result: https://www.2embed.cc/embed/tt10676048
 * 
 * // Embed TV Episode
 * const episodeUrl = getEpisodeEmbedUrl(60735, 1, 1); // TMDB ID
 * // Result: https://www.2embed.cc/embedtv/60735&s=1&e=1
 * 
 * const episodeUrlImdb = getEpisodeEmbedUrl('tt3107288', 1, 1); // IMDB ID
 * // Result: https://www.2embed.cc/embedtv/tt3107288&s=1&e=1
 * 
 * // Embed Full TV Show
 * const tvShowUrl = getTVShowEmbedUrl(60735);
 * // Result: https://www.2embed.cc/embedtvfull/60735
 * 
 * // JSON API Usage
 * const movieDetails = await getMovieDetails('tt10676048');
 * const trending = await getTrendingMovies('week', 1);
 * const searchResults = await searchMovies('Inception', 1);
 */

export default {
  // Embed URLs
  getMovieEmbedUrl,
  getEpisodeEmbedUrl,
  getTVShowEmbedUrl,
  getSeasonEmbedUrl,
  
  // JSON API
  getMovieDetails,
  getTrendingMovies,
  searchMovies,
  getSimilarMovies,
  getTVDetails,
  getTrendingTVShows,
  searchTVShows,
  getSimilarTVShows,
  getSeasonDetails,
};
