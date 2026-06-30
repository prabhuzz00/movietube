import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { getTrending, getPopular, getTopRated, getByGenre, getByLanguage } from '../services/tmdb';
import MovieCard from '../components/MovieCard';
import './CategoryPage.css';

const CategoryPage = () => {
  const { mediaType, categoryType, categoryId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const observerTarget = useRef(null);
  
  const title = location.state?.title || 'Movies';

  useEffect(() => {
    setMovies([]);
    setPage(1);
    setHasMore(true);
    fetchMovies(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mediaType, categoryType, categoryId]);

  const fetchMovies = useCallback(async (pageNum) => {
    if (loadingMore) return; // Prevent multiple simultaneous requests
    
    try {
      if (pageNum === 1) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      let data;
      
      switch (categoryType) {
        case 'trending':
          data = await getTrending(mediaType, 'week', pageNum);
          break;
        case 'popular':
          data = await getPopular(mediaType, pageNum);
          break;
        case 'top_rated':
          data = await getTopRated(mediaType, pageNum);
          break;
        case 'genre':
          data = await getByGenre(categoryId, mediaType, pageNum);
          break;
        case 'language':
          data = await getByLanguage(categoryId, mediaType, pageNum);
          break;
        default:
          data = { results: [] };
      }

      if (pageNum === 1) {
        setMovies(data.results || []);
      } else {
        // Filter out duplicates by checking IDs
        const existingIds = new Set(movies.map(m => m.id));
        const newMovies = (data.results || []).filter(m => !existingIds.has(m.id));
        setMovies(prev => [...prev, ...newMovies]);
      }

      setHasMore((data.page || 1) < (data.total_pages || 1));
      setPage(pageNum);
    } catch (error) {
      console.error('Error fetching category movies:', error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [mediaType, categoryType, categoryId, loadingMore, movies]);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loadingMore && !loading) {
          fetchMovies(page + 1);
        }
      },
      {
        threshold: 0.1,
        rootMargin: '100px' // Start loading 100px before reaching the bottom
      }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [hasMore, loadingMore, loading, page, fetchMovies]);

  if (loading) {
    return (
      <div className="category-page">
        <div className="category-loading">
          <div className="loading-spinner"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="category-page">
      <div className="category-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
          </svg>
          Back
        </button>
        <h1 className="category-title">{title}</h1>
        <div className="category-info">
          <span className="media-type-badge">{mediaType === 'movie' ? 'Movies' : 'TV Shows'}</span>
          <span className="results-count">{movies.length} items</span>
        </div>
      </div>

      <div className="category-grid">
        {movies.map((movie, index) => (
          <MovieCard
            key={`${movie.id}-${index}`}
            movie={movie}
            mediaType={mediaType}
          />
        ))}
      </div>

      {/* Intersection Observer Target */}
      {hasMore && (
        <div ref={observerTarget} className="load-more-trigger">
          {loadingMore && (
            <div className="loading-more">
              <div className="loading-spinner"></div>
              <p>Loading more...</p>
            </div>
          )}
        </div>
      )}

      {!hasMore && movies.length > 0 && (
        <div className="end-message">
          <p>You've reached the end</p>
        </div>
      )}
    </div>
  );
};

export default CategoryPage;
