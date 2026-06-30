# 🚀 Deployment Guide - MovieWeb

## Deployment Options

### Option 1: Vercel (Recommended)

#### Steps:
1. Create account at [vercel.com](https://vercel.com)
2. Install Vercel CLI:
```bash
npm install -g vercel
```

3. Build the project:
```bash
npm run build
```

4. Deploy:
```bash
vercel
```

5. Follow prompts and get deployment URL

#### Environment Variables in Vercel:
- Go to Project Settings → Environment Variables
- Add: `VITE_TMDB_API_KEY` and `VITE_TMDB_API_TOKEN`

---

### Option 2: Netlify

#### Steps:
1. Create account at [netlify.com](https://netlify.com)
2. Install Netlify CLI:
```bash
npm install -g netlify-cli
```

3. Build:
```bash
npm run build
```

4. Deploy:
```bash
netlify deploy --prod
```

#### Netlify Configuration:
Create `netlify.toml`:
```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

---

### Option 3: GitHub Pages

#### Steps:
1. Install gh-pages:
```bash
npm install --save-dev gh-pages
```

2. Add to `package.json`:
```json
{
  "homepage": "https://yourusername.github.io/movieweb",
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  }
}
```

3. Update `vite.config.js`:
```javascript
export default defineConfig({
  plugins: [react()],
  base: '/movieweb/'
})
```

4. Deploy:
```bash
npm run deploy
```

---

### Option 4: Firebase Hosting

#### Steps:
1. Install Firebase CLI:
```bash
npm install -g firebase-tools
```

2. Login:
```bash
firebase login
```

3. Initialize:
```bash
firebase init hosting
```

4. Configure:
- Public directory: `dist`
- Single-page app: `Yes`
- Auto builds: `No`

5. Build and deploy:
```bash
npm run build
firebase deploy
```

---

## Pre-Deployment Checklist

### 1. Environment Variables
- [ ] Move API credentials to environment variables
- [ ] Update `src/services/tmdb.js` to use env vars:
```javascript
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const API_TOKEN = import.meta.env.VITE_TMDB_API_TOKEN;
```

### 2. Build Optimization
- [ ] Run `npm run build`
- [ ] Check for build errors
- [ ] Test build locally with `npm run preview`

### 3. Testing
- [ ] Test all routes
- [ ] Test search functionality
- [ ] Test video playback
- [ ] Test on mobile devices
- [ ] Check browser compatibility

### 4. Performance
- [ ] Enable compression (gzip/brotli)
- [ ] Configure caching headers
- [ ] Optimize images
- [ ] Enable CDN

### 5. Security
- [ ] Remove console.logs
- [ ] Hide API keys
- [ ] Add rate limiting
- [ ] Configure CORS

### 6. SEO (Optional)
- [ ] Add meta tags
- [ ] Add Open Graph tags
- [ ] Add structured data
- [ ] Create sitemap

---

## Production Build Configuration

### Update `vite.config.js`:
```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
      },
    },
  },
  server: {
    port: 5173,
    host: true,
  },
})
```

---

## Environment Variables Setup

### Create `.env.production`:
```env
VITE_TMDB_API_KEY=your_api_key
VITE_TMDB_API_TOKEN=your_api_token
VITE_APP_NAME=MovieWeb
```

### Update Service Files:
Replace hardcoded values with:
```javascript
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const API_TOKEN = import.meta.env.VITE_TMDB_API_TOKEN;
```

---

## Custom Domain Setup

### For Vercel:
1. Go to Project Settings → Domains
2. Add your custom domain
3. Configure DNS records as instructed

### For Netlify:
1. Go to Domain Settings
2. Add custom domain
3. Configure DNS or use Netlify DNS

---

## Monitoring & Analytics

### Add Google Analytics:
1. Create GA4 property
2. Add to `index.html`:
```html
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

### Error Tracking (Optional):
Consider adding:
- Sentry for error tracking
- LogRocket for session replay
- Hotjar for user behavior

---

## Performance Optimization

### 1. Code Splitting:
```javascript
// Lazy load routes
const Home = lazy(() => import('./pages/Home'))
const MovieDetail = lazy(() => import('./pages/MovieDetail'))
```

### 2. Image Optimization:
- Use WebP format
- Implement progressive loading
- Add blur placeholders

### 3. Caching Strategy:
```javascript
// Service Worker for caching (optional)
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js')
}
```

---

## SSL Certificate

All major platforms provide free SSL:
- Vercel: Automatic
- Netlify: Automatic
- Firebase: Automatic
- Custom: Use Let's Encrypt

---

## Continuous Deployment

### GitHub Actions Example:
Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm install
      - run: npm run build
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

---

## Post-Deployment

### 1. Verify Deployment:
- [ ] Check all pages load
- [ ] Test all functionality
- [ ] Verify API calls work
- [ ] Test on multiple devices
- [ ] Check performance scores

### 2. Monitor:
- Watch for errors
- Check analytics
- Monitor load times
- Review user feedback

### 3. Maintain:
- Update dependencies regularly
- Fix bugs promptly
- Add new features
- Optimize based on usage

---

## Troubleshooting

### Issue: Blank Page After Deployment
**Solution**: Check browser console, verify base URL in vite.config.js

### Issue: 404 on Refresh
**Solution**: Configure redirects for SPA routing

### Issue: API Calls Failing
**Solution**: Verify CORS settings and API keys

### Issue: Slow Loading
**Solution**: Enable compression, optimize images, use CDN

---

## Cost Considerations

### Free Tier Options:
- **Vercel**: Free for personal projects
- **Netlify**: 100GB bandwidth/month free
- **Firebase**: Free Spark plan available
- **GitHub Pages**: Free for public repos

### Paid Upgrades:
- Higher bandwidth
- More concurrent builds
- Advanced analytics
- Custom support

---

## Recommended: Vercel Deployment

For the easiest deployment with zero configuration:

```bash
npm install -g vercel
vercel login
vercel
```

That's it! Your site will be live in minutes.

---

## Support & Resources

- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)
- [React Deployment](https://react.dev/learn/start-a-new-react-project#deploying)
- [Vercel Docs](https://vercel.com/docs)
- [Netlify Docs](https://docs.netlify.com/)

---

**Deployment Status**: Ready for production ✅
**Recommended Platform**: Vercel
**Estimated Setup Time**: 10-15 minutes
