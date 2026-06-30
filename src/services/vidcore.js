/**
 * VidCore API Service
 * Documentation: https://vidcore.org
 */

/**
 * Generate VidCore embed URL for movies
 * @param {string|number} tmdbId - TMDB movie ID
 * @param {Object} options - Optional parameters
 * @param {boolean} options.title - Controls whether the media title is displayed
 * @param {boolean} options.poster - Determines if the poster image is shown
 * @param {boolean} options.autoPlay - Controls whether the media starts playing automatically (default: true)
 * @param {number} options.startAt - Starts the video at the specified time in seconds
 * @param {string} options.theme - Changes the player's color, hex code format (e.g., 'FF0000')
 * @param {string} options.server - Changes the default server for the player
 * @param {boolean} options.hideServer - Controls whether the server selector button is shown
 * @param {boolean} options.fullscreenButton - Controls whether the fullscreen button is shown
 * @param {boolean} options.chromecast - Reserved Chromecast visibility option
 * @param {string} options.sub - Sets the default subtitle (e.g., 'en', 'es', 'fr')
 * @returns {string} VidCore embed URL
 */
export const getMovieEmbedUrl = (tmdbId, options = {}) => {
  const {
    title,
    poster,
    autoPlay = true,
    startAt,
    theme,
    server,
    hideServer,
    fullscreenButton,
    chromecast,
    sub
  } = options;
  
  let url = `https://vidcore.org/embed/movie/${tmdbId}`;
  const params = [];
  
  // Add autoPlay by default
  params.push(`autoPlay=${autoPlay}`);
  
  // Add optional parameters
  if (title !== undefined) params.push(`title=${title}`);
  if (poster !== undefined) params.push(`poster=${poster}`);
  if (startAt !== undefined) params.push(`startAt=${startAt}`);
  if (theme) params.push(`theme=${theme}`);
  if (server) params.push(`server=${server}`);
  if (hideServer !== undefined) params.push(`hideServer=${hideServer}`);
  if (fullscreenButton !== undefined) params.push(`fullscreenButton=${fullscreenButton}`);
  if (chromecast !== undefined) params.push(`chromecast=${chromecast}`);
  if (sub) params.push(`sub=${sub}`);
  
  // Append parameters if any
  if (params.length > 0) {
    url += `?${params.join('&')}`;
  }
  
  return url;
};

/**
 * Generate VidCore embed URL for TV show episodes
 * @param {string|number} tmdbId - TMDB TV show ID
 * @param {number} season - Season number
 * @param {number} episode - Episode number
 * @param {Object} options - Optional parameters (same as movies)
 * @returns {string} VidCore embed URL
 */
export const getEpisodeEmbedUrl = (tmdbId, season, episode, options = {}) => {
  const {
    title,
    poster,
    autoPlay = true,
    startAt,
    theme,
    server,
    hideServer,
    fullscreenButton,
    chromecast,
    sub
  } = options;
  
  let url = `https://vidcore.org/embed/tv/${tmdbId}/${season}/${episode}`;
  const params = [];
  
  // Add autoPlay by default
  params.push(`autoPlay=${autoPlay}`);
  
  // Add optional parameters
  if (title !== undefined) params.push(`title=${title}`);
  if (poster !== undefined) params.push(`poster=${poster}`);
  if (startAt !== undefined) params.push(`startAt=${startAt}`);
  if (theme) params.push(`theme=${theme}`);
  if (server) params.push(`server=${server}`);
  if (hideServer !== undefined) params.push(`hideServer=${hideServer}`);
  if (fullscreenButton !== undefined) params.push(`fullscreenButton=${fullscreenButton}`);
  if (chromecast !== undefined) params.push(`chromecast=${chromecast}`);
  if (sub) params.push(`sub=${sub}`);
  
  // Append parameters if any
  if (params.length > 0) {
    url += `?${params.join('&')}`;
  }
  
  return url;
};

/**
 * Generate VidCore embed URL for TV show (general, without specific episode)
 * Note: VidCore requires season and episode, so this will default to S1E1
 * @param {string|number} tmdbId - TMDB TV show ID
 * @param {Object} options - Optional parameters
 * @returns {string} VidCore embed URL
 */
export const getTVShowEmbedUrl = (tmdbId, options = {}) => {
  // VidCore requires season and episode, so default to S1E1
  return getEpisodeEmbedUrl(tmdbId, 1, 1, options);
};

/**
 * Example usage:
 * 
 * // Movie
 * const movieUrl = getMovieEmbedUrl(533535, {
 *   autoPlay: true,
 *   theme: 'FF0000',
 *   sub: 'en'
 * });
 * // Result: https://vidcore.org/embed/movie/533535?autoPlay=true&theme=FF0000&sub=en
 * 
 * // TV Show Episode
 * const episodeUrl = getEpisodeEmbedUrl(1396, 1, 1, {
 *   autoPlay: true,
 *   sub: 'en'
 * });
 * // Result: https://vidcore.org/embed/tv/1396/1/1?autoPlay=true&sub=en
 */

export default {
  getMovieEmbedUrl,
  getEpisodeEmbedUrl,
  getTVShowEmbedUrl
};
