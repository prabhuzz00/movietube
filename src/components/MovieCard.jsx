import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getImageUrl } from '../services/tmdb';
import { watchlistAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import './MovieCard.css';

const MovieCard = ({ movie, mediaType = 'movie', id, title: propTitle, poster, type: propType, showWatchlistButton = true }) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [inWatchlist, setInWatchlist] = useState(false);
  const [watchlistLoading, setWatchlistLoading] = useState(false);
  
  // Support both old and new prop styles
  const itemId = id || movie?.id;
  const type = propType || movie?.media_type || mediaType;
  const title = propTitle || movie?.title || movie?.name;
  const releaseDate = movie?.release_date || movie?.first_air_date;
  const year = releaseDate ? releaseDate.slice(0, 4) : 'N/A';
  const rating = movie?.vote_average ? movie.vote_average.toFixed(1) : 'N/A';
  
  const posterUrl = poster || (movie?.poster_path
    ? getImageUrl(movie.poster_path, 'w500')
    : 'https://via.placeholder.com/500x750?text=No+Image');

  useEffect(() => {
    if (isAuthenticated && showWatchlistButton && itemId) {
      checkWatchlistStatus();
    }
  }, [isAuthenticated, itemId, type]);

  const checkWatchlistStatus = async () => {
    try {
      const status = await watchlistAPI.checkInWatchlist(type, itemId);
      setInWatchlist(status);
    } catch (err) {
      console.error('Error checking watchlist status:', err);
    }
  };

  const handleWatchlistToggle = async (e) => {
    e.stopPropagation();
    
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    setWatchlistLoading(true);
    try {
      if (inWatchlist) {
        await watchlistAPI.removeFromWatchlist(type, itemId);
        setInWatchlist(false);
      } else {
        await watchlistAPI.addToWatchlist(type, itemId, title, poster || movie?.poster_path);
        setInWatchlist(true);
      }
    } catch (err) {
      console.error('Error toggling watchlist:', err);
    } finally {
      setWatchlistLoading(false);
    }
  };

  const handleClick = () => {
    navigate(`/${type}/${itemId}`);
  };

  return (
    <div className="movie-card" onClick={handleClick}>
      <div className="movie-card-image">
        <img src={posterUrl} alt={title} loading="lazy" />
        {showWatchlistButton && (
          <button
            className={`watchlist-btn ${inWatchlist ? 'in-watchlist' : ''}`}
            onClick={handleWatchlistToggle}
            disabled={watchlistLoading}
            title={inWatchlist ? 'Remove from watchlist' : 'Add to watchlist'}
          >
            <svg viewBox="0 0 24 24" fill={inWatchlist ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
            </svg>
          </button>
        )}
        <div className="movie-card-overlay">
          <button className="play-button">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z" />
            </svg>
          </button>
          <div className="movie-card-info">
            <div className="rating">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
              {rating}
            </div>
          </div>
        </div>
      </div>
      <div className="movie-card-details">
        <h3 className="movie-card-title">{title}</h3>
        <p className="movie-card-year">{year}</p>
      </div>
    </div>
  );
};

export default MovieCard;
