# MovieWeb - Features & Usage Guide

## 🎬 Application Overview

MovieWeb is a Netflix-style streaming platform that allows users to browse and watch movies and TV shows. The application fetches data from TMDB API and streams content via vidsrc-embed.ru.

## 🌟 Key Features

### 1. Home Page
- **Hero Banner**: Displays trending content with play and info buttons
- **Category Rows**: 
  - Trending Now
  - Popular Movies
  - Top Rated
  - Action, Adventure, Comedy, Animation, Horror, Romance

### 2. Navigation
- **Header**: Fixed header with logo, navigation links, and search bar
- **Smooth Scrolling**: Header becomes solid on scroll
- **Routes**:
  - `/` - Home page (all content)
  - `/movies` - Movies only
  - `/tv` - TV shows only

### 3. Search Functionality
- **Real-time Search**: Starts searching after 3 characters
- **Dropdown Results**: Shows up to 8 results with:
  - Poster thumbnail
  - Title
  - Media type (Movie/TV Show)
  - Release year
- **Click to Navigate**: Click any result to view details

### 4. Movie/TV Cards
- **Hover Effects**: Scale animation on hover
- **Play Button**: Appears on hover
- **Rating Display**: Shows TMDB rating with star icon
- **Poster Images**: High-quality posters from TMDB

### 5. Detail Page
- **Full Information**:
  - Backdrop image
  - Poster
  - Title and metadata (rating, year, runtime, genres)
  - Overview/description
  - Cast information
- **Actions**:
  - Play Now button (opens video player)
  - Watch Trailer button (opens YouTube)
- **Similar Titles**: Row of related content
- **Video Player**: Full-screen modal with close button

### 6. Video Streaming
- **Supported Content**:
  - Movies (by TMDB ID)
  - TV Shows (full series)
  - Individual episodes
- **Player Features**:
  - Fullscreen support
  - Subtitle support (optional)
  - Autoplay option
  - Autonext for episodes

### 7. Responsive Design
- **Desktop**: Full features with hover effects
- **Tablet**: Optimized layout
- **Mobile**: Touch-friendly, simplified navigation

## 🎨 Design Elements

### Color Palette
```css
Primary Red:  #db0000  /* Main accent color */
Black:        #000000  /* Background */
White:        #ffffff  /* Text */
Gray:         #564d4d  /* Secondary elements */
Dark Red:     #831010  /* Hover states */
```

### Typography
- Headings: Bold, large sizes
- Body: Clean, readable sans-serif
- Responsive font sizing

### Animations
- Smooth transitions (0.3s)
- Scale transforms on hover
- Fade-in effects
- Slide animations for navigation

## 🔧 Technical Details

### API Integration

#### TMDB API Endpoints:
1. **Trending**: `/trending/{media_type}/{time_window}`
2. **Popular**: `/{media_type}/popular`
3. **Top Rated**: `/{media_type}/top_rated`
4. **Discover by Genre**: `/discover/{media_type}?with_genres={id}`
5. **Details**: `/{media_type}/{id}?append_to_response=videos,credits,similar`
6. **Search**: `/search/multi?query={query}`

#### Video Streaming URLs:
```javascript
// Movies
https://vidsrc-embed.ru/embed/movie?tmdb={id}

// TV Shows
https://vidsrc-embed.ru/embed/tv?tmdb={id}

// Episodes
https://vidsrc-embed.ru/embed/tv?tmdb={id}&season={s}&episode={e}
```

### Component Architecture
```
App
├── Header (Search + Navigation)
├── Routes
    ├── Home
    │   ├── Hero
    │   └── MovieRow[] (Multiple categories)
    ├── Movies
    │   ├── Hero
    │   └── MovieRow[] (Movie categories)
    ├── TVShows
    │   ├── Hero
    │   └── MovieRow[] (TV categories)
    └── MovieDetail
        ├── Hero Section
        ├── Player Modal
        └── Similar Content Row
```

## 📱 User Interactions

### Browsing Content
1. **Scroll** through categories
2. **Hover** over cards for info
3. **Click arrows** to scroll rows (desktop)
4. **Touch swipe** to scroll (mobile)

### Searching
1. Type in search bar
2. Wait for dropdown
3. Click result
4. View details

### Watching Content
1. Navigate to content
2. Click "Play Now"
3. Watch in modal player
4. Close with X button

### Navigation Flow
```
Home → [Click Movie] → Detail Page → [Play Now] → Player
     → [Search] → Results → Detail Page → Player
     → [Movies/TV] → Category Page → Detail Page → Player
```

## 🚀 Performance Optimizations

1. **Lazy Loading**: Images load on scroll
2. **Debounced Search**: 300ms delay prevents excessive API calls
3. **Efficient Routing**: React Router for fast navigation
4. **Parallel API Calls**: `Promise.all()` for simultaneous requests
5. **Smooth Scrolling**: CSS scroll-behavior for UX
6. **Optimized Images**: TMDB CDN with size parameters

## 🎯 Future Enhancements

Potential features to add:
- User authentication
- Watchlist/favorites
- Continue watching
- Ratings and reviews
- Multiple subtitle languages
- Video quality selection
- Episode selection for TV shows
- Genre filtering
- Advanced search filters
- Dark/light theme toggle

## 📚 Learning Resources

- [React Documentation](https://react.dev/)
- [React Router](https://reactrouter.com/)
- [TMDB API Docs](https://developers.themoviedb.org/3)
- [Vite Guide](https://vitejs.dev/guide/)

## 🐛 Troubleshooting

### Common Issues:

1. **Videos not playing**: Check vidsrc-embed.ru availability
2. **Images not loading**: Verify TMDB API key
3. **Search not working**: Check API rate limits
4. **Blank page**: Check browser console for errors

### Debug Tips:
- Open browser DevTools (F12)
- Check Console tab for errors
- Verify Network tab for API responses
- Clear cache and reload (Ctrl+Shift+R)

## 💡 Tips for Best Experience

1. Use a modern browser (Chrome, Firefox, Safari, Edge)
2. Stable internet connection required
3. Allow fullscreen for best video experience
4. Use search for quick access to content
5. Browse by genre for discovery
