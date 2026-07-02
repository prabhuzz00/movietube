# Firebase Setup Guide for MovieTube

## Why Firebase Instead of Backend?

✅ **No Server Management** - No need to deploy backend to cPanel
✅ **Free Tier** - 50,000 reads/day, 20,000 writes/day
✅ **Real-time Sync** - Watchlist syncs across devices automatically
✅ **Built-in Auth** - Email/password, Google, Facebook, etc.
✅ **Secure** - Firebase handles all security
✅ **Scalable** - Grows with your app
✅ **Already Installed** - Firebase is in your package.json!

## Step-by-Step Setup

### 1. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add project"**
3. Name it: **"movietube"** (or any name)
4. Disable Google Analytics (optional)
5. Click **"Create project"**

### 2. Enable Authentication

1. In Firebase Console, click **"Authentication"**
2. Click **"Get started"**
3. Click **"Sign-in method"** tab
4. Click **"Email/Password"**
5. Enable **"Email/Password"**
6. Click **"Save"**

**Optional:** Enable Google Sign-in for one-click login

### 3. Create Firestore Database

1. In Firebase Console, click **"Firestore Database"**
2. Click **"Create database"**
3. Choose **"Start in production mode"**
4. Select a location (choose closest to your users)
5. Click **"Enable"**

### 4. Set Up Security Rules

1. In Firestore, click **"Rules"** tab
2. Replace the rules with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Watchlist collection
    match /watchlist/{document=**} {
      // Users can only read/write their own watchlist
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
    }
  }
}
```

3. Click **"Publish"**

### 5. Get Firebase Configuration

1. In Firebase Console, click **Settings icon** (⚙️) > **Project settings**
2. Scroll down to **"Your apps"**
3. Click **Web icon** (</>) to add a web app
4. Register app name: **"MovieTube"**
5. **Copy the configuration object**

It looks like this:
```javascript
const firebaseConfig = {
  apiKey: "AIzaSyB...",
  authDomain: "movietube-xxxxx.firebaseapp.com",
  projectId: "movietube-xxxxx",
  storageBucket: "movietube-xxxxx.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};
```

### 6. Update Firebase Configuration

Open `src/config/firebase.js` and replace the config:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY_HERE",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

### 7. Update Components

#### Update Login Component

**`src/pages/Login.jsx`:**

```javascript
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser } from '../services/auth';
import './Auth.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await loginUser(email, password);
    
    if (result.success) {
      navigate('/');
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  // ... rest of the component (same as before)
};

export default Login;
```

#### Update Register Component

**`src/pages/Register.jsx`:**

```javascript
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser } from '../services/auth';
import './Auth.css';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    const result = await registerUser(email, password, name);
    
    if (result.success) {
      navigate('/');
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  // ... rest of the component (same as before)
};

export default Register;
```

#### Update Watchlist Page

**`src/pages/Watchlist.jsx`:**

```javascript
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
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    fetchWatchlist();
  }, [isAuthenticated, navigate, user]);

  const fetchWatchlist = async () => {
    if (!user) return;
    
    setLoading(true);
    const result = await getWatchlist(user.id);
    
    if (result.success) {
      setWatchlist(result.watchlist);
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

  // ... rest of the component (same as before)
  // Update the remove button to use: onClick={() => handleRemove(item.id)}
};

export default Watchlist;
```

#### Update MovieCard Component

**`src/components/MovieCard.jsx`:**

```javascript
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getImageUrl } from '../services/tmdb';
import { addToWatchlist, removeFromWatchlist, checkInWatchlist } from '../services/watchlist';
import { useAuth } from '../context/AuthContextFirebase';
import './MovieCard.css';

