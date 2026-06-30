import { useState, useEffect } from 'react';
import Hero from '../components/Hero';
import MovieRow from '../components/MovieRow';
import {
  getPopular,
  getTopRated,
  getByGenre,
  getByLanguage,
  GENRES,
} from '../services/tmdb';
import './Movies.css';

const Movies = () => {
  const [popularMovies, setPopularMovies] = useState([]);
  const [topRatedMovies, setTopRatedMovies] = useState([]);
  const [actionMovies, setActionMovies] = useState([]);
  const [adventureMovies, setAdventureMovies] = useState([]);
  const [comedyMovies, setComedyMovies] = useState([]);
  const [animationMovies, setAnimationMovies] = useState([]);
  const [horrorMovies, setHorrorMovies] = useState([]);
  const [romanceMovies, setRomanceMovies] = useState([]);
  const [sciFiMovies, setSciFiMovies] = useState([]);
  const [thrillerMovies, setThrillerMovies] = useState([]);
  const [hindiMovies, setHindiMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const [
          popular,
          topRated,
          action,
          adventure,
          comedy,
          animation,
          horror,
          romance,
          sciFi,
          thriller,
          hindi,
        ] = await Promise.all([
          getPopular('movie'),
          getTopRated('movie'),
          getByGenre(GENRES.ACTION),
          getByGenre(GENRES.ADVENTURE),
          getByGenre(GENRES.COMEDY),
          getByGenre(GENRES.ANIMATION),
          getByGenre(GENRES.HORROR),
          getByGenre(GENRES.ROMANCE),
          getByGenre(GENRES.SCIENCE_FICTION),
          getByGenre(GENRES.THRILLER),
          getByLanguage('hi'),
        ]);

        setPopularMovies(popular.results);
        setTopRatedMovies(topRated.results);
        setActionMovies(action.results);
        setAdventureMovies(adventure.results);
        setComedyMovies(comedy.results);
        setAnimationMovies(animation.results);
        setHorrorMovies(horror.results);
        setRomanceMovies(romance.results);
        setSciFiMovies(sciFi.results);
        setThrillerMovies(thriller.results);
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
      <div className="movies-loading">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="movies-page">
      <Hero items={topRatedMovies} mediaType="movie" />
      <div className="movies-content">
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
        {animationMovies.length > 0 && (
          <MovieRow 
            title="Animation Movies" 
            movies={animationMovies}
            mediaType="movie"
            categoryType="genre"
            categoryId={GENRES.ANIMATION}
          />
        )}
        {sciFiMovies.length > 0 && (
          <MovieRow 
            title="Sci-Fi Movies" 
            movies={sciFiMovies}
            mediaType="movie"
            categoryType="genre"
            categoryId={GENRES.SCIENCE_FICTION}
          />
        )}
        {thrillerMovies.length > 0 && (
          <MovieRow 
            title="Thriller Movies" 
            movies={thrillerMovies}
            mediaType="movie"
            categoryType="genre"
            categoryId={GENRES.THRILLER}
          />
        )}
        {horrorMovies.length > 0 && (
          <MovieRow 
            title="Horror Movies" 
            movies={horrorMovies}
            mediaType="movie"
            categoryType="genre"
            categoryId={GENRES.HORROR}
          />
        )}
        {romanceMovies.length > 0 && (
          <MovieRow 
            title="Romance Movies" 
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

export default Movies;
