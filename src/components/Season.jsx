import { useState, useEffect } from 'react';
import { getSeasonDetails, getImageUrl } from '../services/tmdb';
import Episode from './Episode';
import './Season.css';

const Season = ({ tvId, season, onPlayEpisode }) => {
  const [expanded, setExpanded] = useState(false);
  const [episodes, setEpisodes] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (expanded && episodes.length === 0) {
      fetchEpisodes();
    }
  }, [expanded]);

  const fetchEpisodes = async () => {
    setLoading(true);
    try {
      const data = await getSeasonDetails(tvId, season.season_number);
      setEpisodes(data.episodes || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching episodes:', error);
      setLoading(false);
    }
  };

  const posterUrl = season.poster_path
    ? getImageUrl(season.poster_path, 'w300')
    : 'https://via.placeholder.com/300x450?text=Season+' + season.season_number;

  const airDate = season.air_date
    ? new Date(season.air_date).getFullYear()
    : 'TBA';

  const handleToggle = () => {
    setExpanded(!expanded);
  };

  return (
    <div className="season-container">
      <div className="season-header" onClick={handleToggle}>
        <div className="season-poster">
          <img src={posterUrl} alt={season.name} />
        </div>
        
        <div className="season-info">
          <h3 className="season-title">{season.name}</h3>
          <div className="season-meta">
            <span>{season.episode_count} Episodes</span>
            {airDate && <span>{airDate}</span>}
          </div>
          {season.overview && !expanded && (
            <p className="season-overview">{season.overview}</p>
          )}
        </div>

        <button className="season-toggle-btn">
          <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            style={{
              transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.3s ease',
            }}
          >
            <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z" />
          </svg>
        </button>
      </div>

      {expanded && (
        <div className="season-episodes">
          {loading ? (
            <div className="episodes-loading">
              <div className="loading-spinner"></div>
            </div>
          ) : (
            <>
              {season.overview && (
                <p className="season-overview-expanded">{season.overview}</p>
              )}
              <div className="episodes-list">
                {episodes.map((episode) => (
                  <Episode
                    key={episode.id}
                    episode={episode}
                    onPlay={() => onPlayEpisode(season.season_number, episode.episode_number)}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Season;
