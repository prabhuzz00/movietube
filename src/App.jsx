import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import Header from './components/Header';
import Home from './pages/Home';
import Movies from './pages/Movies';
import TVShows from './pages/TVShows';
import MovieDetail from './pages/MovieDetail';
import CategoryPage from './pages/CategoryPage';
import InstallPWA from './components/InstallPWA';
import { clearCache, getCacheStats, cacheService } from './services/tmdb';
import './App.css';

function App() {
  // Expose cache utilities to window object for debugging
  useEffect(() => {
    if (import.meta.env.DEV) {
      window.tmdbCache = {
        clear: clearCache,
        stats: getCacheStats,
        service: cacheService,
        help: () => {
          console.log(`
🎬 TMDB Cache Utilities:
  
  window.tmdbCache.stats()   - View cache statistics
  window.tmdbCache.clear()   - Clear all cached data
  window.tmdbCache.service   - Access cache service directly
  
Cache is automatically managed with the following TTL:
  - Movie/TV Details: 2 hours
  - Lists (Trending/Popular): 30 minutes
  - Search Results: 10 minutes
  - Genres: 24 hours
  - Season Details: 2 hours
          `);
        }
      };
      
      console.log('🎬 TMDB Cache utilities available! Type window.tmdbCache.help() for info');
    }
  }, []);

  return (
    <Router>
      <div className="app">
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/movies" element={<Movies />} />
          <Route path="/tv" element={<TVShows />} />
          <Route path="/category/:mediaType/:categoryType/:categoryId" element={<CategoryPage />} />
          <Route path="/:type/:id" element={<MovieDetail />} />
        </Routes>
        <InstallPWA />
      </div>
    </Router>
  );
}

export default App;
