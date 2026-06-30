import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getImageUrl } from '../services/tmdb';
import './Hero.css';

const Hero = ({ items = [], mediaType = 'movie' }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (items.length <= 1) return;

    const interval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % items.length);
        setIsTransitioning(false);
      }, 500);
    }, 5000);

    return () => clearInterval(interval);
  }, [items.length]);

  const handleDotClick = (index) => {
    if (index !== currentIndex && !isTransitioning) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentIndex(index);
        setIsTransitioning(false);
      }, 500);
    }
  };

  if (!items || items.length === 0) {
    return (
      <div className="hero-loading">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  const currentItem = items[currentIndex];
  const backdropUrl = currentItem.backdrop_path
    ? getImageUrl(currentItem.backdrop_path, 'original')
    : getImageUrl(currentItem.poster_path, 'original');

  const title = currentItem.title || currentItem.name;
  const description = currentItem.overview;
  const rating = currentItem.vote_average ? currentItem.vote_average.toFixed(1) : 'N/A';
  const itemMediaType = currentItem.media_type || mediaType;

  const handlePlay = () => {
    navigate(`/${itemMediaType}/${currentItem.id}`);
  };

  return (
    <div className="hero">
      <div 
        className={`hero-background ${isTransitioning ? 'fade-out' : 'fade-in'}`}
        style={{ backgroundImage: `url(${backdropUrl})` }}
      />
      <div className="hero-overlay">
        <div className={`hero-content ${isTransitioning ? 'fade-out' : 'fade-in'}`}>
          <h1 className="hero-title">{title}</h1>
          <div className="hero-meta">
            <span className="hero-rating">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
              {rating}
            </span>
            <span className="hero-type">{itemMediaType === 'tv' ? 'TV Show' : 'Movie'}</span>
          </div>
          <p className="hero-description">{description}</p>
          <div className="hero-buttons">
            <button className="hero-button play" onClick={handlePlay}>
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z" />
              </svg>
              Play
            </button>
            <button className="hero-button info" onClick={handlePlay}>
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M11 7h2v2h-2zm0 4h2v6h-2zm1-9C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
              </svg>
              More Info
            </button>
          </div>
        </div>
        
        {items.length > 1 && (
          <div className="hero-indicators">
            {items.slice(0, 10).map((_, index) => (
              <button
                key={index}
                className={`hero-dot ${index === currentIndex ? 'active' : ''}`}
                onClick={() => handleDotClick(index)}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Hero;
