import { useNavigate } from 'react-router-dom';
import { getImageUrl } from '../services/tmdb';
import './MovieCard.css';

const MovieCard = ({ movie, mediaType = 'movie' }) => {
  const navigate = useNavigate();
  
  const type = movie.media_type || mediaType;
  const title = movie.title || movie.name;
  const releaseDate = movie.release_date || movie.first_air_date;
  const year = releaseDate ? releaseDate.slice(0, 4) : 'N/A';
  const rating = movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A';
  
  const posterUrl = movie.poster_path
    ? getImageUrl(movie.poster_path, 'w500')
    : 'https://via.placeholder.com/500x750?text=No+Image';

  const handleClick = () => {
    navigate(`/${type}/${movie.id}`);
  };

  return (
    <div className="movie-card" onClick={handleClick}>
      <div className="movie-card-image">
        <img src={posterUrl} alt={title} loading="lazy" />
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
