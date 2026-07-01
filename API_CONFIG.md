# API URL Configuration Summary

## Current Configuration

### Frontend API URL (Production)
**File:** `.env.production`
```
VITE_API_URL=https://api.movietube.in/api
```

### Frontend API URL (Development)
**File:** `.env.development`
```
VITE_API_URL=http://localhost:5000/api
```

### Backend CORS Configuration
**File:** `backend/server.js`

Allowed origins:
- `http://localhost:5173` (local dev)
- `http://localhost:5174` (local dev alternate)
- `http://localhost:3000` (local dev alternate)
- `https://movietube.in` (production)
- `https://www.movietube.in` (production with www)
- `http://movietube.in` (production without SSL - fallback)
- `http://www.movietube.in` (production www without SSL - fallback)

## API Endpoints

Your backend API will be accessible at:

### Base URL
```
https://api.movietube.in/api
```

### Available Endpoints

#### Health Check
```
GET https://api.movietube.in/api/health
Response: {"status":"OK","message":"MovieTube API is running"}
```

#### Authentication

**Register**
```
POST https://api.movietube.in/api/auth/register
Body: {
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe" (optional)
}
```

**Login**
```
POST https://api.movietube.in/api/auth/login
Body: {
  "email": "user@example.com",
  "password": "password123"
}
```

#### Watchlist (Requires Authentication)

**Get Watchlist**
```
GET https://api.movietube.in/api/watchlist
Headers: {
  "Authorization": "Bearer YOUR_JWT_TOKEN"
}
```

**Add to Watchlist**
```
POST https://api.movietube.in/api/watchlist/add
Headers: {
  "Authorization": "Bearer YOUR_JWT_TOKEN"
}
Body: {
  "media_type": "movie" or "tv",
  "media_id": 12345,
  "title": "Movie Title",
  "poster_path": "/path/to/poster.jpg" (optional)
}
```

**Remove from Watchlist**
```
DELETE https://api.movietube.in/api/watchlist/remove/:mediaType/:mediaId
Headers: {
  "Authorization": "Bearer YOUR_JWT_TOKEN"
}
Example: DELETE https://api.movietube.in/api/watchlist/remove/movie/12345
```

**Check if in Watchlist**
```
GET https://api.movietube.in/api/watchlist/check/:mediaType/:mediaId
Headers: {
  "Authorization": "Bearer YOUR_JWT_TOKEN"
}
Example: GET https://api.movietube.in/api/watchlist/check/movie/12345
```

## Testing Your API

### 1. Test Health Check
```bash
curl https://api.movietube.in/api/health
```

Expected response:
```json
{"status":"OK","message":"MovieTube API is running"}
```

### 2. Test Registration
```bash
curl -X POST https://api.movietube.in/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "test123456",
    "name": "Test User"
  }'
```

### 3. Test Login
```bash
curl -X POST https://api.movietube.in/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "test123456"
  }'
```

Save the `token` from the response for the next requests.

### 4. Test Watchlist (with token)
```bash
curl https://api.movietube.in/api/watchlist \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Frontend Configuration

Your React frontend will automatically use the correct API URL based on the environment:

- **Development** (`npm run dev`): Uses `http://localhost:5000/api`
- **Production** (`npm run build`): Uses `https://api.movietube.in/api`

The configuration is handled by Vite's environment variables in:
- `.env.development`
- `.env.production`

And consumed in `src/services/api.js`:
```javascript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
```

## Important Notes

### SSL/HTTPS
- Production frontend (movietube.in) **must** use HTTPS
- Production API (api.movietube.in) **must** use HTTPS
- Modern browsers require HTTPS for secure cookies and authentication

### CORS
- The backend is configured to accept requests from:
  - Your production domain (movietube.in)
  - Local development servers
- If you add more domains, update `allowedOrigins` in `backend/server.js`

### Environment Variables
Make sure these are set in your cPanel Node.js app:
- `PORT` (usually 3000 for cPanel)
- `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`
- `JWT_SECRET` (must be a secure random string in production!)
- `NODE_ENV=production`

## Deployment Checklist

- [ ] Backend deployed to cPanel at `api.movietube.in`
- [ ] SSL certificate installed for `api.movietube.in`
- [ ] Environment variables set in cPanel
- [ ] Health check endpoint working: `https://api.movietube.in/api/health`
- [ ] Frontend built with production env: `npm run build`
- [ ] Frontend deployed to `movietube.in`
- [ ] SSL certificate installed for `movietube.in`
- [ ] Test user registration from frontend
- [ ] Test user login from frontend
- [ ] Test watchlist functionality
- [ ] No CORS errors in browser console

## Troubleshooting

### CORS Errors
If you see CORS errors in the browser console:
1. Check that your frontend domain is in `allowedOrigins` in `backend/server.js`
2. Restart the backend server after making changes
3. Clear browser cache

### 401 Unauthorized
- Token expired (tokens last 7 days)
- Token not being sent with request
- User needs to log in again

### 404 Not Found
- Check that the API URL is correct
- Verify backend is running
- Check route paths in backend

### Connection Refused
- Backend server is not running
- Wrong port number
- Firewall blocking the connection

## Quick Reference

| Environment | Frontend URL | Backend API URL |
|-------------|-------------|-----------------|
| Development | http://localhost:5173 | http://localhost:5000/api |
| Production | https://movietube.in | https://api.movietube.in/api |

---

**Your API is configured and ready to deploy to `api.movietube.in`!** 🚀
