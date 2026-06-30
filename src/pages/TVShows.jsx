import { useState, useEffect } from 'react';
import Hero from '../components/Hero';
import MovieRow from '../components/MovieRow';
import {
  getTrending,
  getPopular,
  getTopRated,
  getByGenre,
  GENRES,
} from '../services/tmdb';
import './TVShows.css';

const TVShows = () => {
  const [trendingShows, setTrendingShows] = useState([]);
  const [popularShows, setPopularShows] = useState([]);
  const [topRatedShows, setTopRatedShows] = useState([]);
  const [actionShows, setActionShows] = useState([]);
  const [comedyShows, setComedyShows] = useState([]);
  const [dramaShows, setDramaShows] = useState([]);
  const [sciFiShows, setSciFiShows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchShows = async () => {
      try {
        const [
          trending,
          popular,
          topRated,
          action,
          comedy,
          drama,
          sciFi,
        ] = await Promise.all([
          getTrending('tv', 'week'),
          getPopular('tv'),
          getTopRated('tv'),
          getByGenre(GENRES.ACTION, 'tv'),
          getByGenre(GENRES.COMEDY, 'tv'),
          getByGenre(GENRES.DRAMA, 'tv'),
          getByGenre(GENRES.SCIENCE_FICTION, 'tv'),
        ]);

        setTrendingShows(trending.results);
        setPopularShows(popular.results);
        setTopRatedShows(topRated.results);
        setActionShows(action.results);
        setComedyShows(comedy.results);
        setDramaShows(drama.results);
        setSciFiShows(sciFi.results);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching TV shows:', error);
        setLoading(false);
      }
    };

    fetchShows();
  }, []);

  if (loading) {
    return (
      <div className="tv-loading">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="tv-page">
      <Hero items={topRatedShows} mediaType="tv" />
      <div className="tv-content">
        {trendingShows.length > 0 && (
          <MovieRow 
            title="Trending TV Shows" 
            movies={trendingShows} 
            mediaType="tv"
            categoryType="trending"
            categoryId="trending"
          />
        )}
        {popularShows.length > 0 && (
          <MovieRow 
            title="Popular TV Shows" 
            movies={popularShows} 
            mediaType="tv"
            categoryType="popular"
            categoryId="popular"
          />
        )}
        {topRatedShows.length > 0 && (
          <MovieRow 
            title="Top Rated TV Shows" 
            movies={topRatedShows} 
            mediaType="tv"
            categoryType="top_rated"
            categoryId="top_rated"
          />
        )}
        {actionShows.length > 0 && (
          <MovieRow 
            title="Action & Adventure" 
            movies={actionShows} 
            mediaType="tv"
            categoryType="genre"
            categoryId={GENRES.ACTION}
          />
        )}
        {comedyShows.length > 0 && (
          <MovieRow 
            title="Comedy Shows" 
            movies={comedyShows} 
            mediaType="tv"
            categoryType="genre"
            categoryId={GENRES.COMEDY}
          />
        )}
        {dramaShows.length > 0 && (
          <MovieRow 
            title="Drama Shows" 
            movies={dramaShows} 
            mediaType="tv"
            categoryType="genre"
            categoryId={GENRES.DRAMA}
          />
        )}
        {sciFiShows.length > 0 && (
          <MovieRow 
            title="Sci-Fi & Fantasy" 
            movies={sciFiShows} 
            mediaType="tv"
            categoryType="genre"
            categoryId={GENRES.SCIENCE_FICTION}
          />
        )}
      </div>
    </div>
  );
};

export default TVShows;
