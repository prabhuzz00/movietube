import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getWatchlist, removeFromWatchlistById } from '../services/watchlist';
import { useAuth } from '../context/AuthContextFirebase';
import MovieCard from '../components/MovieCard';
import './Watchlist.css';

const Watchlist = () => {
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Wait for auth to finish loading before checking authentication
    if (authLoading) {
      return;
    }

    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (user) {
      fetchWatchlist();
    }
    
    // Listen for watchlist updates from other components
    const handleWatchlistUpdate = () => {
      if (user) {
        fetchWatchlist();
      }
    };
    
    window.addEventListener('watchlistUpdated', handleWatchlistUpdate);
    
    return () => {
      window.removeEventListener('watchlistUpdated', handleWatchlistUpdate);
    };
  }, [isAuthenticated, authLoading, navigate, user]);

  const fetchWatchlist = async () => {
    if (!user) return;
    
    setLoading(true);
    const result = await getWatchlist(user.id);
    
    if (result.success) {
      setWatchlist(result.watchlist);
      setError(null);
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  const handleRemove = async (docId) => {
    const result = await removeFromWatchlistById(docId);
    if (result.success) {
      setWatchlist(watchlist.filter(item => item.id !== docId));
    }
  };

  if (authLoading || loading) {
    return (
      <div className="watchlist-container">
        <div className="watchlist-loading">
          <div className="spinner"></div>
          <p>Loading your watchlist...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="watchlist-container">
      <div className="watchlist-header">
        <h1>My Watchlist</h1>
        <p className="watchlist-count">
          {watchlist.length} {watchlist.length === 1 ? 'item' : 'items'}
        </p>
      </div>

      {error && (
        <div className="watchlist-error">
          {error}
        </div>
      )}

      {watchlist.length === 0 ? (
        <div className="watchlist-empty">
          <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
          </svg>
          <h2>Your watchlist is empty</h2>
          <p>Start adding movies and TV shows to keep track of what you want to watch!</p>
          <button onClick={() => navigate('/')} className="browse-button">
            Browse Content
          </button>
        </div>
      ) : (
        <div className="watchlist-grid">
          {watchlist.map((item) => (
            <div key={item.id} className="watchlist-item">
              <MovieCard
                id={item.mediaId}
                title={item.title}
                poster={item.posterPath}
                type={item.mediaType}
                showWatchlistButton={false}
              />
              {/* <button
                className="remove-button"
                onClick={() => handleRemove(item.id)}
                title="Remove from watchlist"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
                Remove
              </button> */}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Watchlist;
