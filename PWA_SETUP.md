# Progressive Web App (PWA) Setup

Your MovieWeb application is now PWA-enabled! This guide explains what has been added and what you need to do to complete the setup.

## ✅ What's Been Added

### 1. **Manifest File** (`public/manifest.json`)
- App name, description, and metadata
- Theme colors (#db0000 for MovieWeb red)
- Icon definitions for all sizes
- Shortcuts to Movies and TV Shows pages
- Display mode: standalone (like a native app)

### 2. **Service Worker** (`public/sw.js`)
- Offline functionality
- Caching strategy for:
  - Static assets (HTML, CSS, JS)
  - TMDB API responses
  - Movie/TV show images
- Background sync capabilities
- Push notification support

### 3. **PWA Utility** (`src/utils/pwa.js`)
- Service worker registration
- Install prompt handling
- Notification permissions
- Update checking
- Cache management

### 4. **Install Component** (`src/components/InstallPWA.jsx`)
- Beautiful install banner
- Auto-dismissal after 7 days
- Install/dismiss buttons
- Mobile-responsive design

### 5. **Updated Files**
- `index.html` - Added PWA meta tags and manifest link
- `src/main.jsx` - Initializes PWA on app load
- `src/App.jsx` - Added InstallPWA component

## 📋 Required Actions

### **1. Generate PWA Icons**

You need to create app icons in multiple sizes. Here's how:

#### Option A: Using Online Tool (Recommended)
1. Visit: https://www.pwabuilder.com/imageGenerator
2. Upload a 512x512px PNG logo of your app
3. Download the generated icons
4. Extract and place them in `public/icons/` folder

#### Option B: Manual Creation
Create the following icons and save them in `public/icons/`:
- `icon-72x72.png`
- `icon-96x96.png`
- `icon-128x128.png`
- `icon-144x144.png`
- `icon-152x152.png`
- `icon-192x192.png`
- `icon-384x384.png`
- `icon-512x512.png`

### **2. Create Icons Folder**
```bash
mkdir public/icons
```

### **3. Add Screenshots (Optional but Recommended)**
For better PWA store listings:
```bash
mkdir public/screenshots
```
Add:
- `desktop-1.png` (1920x1080)
- `mobile-1.png` (390x844)

### **4. Test Your PWA**

#### Development Testing:
1. Build your app: `npm run build`
2. Serve the build: `npm run preview` or use a local server
3. Open in browser (Chrome/Edge recommended)
4. Open DevTools → Application → Manifest
5. Check "Service Workers" tab

#### Lighthouse Audit:
1. Open DevTools → Lighthouse
2. Select "Progressive Web App"
3. Click "Generate report"
4. Aim for 90+ score

## 🎯 PWA Features

### **Install Banner**
- Shows on first visit (if not installed)
- Dismissible for 7 days
- Auto-hides if app is already installed

### **Offline Support**
- Static pages cached immediately
- API responses cached for offline viewing
- Images cached after first load
- Graceful fallback for failed requests

### **Add to Home Screen**
- **Android**: Install banner + Chrome menu
- **iOS**: Safari → Share → Add to Home Screen
- **Desktop**: Install icon in address bar

### **App-Like Experience**
- No browser UI (standalone mode)
- Splash screen on launch
- Works in fullscreen
- Fast loading from cache

## 🔧 Customization

### **Change Theme Color**
Edit `public/manifest.json`:
```json
{
  "theme_color": "#db0000",
  "background_color": "#000000"
}
```

### **Update App Name**
Edit `public/manifest.json`:
```json
{
  "name": "Your App Name",
  "short_name": "Short Name"
}
```

### **Modify Caching Strategy**
Edit `public/sw.js` - adjust `CACHE_NAME` versions and caching logic

### **Disable Install Banner**
Remove `<InstallPWA />` from `src/App.jsx`

## 📱 Push Notifications (Optional)

To enable push notifications:

1. **Generate VAPID Keys**:
   ```bash
   npx web-push generate-vapid-keys
   ```

2. **Update PWA Utility**:
   Replace `YOUR_VAPID_PUBLIC_KEY` in `src/utils/pwa.js`

3. **Set up Backend**:
   Create an endpoint to receive and store subscriptions

4. **Send Notifications**:
   Use the web-push library on your backend

## 🚀 Deployment

### **Build for Production**:
```bash
npm run build
```

### **Important Deployment Notes**:
1. **HTTPS Required**: PWA only works on HTTPS (except localhost)
2. **Service Worker Scope**: Must be served from root (`/sw.js`)
3. **Icons Must Exist**: Ensure all icon files are in place
4. **Manifest Accessible**: Check `/manifest.json` is accessible

### **Vercel/Netlify**:
- Automatically handles HTTPS ✅
- Place `public/` files in build output
- No extra configuration needed

### **Apache/Nginx**:
Add service worker headers in `.htaccess` or nginx.conf:
```apache
<Files "sw.js">
  Header set Service-Worker-Allowed "/"
  Header set Cache-Control "max-age=0, no-cache, no-store, must-revalidate"
</Files>
```

## 🧪 Testing Checklist

- [ ] Icons display correctly in install prompt
- [ ] App installs successfully
- [ ] Works offline (try airplane mode)
- [ ] Lighthouse PWA score > 90
- [ ] Splash screen shows on launch
- [ ] Theme color matches your brand
- [ ] Update prompt shows on new version
- [ ] Install banner appears/dismisses correctly

## 📊 PWA Console Commands

In browser console (when on your site):

```javascript
// Check if app is installed
window.matchMedia('(display-mode: standalone)').matches

// Manually trigger install
window.tmdbCache.clear() // If you exposed cache functions

// Check service worker status
navigator.serviceWorker.ready.then(reg => console.log(reg))

// View cache
caches.keys().then(keys => console.log(keys))
```

## 🆘 Troubleshooting

### Install Button Not Showing?
- Check browser console for errors
- Ensure HTTPS (or localhost)
- Try incognito/private mode
- Check if already installed

### Service Worker Not Registering?
- Check `/sw.js` is accessible
- Clear browser cache
- Check console for errors
- Verify HTTPS

### Icons Not Displaying?
- Verify files exist in `public/icons/`
- Check paths in `manifest.json`
- Clear browser cache
- Rebuild the app

### Updates Not Applying?
- Hard refresh (Ctrl+Shift+R)
- Unregister old service worker
- Clear all site data
- Re-install the app

## 📚 Resources

- [PWA Builder](https://www.pwabuilder.com/)
- [MDN PWA Guide](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps)
- [Google PWA Checklist](https://web.dev/pwa-checklist/)
- [Workbox (Advanced)](https://developers.google.com/web/tools/workbox)

## 🎉 You're Done!

Once you've generated and added the icons, your PWA is fully functional!

Your users can now:
- Install MovieWeb like a native app
- Use it offline
- Enjoy fast loading from cache
- Get a full-screen app experience

Enjoy your new Progressive Web App! 🚀
