export const getMovieEmbedUrl = (tmdbId, options = {}) => {
  const { ds_lang, sub_url, autoplay = 1 } = options;
  
  let url = `https://vidsrc-embed.ru/embed/movie?tmdb=${tmdbId}`;
  
  if (ds_lang) {
    url += `&ds_lang=${ds_lang}`;
  }
  
  if (sub_url) {
    url += `&sub_url=${encodeURIComponent(sub_url)}`;
  }
  
  url += `&autoplay=${autoplay}`;
  
  return url;
};

export const getTVShowEmbedUrl = (tmdbId, options = {}) => {
  const { ds_lang, autoplay = 1 } = options;
  
  let url = `https://vidsrc-embed.ru/embed/tv?tmdb=${tmdbId}`;
  
  if (ds_lang) {
    url += `&ds_lang=${ds_lang}`;
  }
  
  url += `&autoplay=${autoplay}`;
  
  return url;
};

export const getEpisodeEmbedUrl = (tmdbId, season, episode, options = {}) => {
  const { ds_lang, sub_url, autoplay = 1, autonext = 0 } = options;
  
  let url = `https://vidsrc-embed.ru/embed/tv?tmdb=${tmdbId}&season=${season}&episode=${episode}`;
  
  if (ds_lang) {
    url += `&ds_lang=${ds_lang}`;
  }
  
  if (sub_url) {
    url += `&sub_url=${encodeURIComponent(sub_url)}`;
  }
  
  url += `&autoplay=${autoplay}&autonext=${autonext}`;
  
  return url;
};

export const getLatestMovies = async (page = 1) => {
  const response = await fetch(`https://vidsrc-embed.ru/movies/latest/page-${page}.json`);
  return response.json();
};

export const getLatestTVShows = async (page = 1) => {
  const response = await fetch(`https://vidsrc-embed.ru/tvshows/latest/page-${page}.json`);
  return response.json();
};

export const getLatestEpisodes = async (page = 1) => {
  const response = await fetch(`https://vidsrc-embed.ru/episodes/latest/page-${page}.json`);
  return response.json();
};
