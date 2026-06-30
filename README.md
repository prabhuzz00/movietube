# MovieWeb 🎬

A modern Netflix-style movie streaming website built with React and Vite. Browse and watch movies and TV shows with data from TMDB API and streaming powered by vidsrc-embed.ru.

## Features

- 🎥 Browse movies and TV shows by categories
- 🔥 Trending, Popular, and Top Rated content
- 🎭 Genre-based browsing (Action, Adventure, Comedy, Animation, Horror, Romance, etc.)
- 🔍 Real-time search with dropdown suggestions
- 📺 Integrated video player for streaming
- 🎨 Netflix-inspired dark theme
- 📱 Fully responsive design
- 🚀 Fast and optimized with Vite

## Tech Stack

- **React 19** - UI framework
- **Vite** - Build tool and dev server
- **React Router** - Navigation and routing
- **Axios** - HTTP client for API calls
- **TMDB API** - Movie and TV show data
- **vidsrc-embed.ru** - Video streaming

## Color Scheme

- Primary Red: `#db0000`
- Black: `#000000`
- White: `#ffffff`
- Gray: `#564d4d`
- Dark Red: `#831010`

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd movieweb
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and visit `http://localhost:5173`

## Project Structure

```
movieweb/
├── src/
│   ├── components/
│   │   ├── Header.jsx          # Navigation header with search
│   │   ├── Hero.jsx            # Hero banner component
│   │   ├── MovieCard.jsx       # Movie/TV show card
│   │   └── MovieRow.jsx        # Horizontal scrolling row
│   ├── pages/
│   │   ├── Home.jsx            # Home page
│   │   ├── Movies.jsx          # Movies page
│   │   ├── TVShows.jsx         # TV shows page
│   │   └── MovieDetail.jsx     # Detail page with player
│   ├── services/
│   │   ├── tmdb.js             # TMDB API service
│   │   └── vidsrc.js           # Video streaming service
│   ├── App.jsx                 # Main app component
│   └── index.css               # Global styles
├── package.json
└── README.md
```

## API Configuration

The project uses the TMDB API for fetching movie and TV show data. The API credentials are already configured in `src/services/tmdb.js`.

### TMDB API Endpoints Used:
- Trending content
- Popular movies/shows
- Top rated content
- Genre-based discovery
- Movie/TV show details
- Search functionality

### Video Streaming

Videos are streamed using vidsrc-embed.ru API which supports:
- Movies by TMDB ID
- TV shows and episodes
- Subtitle support
- Autoplay and autonext features

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run linter

## Features Breakdown

### Home Page
- Featured hero banner with trending content
- Multiple category rows (Trending, Popular, Action, Comedy, etc.)
- Smooth horizontal scrolling
- Hover effects on movie cards

### Search
- Real-time search with debouncing
- Dropdown with movie posters and metadata
- Navigate to detail page on click

### Movie/TV Detail Page
- Full-screen backdrop
- Movie information (rating, year, runtime, genres, cast)
- Integrated video player in modal
- Similar titles recommendations
- YouTube trailer link

### Responsive Design
- Mobile-friendly layout
- Touch-optimized scrolling
- Adaptive navigation
- Responsive typography

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the MIT License.

## Acknowledgments

- [TMDB](https://www.themoviedb.org/) for providing the movie database API
- [vidsrc-embed.ru](https://vidsrc-embed.ru/) for video streaming capabilities
- Netflix for design inspiration
