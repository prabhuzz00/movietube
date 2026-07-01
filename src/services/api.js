import axios from 'axios';

// Use environment variable or default to localhost
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authAPI = {
  register: async (email, password, name) => {
    const response = await api.post('/auth/register', { email, password, name });
    return response.data;
  },
  
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  }
};

// Watchlist API
export const watchlistAPI = {
  getWatchlist: async () => {
    const response = await api.get('/watchlist');
    return response.data.watchlist;
  },
  
  addToWatchlist: async (mediaType, mediaId, title, posterPath) => {
    const response = await api.post('/watchlist/add', {
      media_type: mediaType,
      media_id: mediaId,
      title,
      poster_path: posterPath
    });
    return response.data;
  },
  
  removeFromWatchlist: async (mediaType, mediaId) => {
    const response = await api.delete(`/watchlist/remove/${mediaType}/${mediaId}`);
    return response.data;
  },
  
  checkInWatchlist: async (mediaType, mediaId) => {
    const response = await api.get(`/watchlist/check/${mediaType}/${mediaId}`);
    return response.data.inWatchlist;
  }
};

export default api;
