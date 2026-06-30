import { useState } from 'react';
import { getImageUrl } from '../services/tmdb';
import './Episode.css';

const Episode = ({ episode, onPlay }) => {
  const [imageError, setImageError] = useState(false);
  
  const stillUrl = episode.still_path && !imageError
    ? getImageUrl(episode.still_path, 'w300')
    : 'https://via.placeholder.com/300x169?text=No+Image';

  const airDate = episode.air_date
    ? new Date(episode.air_date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : 'TBA';

  const runtime = episode.runtime ? `${episode.runtime}m` : '';

  return (
    <div className="episode-item">
      <div className="episode-thumbnail">
        <img
          src={stillUrl}
          alt={episode.name}
          onError={() => setImageError(true)}
        />
        <button className="episode-play-btn" onClick={onPlay}>
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M8 5v14l11-7z" />
          </svg>
        </button>
        <div className="episode-number">
          {episode.episode_number}
        </div>
      </div>
      
      <div className="episode-info">
        <div className="episode-header">
          <h4 className="episode-title">{episode.name}</h4>
          <div className="episode-meta">
            {airDate && <span>{airDate}</span>}
            {runtime && <span>{runtime}</span>}
            {episode.vote_average > 0 && (
              <span className="episode-rating">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
                {episode.vote_average.toFixed(1)}
              </span>
            )}
          </div>
        </div>
        {episode.overview && (
          <p className="episode-overview">{episode.overview}</p>
        )}
      </div>
    </div>
  );
};

export default Episode;
