import { useState, useEffect } from 'react';
import Hero from '../components/Hero';
import MovieRow from '../components/MovieRow';
import {
  getTrending,
  getPopular,
  getTopRated,
  getByGenre,
  getByLanguage,
  GENRES,
} from '../services/tmdb';
import './Home.css';

const Home = () => {
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [popularMovies, setPopularMovies] = useState([]);
  const [topRatedMovies, setTopRatedMovies] = useState([]);
  const [topRatedShows, setTopRatedShows] = useState([]);
  const [popularShows, setPopularShows] = useState([]);
  const [comedyShows, setComedyShows] = useState([]);
  const [dramaShows, setDramaShows] = useState([]);
  const [sciFiShows, setSciFiShows] = useState([]);
  const [heroItems, setHeroItems] = useState([]);
  const [actionMovies, setActionMovies] = useState([]);
  const [adventureMovies, setAdventureMovies] = useState([]);
  const [comedyMovies, setComedyMovies] = useState([]);
  const [animationMovies, setAnimationMovies] = useState([]);
  const [horrorMovies, setHorrorMovies] = useState([]);
  const [romanceMovies, setRomanceMovies] = useState([]);
  const [hindiMovies, setHindiMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const [
          trending,
          popular,
          topRatedMoviesData,
          topRatedShowsData,
          popularShowsData,
          comedyShowsData,
          dramaShowsData,
          sciFiShowsData,
          action,
          adventure,
          comedy,
          animation,
          horror,
          romance,
          hindi,
        ] = await Promise.all([
          getTrending('movie', 'week'),
          getPopular('movie'),
          getTopRated('movie'),
          getTopRated('tv'),
          getPopular('tv'),
          getByGenre(GENRES.COMEDY, 'tv'),
          getByGenre(GENRES.DRAMA, 'tv'),
          getByGenre(GENRES.SCIENCE_FICTION, 'tv'),
          getByGenre(GENRES.ACTION),
          getByGenre(GENRES.ADVENTURE),
          getByGenre(GENRES.COMEDY),
          getByGenre(GENRES.ANIMATION),
          getByGenre(GENRES.HORROR),
          getByGenre(GENRES.ROMANCE),
          getByLanguage('hi'),
        ]);

        setTrendingMovies(trending.results);
        setPopularMovies(popular.results);
        setTopRatedMovies(topRatedMoviesData.results);
        setTopRatedShows(topRatedShowsData.results);
        setPopularShows(popularShowsData.results);
        setComedyShows(comedyShowsData.results);
        setDramaShows(dramaShowsData.results);
        setSciFiShows(sciFiShowsData.results);
        
        const mixedTopRated = [
          ...topRatedMoviesData.results.slice(0, 5).map(item => ({ ...item, media_type: 'movie' })),
          ...topRatedShowsData.results.slice(0, 5).map(item => ({ ...item, media_type: 'tv' }))
        ].sort(() => Math.random() - 0.5);
        
        setHeroItems(mixedTopRated);
        setActionMovies(action.results);
        setAdventureMovies(adventure.results);
        setComedyMovies(comedy.results);
        setAnimationMovies(animation.results);
        setHorrorMovies(horror.results);
        setRomanceMovies(romance.results);
        setHindiMovies(hindi.results);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching movies:', error);
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  if (loading) {
    return (
      <div className="home-loading">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="home">
      <Hero items={heroItems} />
      <div className="home-content">
        {popularMovies.length > 0 && (
          <MovieRow 
            title="Popular Movies" 
            movies={popularMovies} 
            mediaType="movie"
            categoryType="popular"
            categoryId="popular"
          />
        )}
        {topRatedMovies.length > 0 && (
          <MovieRow 
            title="Top Rated Movies" 
            movies={topRatedMovies}
            mediaType="movie"
            categoryType="top_rated"
            categoryId="top_rated"
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
        {popularShows.length > 0 && (
          <MovieRow 
            title="Popular TV Shows" 
            movies={popularShows} 
            mediaType="tv"
            categoryType="popular"
            categoryId="popular"
          />
        )}
        {actionMovies.length > 0 && (
          <MovieRow 
            title="Action Movies" 
            movies={actionMovies}
            mediaType="movie"
            categoryType="genre"
            categoryId={GENRES.ACTION}
          />
        )}
        {adventureMovies.length > 0 && (
          <MovieRow 
            title="Adventure Movies" 
            movies={adventureMovies}
            mediaType="movie"
            categoryType="genre"
            categoryId={GENRES.ADVENTURE}
          />
        )}
        {comedyMovies.length > 0 && (
          <MovieRow 
            title="Comedy Movies" 
            movies={comedyMovies}
            mediaType="movie"
            categoryType="genre"
            categoryId={GENRES.COMEDY}
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
        {animationMovies.length > 0 && (
          <MovieRow 
            title="Animation" 
            movies={animationMovies}
            mediaType="movie"
            categoryType="genre"
            categoryId={GENRES.ANIMATION}
          />
        )}
        {horrorMovies.length > 0 && (
          <MovieRow 
            title="Horror" 
            movies={horrorMovies}
            mediaType="movie"
            categoryType="genre"
            categoryId={GENRES.HORROR}
          />
        )}
        {romanceMovies.length > 0 && (
          <MovieRow 
            title="Romance" 
            movies={romanceMovies}
            mediaType="movie"
            categoryType="genre"
            categoryId={GENRES.ROMANCE}
          />
        )}
        {hindiMovies.length > 0 && (
          <MovieRow 
            title="Hindi Movies" 
            movies={hindiMovies}
            mediaType="movie"
            categoryType="language"
            categoryId="hi"
          />
        )}
      </div>
    </div>
  );
};

export default Home;
