import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MovieCard from './MovieCard';
import './MovieRow.css';

const MovieRow = ({ title, movies, mediaType = 'movie', categoryId, categoryType }) => {
  const navigate = useNavigate();
  const rowRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const scroll = (direction) => {
    if (rowRef.current) {
      const scrollAmount = 800;
      const newScrollPosition =
        direction === 'left'
          ? rowRef.current.scrollLeft - scrollAmount
          : rowRef.current.scrollLeft + scrollAmount;

      rowRef.current.scrollTo({
        left: newScrollPosition,
        behavior: 'smooth',
      });

      setTimeout(() => {
        checkScroll();
      }, 300);
    }
  };

  const checkScroll = () => {
    if (rowRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = rowRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const handleViewMore = () => {
    if (categoryId && categoryType) {
      navigate(`/category/${mediaType}/${categoryType}/${categoryId}`, {
        state: { title }
      });
    }
  };

  return (
    <div className="movie-row">
      <div className="row-header">
        <h2 className="row-title">{title}</h2>
        {categoryId && categoryType && (
          <button className="view-more-btn" onClick={handleViewMore}>
            View More
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M8.59 16.59L10 18l6-6-6-6-1.41 1.41L13.17 12z" />
            </svg>
          </button>
        )}
      </div>
      <div className="row-container">
        {showLeftArrow && (
          <button
            className="row-arrow row-arrow-left"
            onClick={() => scroll('left')}
          >
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
            </svg>
          </button>
        )}

        <div
          className="row-posters"
          ref={rowRef}
          onScroll={checkScroll}
        >
          {movies.map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              mediaType={mediaType}
            />
          ))}
        </div>

        {showRightArrow && (
          <button
            className="row-arrow row-arrow-right"
            onClick={() => scroll('right')}
          >
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M8.59 16.59L10 18l6-6-6-6-1.41 1.41L13.17 12z" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

export default MovieRow;
