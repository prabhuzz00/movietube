import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getMovieDetails, getTVDetails, getImageUrl } from '../services/tmdb';
import { getMovieEmbedUrl, getTVShowEmbedUrl, getEpisodeEmbedUrl } from '../services/twoembed';
import { addToWatchlist, removeFromWatchlist, checkInWatchlist } from '../services/watchlist';
import { useAuth } from '../context/AuthContextFirebase';
import MovieRow from '../components/MovieRow';
import Season from '../components/Season';
import './MovieDetail.css';

const MovieDetail = () => {
  const { type, id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showPlayer, setShowPlayer] = useState(false);
  const [currentEpisode, setCurrentEpisode] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [inWatchlist, setInWatchlist] = useState(false);
  const [watchlistLoading, setWatchlistLoading] = useState(false);
  const playerModalRef = useRef(null);

  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
      try {
        const data =
          type === 'tv' ? await getTVDetails(id) : await getMovieDetails(id);
        setDetails(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching details:', error);
        setLoading(false);
      }
    };

    fetchDetails();
    window.scrollTo(0, 0);
    
    // Reset watchlist state when navigating to new content
    setInWatchlist(false);
  }, [type, id]);

  // Check watchlist status
  useEffect(() => {
    const checkStatus = async () => {
      if (isAuthenticated && user && id) {
        // Small delay to ensure Firebase write completes
        await new Promise(resolve => setTimeout(resolve, 100));
        const status = await checkInWatchlist(user.id, type, id);
        setInWatchlist(status);
      }
    };
    
    checkStatus();
    
    // Listen for watchlist updates from other components
    const handleWatchlistUpdate = (event) => {
      const { mediaId, mediaType, action } = event.detail;
      // Convert both to strings for comparison
      if (String(mediaId) === String(id) && mediaType === type) {
        setInWatchlist(action === 'added');
      }
    };
    
    // Re-check when page becomes visible (user returns from another tab/page)
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        checkStatus();
      }
    };
    
    // Re-check when window gains focus
    const handleFocus = () => {
      checkStatus();
    };
    
    window.addEventListener('watchlistUpdated', handleWatchlistUpdate);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);
    
    return () => {
      window.removeEventListener('watchlistUpdated', handleWatchlistUpdate);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
    };
  }, [isAuthenticated, user, id, type]);

  useEffect(() => {
    const requestFullscreen = async () => {
      if (showPlayer && playerModalRef.current && !isFullscreen) {
        try {
          if (playerModalRef.current.requestFullscreen) {
            await playerModalRef.current.requestFullscreen();
          } else if (playerModalRef.current.webkitRequestFullscreen) {
            await playerModalRef.current.webkitRequestFullscreen();
          } else if (playerModalRef.current.mozRequestFullScreen) {
            await playerModalRef.current.mozRequestFullScreen();
          } else if (playerModalRef.current.msRequestFullscreen) {
            await playerModalRef.current.msRequestFullscreen();
          }
          setIsFullscreen(true);
        } catch (error) {
          // Fullscreen request failed
        }
      }
    };

    requestFullscreen();
  }, [showPlayer, isFullscreen]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      const isCurrentlyFullscreen = !!(
        document.fullscreenElement ||
        document.webkitFullscreenElement ||
        document.mozFullScreenElement ||
        document.msFullscreenElement
      );
      
      if (!isCurrentlyFullscreen && isFullscreen) {
        setIsFullscreen(false);
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
    };
  }, [isFullscreen]);

  if (loading) {
    return (
      <div className="detail-loading">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (!details) {
    return (
      <div className="detail-error">
        <h2>Content not found</h2>
        <button onClick={() => navigate('/')}>Go Home</button>
      </div>
    );
  }

  const title = details.title || details.name;
  const releaseDate = details.release_date || details.first_air_date;
  const year = releaseDate ? releaseDate.slice(0, 4) : 'N/A';
  const runtime = details.runtime || details.episode_run_time?.[0];
  const rating = details.vote_average ? details.vote_average.toFixed(1) : 'N/A';

  const backdropUrl = details.backdrop_path
    ? getImageUrl(details.backdrop_path, 'original')
    : getImageUrl(details.poster_path, 'original');

  const posterUrl = details.poster_path
    ? getImageUrl(details.poster_path, 'w500')
    : null;

  const trailer = details.videos?.results?.find(
    (video) => video.type === 'Trailer' && video.site === 'YouTube'
  );

  const getEmbedUrl = () => {
    if (type === 'movie') {
      return getMovieEmbedUrl(id);
    } else {
      if (currentEpisode) {
        return getEpisodeEmbedUrl(
          id,
          currentEpisode.season,
          currentEpisode.episode
          // ,
          // { autonext: 1 }
        );
      }
      return getTVShowEmbedUrl(id);
    }
  };

  const embedUrl = getEmbedUrl();

  const getNextEpisode = () => {
    if (type !== 'tv' || !currentEpisode || !details.seasons) {
      return null;
    }

    const currentSeason = details.seasons.find(
      (s) => s.season_number === currentEpisode.season
    );
    
    if (!currentSeason) return null;

    const nextEpisodeInSeason = currentEpisode.episode + 1;
    
    if (nextEpisodeInSeason <= currentSeason.episode_count) {
      return {
        season: currentEpisode.season,
        episode: nextEpisodeInSeason,
      };
    }

    const nextSeason = details.seasons.find(
      (s) => s.season_number === currentEpisode.season + 1
    );
    
    if (nextSeason && nextSeason.episode_count > 0) {
      return {
        season: nextSeason.season_number,
        episode: 1,
      };
    }

    return null;
  };

  const nextEpisode = getNextEpisode();

  const handlePlayNextEpisode = () => {
    if (nextEpisode) {
      setCurrentEpisode(nextEpisode);
      setIsFullscreen(false);
    }
  };

  const handlePlayClick = () => {
    setCurrentEpisode(null);
    setShowPlayer(true);
    setIsFullscreen(false);
  };

  const handlePlayEpisode = (season, episode) => {
    setCurrentEpisode({ season, episode });
    setShowPlayer(true);
    setIsFullscreen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleClosePlayer = () => {
    if (document.fullscreenElement) {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
    }
    setShowPlayer(false);
    setCurrentEpisode(null);
    setIsFullscreen(false);
  };

  const handleToggleFullscreen = async () => {
    if (isFullscreen) {
      if (document.exitFullscreen) {
        await document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        await document.webkitExitFullscreen();
      } else if (document.mozCancelFullScreen) {
        await document.mozCancelFullScreen();
      } else if (document.msExitFullscreen) {
        await document.msExitFullscreen();
      }
      setIsFullscreen(false);
    } else {
      if (playerModalRef.current) {
        try {
          if (playerModalRef.current.requestFullscreen) {
            await playerModalRef.current.requestFullscreen();
          } else if (playerModalRef.current.webkitRequestFullscreen) {
            await playerModalRef.current.webkitRequestFullscreen();
          } else if (playerModalRef.current.mozRequestFullScreen) {
            await playerModalRef.current.mozRequestFullScreen();
          } else if (playerModalRef.current.msRequestFullscreen) {
            await playerModalRef.current.msRequestFullscreen();
          }
          setIsFullscreen(true);
        } catch (error) {
          // Fullscreen request failed
        }
      }
    }
  };

  const handleWatchlistToggle = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    setWatchlistLoading(true);
    
    if (inWatchlist) {
      const result = await removeFromWatchlist(user.id, type, id);
      if (result.success) {
        setInWatchlist(false);
        // Dispatch custom event to notify other components
        window.dispatchEvent(new CustomEvent('watchlistUpdated', { 
          detail: { mediaId: id, mediaType: type, action: 'removed' } 
        }));
      }
    } else {
      const result = await addToWatchlist(user.id, {
        mediaType: type,
        mediaId: id,
        title: details?.title || details?.name,
        posterPath: details?.poster_path
      });
      if (result.success) {
        setInWatchlist(true);
        // Dispatch custom event to notify other components
        window.dispatchEvent(new CustomEvent('watchlistUpdated', { 
          detail: { mediaId: id, mediaType: type, action: 'added' } 
        }));
      }
    }
    
    setWatchlistLoading(false);
  };

  return (
    <div className="movie-detail">
      {showPlayer && (
        <div className="player-modal" ref={playerModalRef}>
          <button className="close-player" onClick={handleClosePlayer} title="Close Player">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
            </svg>
          </button>
          {!isFullscreen && (
            <>
              <button 
                className="fullscreen-toggle" 
                onClick={handleToggleFullscreen}
                title="Toggle Fullscreen"
              >
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z" />
                </svg>
              </button>
              {type === 'tv' && nextEpisode && (
                <button 
                  className="next-episode-btn" 
                  onClick={handlePlayNextEpisode}
                  title={`Play S${nextEpisode.season}E${nextEpisode.episode}`}
                >
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
                  </svg>
                  Next Episode
                </button>
              )}
            </>
          )}
          {type === 'tv' && currentEpisode && (
            <div className="episode-info-overlay">
              Season {currentEpisode.season} • Episode {currentEpisode.episode}
            </div>
          )}
          <div className="player-container">
            <iframe
              src={embedUrl}
              style={{ width: '100%', height: '100%' }}
              frameBorder="0"
              referrerPolicy="origin"
              allowFullScreen
              title={title}
            ></iframe>
          </div>
        </div>
      )}

      <div
        className="detail-hero"
        style={{ backgroundImage: `url(${backdropUrl})` }}
      >
        <div className="detail-overlay">
          <div className="detail-content">
            <div className="detail-poster">
              {posterUrl && <img src={posterUrl} alt={title} />}
            </div>

            <div className="detail-info">
              <h1 className="detail-title">{title}</h1>

              <div className="detail-meta">
                <span className="rating">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                  {rating}
                </span>
                <span>{year}</span>
                {runtime && <span>{runtime} min</span>}
                {details.genres && (
                  <span className="genres">
                    {details.genres.slice(0, 3).map((g) => g.name).join(', ')}
                  </span>
                )}
              </div>

              <p className="detail-overview">{details.overview}</p>

              <div className="detail-buttons">
                {type === 'movie' ? (
                  <button className="detail-button play" onClick={handlePlayClick}>
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                    Play Now
                  </button>
                ) : (
                  <button className="detail-button play" onClick={handlePlayClick}>
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                    Play Trailer/First Episode
                  </button>
                )}
                
                <button 
                  className={`detail-button watchlist ${inWatchlist ? 'in-watchlist' : ''}`}
                  onClick={handleWatchlistToggle}
                  disabled={watchlistLoading}
                  title={inWatchlist ? 'Remove from watchlist' : 'Add to watchlist'}
                >
                  <svg viewBox="0 0 24 24" fill={inWatchlist ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
                    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                  </svg>
                  {watchlistLoading ? 'Loading...' : (inWatchlist ? 'In Watchlist' : 'Add to Watchlist')}
                </button>

                {trailer && (
                  <a
                    href={`https://www.youtube.com/watch?v=${trailer.key}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="detail-button trailer"
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M10 16.5l6-4.5-6-4.5v9zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
                    </svg>
                    Watch Trailer
                  </a>
                )}
              </div>

              {details.credits?.cast && details.credits.cast.length > 0 && (
                <div className="detail-cast">
                  <h3>Cast:</h3>
                  <p>
                    {details.credits.cast
                      .slice(0, 5)
                      .map((actor) => actor.name)
                      .join(', ')}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {type === 'tv' && details.seasons && details.seasons.length > 0 && (
        <div className="seasons-section">
          <h2 className="seasons-title">Seasons & Episodes</h2>
          <div className="seasons-list">
            {details.seasons
              .filter((season) => season.season_number >= 0)
              .map((season) => (
                <Season
                  key={season.id}
                  tvId={id}
                  season={season}
                  onPlayEpisode={handlePlayEpisode}
                />
              ))}
          </div>
        </div>
      )}

      {details.similar?.results && details.similar.results.length > 0 && (
        <div className="similar-section">
          <MovieRow
            title="Similar Titles"
            movies={details.similar.results}
            mediaType={type}
          />
        </div>
      )}
    </div>
  );
};

export default MovieDetail;
