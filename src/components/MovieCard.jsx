import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getImageUrl } from '../services/tmdb';
import { addToWatchlist, removeFromWatchlist, checkInWatchlist } from '../services/watchlist';
import { useAuth } from '../context/AuthContextFirebase';
import './MovieCard.css';

const MovieCard = ({ movie, mediaType = 'movie', id, title: propTitle, poster, type: propType, showWatchlistButton = true, rating: propRating, year: propYear }) => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [inWatchlist, setInWatchlist] = useState(false);
  const [watchlistLoading, setWatchlistLoading] = useState(false);
  
  // Support both old and new prop styles
  const itemId = id || movie?.id;
  const type = propType || movie?.media_type || mediaType;
  const title = propTitle || movie?.title || movie?.name;
  const releaseDate = movie?.release_date || movie?.first_air_date;
  const year = propYear || (releaseDate ? releaseDate.slice(0, 4) : null);
  const rating = propRating || (movie?.vote_average ? movie.vote_average.toFixed(1) : null);
  
  const posterPath = poster || movie?.poster_path;
  const posterUrl = posterPath
    ? getImageUrl(posterPath, 'w500')
    : 'https://via.placeholder.com/500x750?text=No+Image';

  useEffect(() => {
    if (isAuthenticated && showWatchlistButton && itemId && user) {
      checkStatus();
      
      // Listen for watchlist updates from other components
      const handleWatchlistUpdate = (event) => {
        const { mediaId, mediaType, action } = event.detail;
        // Convert both to strings for comparison
        if (String(mediaId) === String(itemId) && mediaType === type) {
          setInWatchlist(action === 'added');
        }
      };
      
      // Re-check when page becomes visible (user returns from detail page)
      const handleVisibilityChange = () => {
        if (!document.hidden && isAuthenticated && user) {
          checkStatus();
        }
      };
      
      window.addEventListener('watchlistUpdated', handleWatchlistUpdate);
      document.addEventListener('visibilitychange', handleVisibilityChange);
      
      return () => {
        window.removeEventListener('watchlistUpdated', handleWatchlistUpdate);
        document.removeEventListener('visibilitychange', handleVisibilityChange);
      };
    }
  }, [isAuthenticated, itemId, type, user, showWatchlistButton]);

  const checkStatus = async () => {
    if (user && itemId) {
      const status = await checkInWatchlist(user.id, type, itemId);
      setInWatchlist(status);
    }
  };

  const handleWatchlistToggle = async (e) => {
    e.stopPropagation();
    
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    setWatchlistLoading(true);
    
    if (inWatchlist) {
      const result = await removeFromWatchlist(user.id, type, itemId);
      if (result.success) {
        setInWatchlist(false);
        // Dispatch custom event to notify other components
        window.dispatchEvent(new CustomEvent('watchlistUpdated', { 
          detail: { mediaId: itemId, mediaType: type, action: 'removed' } 
        }));
      }
    } else {
      const result = await addToWatchlist(user.id, {
        mediaType: type,
        mediaId: itemId,
        title: title,
        posterPath: posterPath
      });
      if (result.success) {
        setInWatchlist(true);
        // Dispatch custom event to notify other components
        window.dispatchEvent(new CustomEvent('watchlistUpdated', { 
          detail: { mediaId: itemId, mediaType: type, action: 'added' } 
        }));
      }
    }
    
    setWatchlistLoading(false);
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
          {rating && (
            <div className="movie-card-info">
              <div className="rating">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
                {rating}
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="movie-card-details">
        <h3 className="movie-card-title">{title}</h3>
        {year && <p className="movie-card-year">{year}</p>}
      </div>
    </div>
  );
};

export default MovieCard;
