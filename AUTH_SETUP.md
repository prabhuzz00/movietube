# MovieTube Authentication & Watchlist System

Complete user authentication and watchlist functionality has been added to MovieTube.

## Features

### User Authentication
- ✅ User registration with email and password
- ✅ User login with JWT token authentication
- ✅ Secure password hashing with bcrypt
- ✅ Session persistence with localStorage
- ✅ Protected routes and API endpoints

### Watchlist
- ✅ Add movies and TV shows to personal watchlist
- ✅ Remove items from watchlist
- ✅ View all watchlist items on dedicated page
- ✅ Watchlist button on every movie/TV card
- ✅ Persistent watchlist across sessions

## Tech Stack

### Backend
- **Node.js + Express** - REST API server
- **MySQL** - Database for users and watchlist
- **JWT** - Token-based authentication
- **Bcrypt** - Password hashing
- **CORS** - Cross-origin resource sharing

### Frontend
- **React Context API** - Global auth state management
- **Axios** - HTTP client for API calls
- **LocalStorage** - Token and user data persistence

## Setup Instructions

### 1. Install Backend Dependencies

```bash
cd backend
npm install
```

### 2. Configure Environment Variables

The `.env` file is already created with your MySQL credentials:
```
DB_HOST=localhost
DB_USER=movi518571_movietube
DB_PASSWORD=movi518571_movietube
DB_NAME=movi518571_movietube
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
PORT=5000
```

**IMPORTANT**: Change the `JWT_SECRET` to a random, secure string in production!

### 3. Start the Backend Server

```bash
cd backend
npm start
```

Or for development with auto-reload:
```bash
npm run dev
```

The backend server will:
- Start on `http://localhost:5000`
- Automatically create the database tables if they don't exist
- Connect to your MySQL database

### 4. Start the Frontend (in a new terminal)

```bash
npm run dev
```

The frontend will run on `http://localhost:5173` (or your configured port).

## Database Tables

The backend automatically creates these tables:

### `users` Table
```sql
- id (INT, PRIMARY KEY, AUTO_INCREMENT)
- email (VARCHAR(255), UNIQUE, NOT NULL)
- password (VARCHAR(255), NOT NULL) -- hashed
- name (VARCHAR(255), NULLABLE)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

### `watchlist` Table
```sql
- id (INT, PRIMARY KEY, AUTO_INCREMENT)
- user_id (INT, FOREIGN KEY → users.id)
- media_type (ENUM: 'movie', 'tv')
- media_id (INT) -- TMDB ID
- title (VARCHAR(500))
- poster_path (VARCHAR(500))
- added_at (TIMESTAMP)
- UNIQUE constraint on (user_id, media_type, media_id)
```

## API Endpoints

### Authentication

#### Register
```
POST /api/auth/register
Body: { email, password, name? }
Response: { token, user }
```

#### Login
```
POST /api/auth/login
Body: { email, password }
Response: { token, user }
```

### Watchlist (Protected - Requires Authentication)

#### Get Watchlist
```
GET /api/watchlist
Headers: { Authorization: "Bearer <token>" }
Response: { watchlist: [...] }
```

#### Add to Watchlist
```
POST /api/watchlist/add
Headers: { Authorization: "Bearer <token>" }
Body: { media_type, media_id, title, poster_path? }
Response: { message }
```

#### Remove from Watchlist
```
DELETE /api/watchlist/remove/:mediaType/:mediaId
Headers: { Authorization: "Bearer <token>" }
Response: { message }
```

#### Check if in Watchlist
```
GET /api/watchlist/check/:mediaType/:mediaId
Headers: { Authorization: "Bearer <token>" }
Response: { inWatchlist: boolean }
```

## Frontend Components

### New Pages
- **`src/pages/Login.jsx`** - Login form
- **`src/pages/Register.jsx`** - Registration form
- **`src/pages/Watchlist.jsx`** - User's watchlist page
- **`src/pages/Auth.css`** - Styles for auth pages

### Context
- **`src/context/AuthContext.jsx`** - Global authentication state

### Services
- **`src/services/api.js`** - API client for auth and watchlist

### Updated Components
- **`src/components/Header.jsx`** - Added login/logout buttons and user menu
- **`src/components/Header.css`** - Styles for user menu
- **`src/components/MovieCard.jsx`** - Added watchlist button
- **`src/components/MovieCard.css`** - Styles for watchlist button
- **`src/App.jsx`** - Added AuthProvider and new routes

## Usage

### For Users

1. **Register**: Click "Sign Up" and create an account
2. **Login**: Sign in with your email and password
3. **Add to Watchlist**: Click the bookmark icon on any movie/TV card
4. **View Watchlist**: Click "Watchlist" in the navigation or user menu
5. **Remove from Watchlist**: Click "Remove" button on watchlist page

### For Developers

#### Authentication Flow
1. User registers/logs in
2. Server returns JWT token
3. Token stored in localStorage
4. Token sent with every authenticated request
5. Server validates token and processes request

#### Adding Auth to New API Routes
```javascript
import { authenticateToken } from './middleware/auth.js';

router.get('/protected-route', authenticateToken, async (req, res) => {
  // req.user contains { id, email }
  // Access user ID with req.user.id
});
```

## Security Notes

- Passwords are hashed with bcrypt (10 salt rounds)
- JWT tokens expire after 7 days
- CORS is enabled for local development
- SQL injection protected with parameterized queries
- Input validation on all endpoints

## Troubleshooting

### Backend won't start
- Check if MySQL server is running
- Verify database credentials in `.env`
- Ensure port 5000 is not in use

### Can't connect to backend
- Check if backend server is running
- Verify API_URL in `src/services/api.js` matches backend port
- Check browser console for CORS errors

### Database errors
- Ensure MySQL user has proper permissions
- Check if database exists
- Verify table creation logs in server console

### Token/Auth issues
- Clear browser localStorage and re-login
- Check token expiration (7 days default)
- Verify JWT_SECRET is consistent

## Production Deployment

### Backend
1. Change `JWT_SECRET` to a secure random string
2. Update `DB_HOST` if using remote MySQL
3. Set `NODE_ENV=production`
4. Use a process manager like PM2
5. Set up HTTPS/SSL
6. Configure CORS for your production domain

### Frontend
1. Update `API_URL` in `src/services/api.js` to production backend URL
2. Build for production: `npm run build`
3. Deploy build folder to your hosting service

## Future Enhancements

- [ ] Email verification
- [ ] Password reset functionality
- [ ] Social login (Google, Facebook)
- [ ] User profile page
- [ ] Watchlist categories/folders
- [ ] Share watchlist with friends
- [ ] Email notifications for new content
- [ ] Watch history tracking

## Support

For issues or questions about the authentication system, check:
1. Server logs in the terminal running the backend
2. Browser console for frontend errors
3. Network tab in browser DevTools for API calls