const MovieCard = ({ movie, mediaType = 'movie', id, title: propTitle, poster, type: propType, showWatchlistButton = true }) => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [inWatchlist, setInWatchlist] = useState(false);
  const [watchlistLoading, setWatchlistLoading] = useState(false);
  
  // Support both old and new prop styles
  const itemId = id || movie?.id;
  const type = propType || movie?.media_type || mediaType;
  const title = propTitle || movie?.title || movie?.name;
  const posterPath = poster || movie?.poster_path;
  
  const posterUrl = posterPath
    ? getImageUrl(posterPath, 'w500')
    : 'https://via.placeholder.com/500x750?text=No+Image';

  useEffect(() => {
    if (isAuthenticated && showWatchlistButton && itemId && user) {
      checkStatus();
    }
  }, [isAuthenticated, itemId, type, user]);

  const checkStatus = async () => {
    const status = await checkInWatchlist(user.id, type, itemId);
    setInWatchlist(status);
  };

  const handleWatchlistToggle = async (e) => {
    e.stopPropagation();
    
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    setWatchlistLoading(true);
    
    if (inWatchlist) {
      const result = await removeFromWatchlist(user.id, type, itemId);
      if (result.success) {
        setInWatchlist(false);
      }
    } else {
      const result = await addToWatchlist(user.id, {
        mediaType: type,
        mediaId: itemId,
        title: title,
        posterPath: posterPath
      });
      if (result.success) {
        setInWatchlist(true);
      }
    }
    
    setWatchlistLoading(false);
  };

  // ... rest of the component (same as before)
};

export default MovieCard;
```

#### Update App.jsx

**`src/App.jsx`:**

Replace:
```javascript
import { AuthProvider } from './context/AuthContext';
```

With:
```javascript
import { AuthProvider } from './context/AuthContextFirebase';
```

### 8. Remove Backend Files (Optional)

Since you're using Firebase, you can delete:
- `backend/` folder entirely
- `src/services/api.js` (no longer needed)
- `src/context/AuthContext.jsx` (replaced by AuthContextFirebase.jsx)

### 9. Test Your Application

```bash
npm run dev
```

1. **Test Registration:**
   - Go to Sign Up page
   - Create a new account
   - Should redirect to home page

2. **Test Login:**
   - Logout
   - Login with your credentials
   - Should redirect to home page

3. **Test Watchlist:**
   - Browse movies
   - Click bookmark icon on any movie
   - Go to "Watchlist" page
   - Should see your saved items
   - Click "Remove" to test deletion

### 10. Deploy to Production

Build your app:
```bash
npm run build
```

Upload the `dist` folder to your web host (cPanel, Netlify, Vercel, etc.)

**No backend deployment needed!** ✅

## Firebase Dashboard

Monitor your app:
- **Authentication** → See registered users
- **Firestore Database** → View watchlist data
- **Usage** → Monitor API calls (stays within free tier for most apps)

## Costs (Free Tier Limits)

Firebase Free (Spark) Plan includes:
- ✅ **50,000 reads/day**
- ✅ **20,000 writes/day**
- ✅ **20,000 deletes/day**
- ✅ **1GB storage**
- ✅ **10GB/month bandwidth**
- ✅ **Unlimited users**

This is more than enough for thousands of users!

## Advantages Over Custom Backend

| Feature | Custom Backend | Firebase |
|---------|---------------|----------|
| Server Setup | Required (cPanel/VPS) | None |
| Deployment | Manual | Automatic |
| Database | MySQL setup needed | Built-in Firestore |
| Security | Manual implementation | Built-in & tested |
| Scaling | Manual | Automatic |
| Cost | ~$5-20/month | Free (up to limits) |
| Sync Across Devices | Custom implementation | Built-in |
| Offline Support | Complex | Built-in |
| Real-time Updates | Complex | Built-in |

## Troubleshooting

### "Firebase: Error (auth/configuration-not-found)"
- Check that you've added your Firebase config to `src/config/firebase.js`
- Make sure Email/Password authentication is enabled in Firebase Console

### "Missing or insufficient permissions"
- Check Firestore security rules
- Make sure you're logged in when accessing watchlist

### "Network request failed"
- Check internet connection
- Verify Firebase project is active
- Check browser console for specific errors

## Next Steps (Optional Enhancements)

1. **Google Sign-In:**
   - Enable in Firebase Console → Authentication → Sign-in method
   - Add Google login button to your auth pages

2. **Email Verification:**
   - Send verification emails after registration
   - Improve account security

3. **Password Reset:**
   - Allow users to reset forgotten passwords
   - Built-in with Firebase

4. **User Profiles:**
   - Store additional user data in Firestore
   - Profile pictures, preferences, etc.

---

**With Firebase, you get authentication + database + hosting for FREE!** 🎉

No server management, no cPanel deployment, no MySQL configuration needed!
