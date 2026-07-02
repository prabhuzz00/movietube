# Firebase Environment Variables Setup

## ✅ Configuration Complete!

Your Firebase configuration is now securely stored in environment variables.

## 📁 Files Created/Updated:

### 1. `.env` (Your actual config - DO NOT COMMIT!)
```env
VITE_FIREBASE_API_KEY=AIzaSyA0PMDOc7Bvmv90QHhA07lu619K_pv4XrM
VITE_FIREBASE_AUTH_DOMAIN=movietube-1ea56.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=movietube-1ea56
VITE_FIREBASE_STORAGE_BUCKET=movietube-1ea56.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=561977640721
VITE_FIREBASE_APP_ID=1:561977640721:web:d862a4a8681c3e7c00eeb0
```

### 2. `.env.development` (Development config)
Same as `.env` - used when running `npm run dev`

### 3. `.env.production` (Production config)
Same config - used when running `npm run build`

### 4. `.env.example` (Template for others)
Contains placeholder values - safe to commit to Git

### 5. `src/config/firebase.js` (Updated)
Now reads from environment variables using `import.meta.env.VITE_*`

## 🔒 Security:

✅ `.env` is in `.gitignore` - Your keys won't be committed to Git
✅ Environment variables keep sensitive data separate from code
✅ Different configs for development and production
✅ Validation added to catch missing variables

## 🎯 How It Works:

### Vite Environment Variables:

Vite requires the `VITE_` prefix for client-side environment variables:

```javascript
// ✅ Works (has VITE_ prefix)
import.meta.env.VITE_FIREBASE_API_KEY

// ❌ Won't work (no VITE_ prefix)
import.meta.env.FIREBASE_API_KEY
```

### Variable Loading:

| Command | File Loaded |
|---------|-------------|
| `npm run dev` | `.env` + `.env.development` |
| `npm run build` | `.env` + `.env.production` |

## 🧪 Testing:

### 1. Restart Your Dev Server

Since you changed environment variables, you need to restart:

```bash
# Stop current server (Ctrl+C)
# Then restart:
npm run dev
```

### 2. Verify Config Loaded

Open browser console and check for errors. If you see:
```
Firebase configuration is missing...
```
Then environment variables aren't loading correctly.

### 3. Test Firebase

Try to register a new account:
- Go to http://localhost:5173/register
- Create an account
- Should work without errors!

## 📝 Important Notes:

### For Development:
- Environment variables are loaded automatically
- Changes to `.env` require server restart
- Use `npm run dev` to start

### For Production:
- Run `npm run build` to create production build
- Uses `.env.production` variables
- Deploy the `dist` folder

### If You Need to Change Config:
1. Update `.env` file with new values
2. Restart the dev server
3. Test the changes

## 🔍 Troubleshooting:

### "Firebase configuration is missing"

**Solution:**
1. Make sure `.env` file exists in project root
2. Check all `VITE_FIREBASE_*` variables are set
3. Restart dev server (`npm run dev`)

### "Firebase: Error (auth/invalid-api-key)"

**Solution:**
1. Double-check your API key in `.env`
2. Make sure there are no extra spaces
3. Verify the key is correct in Firebase Console

### Environment variables not working

**Solution:**
1. Variables must start with `VITE_`
2. File must be named exactly `.env`
3. File must be in project root (same folder as `package.json`)
4. Restart dev server after changes

## 🌐 Deployment:

### Deploy to Netlify/Vercel:

Add environment variables in their dashboard:
```
VITE_FIREBASE_API_KEY = AIzaSyA0PMDOc7Bvmv90QHhA07lu619K_pv4XrM
VITE_FIREBASE_AUTH_DOMAIN = movietube-1ea56.firebaseapp.com
VITE_FIREBASE_PROJECT_ID = movietube-1ea56
VITE_FIREBASE_STORAGE_BUCKET = movietube-1ea56.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID = 561977640721
VITE_FIREBASE_APP_ID = 1:561977640721:web:d862a4a8681c3e7c00eeb0
```

### Deploy to cPanel:

Since it's static files, just upload the `dist` folder:
1. Run `npm run build`
2. Upload contents of `dist` folder
3. Environment variables are already built into the files!

## ✨ Benefits:

| Before | After |
|--------|-------|
| Config hardcoded in file | Config in environment variables |
| Keys visible in Git | Keys hidden from Git |
| Same config everywhere | Different configs per environment |
| Manual updates needed | Just edit .env file |

## 📚 Additional Variables:

You can add more environment variables as needed:

```env
# Custom API URLs
VITE_TMDB_API_KEY=your_tmdb_key
VITE_API_BASE_URL=https://api.example.com

# Feature flags
VITE_ENABLE_ANALYTICS=true
VITE_DEBUG_MODE=false
```

Access them in your code:
```javascript
const tmdbKey = import.meta.env.VITE_TMDB_API_KEY;
const apiUrl = import.meta.env.VITE_API_BASE_URL;
```

## 🎉 You're All Set!

Your Firebase configuration is now secure and environment-aware!

**Next Steps:**
1. Restart your dev server: `npm run dev`
2. Test user registration
3. Test login
4. Test watchlist functionality

Everything should work exactly as before, but now with secure environment variables!
